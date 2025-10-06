import { NavLink } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <h1 className="brand">PokeDex</h1>

        <nav className="tabs" aria-label="Main">
          <NavLink to="/" end className={({isActive}) => "tab" + (isActive ? " active" : "")}>
            List
          </NavLink>
          <NavLink to="/gallery" className={({isActive}) => "tab" + (isActive ? " active" : "")}>
            Gallery
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
