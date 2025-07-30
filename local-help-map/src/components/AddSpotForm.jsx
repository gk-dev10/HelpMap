import { useState } from "react";
import { supabase } from "../supabase/client";

const AddSpotForm = ({ form, setForm, onAdded, user }) => {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add a spot.");
      return;
    }

    let imageUrl = "";
    if (imageFile) {
      setUploading(true);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('spot-images').upload(fileName, imageFile);
      if (uploadError) {
        alert("Image upload failed");
        setUploading(false);
        return;
      }
      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('spot-images').getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
      setUploading(false);
    }

    const spotData = {
      ...form,
      user_id: user.id,
      image: imageUrl,
    };

    const { data, error } = await supabase.from("help_spots").insert([spotData]);

    if (error) {
      console.error("Error adding spot:", error);
      alert("Failed to add spot.");
    } else {
      alert("Spot added successfully!");
      setForm({
        name: "",
        type: "",
        latitude: "",
        longitude: "",
        description: "",
        contact: "",
        user_id: "",
      });
      setImageFile(null);
      onAdded?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Add a Help Spot</h2>

      <input
        style={styles.input}
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        style={styles.input}
        name="type"
        placeholder="Type (e.g. Food, Water)"
        value={form.type}
        onChange={handleChange}
        required
      />
      <input
        style={styles.input}
        name="latitude"
        placeholder="Latitude"
        value={form.latitude}
        onChange={handleChange}
        required
        readOnly
      />
      <input
        style={styles.input}
        name="longitude"
        placeholder="Longitude"
        value={form.longitude}
        onChange={handleChange}
        required
        readOnly
      />
      <textarea
        style={styles.textarea}
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        style={styles.input}
        name="contact"
        placeholder="Contact (optional)"
        value={form.contact}
        onChange={handleChange}
      />
      <input
        style={styles.fileInput}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {uploading && <p style={styles.uploading}>Uploading image...</p>}

      <button type="submit" style={styles.button} disabled={uploading}>Add Spot</button>
    </form>
  );
};

const styles = {
  form: {
    padding: "var(--space-xl)",
    maxWidth: 500,
    margin: "auto",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "var(--radius-xl)",
    boxShadow: "var(--shadow-xl)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-md)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    animation: "fadeIn 0.6s ease-out",
  },
  heading: {
    textAlign: "center",
    color: "var(--text-primary)",
    fontSize: "2rem",
    marginBottom: "var(--space-lg)",
    background: "var(--primary-gradient)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: "bold",
  },
  input: {
    padding: "var(--space-md)",
    borderRadius: "var(--radius-md)",
    border: "2px solid var(--border-color)",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
  },
  textarea: {
    padding: "var(--space-md)",
    borderRadius: "var(--radius-md)",
    border: "2px solid var(--border-color)",
    fontSize: "1rem",
    height: 100,
    resize: "vertical",
    outline: "none",
    transition: "all 0.3s ease",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontFamily: "inherit",
  },
  button: {
    background: "var(--primary-gradient)",
    color: "white",
    padding: "var(--space-md) var(--space-lg)",
    border: "none",
    borderRadius: "var(--radius-md)",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    boxShadow: "var(--shadow-md)",
    marginTop: "var(--space-md)",
  },
  fileInput: {
    padding: "var(--space-md)",
    borderRadius: "var(--radius-md)",
    border: "2px dashed var(--primary-color)",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    background: "rgba(102, 126, 234, 0.05)",
    color: "var(--text-primary)",
    cursor: "pointer",
  },
  uploading: {
    textAlign: "center",
    color: "var(--accent-color)",
    fontWeight: "600",
    padding: "var(--space-sm)",
    borderRadius: "var(--radius-sm)",
    background: "rgba(79, 172, 254, 0.1)",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-sm)",
  },
  label: {
    color: "var(--text-secondary)",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
};

export default AddSpotForm;
