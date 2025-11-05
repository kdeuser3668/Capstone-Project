//eventually want to make this collapsable
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = () => {
    
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigate = useNavigate();
    
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
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: isCollapsed ? "0px" : "150px",

    }}>
      <div>
        <h2 style={{ color: "var(--text-color)", marginBottom: "2rem" }}>{isCollapsed ? "" : "PlannerPal"}</h2>

        <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="toggleButtonStyle"
        title={isCollapsed ? "Expand" : "Collapse"}
        >{isCollapsed ? "›" : "‹"}</button>

        <NavLink to="/dashboard" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>{isCollapsed ? "" : "Dashboard"}</NavLink>
        <NavLink to="/calendar" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>{isCollapsed ? "" : "Calendar"}</NavLink>
        <NavLink to="/focus" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>{isCollapsed ? "" : "Focus"}</NavLink>
        <NavLink to="/notes" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>{isCollapsed ? "" : "Notes"}</NavLink>
        <NavLink to="/tasks" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>{isCollapsed ? "" : "Tasks"}</NavLink>
        <NavLink to="/settings" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>{isCollapsed ? "" : "Settings"}</NavLink>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
          navigate('/');
        }}
        style={{
          ...linkStyle,
          width: "100%",
          textAlign: "center",
          backgroundColor: "var(--button-color, #ee6dd5)",
          border: "none",
          cursor: "pointer"
        }}
        >{isCollapsed ? "" : "Log Out"}</button>
    
    </div>

  );
};

export default Sidebar;
