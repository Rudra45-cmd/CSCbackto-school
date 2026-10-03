import { useMemo, useState } from "react";
import {
  BookOpen,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Send,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

interface Post {
  id: number;
  author: string;
  initials: string;
  subject: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  liked: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "Aarav Sharma",
    initials: "AS",
    subject: "Mathematics",
    title: "How are you preparing for calculus?",
    content:
      "I am struggling with application-based questions. What resources or methods are you using?",
    likes: 18,
    comments: 6,
    time: "12 min ago",
    liked: false,
  },
  {
    id: 2,
    author: "Priya Singh",
    initials: "PS",
    subject: "Physics",
    title: "Important chapters for revision",
    content:
      "Sharing a quick list of chapters I am revising this week. Feel free to add anything I missed.",
    likes: 12,
    comments: 4,
    time: "38 min ago",
    liked: false,
  },
  {
    id: 3,
    author: "Rohan Verma",
    initials: "RV",
    subject: "English",
    title: "Best way to improve writing skills?",
    content:
      "Looking for practical ways to improve essays, vocabulary, and answer structure before exams.",
    likes: 9,
    comments: 8,
    time: "1 hr ago",
    liked: false,
  },
];

const SUBJECTS = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science",
];

export default function Community() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [showComposer, setShowComposer] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newSubject, setNewSubject] = useState("Mathematics");

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesSubject =
        subject === "All" || post.subject === subject;

      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query);

      return matchesSubject && matchesSearch;
    });
  }, [posts, search, subject]);

  function toggleLike(id: number) {
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked
                ? post.likes - 1
                : post.likes + 1,
            }
          : post,
      ),
    );
  }

  function createPost() {
    const title = newTitle.trim();
    const content = newContent.trim();

    if (!title || !content) return;

    const post: Post = {
      id: Date.now(),
      author: "You",
      initials: "YO",
      subject: newSubject,
      title,
      content,
      likes: 0,
      comments: 0,
      time: "Just now",
      liked: false,
    };

    setPosts((current) => [post, ...current]);
    setNewTitle("");
    setNewContent("");
    setShowComposer(false);
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-violet-500">
              <Users size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                Student Community
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Learn together.
            </h1>

            <p className="mt-1 max-w-xl text-sm text-slate-500">
              Ask questions, share study tips, and learn from other students.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowComposer(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-700"
          >
            <Plus size={15} />
            Create Post
          </button>
        </div>

        {/* Search */}
        <div className="mt-7 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search discussions..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {SUBJECTS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSubject(item)}
                className={`whitespace-nowrap rounded-xl px-4 py-3 text-xs font-semibold transition ${
                  subject === item
                    ? "bg-violet-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Layout */}
        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Feed */}
          <main className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
                <BookOpen
                  size={24}
                  className="mx-auto text-violet-400"
                />

                <p className="mt-4 text-sm font-bold text-slate-800">
                  No discussions found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Try another search or create a new discussion.
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-200 sm:p-6"
                >
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-xs font-bold text-white">
                      {post.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {post.author}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          · {post.time}
                        </span>

                        <span className="rounded-md bg-violet-50 px-2 py-1 text-[9px] font-bold text-violet-600">
                          {post.subject}
                        </span>
                      </div>

                      <h2 className="mt-3 text-base font-bold text-slate-900">
                        {post.title}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {post.content}
                      </p>

                      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            post.liked
                              ? "bg-rose-50 text-rose-500"
                              : "text-slate-500 hover:bg-slate-50 hover:text-rose-500"
                          }`}
                        >
                          <Heart
                            size={14}
                            fill={
                              post.liked
                                ? "currentColor"
                                : "none"
                            }
                          />
                          {post.likes}
                        </button>

                        <button
                          type="button"
                          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-violet-600"
                        >
                          <MessageCircle size={14} />
                          {post.comments}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp
                  size={16}
                  className="text-violet-500"
                />

                <h3 className="text-sm font-bold text-slate-900">
                  Trending Topics
                </h3>
              </div>

              <div className="mt-4 space-y-2">
                {[
                  "Exam preparation",
                  "Mathematics",
                  "Study techniques",
                  "Physics numericals",
                  "Time management",
                ].map((topic, index) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5"
                  >
                    <span className="text-xs font-semibold text-slate-600">
                      {topic}
                    </span>

                    <span className="text-[10px] font-bold text-slate-400">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-5">
              <BookOpen
                size={18}
                className="text-violet-500"
              />

              <h3 className="mt-3 text-sm font-bold text-slate-900">
                Study together
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Share what you know and help another student understand a difficult topic.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Create Post Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Create Discussion
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Start a conversation with your study community.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <input
                value={newTitle}
                onChange={(event) =>
                  setNewTitle(event.target.value)
                }
                placeholder="Discussion title"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
              />

              <select
                value={newSubject}
                onChange={(event) =>
                  setNewSubject(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
              >
                {SUBJECTS.filter(
                  (item) => item !== "All",
                ).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <textarea
                value={newContent}
                onChange={(event) =>
                  setNewContent(event.target.value)
                }
                rows={5}
                placeholder="What would you like to discuss?"
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
              />

              <button
                type="button"
                onClick={createPost}
                disabled={
                  !newTitle.trim() || !newContent.trim()
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={14} />
                Publish Discussion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
