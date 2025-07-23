import React, { useContext, useState } from "react";
import { Outlet, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import NotesListPage from "./NotesListPage";
import NoteEditorPage from "./NoteEditorPage";
import NoteViewPage from "./NoteViewPage";
import { AuthContext } from "../App";
import { theme } from "../theme";
import "./NotesLayout.css";

// PUBLIC_INTERFACE
function NotesLayout() {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 700);
  const navigate = useNavigate();
  const loc = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Responsive sidebar toggle
  function handleResizeSidebar() {
    setSidebarOpen((o) => !o);
  }

  return (
    <div className="layout__wrapper">
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar__brand">
          <span
            className="sidebar__toggle"
            title={sidebarOpen ? "Hide menu" : "Show menu"}
            onClick={handleResizeSidebar}
            style={{
              color: theme.colors.secondary,
              cursor: "pointer",
              fontWeight: 700,
            }}
            aria-label="toggle sidebar"
          >
            ☰
          </span>
          <span className="brand__name" onClick={() => navigate("/")}>
            NotesApp
          </span>
        </div>
        <nav className="sidebar__menu">
          <div
            className={`sidebar__menu__item${loc.pathname === "/" ? " active" : ""}`}
            onClick={() => navigate("/")}
          >
            📝 All Notes
          </div>
          <div
            className={`sidebar__menu__item${loc.pathname === "/notes/new" ? " active" : ""}`}
            onClick={() => navigate("/notes/new")}
          >
            ➕ New Note
          </div>
        </nav>
        <div className="sidebar__footer">
          <span>
            <strong>{user?.email || user?.username}</strong>
          </span>
          <button className="sidebar__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main__area">
        <header className="main__header">
          <span className="header__title">{loc.pathname === "/" ? "All Notes" : "Notes"}</span>
        </header>
        <section className="main__content">
          <Routes>
            <Route path="/" element={<NotesListPage />} />
            <Route path="/notes/new" element={<NoteEditorPage mode="create" />} />
            <Route path="/notes/:id" element={<NoteViewPage />} />
            <Route path="/notes/:id/edit" element={<NoteEditorPage mode="edit" />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}
export default NotesLayout;
