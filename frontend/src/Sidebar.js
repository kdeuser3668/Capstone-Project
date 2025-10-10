//eventually want to make this collapsable
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const linkStyle = {
    display: "block",
    padding: "1rem 1.5rem",
    color: "black",
    textDecoration: "none",
    marginBottom: "0.5rem",
    borderRadius: "6px"
  };

  const activeStyle = {
    backgroundColor: "rgba(235, 89, 193, 0.6)"
  };

  return (
    <div style={{
      width: "200px",
      height: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "1rem",
      boxSizing: "border-box",
      border: "black",
    }}>
      <h3 style={{ color: "black", marginBottom: "2rem" }}>PlannerPal</h3>

      <NavLink to="/dashboard" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>Dashboard</NavLink>
      <NavLink to="/" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>Log Out</NavLink>
    
    </div>
  );
};

export default Sidebar;
