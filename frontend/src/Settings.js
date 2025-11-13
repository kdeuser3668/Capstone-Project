import { useState, useEffect } from "react";
import Sidebar from './Sidebar';
import './Calendar.css';
import './App.css';

const backendUrl = "http://localhost:5050"; // hits local backend, will be changed in deployment

function Settings() {

    const [textColor, setTextColor] = useState(
        typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem("textColor") || "#000000"
        : "#000000"
    );

    const [buttonColor, setButtonColor] = useState(
        typeof window !== "undefined" && window.localStorage
          ? window.localStorage.getItem("buttonColor") || "#a7d0fb"
          : "#a7d0fb"
      );

    const [shadowColor, setShadowColor] = useState(
        typeof window !== "undefined" && window.localStorage
          ? window.localStorage.getItem("shadowColor") || "#42434d"
          : "#42434d"
      );

    const [backgroundColor, setBackgroundColor] = useState(
        typeof window !== "undefined" && window.localStorage
          ? window.localStorage.getItem("backgroundColor") || "white"
          : "white"
    );
    const [sidebarColor, setSidebarColor] = useState(
        typeof window !== "undefined" && window.localStorage
          ? window.localStorage.getItem("sidebarColor") || "#f5f5f5"
          : "#f5f5f5"
    );
    const [cardColor, setCardColor] = useState(
        typeof window !== "undefined" && window.localStorage
          ? window.localStorage.getItem("cardColor") || "#fff"
          : "#fff"
    );
    const [fontSize, setFontSize] = useState(
        parseFloat(localStorage.getItem("fontSize")) || 1 
    ); 

    //saves and applies text changes across all pages when using color: "var(--text-color)"
    const handleColorChange = (event) => {
        const newColor = event.target.value;
        setTextColor(newColor);
        window.localStorage.setItem("textColor", newColor);
        document.documentElement.style.setProperty("--text-color", newColor);
      };
    
      useEffect(() => {
        const savedColor = window.localStorage.getItem("textColor") || "#000000";
        document.documentElement.style.setProperty("--text-color", savedColor);
      }, []);

    
      //saves and applies button changes across all pages when using background: "var(--button-color, #a7d0fb)" the second color is a fallback color
    const handleButtonChange = (event) => {
        const newButtonColor = event.target.value;
        setButtonColor(newButtonColor);
        window.localStorage.setItem("buttonColor", newButtonColor);
        document.documentElement.style.setProperty("--button-color", newButtonColor);
      };
    
      useEffect(() => {
        const savedButtonColor = window.localStorage.getItem("buttonColor") || "#a7d0fb";
        document.documentElement.style.setProperty("--button-color", savedButtonColor);
      }, []);

    //saves and applies shadow changes across all pages when using boxShadow: "0 4px 8px var(--shadow-color, #42434d)" the second color is a fallback color
    const handleShadowChange = (event) => {
        const newShadowColor = event.target.value;
        setShadowColor(newShadowColor);
        window.localStorage.setItem("shadowColor", newShadowColor);
        document.documentElement.style.setProperty("--shadow-color", newShadowColor);
        };

    useEffect(() => {
        const savedShadowColor = window.localStorage.getItem("shadowColor") || "#42434d";
        document.documentElement.style.setProperty("--shadow-color", savedShadowColor);
        }, []);

    //saves and applies page color changes across all pages when using backgroundColor: "var(--background-color, #ffffff)" the second color is a fallback color
    const handleBackgroundChange = (event) => {
        const newBackgroundColor = event.target.value;
        setBackgroundColor(newBackgroundColor);
        window.localStorage.setItem("backgroundColor", newBackgroundColor);
        document.documentElement.style.setProperty("--background-color", newBackgroundColor);
        };

    useEffect(() => {
        const savedBackgroundColor = window.localStorage.getItem("backgroundColor") || "#ffffff";
        document.documentElement.style.setProperty("--background-color", savedBackgroundColor);
        }, []);
    
    //saves and applies page color changes across all pages when using backgroundColor: "var(--sidebar-color, #f5f5f5)" the second color is a fallback color
    const handleSidebarChange = (event) => {
        const newSidebarColor = event.target.value;
        setSidebarColor(newSidebarColor);
        window.localStorage.setItem("sidebarColor", newSidebarColor);
        document.documentElement.style.setProperty("--sidebar-color", newSidebarColor);
        };

    useEffect(() => {
        const savedSidebarColor = window.localStorage.getItem("sidebarColor") || "#f5f5f5";
        document.documentElement.style.setProperty("--sidebar-color", savedSidebarColor);
        }, []);

    //saves and applies card color changes across all pages when using backgroundColor: "var(--card-color, #fff)" the second color is a fallback color
    const handleCardChange = (event) => {
        const newCardColor = event.target.value;
        setCardColor(newCardColor);
        window.localStorage.setItem("cardColor", newCardColor);
        document.documentElement.style.setProperty("--card-color", newCardColor);
        };

    useEffect(() => {
        const savedCardColor = window.localStorage.getItem("cardColor") || "#fff";
        document.documentElement.style.setProperty("--card-color", savedCardColor);
        }, []);

    //Font size
    const handleFontSizeChange = (event) => {
        const newSize = parseFloat(event.target.value);
        setFontSize(newSize);
        document.documentElement.style.setProperty("--font-size", newSize);
        localStorage.setItem("fontSize", newSize);
        };

    useEffect(() => {
        const savedFontSize = localStorage.getItem("fontSize");
        document.documentElement.style.setProperty("--font-size", savedFontSize);
        }, []);
    
        

    // change password functionality
    // change password and email functionality
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?.id;

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newConfirmPassword, setNewConfirmPassword] = useState('');

    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newConfirmEmail, setNewConfirmEmail] = useState('');
    const [password2, setPassword2] = useState('');

    const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== newConfirmPassword) {
        alert("New passwords do not match");
        return;
    }

    try {
        const res = await fetch(`${backendUrl}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            userId: userId,
            currentPassword: password, 
            newPassword: newPassword 
        }),
        });

        const data = await res.json();
        if (res.ok) {
        alert("Password changed successfully!");
        setPassword('');
        setNewPassword('');
        setNewConfirmPassword('');
        } else {
        alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong");
    }
    };

    const handleEmailChange = async (e) => {
    e.preventDefault();
    
    if (newEmail !== newConfirmEmail) {
        alert("New emails do not match");
        return;
    }

    try {
        const res = await fetch(`${backendUrl}/change-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            userId: userId,
            currentEmail: currentEmail,
            newEmail: newEmail,
            password: password2
        }),
        });

        const data = await res.json();
        if (res.ok) {
        alert("Email changed successfully!");
        setCurrentEmail('');
        setNewEmail('');
        setNewConfirmEmail('');
        setPassword2('');
        } else {
        alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong");
    }
    };
    
    // profile
        // reset colors
        // notifications
        // categories
        // course management
        
