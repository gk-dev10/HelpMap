import MapView from "./components/MapView";
import AddSpotForm from "./components/AddSpotForm";
import { useState, useEffect } from "react";
import { supabase } from "./supabase/client";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [types, setTypes] = useState([]);
  const [filterType, setFilterType] = useState("");

  const handleSpotAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    latitude: "",
    longitude: "",
    description: "",
    contact: "",
  });

  useEffect(() => {
    const fetchTypes = async () => {
      const { data, error } = await supabase
        .from("help_spots")
        .select("type", { count: "exact", head: false });

      if (error) {
        console.error("Error fetching types:", error);
      } else {
        const uniqueTypes = [...new Set(data.map((item) => item.type))];
        setTypes(uniqueTypes);
      }
    };

    fetchTypes();
  }, [refreshTrigger]);

  return (
    <>
      <AddSpotForm
        onAdded={handleSpotAdded}
        form={formData}
        setForm={setFormData}
      />

      <div style={{ padding: "1rem" }}>
        <label>Filter by Type: </label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <MapView
        refreshTrigger={refreshTrigger}
        filterType={filterType}
        form={formData}
        setForm={setFormData}
      />
    </>
  );
}

export default App;
