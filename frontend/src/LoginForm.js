// LoginForm.js
import {useState} from 'react';


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://your-eb-domain.us-east-1.elasticbeanstalk.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

  };

  return (
    <div style={styles.page}>
        <div style={styles.card}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                styles={styles.input}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                styles={styles.input}
            />
            <button type="submit" style={styles.button}>Login</button>
        </form>
        <p>{message}</p>
        </div>
    </div>
  );
}

const styles = {
    page: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor:"#f5f5f5",
    },
    card: {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "12px",      
        boxShadow: "0 4px 8px rgba(235, 89, 193, 0.6)",
        textAlign: "center",
        width: "300px",
        height: "300px",
        display: "flex",          
        flexDirection: "column",
        justifyContent: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column", 
        gap: "1rem",
    },
    input: {
        padding: "0.5rem",
        fontSize: "1rem",
        width: "100%",
        boxSizing: "border-box",
    },
    button:{
        padding: ".5rem",
        fontSize: "1rem",
        backgroundColor: "#ee6dd5",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
};