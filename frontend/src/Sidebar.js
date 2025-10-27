//eventually want to make this collapsable
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const linkStyle = {
    display: "block",
    padding: "1rem 1.5rem",
    color: "var(--text-color)",
    textDecoration: "none",
    marginBottom: "0.5rem",
    borderRadius: "6px"
  };

  const activeStyle = {
    backgroundColor: "var(--button-color, #ee6dd5)"
  };

  return (
    <div style={{
      height: "100vh", 
      backgroundColor: "var(--sidebar-color, #f5f5f5)",
      padding: "1rem",
      boxSizing: "border-box",
      border: "black",
    }}>
      <h2 style={{ color: "var(--text-color)", marginBottom: "2rem" }}>PlannerPal</h2>

      <NavLink to="/dashboard" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>Dashboard</NavLink>
      <NavLink to="/calendar" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>Calendar</NavLink>
      <NavLink to="/focus" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>Focus</NavLink>
      <NavLink to="/notes" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>Notes</NavLink>
      <NavLink to="/tasks" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>Tasks</NavLink>
      <NavLink to="/settings" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>Settings</NavLink>
      <NavLink to="/" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>Log Out</NavLink>
    
    </div>
  );
};

export default Sidebar;
