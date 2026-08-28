"use client";

import { useState, useEffect, useCallback } from "react";

interface Blog {
  blog_id: string;
  title: string;
  content: string;
  created_at: string;
  is_published?: boolean;
}

type View = "login" | "dashboard";
type EditorMode = "create" | "edit";

const API = process.env.NEXT_PUBLIC_SERVER_URI;

export default function AdminPage() {
  const [view, setView] = useState<View>("login");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_token");
    if (stored) {
      setToken(stored);
      setView("dashboard");
    }
  }, []);

  const handleLogin = (t: string) => {
    sessionStorage.setItem("admin_token", t);
    setToken(t);
    setView("dashboard");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
    setView("login");
  };

  return (
    <div className="admin-root">
      <style>{css}</style>
      {view === "login" && <LoginPanel onLogin={handleLogin} />}
      {view === "dashboard" && (
        <Dashboard token={token!} onLogout={handleLogout} />
      )}
    </div>
  );
}

// ── Login ────────────────────────────────────────────────────────────────────

function LoginPanel({ onLogin }: { onLogin: (t: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        setShake(true);
        setTimeout(() => setShake(false), 600);
        return;
      }
      onLogin(data.token || "authenticated");
    } catch {
      setError("Cannot reach server");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className={`login-card ${shake ? "shake" : ""}`}>
        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />

        <div className="login-badge-row">
          <span className="status-dot" />
          <span className="badge-text">THE.BYTE.CLUB</span>
          <span className="portal-pill">ADMIN PORTAL</span>
        </div>

        <div className="cyan-line" style={{ marginBottom: "1.5rem" }} />

        <p className="login-eyebrow">SECURE ACCESS</p>
        <h1 className="login-title">ADMIN LOGIN_</h1>
        <p className="login-sub">
          Restricted transmission channel. Authenticate to proceed.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label className="field-label">USERNAME</label>
            <input
              className="cyber-input"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <div className="field-group">
            <label className="field-label">PASSWORD</label>
            <input
              className="cyber-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="cyber-toast error">✗ {error}</div>}

          <button className="cyber-btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "AUTHENTICATE →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({
  token,
  onLogout,
}: {
  token: string;
  onLogout: () => void;
}) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>("create");
  const [editTarget, setEditTarget] = useState<Blog | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/blog`);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to load blogs", "err");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (blog_id: string) => {
    try {
      const res = await fetch(`${API}/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "delete", blog_id }),
      });
      if (!res.ok) throw new Error();
      showToast("✓ Post deleted");
      setDeleteConfirm(null);
      fetchBlogs();
    } catch {
      showToast("Delete failed", "err");
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">BC_</div>
        <div className="sidebar-divider" />
        <nav className="sidebar-nav">
          <span className="sidebar-nav-item active">// BLOGS</span>
        </nav>
        <button className="sidebar-logout" onClick={onLogout}>
          ← DISCONNECT
        </button>
      </aside>

      {/* Main */}
      <main className="main-area">
        <header className="main-header">
          <div>
            <p className="main-eyebrow">TRANSMISSION FEED</p>
            <h2 className="main-title">BLOG MANAGEMENT_</h2>
            <p className="main-sub">
              {blogs.length} post{blogs.length !== 1 ? "s" : ""} in database
            </p>
          </div>
          <button
            className="cyber-btn small"
            onClick={() => {
              setEditorMode("create");
              setEditTarget(null);
              setEditorOpen(true);
            }}
          >
            + NEW POST
          </button>
        </header>

        <div className="cyan-line" style={{ marginBottom: "2rem" }} />

        {loading ? (
          <div className="loading-area">
            <span className="spinner" />
            <span>Fetching transmissions…</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">NO POSTS FOUND</p>
            <button
              className="cyber-btn small"
              onClick={() => {
                setEditorMode("create");
                setEditTarget(null);
                setEditorOpen(true);
              }}
            >
              CREATE FIRST POST
            </button>
          </div>
        ) : (
          <div className="blog-grid">
            {blogs.map((blog) => (
              <div className="blog-card" key={blog.blog_id}>
                <div className="corner corner-tl sm" />
                <div className="corner corner-tr sm" />
                <div className="blog-card-meta">
                  <span className="blog-card-id">
                    #{String(blog.blog_id).slice(0, 8)}
                  </span>
                  <span className="blog-card-date">
                    {new Date(blog.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-preview">
                  {blog.content.replace(/<[^>]*>/g, "").slice(0, 110)}…
                </p>
                <div className="blog-card-actions">
                  <button
                    className="ghost-btn edit"
                    onClick={() => {
                      setEditorMode("edit");
                      setEditTarget(blog);
                      setEditorOpen(true);
                    }}
                  >
                    EDIT
                  </button>
                  <button
                    className="ghost-btn delete"
                    onClick={() => setDeleteConfirm(blog.blog_id)}
                  >
                    DELETE
                  </button>
                </div>
                {deleteConfirm === blog.blog_id && (
                  <div className="delete-confirm">
                    <span>CONFIRM DELETE?</span>
                    <button
                      className="ghost-btn delete"
                      onClick={() => handleDelete(blog.blog_id)}
                    >
                      YES
                    </button>
                    <button
                      className="ghost-btn"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      NO
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {editorOpen && (
        <BlogEditor
          mode={editorMode}
          blog={editTarget}
          token={token}
          onClose={() => setEditorOpen(false)}
          onSaved={() => {
            setEditorOpen(false);
            fetchBlogs();
            showToast(
              editorMode === "create" ? "✓ Post transmitted" : "✓ Post updated",
            );
          }}
          onError={(msg) => showToast(msg, "err")}
        />
      )}

      {toast && (
        <div className={`cyber-toast fixed ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}

// ── Editor Modal ─────────────────────────────────────────────────────────────

function BlogEditor({
  mode,
  blog,
  token,
  onClose,
  onSaved,
  onError,
}: {
  mode: EditorMode;
  blog: Blog | null;
  token: string;
  onClose: () => void;
  onSaved: () => void;
  onError: (m: string) => void;
}) {
  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");
  const [isPublished, setIsPublished] = useState(blog?.is_published ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      onError("Title and content required");
      return;
    }
    setSaving(true);
    try {
      const payload =
        mode === "create"
          ? { action: "create", title, content, is_published: isPublished }
          : {
              action: "update",
              blog_id: blog!.blog_id,
              title,
              content,
              is_published: isPublished,
            };
      const res = await fetch(`${API}/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed");
      }
      onSaved();
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />

        <div className="modal-header">
          <div>
            <p className="login-eyebrow">
              {mode === "create" ? "NEW TRANSMISSION" : "EDIT TRANSMISSION"}
            </p>
            <h3 className="modal-title">
              {mode === "create" ? "CREATE POST_" : "UPDATE POST_"}
            </h3>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cyan-line" />

        <form onSubmit={handleSave} className="editor-form">
          <div className="field-group">
            <label className="field-label">TITLE</label>
            <input
              className="cyber-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title…"
              required
            />
          </div>
          <div className="field-group">
            <label className="field-label">CONTENT DATA</label>
            <textarea
              className="cyber-input field-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content… (preferred markdown language i.e readme.md type)"
              required
            />
          </div>
          <div className="field-group toggle-group">
            <label className="field-label">STATUS</label>
            <button
              type="button"
              className={`toggle ${isPublished ? "on" : "off"}`}
              onClick={() => setIsPublished(!isPublished)}
            >
              <span className="toggle-knob" />
            </button>
            <span className="toggle-label">
              {isPublished ? "LIVE" : "DRAFT"}
            </span>
          </div>
          <div className="modal-footer">
            <button type="button" className="ghost-btn" onClick={onClose}>
              CANCEL
            </button>
            <button type="submit" className="cyber-btn small" disabled={saving}>
              {saving ? (
                <span className="spinner" />
              ) : mode === "create" ? (
                "TRANSMIT →"
              ) : (
                "UPDATE →"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=DM+Sans:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .admin-root {
    --cyan: #00d4ff;
    --cyan2: #1affe4;
    --bg: #020812;
    --surface: rgba(2,8,18,0.94);
    --border: rgba(0,212,255,0.25);
    --border-bright: rgba(0,212,255,0.8);
    --text: #e0f4ff;
    --muted: rgba(0,212,255,0.6);
    --danger: #ff5252;
    --ok: #00ff9c;
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 30px rgba(0,212,255,0.12), 0 0 60px rgba(0,212,255,0.06); }
    50%      { box-shadow: 0 0 50px rgba(0,212,255,0.22), 0 0 100px rgba(0,212,255,0.12); }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(600px); }
  }
  @keyframes shake {
    0%,100% { transform:translateX(0); }
    20%,60% { transform:translateX(-8px); }
    40%,80% { transform:translateX(8px); }
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

  /* ── Shared ── */
  .corner {
    position: absolute;
    width: 14px; height: 14px;
    z-index: 10;
  }
  .corner.sm { width: 9px; height: 9px; }
  .corner-tl { top:10px; left:10px; border-top:2px solid var(--cyan); border-left:2px solid var(--cyan); }
  .corner-tr { top:10px; right:10px; border-top:2px solid var(--cyan); border-right:2px solid var(--cyan); }
  .corner-bl { bottom:10px; left:10px; border-bottom:2px solid var(--cyan); border-left:2px solid var(--cyan); }
  .corner-br { bottom:10px; right:10px; border-bottom:2px solid var(--cyan); border-right:2px solid var(--cyan); }

  .cyan-line {
    height: 1px; width: 100%;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.5), rgba(26,255,228,0.5), transparent);
  }

  .field-group { display:flex; flex-direction:column; gap:8px; }
  .field-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; color: var(--cyan);
    letter-spacing: 0.15em;
  }

  .cyber-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: all 0.25s ease;
  }
  .cyber-input:focus { border-color: var(--border-bright); box-shadow: 0 0 20px rgba(0,212,255,0.15); }
  .cyber-input::placeholder { color: rgba(255,255,255,0.25); }

  .field-textarea { resize: vertical; min-height: 220px; line-height: 1.7; }

  .cyber-btn {
    height: 52px;
    padding: 0 28px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--cyan), var(--cyan2));
    color: #020812;
    font-family: 'Orbitron', sans-serif;
    font-size: 13px; font-weight: 800;
    letter-spacing: 0.12em;
    cursor: pointer;
    transition: all 0.25s ease;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    white-space: nowrap;
  }
  .cyber-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 25px rgba(0,212,255,0.35); }
  .cyber-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .cyber-btn.small { height: 40px; font-size: 11px; }

  .ghost-btn {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; letter-spacing: 2px;
    padding: 7px 16px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
  }
  .ghost-btn:hover { color: var(--cyan); border-color: var(--border-bright); }
  .ghost-btn.edit:hover { color: var(--cyan2); border-color: var(--cyan2); box-shadow: 0 0 12px rgba(26,255,228,0.15); }
  .ghost-btn.delete:hover { color: var(--danger); border-color: var(--danger); box-shadow: 0 0 12px rgba(255,82,82,0.15); }

  .cyber-toast {
    padding: 12px 16px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
  }
  .cyber-toast.ok  { background: rgba(0,255,150,0.10); color: var(--ok);    border: 1px solid rgba(0,255,150,0.25); }
  .cyber-toast.err { background: rgba(255,0,0,0.10);   color: var(--danger); border: 1px solid rgba(255,82,82,0.25); }
  .cyber-toast.fixed {
    position: fixed; bottom: 28px; right: 28px; z-index: 200;
    animation: slideUp 0.25s ease;
  }

  .spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(2,8,18,0.3);
    border-top-color: #020812;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* ── Login ── */
  .login-bg {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem 1rem;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,212,255,0.08), transparent);
  }

  .login-card {
    position: relative; overflow: hidden;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 26px;
    padding: 2.5rem;
    width: 100%; max-width: 440px;
    animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1), pulseGlow 4s ease-in-out infinite;
    backdrop-filter: blur(16px);
  }
  .login-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,212,255,0.05) 0%, transparent 50%, rgba(26,255,228,0.03) 100%);
    pointer-events: none;
  }
  .login-card::after {
    content: '';
    position: absolute; top: -100%; left: 0; right: 0; height: 35%;
    background: linear-gradient(transparent, rgba(0,212,255,0.04), transparent);
    animation: scanline 4s linear infinite;
    pointer-events: none;
  }
  .login-card.shake { animation: shake 0.5s ease, pulseGlow 4s ease-in-out infinite; }

  .login-badge-row {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 1.2rem;
  }
  .status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--cyan); box-shadow: 0 0 10px var(--cyan);
  }
  .badge-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; color: var(--muted); letter-spacing: 0.2em;
    flex: 1;
  }
  .portal-pill {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; color: var(--cyan);
    border: 1px solid var(--border);
    padding: 4px 10px; border-radius: 999px;
    background: rgba(0,212,255,0.08);
    letter-spacing: 0.1em;
  }

  .login-eyebrow {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; color: rgba(0,212,255,0.5);
    letter-spacing: 0.18em; margin-bottom: 6px;
  }
  .login-title {
    font-family: 'Orbitron', sans-serif;
    font-weight: 900; font-size: clamp(1.8rem,5vw,2.4rem);
    color: var(--cyan);
    text-shadow: 0 0 12px rgba(0,212,255,0.7), 0 0 35px rgba(0,212,255,0.3);
    line-height: 1.1; margin-bottom: 8px;
  }
  .login-sub {
    font-size: 13px; color: rgba(180,220,230,0.6);
    line-height: 1.6; margin-bottom: 2rem;
  }
  .login-form { display:flex; flex-direction:column; gap:18px; }

  /* ── Dashboard ── */
  .dashboard { display:flex; min-height:100vh; }

  .sidebar {
    width: 210px; flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 32px 20px;
    position: sticky; top: 0; height: 100vh;
    backdrop-filter: blur(16px);
  }
  .sidebar-logo {
    font-family: 'Orbitron', sans-serif;
    font-weight: 900; font-size: 22px;
    color: var(--cyan);
    text-shadow: 0 0 12px rgba(0,212,255,0.7);
    margin-bottom: 24px;
  }
  .sidebar-divider { height:1px; background: var(--border); margin-bottom: 24px; }
  .sidebar-nav { flex:1; }
  .sidebar-nav-item {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; letter-spacing: 2px;
    padding: 10px 12px; border-radius: 8px;
    color: var(--muted); cursor: pointer;
    transition: all 0.15s;
  }
  .sidebar-nav-item.active { color: var(--cyan); background: rgba(0,212,255,0.08); border: 1px solid var(--border); }
  .sidebar-logout {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; letter-spacing: 2px;
    background: none; border: 1px solid var(--border);
    color: var(--muted); padding: 9px 12px; border-radius: 8px;
    cursor: pointer; transition: all 0.2s;
  }
  .sidebar-logout:hover { color: var(--danger); border-color: var(--danger); }

  .main-area { flex:1; padding: 40px 48px; overflow-y: auto; }

  .main-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .main-eyebrow {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; color: rgba(0,212,255,0.5);
    letter-spacing: 0.18em; margin-bottom: 6px;
  }
  .main-title {
    font-family: 'Orbitron', sans-serif;
    font-weight: 900; font-size: 26px;
    color: var(--cyan);
    text-shadow: 0 0 12px rgba(0,212,255,0.5);
  }
  .main-sub { font-size: 12px; color: var(--muted); margin-top: 4px; }

  .loading-area {
    display: flex; align-items: center; gap: 12px;
    color: var(--muted); font-size: 13px; padding: 60px 0;
    font-family: 'Share Tech Mono', monospace; letter-spacing: 2px;
  }
  .loading-area .spinner {
    border-color: rgba(0,212,255,0.2);
    border-top-color: var(--cyan);
  }

  .empty-state {
    display: flex; flex-direction: column; align-items: center;
    gap: 20px; padding: 80px 0;
  }
  .empty-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px; color: var(--muted); letter-spacing: 3px;
  }

  .blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .blog-card {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 22px;
    display: flex; flex-direction: column; gap: 12px;
    transition: border-color 0.2s, box-shadow 0.2s;
    overflow: hidden;
    backdrop-filter: blur(8px);
  }
  .blog-card:hover { border-color: rgba(0,212,255,0.5); box-shadow: 0 0 20px rgba(0,212,255,0.08); }

  .blog-card-meta {
    display: flex; justify-content: space-between; align-items: center;
  }
  .blog-card-id {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; color: rgba(0,212,255,0.4); letter-spacing: 2px;
  }
  .blog-card-date { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: var(--muted); }
  .blog-card-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 14px; font-weight: 700; line-height: 1.4;
    color: var(--text);
  }
  .blog-card-preview { font-size: 12px; color: rgba(180,220,230,0.55); line-height: 1.7; flex:1; }
  .blog-card-actions { display:flex; gap:8px; }

  .delete-confirm {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    padding-top: 10px;
    border-top: 1px solid var(--border);
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; color: var(--danger); letter-spacing: 2px;
  }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(2,8,18,0.82);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; padding: 20px;
    backdrop-filter: blur(8px);
  }
  .modal {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    width: 100%; max-width: 600px; max-height: 90vh;
    overflow-y: auto;
    animation: fadeUp 0.3s cubic-bezier(0.16,1,0.3,1);
    backdrop-filter: blur(16px);
  }
  .modal-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 24px 28px 20px;
  }
  .modal-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 18px; font-weight: 700;
    color: var(--cyan);
    text-shadow: 0 0 10px rgba(0,212,255,0.5);
  }
  .modal-close {
    background: none; border: none; color: var(--muted);
    font-size: 16px; cursor: pointer; padding: 4px;
    transition: color 0.15s; line-height: 1;
  }
  .modal-close:hover { color: var(--cyan); }

  .editor-form { display:flex; flex-direction:column; gap:20px; padding: 20px 28px 28px; }

  .toggle-group { flex-direction: row; align-items: center; gap: 12px; }
  .toggle {
    width: 42px; height: 24px; border-radius: 12px;
    border: none; cursor: pointer; position: relative;
    transition: background 0.2s; flex-shrink: 0; padding: 0;
  }
  .toggle.on  { background: linear-gradient(135deg, var(--cyan), var(--cyan2)); }
  .toggle.off { background: rgba(0,212,255,0.1); border: 1px solid var(--border); }
  .toggle-knob {
    position: absolute; top: 3px;
    width: 18px; height: 18px; border-radius: 50%;
    background: #020812; transition: left 0.2s;
  }
  .toggle.on  .toggle-knob { left: 21px; }
  .toggle.off .toggle-knob { left: 3px; }
  .toggle-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; color: var(--muted); letter-spacing: 2px;
  }

  .modal-footer {
    display: flex; justify-content: flex-end; gap: 10px;
    padding-top: 10px; border-top: 1px solid var(--border); margin-top: 4px;
  }
`;
