import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WebsiteInformation = ({ token }) => {
  const ID = "6931dc9d87c37bcf75efc18a";

  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    ShortDescription: "",
    Contact: "",
    email: "",
    Accent: "#000000",
    SecondaryAccent: "#000000",
    DefaultColor: "#ffffff",
    PriceColor: "#000000",
    Currency: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/web/single/${ID}`, { headers: { token } });
      const data = res.data.data;

      setFormData({
        FirstName: data.FirstName,
        LastName: data.LastName,
        ShortDescription: data.ShortDescription,
        Contact: data.Contact,
        email: data.email,
        Accent: data.Accent || "#000000",
        SecondaryAccent: data.SecondaryAccent || "#000000",
        DefaultColor: data.DefaultColor || "#ffffff",
        PriceColor: data.PriceColor || "#000000",
        Currency: data.Currency,
      });

      if (data.Logo && data.Logo.length > 0) setPreview(data.Logo[0]);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch website data");
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const data = new FormData();
      if (logo) data.append("logo", logo);
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));

      await axios.put(`${backendUrl}/api/web/update/${ID}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Website information updated successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl space-y-10"
      >
        {/* Section 1: Business Information */}
        <div>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Business Information</h2>

          {/* Logo */}
          <div className="flex items-center gap-6 mb-6">
            <label className="relative cursor-pointer">
              <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
              {preview ? (
                <img
                  src={preview}
                  alt="Logo Preview"
                  className="w-32 h-32 object-cover rounded-xl border shadow-sm"
                />
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 transition">
                  <span className="text-3xl font-bold">+</span>
                  <span className="text-sm mt-1">Upload</span>
                </div>
              )}
            </label>
            <p className="text-gray-500">Recommended size: 200x200px</p>
          </div>

          {/* Business Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {["FirstName", "LastName"].map((field) => (
              <div key={field} className="relative">
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  placeholder={field === "FirstName" ? "Business First Name" : "Business Last Name"}
                  className="peer w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <label className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">
                  {field === "FirstName" ? "Business First Name" : "Business Last Name"}
                </label>
              </div>
            ))}
          </div>

          {/* Contact & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {["Contact", "email"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  placeholder={field === "email" ? "Email Address" : "Contact Number"}
                  className="peer w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <label className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">
                  {field === "email" ? "Email Address" : "Contact Number"}
                </label>
              </div>
            ))}
          </div>

          <div className="relative">
            <textarea
              name="ShortDescription"
              value={formData.ShortDescription}
              onChange={handleChange}
              rows={4}
              required
              placeholder=" "
              className="peer w-full h-64 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            <label className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">
              Short Description
            </label>
          </div>

        </div>

       {/* Section 2: Color Theme */}
<div>
  <h2 className="text-2xl font-bold mb-6 border-b pb-2">Color Theme</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {["Accent", "SecondaryAccent", "DefaultColor", "PriceColor"].map((color) => (
      <div key={color} className="flex flex-col items-center">
        <label className="mb-2 font-medium text-gray-700">
          {color.replace(/([A-Z])/g, " $1")}
        </label>
        <div className="relative">
          {/* Invisible color input */}
          <input
            type="color"
            value={formData[color]}
            onChange={(e) => setFormData({ ...formData, [color]: e.target.value })}
            className="absolute w-12 h-12 rounded-full opacity-0 cursor-pointer"
          />
          {/* Colored circle */}
          <div
            className="w-12 h-12 rounded-full shadow-md border-2 border-gray-300 cursor-pointer"
            style={{ backgroundColor: formData[color] }}
          />
        </div>
      </div>
    ))}
  </div>
</div>


        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-48 bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </>
  );
};

export default WebsiteInformation;
