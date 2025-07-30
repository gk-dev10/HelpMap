import MapView from "./components/MapView";
import AddSpotForm from "./components/AddSpotForm";
import { useState, useEffect } from "react";
import { supabase } from "./supabase/client";
import { useNavigate } from "react-router-dom";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [types, setTypes] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [radius, setRadius] = useState(5); // default radius in km
  const [showForm, setShowForm] = useState(false); // 👈 control visibility of AddSpotForm
  const [showModal, setShowModal] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false); // 👈 control slide panel

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userSpots, setUserSpots] = useState([]);
  const [isToggleHovered, setIsToggleHovered] = useState(false);

  useEffect(() => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  getUser();
}, []);

  const styles = {
    floatingButton: {
      position: "fixed",
      bottom: "var(--space-lg)",
      right: "var(--space-lg)",
      padding: "var(--space-md) var(--space-lg)",
      fontSize: "1rem",
      background: "var(--primary-gradient)",
      color: "white",
      border: "none",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      zIndex: 2000,
      boxShadow: "var(--shadow-lg)",
      transition: "all 0.3s ease",
      fontWeight: "600",
    },
    modalBackdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(4px)",
      zIndex: 1500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-md)",
    },
    modalContent: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      padding: "var(--space-xl)",
      borderRadius: "var(--radius-xl)",
      width: "95vw",
      maxWidth: "420px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "var(--shadow-xl)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      animation: "fadeIn 0.4s ease-out",
    },
    closeButton: {
      marginTop: "var(--space-md)",
      background: "var(--warning-gradient)",
      color: "white",
      border: "none",
      padding: "var(--space-sm) var(--space-md)",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "var(--shadow-md)",
    },
    logoutButton: {
      marginTop: "var(--space-md)",
      left: "var(--space-md)",
      background: "var(--danger-color)",
      color: "white",
      border: "none",
      padding: "var(--space-sm) var(--space-md)",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "var(--shadow-md)",
    },
    // Slide panel styles
    slidePanel: {
      position: "fixed",
      top: 0,
      right: isPanelOpen ? 0 : "-320px",
      width: "320px",
      height: "100vh",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      boxShadow: "var(--shadow-xl)",
      borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
      zIndex: 1000,
      transition: "right 0.3s ease-in-out",
      overflowY: "auto",
      padding: "var(--space-lg)",
    },
    panelToggleButton: {
      position: "fixed",
      top: "50%",
      right: isPanelOpen ? "320px" : 0,
      transform: "translateY(-50%)",
      background: "var(--primary-gradient)",
      color: "white",
      border: "none",
      padding: "var(--space-md)",
      borderRadius: "var(--radius-md) 0 0 var(--radius-md)",
      cursor: "pointer",
      zIndex: 1001,
      boxShadow: "var(--shadow-lg)",
      transition: "all 0.3s ease",
      fontSize: "1.2rem",
    },
    panelContent: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-lg)",
      height: "100%",
    },
    filterContainer: {
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(5px)",
      padding: "var(--space-lg)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-md)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
    },
    filterTitle: {
      color: "var(--text-primary)",
      fontSize: "1.1rem",
      fontWeight: "bold",
      marginBottom: "var(--space-md)",
      textAlign: "center",
    },
    filterSelect: {
      width: "100%",
      padding: "var(--space-sm)",
      borderRadius: "var(--radius-sm)",
      border: "2px solid var(--border-color)",
      marginBottom: "var(--space-md)",
      background: "var(--bg-primary)",
      color: "var(--text-primary)",
      fontSize: "0.9rem",
    },
    radiusSlider: {
      width: "100%",
      marginBottom: "var(--space-md)",
      outline: "none",
      boxShadow: "none",
    },
    radiusLabel: {
      color: "var(--text-secondary)",
      fontSize: "0.9rem",
      marginBottom: "var(--space-sm)",
      display: "block",
    },
    actionButtons: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)",
      marginTop: "auto",
    },
    actionButton: {
      padding: "var(--space-md) var(--space-lg)",
      fontSize: "1rem",
      color: "white",
      border: "none",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      fontWeight: "600",
      boxShadow: "var(--shadow-md)",
      transition: "all 0.3s ease",
      textAlign: "center",
    },
    addSpotButton: {
      background: "var(--primary-gradient)",
    },
    profileButton: {
      background: "var(--secondary-gradient)",
    },
  };

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    latitude: "",
    longitude: "",
    description: "",
    contact: "",
    user_id:""
  });

  const handleSpotAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowForm(false); // hide the form after submission
  };

  useEffect(() => {
    const fetchTypes = async () => {
      const { data, error } = await supabase
        .from("help_spots")
        .select("type", { count: "exact", head: false })
        .order("type", { ascending: true });

      if (error) {
        console.error("Error fetching types:", error);
      } else {
        const uniqueTypes = [...new Set(data.map((item) => item.type))];
        setTypes(uniqueTypes);
      }
    };

    fetchTypes();
  }, [refreshTrigger]);

  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error.message);
    alert("Logout failed");
  } else {
    setUser(null); // Clear user from state/context
    setUserSpots([]);
    alert("Logged out successfully");
  }
};

  const handleOpenProfile = async () => {
  if (!user) {
    alert("You are not logged in.");
    return;
  }

  const { data, error } = await supabase
    .from("help_spots")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to fetch user's spots:", error);
  } else {
    setUserSpots(data || []);
    setShowProfileModal(true);
  }
};

  return (
    <>
      {/* Slide Panel */}
      <div style={styles.slidePanel}>
        <div style={styles.panelContent}>
          {/* Panel Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
            justifyContent: "center"
          }}>
            <span style={{ fontSize: 28, marginRight: 8 }}>🗺️</span>
            <span style={{ fontWeight: 700, fontSize: "1.3rem", letterSpacing: 1 }}>HelpMap Panel</span>
          </div>

          {/* Profile Preview */}
          {user && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255,255,255,0.7)",
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              marginBottom: 18,
              boxShadow: "var(--shadow-sm)",
            }}>
              <span style={{ fontSize: 28 }}>👤</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "1rem" }}>{user.user_metadata?.name || user.email}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{user.email}</div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "12px 0 18px 0", borderRadius: 2 }} />

          {/* Filter Section */}
          <div style={{
            background: "rgba(255,255,255,0.85)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            padding: "var(--space-lg)",
            marginBottom: 18,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>🔎</span>
              <div style={styles.filterTitle}>Filter Spots</div>
            </div>
            <select
              style={{ ...styles.filterSelect, marginBottom: 10, cursor: "pointer" }}
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <label style={styles.radiusLabel}>
              Radius: {radius} km
              <input
                type="range"
                min={1}
                max={20}
                value={radius}
                onChange={e => setRadius(Number(e.target.value))}
                style={{ ...styles.radiusSlider, cursor: "pointer" }}
              />
            </label>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "12px 0 18px 0", borderRadius: 2 }} />

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)",
            marginTop: "auto",
          }}>
            <button
              onClick={() => {
                if (!user) {
                  navigate("/login");
                } else {
                  setShowModal(true);
                }
              }}
              style={{
                ...styles.actionButton,
                ...styles.addSpotButton,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: "1.05rem",
                justifyContent: "center",
                transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
                cursor: "pointer"
              }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              title="Add Spot"
            >
              <span style={{ fontSize: 20 }}>➕</span> Add Spot
            </button>
            <button
              onClick={() => handleOpenProfile()}
              style={{
                ...styles.actionButton,
                ...styles.profileButton,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: "1.05rem",
                justifyContent: "center",
                transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
                cursor: "pointer"
              }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              title="Open profile"
            >
              <span style={{ fontSize: 20 }}>👤</span> Profile
            </button>
          </div>
        </div>
      </div>

      {/* Panel Toggle Button */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        onMouseEnter={() => setIsToggleHovered(true)}
        onMouseLeave={() => setIsToggleHovered(false)}
        style={{
          ...styles.panelToggleButton,
          background: isToggleHovered ? "var(--secondary-gradient)" : "var(--primary-gradient)",
          transform: isToggleHovered ? "translateY(-50%) scale(1.05)" : "translateY(-50%)",
          boxShadow: isToggleHovered ? "var(--shadow-xl)" : "var(--shadow-lg)",
        }}
        title={isPanelOpen ? "Close Panel" : "Open Panel"}
      >
        {isPanelOpen ? "×" : "☰"}
      </button>

      {/* Map with adjusted width, fixed to viewport */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isPanelOpen ? "calc(100vw - 320px)" : "100vw",
          transition: "width 0.3s ease-in-out",
          zIndex: 0,
        }}
      >
        <MapView
          refreshTrigger={refreshTrigger}
          filterType={filterType}
          radius={radius}
          form={formData}
          setForm={setFormData}
        />
      </div>

      {showModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <AddSpotForm
              onAdded={() => {
                handleSpotAdded();
                setShowModal(false);
              }}
              form={formData}
              setForm={setFormData}
              user={user}
            />
            <button onClick={() => setShowModal(false)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <h3>User Profile</h3>
            <p><strong>Name:</strong> {user?.user_metadata?.name || user?.email}</p>

            <h4>Your Added Spots:</h4>
            {userSpots.length === 0 ? (
              <p>You haven't added any spots yet.</p>
            ) : (
              <ul>
                {userSpots.map((spot) => (
                  <li key={spot.id}>
                    <strong>{spot.name}</strong> ({spot.type})
                  </li>
                ))}
              </ul>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setShowProfileModal(false)} style={styles.closeButton}>
                Close
              </button>
              <button onClick={() => handleLogout()} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
