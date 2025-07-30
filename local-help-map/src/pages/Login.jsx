import { supabase } from "../supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) navigate("/");
    });
  }, [navigate]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Login error:", error.message);
      alert("Login failed. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to HelpMap</h1>
        <p style={styles.subtitle}>Connect with your community</p>
        <button onClick={handleLogin} style={styles.button}>
          <span style={styles.buttonIcon}>🔐</span>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    background: "var(--primary-gradient)",
    position: "relative",
    overflow: "hidden",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    padding: "var(--space-2xl)",
    borderRadius: "var(--radius-xl)",
    boxShadow: "var(--shadow-xl)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    textAlign: "center",
    maxWidth: "400px",
    width: "90%",
    animation: "fadeIn 0.6s ease-out",
  },
  title: {
    color: "var(--text-primary)",
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "var(--space-sm)",
    background: "var(--primary-gradient)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "1.1rem",
    marginBottom: "var(--space-xl)",
    fontWeight: "500",
  },
  button: {
    background: "var(--accent-gradient)",
    color: "white",
    border: "none",
    padding: "var(--space-md) var(--space-xl)",
    borderRadius: "var(--radius-md)",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "var(--shadow-lg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--space-sm)",
    width: "100%",
  },
  buttonIcon: {
    fontSize: "1.2rem",
  },
};

export default Login;
