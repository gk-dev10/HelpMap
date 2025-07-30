import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SecondLandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const goToMap = () => {
    navigate("/app");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const features = [
    {
      icon: "🗺️",
      title: "Interactive Map",
      description: "Explore real-time locations of help spots, shelters, and resources in your area with our intuitive mapping system.",
      color: "#667eea"
    },
    {
      icon: "🤝",
      title: "Community Support",
      description: "Join a network of caring individuals who share and update information to help those in need.",
      color: "#764ba2"
    },
    {
      icon: "🔐",
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security. Login with Google for seamless access.",
      color: "#f093fb"
    }
  ];

  const stats = [
    { number: "24/7", label: "Available" },
    { number: "100%", label: "Free" }
  ];

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.mainTitle}>
              <span style={styles.highlight}>Help</span>Map
            </h1>
            <p style={styles.heroSubtitle}>
              Connecting communities through compassion. Find and share essential resources when they matter most.
            </p>
            <div style={styles.buttonGroup}>
              <button style={styles.primaryButton} onClick={goToMap}>
                Explore Map
              </button>
              <button style={styles.secondaryButton} onClick={goToLogin}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <div key={index} style={styles.statItem}>
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why Choose HelpMap?</h2>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              style={{
                ...styles.featureCard,
                transform: activeFeature === index ? 'scale(1.05)' : 'scale(1)',
                borderColor: activeFeature === index ? feature.color : '#e1e5e9'
              }}
            >
              <div style={{...styles.featureIcon, backgroundColor: feature.color}}>
                {feature.icon}
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.howItWorksSection}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepsContainer}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <h3>Find Your Location</h3>
            <p>Allow location access to see nearby help spots</p>
          </div>
          <div style={styles.stepArrow}>→</div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <h3>Explore Resources</h3>
            <p>Browse food, water, shelter, and medical assistance</p>
          </div>
          <div style={styles.stepArrow}>→</div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <h3>Get Directions</h3>
            <p>Get real-time directions to your chosen location</p>
          </div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Make a Difference?</h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of users who are already helping their communities
          </p>
          <button style={styles.ctaButton} onClick={goToMap}>
            Start Exploring Now
          </button>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>HelpMap</h3>
            <p>Building stronger communities through shared resources and mutual support.</p>
          </div>
          <div style={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul style={styles.footerLinks}>
              <li><button style={styles.footerLink} onClick={goToMap}>Map</button></li>
              <li><button style={styles.footerLink} onClick={goToLogin}>Login</button></li>
            </ul>
          </div>
          <div style={styles.footerSection}>
            <h4>Support</h4>
            <p>Need help? Contact our community support team.</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} HelpMap — Built with ❤️ by the "ENTER TEAM NAME"</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
  },
  hero: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "80px 20px",
    color: "white",
    position: "relative",
    overflow: "hidden",
    minHeight: "60vh", // Add this for vertical space
    display: "flex",   // Add this
    alignItems: "center", // Add this for vertical centering
    justifyContent: "center", // Add this for horizontal centering
  },
  heroContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column", // Change to column for vertical stacking
    alignItems: "center",    // Center horizontally
    justifyContent: "center",// Center vertically
    gap: "60px",
  },
  heroText: {
    flex: 1,
    textAlign: "center", // Add this to center text and buttons
  },
  mainTitle: {
    fontSize: "4rem",
    fontWeight: "800",
    marginBottom: "20px",
    lineHeight: "1.1",
  },
  highlight: {
    color: "#fbbf24",
  },
  heroSubtitle: {
    fontSize: "1.25rem",
    marginBottom: "40px",
    opacity: 0.9,
    lineHeight: "1.6",
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    padding: "16px 32px",
    fontSize: "1.1rem",
    backgroundColor: "#fbbf24",
    color: "#1f2937",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 14px rgba(251, 191, 36, 0.3)",
  },
  secondaryButton: {
    padding: "16px 32px",
    fontSize: "1.1rem",
    backgroundColor: "transparent",
    color: "white",
    border: "2px solid white",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  heroVisual: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  mapMockup: {
    width: "300px",
    height: "200px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    position: "relative",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  mapPin: {
    position: "absolute",
    top: "30%",
    left: "20%",
    fontSize: "24px",
    animation: "bounce 2s infinite",
  },
  mapPin2: {
    position: "absolute",
    top: "60%",
    right: "25%",
    fontSize: "24px",
    animation: "bounce 2s infinite 0.5s",
  },
  mapPin3: {
    position: "absolute",
    bottom: "20%",
    left: "50%",
    fontSize: "24px",
    animation: "bounce 2s infinite 1s",
  },
  statsSection: {
    padding: "60px 20px",
    backgroundColor: "#f8fafc",
  },
  statsContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
  },
  statItem: {
    textAlign: "center",
  },
  statNumber: {
    fontSize: "3rem",
    fontWeight: "800",
    color: "#667eea",
    marginBottom: "8px",
  },
  statLabel: {
    fontSize: "1.1rem",
    color: "#64748b",
    fontWeight: "500",
  },
  featuresSection: {
    padding: "80px 20px",
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "60px",
    fontWeight: "700",
    color: "#1f2937",
  },
  featuresGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  featureCard: {
    padding: "40px 30px",
    borderRadius: "20px",
    border: "2px solid #e1e5e9",
    textAlign: "center",
    transition: "all 0.3s ease",
    backgroundColor: "white",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  },
  featureIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    margin: "0 auto 20px",
  },
  featureTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#1f2937",
  },
  featureDescription: {
    fontSize: "1rem",
    color: "#64748b",
    lineHeight: "1.6",
  },
  howItWorksSection: {
    padding: "80px 20px",
    backgroundColor: "#f8fafc",
  },
  stepsContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap",
  },
  step: {
    textAlign: "center",
    flex: 1,
    minWidth: "200px",
  },
  stepNumber: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#667eea",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: "0 auto 20px",
  },
  stepArrow: {
    fontSize: "2rem",
    color: "#667eea",
    fontWeight: "700",
  },
  ctaSection: {
    padding: "80px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    textAlign: "center",
  },
  ctaContent: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  ctaTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "20px",
  },
  ctaSubtitle: {
    fontSize: "1.2rem",
    marginBottom: "40px",
    opacity: 0.9,
  },
  ctaButton: {
    padding: "18px 40px",
    fontSize: "1.2rem",
    backgroundColor: "#fbbf24",
    color: "#1f2937",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 14px rgba(251, 191, 36, 0.3)",
  },
  footer: {
    backgroundColor: "#1f2937",
    color: "white",
    padding: "60px 20px 20px",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "40px",
    marginBottom: "40px",
  },
  footerSection: {
    h3: {
      marginBottom: "20px",
      fontSize: "1.3rem",
      fontWeight: "600",
    },
    h4: {
      marginBottom: "16px",
      fontSize: "1.1rem",
      fontWeight: "600",
    },
  },
  footerTitle: {
    marginBottom: "20px",
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#fbbf24",
  },
  footerLinks: {
    listStyle: "none",
    padding: 0,
  },
  footerLink: {
    background: "none",
    border: "none",
    color: "#d1d5db",
    cursor: "pointer",
    padding: "4px 0",
    fontSize: "1rem",
    transition: "color 0.3s ease",
  },
  footerBottom: {
    borderTop: "1px solid #374151",
    paddingTop: "20px",
    textAlign: "center",
    color: "#9ca3af",
  },
};

export default SecondLandingPage; 