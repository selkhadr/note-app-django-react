import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Sparkles, BookOpen } from "lucide-react";
import api from "../api"; // <-- Use your real API instance
import '../styles/Home.css';

// Note Component
function Note({ note, onDelete }) {
  return (
    <div className="note-card">
      <div className="note-card-overlay"></div>
      <div className="note-content">
        <div className="note-header">
          <h3 className="note-title">
            <BookOpen className="note-icon" />
            {note.title}
          </h3>
          <button
            onClick={() => onDelete(note.id)}
            className="delete-btn"
          >
            <Trash2 className="delete-icon" />
          </button>
        </div>
        <p className="note-text">{note.content}</p>
      </div>
    </div>
  );
}

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          setNotes(notes.filter(note => note.id !== id));
        } else {
          alert("Failed to delete note.");
        }
      })
      .catch((error) => alert(error));
  };

  const createNote = () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) {
          getNotes(); // Refresh notes from backend
          setTitle("");
          setContent("");
        } else {
          alert("Failed to make note.");
        }
      })
      .catch((err) => alert(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="app-container">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-icon">
            <div className="icon-wrapper">
              <Sparkles className="sparkles-icon" />
            </div>
            <h1 className="main-title">Notes</h1>
          </div>
          <p className="subtitle">
            Capture your thoughts, ideas, and inspirations in a beautiful, intuitive space designed for creativity.
          </p>
        </div>

        <div className="content-grid">
          {/* Notes Display */}
          <div className="notes-section">
            <div className="section-header">
              <h2 className="section-title">
                <div className="title-accent"></div>
                Your Notes
                <span className="notes-count">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </span>
              </h2>
            </div>

            {notes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <BookOpen className="empty-book-icon" />
                </div>
                <p className="empty-text">No notes yet. Create your first note to get started!</p>
              </div>
            ) : (
              <div className="notes-grid">
                {notes.map((note) => (
                  <Note note={note} onDelete={deleteNote} key={note.id} />
                ))}
              </div>
            )}
          </div>

          {/* Create Note Form */}
          <div className="form-section">
            <div className="form-container">
              <div className="form-card">
                <h2 className="form-title">
                  <Plus className="plus-icon" />
                  Create New Note
                </h2>

                <div className="form-content">
                  <div className="input-group">
                    <label htmlFor="title" className="input-label">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                      placeholder="Enter note title..."
                      className="text-input"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="content" className="input-label">
                      Content
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your thoughts here..."
                      rows="6"
                      className="textarea-input"
                    />
                  </div>

                  <button
                    onClick={createNote}
                    disabled={loading || !title.trim() || !content.trim()}
                    className="create-btn"
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="btn-icon" />
                        Create Note
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Home;