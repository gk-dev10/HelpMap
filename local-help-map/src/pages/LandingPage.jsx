import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate("/app"); // or wherever your map page is
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>HelpMap</h1>
        <p style={styles.subtitle}>Find and Share Help Spots Near You</p>
        <button style={styles.ctaButton} onClick={goToMap}>Get Started</button>
      </header>

      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why HelpMap?</h2>
        <div style={styles.features}>
          <div style={styles.featureBox}>
            <h3>🗺️ Real-Time Map</h3>
            <p>View nearby spots for food, water, shelter, and aid.</p>
          </div>
          <div style={styles.featureBox}>
            <h3>👥 Community Driven</h3>
            <p>Add and update locations to support others in need.</p>
          </div>
          <div style={styles.featureBox}>
            <h3>🔒 Secure Login</h3>
            <p>Login with Google. Your spots stay linked to your account.</p>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} HelpMap — Built with ❤️ by the community</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    background: "linear-gradient(to right, #e0eafc, #cfdef3)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "60px 20px",
    textAlign: "center",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    color: "white",
  },
  title: {
    fontSize: "3rem",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: "1.3rem",
    marginBottom: 30,
  },
  ctaButton: {
    padding: "12px 28px",
    fontSize: "1rem",
    backgroundColor: "#ffffff",
    color: "#4b0082",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    transition: "transform 0.2s",
  },
  featuresSection: {
    padding: "60px 20px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "2rem",
    marginBottom: 40,
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    maxWidth: 900,
    margin: "0 auto",
  },
  featureBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease-in-out",
  },
  footer: {
    textAlign: "center",
    padding: 20,
    marginTop: "auto",
    backgroundColor: "#eee",
    fontSize: "0.9rem",
  },
};

export default LandingPage;
