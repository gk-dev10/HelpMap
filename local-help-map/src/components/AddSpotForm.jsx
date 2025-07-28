import { useState } from "react";
import { supabase } from "../supabase/client";

const AddSpotForm = ({ form, setForm, onAdded, user }) => {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add a spot.");
      return;
    }

    const spotData = {
      ...form,
      user_id: user.id,
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

      <button type="submit" style={styles.button}>Add Spot</button>
    </form>
  );
};

const styles = {
  form: {
    padding: 20,
    maxWidth: 400,
    margin: "auto",
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  heading: {
    textAlign: "center",
    color: "#333",
    fontSize: "1.5rem",
    marginBottom: 10,
  },
  input: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.3s",
  },
  textarea: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: "1rem",
    height: 80,
    resize: "vertical",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  },
};

export default AddSpotForm;
