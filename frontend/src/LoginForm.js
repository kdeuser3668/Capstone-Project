// LoginForm.js
//need to include a checkoff stating the user must be 13+ and have the user agree
//need to incliude a toggle to change from login to sign up
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Test email and password to make sure the navigation to dashboard works
    if (email == 'example@email.com' && password == 'password123!'){
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard')
    }else{
      //console.error(err);
      alert("Something went wrong");
    }

    /*
    try {
      const res = await fetch("http://plannerpal.us-east-2.elasticbeanstalk.com/)", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
        maxWidth: "90%",
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