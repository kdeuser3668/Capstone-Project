// LoginForm.js
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';


export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [agreedToTerms, agree] = useState('');
  const [ofAge, setOfAge] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!isLogin && (!agreedToTerms || !ofAge)) {
      alert("You must agree to the Privacy Policy and be 13 years of age or older.");
      return;
    }
  /*
    const endpoint = isLogin ? "login" : "signup";
    const payload = isLogin ? { email, password } : { email, password, username };

    try {
      const res = await fetch(`http://localhost:5050/${endpoint}`, { // hits local backend, will be changed in deployment
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        localStorage.setItem('isAuthenticated', 'true');

        navigate('/dashboard')
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
    */
   // --- Add this mock logic instead ---
    console.log(isLogin ? "Mock login..." : "Mock signup...");
    await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay

    alert(isLogin ? "Login successful!" : "Signup successful!");
    localStorage.setItem("isAuthenticated", "true");
    navigate("/dashboard");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 class="h2">Welcome to PlannerPal!</h2>
        <div style={styles.tabs}>
          <div
            onClick={() => setIsLogin(true)}
            style={{
              ...styles.tab,
              ...(isLogin ? styles.activeTab : {}),
            }}
          >
            Login
          </div>
          <div
            onClick={() => setIsLogin(false)}
            style={{
              ...styles.tab,
              ...(!isLogin ? styles.activeTab : {}),
            }}
          >
            Sign Up
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
          )}
          {!isLogin && (
          <label style={{ fontSize: "0.9rem", textAlign: "left" }}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => agree(e.target.checked)}
              required
              style={{ marginRight: "0.5rem" }}
            />
            I agree to PlannerPal's <a href="/privacy-policy">Privacy Policy</a>.
          </label>
        )}
        {!isLogin && (
          <label style={{ fontSize: "0.9rem", textAlign: "left" }}>
            <input
              type="checkbox"
              checked={ofAge}
              onChange={(e) => setOfAge(e.target.checked)}
              required
              style={{ marginRight: "0.5rem" }}
            />
            I verify that I am 13 years of age or older.
          </label>
        )}
          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '1rem' }}>{message}</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f5f8',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
    width: '320px',
    maxWidth: '90%',
    transition: 'all 0.3s ease',
  },
  tabs: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    textAlign: 'center',
    padding: '0.75rem 0',
    cursor: 'pointer',
    color: '#777',
    fontWeight: 500,
    transition: 'all 0.3s ease',
  },
  activeTab: {
    backgroundColor: '#ee6dd5',
    color: '#fff',
    fontWeight: 600,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.6rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border 0.2s ease',
  },
  button: {
    padding: '0.6rem',
    fontSize: '1rem',
    backgroundColor: '#ee6dd5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  message: {
    color: '#ee6dd5',
    marginTop: '1rem',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
};