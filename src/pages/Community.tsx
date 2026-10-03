import { useCallback, useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Users,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { apiFetch } from "../lib/api";
import { getToken } from "../lib/auth";

type Reply = {
  id: number;
  content: string;
  author: string;
  author_id: number;
  created_at: string;
};

type Post = {
  id: number;
  content: string;
  author: string;
  author_id: number;
  created_at: string;
  likes: number;
  liked: boolean;
  replies: Reply[];
};

function timeAgo(value: string) {
  const date = new Date(value);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    if (!getToken()) return;

    try {
      const response = await apiFetch<{ posts: Post[] }>(
        "/api/community/posts",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      setPosts(response.posts);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Could not load the community right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();

    const interval = window.setInterval(() => {
      void loadPosts();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [loadPosts]);

  async function createPost() {
    const value = content.trim();

    if (!value || posting) return;

    setPosting(true);
    setError("");

    try {
      await apiFetch("/api/community/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          content: value,
        }),
      });

      setContent("");
      await loadPosts();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not publish your post.",
      );
    } finally {
      setPosting(false);
    }
  }

  async function toggleLike(postId: number) {
    try {
      const response = await apiFetch<{
        liked: boolean;
        likes: number;
      }>(`/api/community/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: response.liked,
                likes: response.likes,
              }
            : post,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function addReply(postId: number) {
    const value = (replyText[postId] || "").trim();

    if (!value) return;

    try {
      await apiFetch(`/api/community/posts/${postId}/replies`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          content: value,
        }),
      });

      setReplyText((current) => ({
        ...current,
        [postId]: "",
      }));

      await loadPosts();
    } catch (err) {
      console.error(err);
      setError("Could not add your reply.");
    }
  }

  async function deletePost(postId: number) {
    if (!window.confirm("Delete this post?")) return;

    try {
      await apiFetch(`/api/community/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      await loadPosts();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-violet-500/10 via-white to-cyan-500/10 p-7 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <Users size={23} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-500">
                Community
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                Class Community
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Connect with your classmates, share ideas, ask questions,
                and discuss your studies.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadPosts()}
              className="ml-auto hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 sm:flex"
              title="Refresh community"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Share something with your class..."
          maxLength={2000}
          rows={4}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10"
        />

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {content.length}/2000
          </span>

          <button
            type="button"
            onClick={() => void createPost()}
            disabled={!content.trim() || posting}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={15} />
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="space-y-4">
        {loading ? (
          <div className="rounded-[26px] border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Loading community...
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-300 bg-white p-10 text-center">
            <Users className="mx-auto text-slate-300" size={32} />
            <h2 className="mt-3 font-semibold text-slate-800">
              No posts yet
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Be the first student to start the conversation.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
                  {post.author.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {post.author}
                      </p>
                      <p className="text-xs text-slate-400">
                        {timeAgo(post.created_at)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void deletePost(post.id)}
                      className="rounded-lg p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
                      title="Delete your post"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {post.content}
                  </p>

                  <div className="mt-5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void toggleLike(post.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                        post.liked
                          ? "bg-rose-50 text-rose-600"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <Heart
                        size={15}
                        fill={post.liked ? "currentColor" : "none"}
                      />
                      {post.likes}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((current) => ({
                          ...current,
                          [post.id]: !current[post.id],
                        }))
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100"
                    >
                      <MessageCircle size={15} />
                      {post.replies.length}{" "}
                      {post.replies.length === 1 ? "reply" : "replies"}
                    </button>
                  </div>

                  {expanded[post.id] && (
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <div className="space-y-3">
                        {post.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="rounded-2xl bg-slate-50 p-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-semibold text-slate-700">
                                {reply.author}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {timeAgo(reply.created_at)}
                              </span>
                            </div>
                            <p className="mt-1 text-sm leading-5 text-slate-600">
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <input
                          value={replyText[post.id] || ""}
                          onChange={(event) =>
                            setReplyText((current) => ({
                              ...current,
                              [post.id]: event.target.value,
                            }))
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              void addReply(post.id);
                            }
                          }}
                          placeholder="Write a reply..."
                          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                        />
                        <button
                          type="button"
                          onClick={() => void addReply(post.id)}
                          className="rounded-xl bg-violet-600 px-3 text-white transition hover:bg-violet-700"
                        >
                          <Send size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
