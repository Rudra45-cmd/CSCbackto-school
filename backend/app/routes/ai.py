from datetime import datetime
import os

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from google import genai

from backend.app.database import get_db
from backend.app.models.assignment import Assignment
from backend.app.models.ai_memory import AIMemory
from backend.app.models.study_session import StudySession
from backend.app.models.user import User
from backend.app.routes.auth import get_current_user


router = APIRouter(prefix="/api/ai", tags=["AI"])


class AIChatRequest(BaseModel):
    message: str


def get_relevant_memories(
    db: Session,
    user_id: int,
    limit: int = 8,
) -> list[AIMemory]:
    """Return the student's most recent useful AI memories."""
    return (
        db.query(AIMemory)
        .filter(AIMemory.user_id == user_id)
        .order_by(
            AIMemory.importance.desc(),
            AIMemory.created_at.desc(),
        )
        .limit(limit)
        .all()
    )


def save_ai_memory(
    db: Session,
    user_id: int,
    message: str,
    reply: str,
) -> None:
    """Store a compact useful summary of the interaction."""
    lower = message.lower()

    # Avoid storing trivial greetings.
    trivial = {
        "hi",
        "hii",
        "hello",
        "hey",
        "thanks",
        "thank you",
        "ok",
        "okay",
    }

    if lower in trivial:
        return

    # Keep memory compact instead of storing the complete conversation.
    memory_text = (
        f"Student asked: {message[:500]}\n"
        f"StudySync AI response: {reply[:700]}"
    )

    memory = AIMemory(
        user_id=user_id,
        category="conversation",
        content=memory_text,
        importance=1,
        created_at=datetime.utcnow(),
    )

    db.add(memory)

    # Keep memory bounded for performance.
    old_memories = (
        db.query(AIMemory)
        .filter(AIMemory.user_id == user_id)
        .order_by(AIMemory.created_at.desc())
        .offset(40)
        .all()
    )

    for old_memory in old_memories:
        db.delete(old_memory)

    db.commit()


def build_memory_context(
    memories: list[AIMemory],
) -> str:
    if not memories:
        return "- No previous learning memories."

    return "\n".join(
        f"- {memory.content}"
        for memory in memories
    )


def build_student_context(
    user: User,
    assignments: list[Assignment],
    sessions: list[StudySession],
) -> str:
    pending = [a for a in assignments if not a.completed]
    completed = [a for a in assignments if a.completed]

    assignment_lines = []
    for assignment in pending[:5]:
        assignment_lines.append(
            f"- {assignment.title} | "
            f"Subject: {assignment.subject} | "
            f"Type: {assignment.assignment_type} | "
            f"Due: {assignment.due_date or 'Not specified'} | "
            f"Priority: {assignment.priority} | "
            f"Estimated: {assignment.estimated_minutes} min"
        )

    recent_sessions = []
    for session in sessions[:15]:
        recent_sessions.append(
            f"- {session.subject or 'General Study'} | "
            f"{session.duration_minutes} min | "
            f"Started: {session.started_at.isoformat() if session.started_at else 'Unknown'} | "
            f"Assignment ID: {session.assignment_id or 'None'}"
        )

    subjects = user.subjects or ""

    return f"""
STUDENTSYNC STUDENT CONTEXT

Student:
- Name: {user.name}
- Grade: {user.grade or 'Not specified'}
- Subjects: {subjects or 'Not specified'}
- Daily study goal: {user.daily_goal or 'Not specified'}
- Preferred study time: {user.preferred_study_time or 'Not specified'}

Assignment summary:
- Total assignments: {len(assignments)}
- Pending: {len(pending)}
- Completed: {len(completed)}

Pending assignments:
{chr(10).join(assignment_lines) if assignment_lines else '- No pending assignments'}

Recent focus sessions:
{chr(10).join(recent_sessions) if recent_sessions else '- No focus sessions recorded'}
""".strip()


