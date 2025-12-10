import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategories = ({ token }) => {
  const [catName, setCatName] = useState("");
  const [catImage, setCatImage] = useState(null);
  const [showHome, setShowHome] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCatImage(Object.assign(file, { preview: URL.createObjectURL(file) }));
  };

  // Remove selected image (UI only, not DB)
  const handleRemoveImage = () => {
    if (catImage && catImage.preview) {
      URL.revokeObjectURL(catImage.preview);
    }
    setCatImage(null);
  };

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (catImage && catImage.preview) {
        URL.revokeObjectURL(catImage.preview);
      }
    };
  }, [catImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!catName || !catImage) {
      toast.error("Category name and image are required!");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("cat_name", catName);
      formData.append("cat_image", catImage);
      formData.append("show_home", showHome);

      const res = await axios.post(`${backendUrl}/api/category/add`, formData, {
        headers: { "Content-Type": "multipart/form-data", token },
      });

      if (res.data.success) {
        toast.success("Category added successfully!");
        setCatName("");
        setCatImage(null);
        setShowHome(false);
      } else {
        toast.error("Failed to add category: " + res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-8 mt-9 bg-white shadow-lg rounded-xl space-y-6"
      >
        {/* Category Name */}
        <div className="relative">
          <input
            type="text"
            id="catName"
            className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            required
          />
          <label
            htmlFor="catName"
            className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all"
          >
            Category Name
          </label>
        </div>

        {/* Category Image */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Category Image</label>
          <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center h-64 hover:border-blue-500 transition relative">
            <input type="file" hidden onChange={handleImageSelect} />
            {catImage ? (
              <>
                <img
                  src={catImage.preview}
                  alt="Category"
                  className="w-full h-full object-contain rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <span className="text-2xl font-bold">+</span>
                <span className="text-sm mt-1">Upload Image</span>
              </div>
            )}
          </label>
        </div>

        {/* Show Home Toggle */}
        <div className="flex items-center gap-4">
          <span className="font-semibold">Show on Home:</span>
          <label htmlFor="showHome" className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="showHome"
              className="sr-only peer"
              checked={showHome}
              onChange={() => setShowHome(!showHome)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
            <div
              className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${
                showHome ? "translate-x-5" : ""
              }`}
            ></div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-48 bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </>
  );
};

export default AddCategories;
