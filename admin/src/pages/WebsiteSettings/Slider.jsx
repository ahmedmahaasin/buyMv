import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Slider = ({ token }) => {
  const ID = "693092bf8f0c079a66f9d03b";

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    bg_video_Link: "",
    Text1: "",
    Text2: "",
    Text3: "",
    btn_Name: "",
    btn_Link: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch slider data
  const fetchData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/hero/single/${ID}`, {
        headers: { token },
      });
      const data = res.data.hero || res.data;

      setFormData({
        bg_video_Link: data.bg_video_Link || "",
        Text1: data.Text1 || "",
        Text2: data.Text2 || "",
        Text3: data.Text3 || "",
        btn_Name: data.btn_Name || "",
        btn_Link: data.btn_Link || "",
      });
     

      if (data.image && ((Array.isArray(data.image) && data.image.length > 0) || typeof data.image === "string")) {
      const img = Array.isArray(data.image) ? data.image[0] : data.image;
      const url = img.startsWith("http") ? img : `${backendUrl}/${img}`;
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }

    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch slider data");
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(Object.assign(file, { preview: URL.createObjectURL(file) }));
  };

  useEffect(() => {
    return () => {
      if (image && image.preview) URL.revokeObjectURL(image.preview);
    };
  }, [image]);

  const handleRemoveImage = async () => {
    if (!previewImage && !image) return;
    try {
      if (previewImage) {
        await axios.post(`${backendUrl}/api/hero/remove/${ID}`, {}, {
          headers: { token },
        });
      }
      setImage(null);
      setPreviewImage(null);
      toast.success("Image removed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove image from database");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      if (image) formDataToSend.append("image", image);
      Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));

      await axios.put(`${backendUrl}/api/hero/update/${ID}`, formDataToSend, {
        headers: { token },
      });

      toast.success("Slider updated successfully!");
      if (image) setPreviewImage(image.preview);
      setImage(null);
    } catch (err) {
      console.error(err);
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
        className="max-w-3xl mx-auto p-8 mt-9 bg-white shadow-lg rounded-xl space-y-6"
      >
        {/* Heading 1 */}
        <div className="relative">
          <input
            type="text"
            id="text1"
            className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.Text1}
            onChange={handleChange}
            name="Text1"
            required
          />
          <label
            htmlFor="text1"
            className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 
                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 
                       peer-placeholder-shown:text-base transition-all"
          >
            Heading 1
          </label>
        </div>

        {/* Heading 2 */}
        <div className="relative">
          <input
            type="text"
            id="text2"
            className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.Text2}
            onChange={handleChange}
            name="Text2"
            required
          />
          <label
            htmlFor="text2"
            className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 
                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 
                       peer-placeholder-shown:text-base transition-all"
          >
            Heading 2
          </label>
        </div>

        {/* Paragraph Text */}
        <div className="relative">
          <textarea
            id="text3"
            className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            value={formData.Text3}
            onChange={handleChange}
            name="Text3"
            rows={4}
            required
          />
          <label
            htmlFor="text3"
            className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 
                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 
                       peer-placeholder-shown:text-base transition-all"
          >
            Paragraph Text
          </label>
        </div>

        {/* Button Name */}
        <div className="relative">
          <input
            type="text"
            id="btnName"
            className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.btn_Name}
            onChange={handleChange}
            name="btn_Name"
          />
          <label
            htmlFor="btnName"
            className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 
                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 
                       peer-placeholder-shown:text-base transition-all"
          >
            Button Name
          </label>
        </div>

        {/* Button Link */}
        <div className="relative">
          <input
            type="text"
            id="btnLink"
            className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.btn_Link}
            onChange={handleChange}
            name="btn_Link"
          />
          <label
            htmlFor="btnLink"
            className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 
                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 
                       peer-placeholder-shown:text-base transition-all"
          >
            Button Link
          </label>
        </div>

        {/* Background Video */}
        <div className="relative">
          <input
            type="text"
            id="bgVideo"
            className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.bg_video_Link}
            onChange={handleChange}
            name="bg_video_Link"
            required
          />
          <label
            htmlFor="bgVideo"
            className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 
                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 
                       peer-placeholder-shown:text-base transition-all"
          >
            Background Video Link
          </label>
        </div>

        {/* Slider Image */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Slider Image</label>
          <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center h-64 hover:border-blue-500 transition relative">
            <input type="file" hidden onChange={handleImageSelect} />
            {image ? (
              <img src={image.preview} alt="Slider" className="w-full h-full object-contain rounded-xl" />
            ) : previewImage ? (
              <img src={previewImage} alt="Slider" className="w-full h-full object-contain rounded-xl" />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <span className="text-2xl font-bold">+</span>
                <span className="text-sm mt-1">Upload Image</span>
              </div>
            )}

            {(image || previewImage) && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition"
              >
                Remove
              </button>
            )}
          </label>
          <p className="text-gray-500 text-sm mt-1">Click "Remove" to delete image from database.</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-48 bg-blue-500 text-white py-3 rounded-xl shadow hover:bg-blue-600 transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "SAVE"}
        </button>
      </form>
    </>
  );
};

export default Slider;