@router.post("/chat")
def chat_with_ai(
    request: AIChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    message = request.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Instant local responses for simple greetings.
    # These do not call Gemini, making common messages essentially instant.
    simple_responses = {
        "hi": "Hey! Welcome back. What are you working on today?",
        "hii": "Hey! Welcome back. What are you working on today?",
        "hello": "Hello! What would you like to study today?",
        "hey": "Hey! What are we working on today?",
        "thanks": "You're welcome! Let me know what you want to work on next.",
        "thank you": "You're welcome! Ready when you are.",
        "good morning": "Good morning! What would you like to study today?",
        "good evening": "Good evening! What would you like to work on today?",
        "good afternoon": "Good afternoon! What would you like to study today?",
    }

    instant_reply = simple_responses.get(message.lower())

    if instant_reply:
        return {
            "reply": instant_reply,
            "model": "local",
        }

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key is not configured on the server.",
        )

    assignments = (
        db.query(Assignment)
        .filter(Assignment.user_id == current_user.id)
        .order_by(Assignment.created_at.desc())
        .all()
    )

    sessions = (
        db.query(StudySession)
        .filter(StudySession.user_id == current_user.id)
        .order_by(StudySession.started_at.desc())
        .limit(5)
        .all()
    )

    context = build_student_context(
        current_user,
        assignments,
        sessions,
    )

    memories = get_relevant_memories(
        db,
        current_user.id,
        limit=5,
    )

    memory_context = build_memory_context(memories)

    system_instruction = """
You are StudySync AI, a smart, friendly academic assistant built into StudySync.

Your personality:
- Friendly, natural, encouraging, and concise.
- Talk like a helpful tutor, not like a report generator.
- Do not repeatedly greet the student by name.
- Do not unnecessarily repeat the student's assignments, study history, or profile.
- Do not start every response with "Hi", "Hello", or the student's name.
- Match the length of your answer to the student's question.

IMPORTANT RESPONSE RULES:

1. Answer the student's actual question first.
   Do not dump their entire StudySync profile into every response.

2. Use the StudySync context only when it is relevant.
   For example:
   - "What should I study?" -> use assignments and deadlines.
   - "How much did I study?" -> use focus sessions.
   - "Explain Newton's second law." -> explain Newton's second law.
   - "Hi" -> respond naturally and briefly.
   - "Make me a study plan." -> use their assignments, goals, and available information.

3. Never invent:
   - assignments
   - deadlines
   - grades
   - exams
   - study sessions
   - completed work
   - personal information

4. If the requested information is not available, say so clearly instead of guessing.

5. For simple messages such as:
   "hi", "hello", "thanks", "okay", "good morning"
   respond briefly and naturally.

6. For academic explanations:
   - Explain the concept clearly.
   - Use simple language appropriate for a school student.
   - Use examples when useful.
   - Use formulas correctly.
   - Break difficult concepts into steps.
   - Offer practice questions when appropriate.

7. For study planning:
   - Prioritize tasks based on due date, priority, and estimated time.
   - Do not claim a task is urgent unless the supplied data supports it.
   - Give a practical plan rather than repeating all available data.

8. For assignment questions:
   - Mention only the relevant assignment information.
   - Help break large assignments into smaller steps.
   - Never claim an assignment is completed unless the data says it is completed.

9. Avoid unnecessary headings for very short answers.

10. Do not overwhelm the student.
    Prefer a useful answer of roughly 2–8 short paragraphs or bullet points unless the student explicitly asks for a detailed explanation.

11. If the student asks a follow-up question, continue the conversation naturally instead of restarting with a full summary.

12. When useful, end with ONE short follow-up question that helps the student continue.
    Do not ask multiple questions at once.

The StudySync context below contains the student's current data.
Use it as supporting context, not as content that must be repeated in every answer.

Prioritize fast, direct answers.
For normal questions, answer the question immediately using only the relevant context.
Do not summarize the entire student profile.
Keep most answers to 1–4 short paragraphs or bullets.
Do not add unnecessary explanations, greetings, or repeated context.
"""



    prompt = f"""
RESPONSE FORMAT — ALWAYS FOLLOW THESE RULES:

- Every response must be clean, structured, readable, and student-friendly.
- Never return a large unformatted paragraph when the information can be structured.
- Use Markdown naturally.
- Use ### headings for sections when useful.
- Use **bold** for important words, concepts, answers, and key terms.
- Use numbered lists for steps, procedures, methods, or ordered information.
- Use bullet points for examples, features, or supporting information.
- Use > 💡 for an important study tip when useful.
- Use tables when comparing multiple items.
- Keep simple questions short and direct.
- Match the answer length to the student's question.

DEFINITIONS:
- Start with a clear one-sentence definition.
- Explain the concept in simple student-friendly language.
- Give 1–3 relevant examples when useful.

SCIENCE / PHYSICS:
- Prefer this structure when appropriate:
  ### Concept
  Short definition and explanation.

  ### Formula
  The relevant equation.

  ### Where:
  - Variable = meaning + SI unit

  ### Example
  A short worked example.

- Always include SI units when numerical values are involved.
- Show important equations clearly.

MATHEMATICS:
- Show the relevant formula first.
- Show calculations step-by-step.
- Keep each calculation on a separate line.
- Clearly mark the final answer.
- Do not skip important calculation steps.

MATH FORMATTING:
- Use LaTeX for mathematical expressions.
- Inline mathematics must use $...$.
- Standalone equations must use $$...$$.
- Use proper LaTeX for fractions, roots, Greek letters, subscripts, superscripts, and symbols.
- Examples:
  $F = ma$
  $$v = u + at$$
  $$\frac{{1}}{{2}}mv^2$$
  $$\sqrt{{x^2+y^2}}$$
  $$\Delta x = v_i t + \frac{{1}}{{2}}at^2$$
- Never expose raw LaTeX commands outside mathematical expressions.
- Never use unnecessary $ symbols.
- Never put mathematical expressions in code blocks unless the student specifically asks for code.

GENERAL FORMATTING:
- Use short paragraphs.
- Add spacing between sections.
- Do not repeat information unnecessarily.
- Do not repeat the student's profile or database context unless it directly helps answer the question.
- Do not invent information.
- Do not add unnecessary filler.
- Do not ask "Would you like..." after every response.
- Only suggest a follow-up when it is genuinely useful.
- Use emojis sparingly and only when they improve readability.
- Keep the tone natural, encouraging, and professional.
- Make the answer look like a polished study assistant response, not a raw AI-generated paragraph.

IMPORTANT:
- Formatting should be applied to EVERY response, including greetings, explanations, homework help, calculations, summaries, study plans, and project questions.
- For very short responses, do not force unnecessary headings or sections.

CURRENT STUDENT CONTEXT:
{context}

RELEVANT LEARNING MEMORY:
{memory_context}

STUDENT REQUEST:
{message}
"""

    try:
        client = genai.Client(api_key=api_key)

        models = [
            "gemini-3.8-flash",
            "gemini-3.5-flash-lite",
        ]

        last_error = None

        for model_name in models:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config={
                        "system_instruction": system_instruction,
                        "max_output_tokens": 300,
                    },
                )

                reply = response.text

                if reply:
                    save_ai_memory(
                        db,
                        current_user.id,
                        message,
                        reply,
                    )

                    return {
                        "reply": reply,
                        "model": model_name,
                    }

            except Exception as exc:
                last_error = exc
                print(f"Gemini model {model_name} failed: {exc}")
                continue

        print(f"All Gemini models failed: {last_error}")

        raise HTTPException(
            status_code=503,
            detail="StudySync AI is temporarily busy. Please try again in a moment.",
        )

    except HTTPException:
        raise
    except Exception as exc:
        print(f"Gemini API error: {exc}")
        raise HTTPException(
            status_code=502,
            detail="StudySync AI could not generate a response.",
        )
