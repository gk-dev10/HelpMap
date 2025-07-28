import { useState } from "react";
import { supabase } from "../supabase/client";
import {useEffect} from "react";

const AddSpotForm = ({ form, setForm, onAdded }) => {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.from("help_spots").insert([form]);

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
      });
      onAdded?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 16, maxWidth: 400 }}>
      <h2>Add a Help Spot</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="type" placeholder="Type (e.g. Food, Water)" value={form.type} onChange={handleChange} required />
      <input name="latitude" placeholder="Latitude" value={form.latitude} onChange={handleChange} required readOnly />
      <input name="longitude" placeholder="Longitude" value={form.longitude} onChange={handleChange} required readOnly />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="contact" placeholder="Contact (optional)" value={form.contact} onChange={handleChange} />
      <button type="submit">Add Spot</button>
    </form>
  );
};

export default AddSpotForm;
