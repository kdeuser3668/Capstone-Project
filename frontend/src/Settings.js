import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Calendar.css'; // Optional: if you're using .switch and .slider styles

function Settings({ weekStart, setWeekStart }) {
  const navigate = useNavigate();
  const today = new Date();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dd = today.getDate();
  const mm = monthNames[today.getMonth()];
  const yyyy = today.getFullYear();
  const theDate = `${mm} ${dd}, ${yyyy}`;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={styles.page}>
        <h1 style={{ textAlign: "left", padding: "10px", marginBottom: "0px" }}>Settings</h1>
        <h3 style={styles.h3}>{theDate}</h3>

        {/* ✅ Toggle UI goes here */}
        <div className="toggle-box" style={{ padding: "20px" }}>
          <label style={styles.toggleLabel}>
            Week starts on: <strong>{weekStart === 'sunday' ? 'Sunday' : 'Monday'}</strong>
          </label>
          <label className="switch">
            <input
              type="checkbox"
              checked={weekStart === 'monday'}
              onChange={() => setWeekStart(weekStart === 'sunday' ? 'monday' : 'sunday')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "200vh",
    backgroundColor: "white",
  },
  button: {
    padding: ".5rem",
    fontSize: "1rem",
    backgroundColor: "#ee6dd5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  h3: {
    fontWeight: "normal",
    textAlign: "left",
    padding: "10px",
    marginTop: "0px",
  },
  toggleLabel: {
    fontSize: "1rem",
    color: "#333"
  }
};

export default Settings;
