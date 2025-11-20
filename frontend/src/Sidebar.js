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
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    marginBottom: "0.5rem",
    borderRadius: "6px"
  };

  const activeStyle = {
    backgroundColor: "var(--button-color, #ee6dd5)"
  };

  return (
    <div style={{
      height: "auto", 
      minHeight: "100vh",
      backgroundColor: "var(--sidebar-color, #f5f5f5)",
      padding: "1rem",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transition: "width 0.3s ease",
      width: isCollapsed ? "calc(var(--font-size, 1) * 4rem)" : "calc(var(--font-size, 1) * 10rem)",
      fontSize: "calc(var(--font-size, 1) * 1rem)",



    }}>
      <div>
        <h2 style={{ color: "var(--text-color)", marginBottom: "2rem" }}>{isCollapsed ? "PP" : "PlannerPal"}</h2>

        <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="toggleButtonStyle"
        title={isCollapsed ? "Expand" : "Collapse"}
        >{isCollapsed ? "›" : "‹"}</button>

        <NavLink to="/dashboard" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>{isCollapsed ? "D" : "Dashboard"}</NavLink>
        <NavLink to="/calendar" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>{isCollapsed ? "C" : "Calendar"}</NavLink>
        <NavLink to="/focus" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>{isCollapsed ? "F" : "Focus"}</NavLink>
        <NavLink to="/notes" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>{isCollapsed ? "N" : "Notes"}</NavLink>
        <NavLink to="/tasks" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>{isCollapsed ? "T" : "Tasks"}</NavLink>
        <NavLink to="/settings" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>{isCollapsed ? "S" : "Settings"}</NavLink>
      </div>

      <div style={{flexgrow: "1"}}/>

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
          cursor: "pointer",
        }}
        >{isCollapsed ? "L" : "Log Out"}</button>
    
    </div>

  );
};

export default Sidebar;
