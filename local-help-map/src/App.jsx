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
    bottom: "20px",
    right: "20px",
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    zIndex: 2000,
  },
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "400px",
  },
  closeButton: {
    marginTop: "10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
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
<div
  style={{
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1000,
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }}
>
  <div>
    <label>Filter by Type: </label>
    <select
      value={filterType}
      onChange={(e) => setFilterType(e.target.value)}
    >
      <option value="">All</option>
      {types.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label>Distance: {radius} km</label>
    <input
      type="range"
      min={1}
      max={50}
      step={1}
      value={radius}
      onChange={(e) => setRadius(parseInt(e.target.value))}
    />
  </div>

  {showProfileModal && (
  <div style={styles.modalBackdrop}>
    <div style={styles.modalContent}>
      <h3>User Profile</h3>
      <p><strong>Name:</strong> {user?.user_metadata?.name || user?.email}</p>

      <h4>Your Added Spots:</h4>
      {userSpots.length === 0 ? (
        <p>You haven’t added any spots yet.</p>
      ) : (
        <ul>
          {userSpots.map((spot) => (
            <li key={spot.id}>
              <strong>{spot.name}</strong> ({spot.type})
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => setShowProfileModal(false)} style={styles.closeButton}>
        Close
      </button>
    </div>
  </div>
)}

  <div style = {{flex : 1, display: "flex", justifyContent: "center"}}>
    <button
        onClick={() => {handleOpenProfile()}}
        style={{
          bottom: "20px",
          right: "20px",
          padding: "12px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "25%",
          fontSize: "20px",
          cursor: "pointer",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          zIndex : 1000
        }}
        title="Open profile"
      >
        Open Profile
      </button>
  </div>
</div>

{showModal && (
  <div style={styles.modalBackdrop}>
    <div style={styles.modalContent}>
      <AddSpotForm
        onAdded={() => {
          handleSpotAdded();
          setShowModal(false); // close modal after adding
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




      {/* MAP VIEW */}
      <MapView
        refreshTrigger={refreshTrigger}
        filterType={filterType}
        radius={radius}
        form={formData}
        setForm={setFormData}
      />

      <button
        onClick={() => {
          if (!user) {
            navigate("/login");
          } else {
            setShowModal(true);
          }
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "12px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "25%",
          fontSize: "20px",
          cursor: "pointer",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          zIndex : 1000
        }}
        title="Add Spot"
      >
        + Add Spot
      </button>
    </>
  );
}

export default App;
