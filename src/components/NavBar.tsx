import { NavLink } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="nav-brand">
          <NavLink to="/" className="brand-link">Clear REACTive</NavLink>
        </div>

        <nav className="nav-links" aria-label="Main">
          <NavLink
            to="/"
            end
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            List
          </NavLink>

          <NavLink
            to="/gallery"
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            Gallery
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