return (
    <div className="container">
    <Sidebar />
        <div className="main-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}>
        <div>
            <h1 className="h1">Settings</h1>
            <h2 className="h2" style={{textAlign:"left", marginBottom: ".5rem", marginTop: "0rem" }}>Appearance Settings</h2>
            <h3 className="h3">Customize PlannerPal's appearance</h3>
        </div>
        <div>
            <button onClick={() => {
                localStorage.clear(); document.documentElement.style.setProperty("--text-color", '#000000'); 
                localStorage.clear(); document.documentElement.style.setProperty("--background-color", "#fff"); 
                localStorage.clear(); document.documentElement.style.setProperty("--button-color",  "#a7d0fb");
                localStorage.clear(); document.documentElement.style.setProperty("--shadow-color", "#42434d"); 
                localStorage.clear(); document.documentElement.style.setProperty("--card-color", "#fff"); 
                localStorage.clear(); document.documentElement.style.setProperty("--font-size", "1"); 
                //window.location.reload(); 
                }} className="button" style={{ alignItems: "right" }}>Reset Customizations</button>
        </div>
        </div>
        
            <div className="grid">
                <div className="card">
                <label htmlFor="textcolor" style={{ display: "block", marginTop: "1rem", color: textColor }}>
                    Select your text color:
                    </label>
                    <input type="color" id="textcolor" value={textColor} onChange={handleColorChange} style={{ marginTop: "0.5rem", cursor: "pointer" }}/>
                    <p className="p" style={{ marginTop: "1rem", color: textColor }}>Your selected color:{" "}<strong style={{ color: textColor }}>{textColor}</strong>
                    </p>
                </div>
                <div className="card">
                <label htmlFor="buttoncolor" style={{ display: "block", marginTop: "1rem", color: textColor,  fontSize: "calc(1rem * var(--font-scale))" }}>
                    Select your button color:
                    </label>
                    <input type="color" id="buttonColor" value={buttonColor} onChange={handleButtonChange} style={{ marginTop: "0.5rem", cursor: "pointer" }}/>
                    <p className="p" style={{ marginTop: "1rem", color: textColor }}>Your selected color:{" "}<strong style={{ color: buttonColor }}>{buttonColor}</strong>
                    </p>
                </div>
                <div className="card">
                <label htmlFor="shadowcolor" style={{ display: "block", marginTop: "1rem", color: textColor,  fontSize: "calc(1rem * var(--font-scale))" }}>
                    Select your drop shadow color:
                    </label>
                    <input type="color" id="shadowColor" value={shadowColor} onChange={handleShadowChange} style={{ marginTop: "0.5rem", cursor: "pointer" }}/>
                    <p className="p" style={{ marginTop: "1rem", color: textColor }}>Your selected color:{" "}<strong style={{ color: shadowColor }}>{shadowColor}</strong>
                    </p>
                </div>
                <div className="card">
                <label htmlFor="backgroundColor" style={{ display: "block", marginTop: "1rem", color: textColor,  fontSize: "calc(1rem * var(--font-scale))" }}>
                    Select your background color:
                    </label>
                    <input type="color" id="backgroundColor" value={backgroundColor} onChange={handleBackgroundChange} style={{ marginTop: "0.5rem", cursor: "pointer" }}/>
                    <p className="p" style={{ marginTop: "1rem", color: textColor }}>Your selected color:{" "}<strong style={{ color: backgroundColor }}>{backgroundColor}</strong>
                    </p>
                </div>
                <div className="card">
                <label htmlFor="sidebarColor" style={{ display: "block", marginTop: "1rem", color: textColor, fontSize: "calc(1rem * var(--font-scale))"}}>
                    Select your sidebar color:
                    </label>
                    <input type="color" id="sidebarColor" value={sidebarColor} onChange={handleSidebarChange} style={{ marginTop: "0.5rem", cursor: "pointer" }}/>
                    <p className="p" style={{ marginTop: "1rem", color: textColor }}>Your selected color:{" "}<strong style={{ color: sidebarColor }}>{sidebarColor}</strong>
                    </p>
                </div>
                <div className="card">
                <label htmlFor="cardColor" style={{ display: "block", marginTop: "1rem", color: textColor, fontSize: "calc(1rem * var(--font-scale))" }}>
                    Select your card color:
                    </label>
                    <input type="color" id="cardColor" value={cardColor} onChange={handleCardChange} style={{ marginTop: "0.5rem", cursor: "pointer" }}/>
                    <p className="p" style={{ marginTop: "1rem", color: textColor }}>Your selected color:{" "}<strong style={{ color: textColor }}>{cardColor}</strong>
                    </p>
                </div>
                <div className="card">
                <label htmlFor="font-size-slider" style={{ display: "block", marginTop: "1rem", color: textColor,  fontSize: "calc(1rem * var(--font-scale))" }}>
                    Change font size:
                    </label>
                    <input type="range" min="0.8" max="1.5" step="0.1" id="font-size-slider" value={fontSize} onChange={handleFontSizeChange} style={{ marginTop: "0.5rem", cursor: "pointer" }}/>
                    <p className="p" style={{ marginTop: "1rem", color: textColor }}>Adjust text size:{" "}<strong style={{ color: textColor, fontSize: "calc(1rem * var(--font-scale))" }}>{fontSize.toFixed(1)}x</strong>
                    </p>
                </div>
            </div>
        <h2 className="h2" style={{textAlign:"left", marginBottom: ".5rem", marginTop: "1rem"}}>User Settings</h2>
        <h3 className="h3">Change account information</h3>
        <div className="grid">
            <div className="card">
                <p className="p" style={{ marginTop: "1rem", color: textColor,  fontSize: "calc(1rem * var(--font-scale))" }}>Change Password:</p>
                <form onSubmit={handlePasswordChange}>
                    <input
                    type="password"
                    placeholder="Current Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                    <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    />
                    <input
                    type="password"
                    placeholder="Confirm Password"
                    value={newConfirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                    required
                    />
                    <button type="submit" className="button" style={{margin: ".5rem"}}>Change Password</button>
                </form>
            </div>
            <div className="card">
                <p style={{ marginTop: "1rem", color: textColor }}>Change Email:</p>
                <form onSubmit={handleEmailChange}>
                    <input
                    type="text"
                    placeholder="Current Email"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    required
                    />
                    <input
                    type="text"
                    placeholder="New Email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    />
                    <input
                    type="text"
                    placeholder="Confirm New Email"
                    value={newConfirmEmail}
                    onChange={(e) => setNewConfirmEmail(e.target.value)}
                    required
                    />
                    <input
                    type="password"
                    placeholder="Password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                    />
                    <button type="submit" className="button" style={{margin: ".5rem"}}>Change Email</button>
                </form>
            </div>
        </div>
        </div>
      </div>
  );
}


export default Settings;
