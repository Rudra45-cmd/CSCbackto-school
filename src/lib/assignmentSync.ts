export const ASSIGNMENTS_CHANGED_EVENT =
  "studysync:assignments-changed";

export const STUDY_SESSIONS_CHANGED_EVENT =
  "studysync:study-sessions-changed";

export function notifyAssignmentsChanged(): void {
  window.dispatchEvent(new Event(ASSIGNMENTS_CHANGED_EVENT));
}

export function notifyStudySessionsChanged(): void {
  window.dispatchEvent(new Event(STUDY_SESSIONS_CHANGED_EVENT));
}
