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

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userSpots, setUserSpots] = useState([]);

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
    filterContainer: {
      position: "fixed",
      top: "var(--space-lg)",
      left: undefined,
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      padding: "var(--space-lg)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-lg)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      zIndex: 1000,
      width: "260px",
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
      {/* Test element to verify CSS variables */}
      
      {/* Filter options at top right */}
      <div style={{ ...styles.filterContainer, right: 'var(--space-lg)', left: 'auto' }}>
        <div style={styles.filterTitle}>Filter Spots</div>
        <select
          style={styles.filterSelect}
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
            style={styles.radiusSlider}
          />
        </label>
      </div>

      <MapView
        refreshTrigger={refreshTrigger}
        filterType={filterType}
        radius={radius}
        form={formData}
        setForm={setFormData}
      />

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

      {/* New combined button group at bottom right */}
      <div style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: "20px"
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
            padding: "1.2rem 2.2rem",
            fontSize: "1.2rem",
            background: "var(--primary-gradient)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "var(--shadow-lg)",
            transition: "all 0.3s ease"
          }}
          title="Add Spot"
        >
          + Add Spot
        </button>
        <button
          onClick={() => handleOpenProfile()}
          style={{
            padding: "1.2rem 2.2rem",
            fontSize: "1.2rem",
            background: "var(--secondary-gradient)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "var(--shadow-lg)",
            transition: "all 0.3s ease"
          }}
          title="Open profile"
        >
          Profile
        </button>
      </div>
    </>
  );
}

export default App;
