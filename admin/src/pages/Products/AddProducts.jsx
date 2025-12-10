import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import SearchableDropdown from "../../components/SearchableDropdown";
import { backendUrl } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProducts = ({ token }) => {
  const [images, setImages] = useState([null, null, null, null, null, null, null]);
  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState({ id: "", name: "" });
  const [category, setCategory] = useState({ id: "", name: "" });
  const [subCategory, setSubCategory] = useState({ id: "", name: "" });
  const [sizes, setSizes] = useState("");
  const [qty, setQty] = useState("");
  const [miniQty, setMiniQty] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [video, setVideo] = useState("");
  const [videoFr, setVideoFr] = useState("");
  const [loading, setLoading] = useState(false);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const brandRes = await axios.get(`${backendUrl}/api/brand/list`, { headers: { token } });
        setBrands((brandRes.data.brands || []).map(b => ({ _id: b._id, name: b.Brand_name })));
        const categoryRes = await axios.get(`${backendUrl}/api/category/list`, { headers: { token } });
        setCategories((categoryRes.data.categories || []).map(c => ({ _id: c._id, name: c.cat_name })));
        const subCategoryRes = await axios.get(`${backendUrl}/api/subcategory/list`, { headers: { token } });
        setSubCategories((subCategoryRes.data.categories || []).map(sc => ({ _id: sc._id, name: sc.cat_name })));
      } catch (error) {
        toast.error("Error fetching dropdown data");
      }
    };
    fetchDropdowns();
  }, [token]);

  const handleImageSelect = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const newImages = [...images];
    newImages[index] = Object.assign(file, { preview: URL.createObjectURL(file) });
    setImages(newImages);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    if (newImages[index] && newImages[index].preview) {
      URL.revokeObjectURL(newImages[index].preview);
    }
    newImages[index] = null;
    setImages(newImages);
  };

  useEffect(() => {
    return () => {
      images.forEach(img => img && img.preview && URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const formData = new FormData();
      images.forEach((img, i) => img && formData.append(`image${i + 1}`, img));
      formData.append("name", name);
      formData.append("description", shortDesc);
      formData.append("long_description", longDesc);
      formData.append("price", Number(price) || 0);
      formData.append("brand", brand.id || "");
      formData.append("category", category.name || "");
      formData.append("subCategory", subCategory.name || "");
      formData.append("sizes", sizes);
      formData.append("qty", Number(qty) || 0);
      formData.append("miniQty", Number(miniQty) || 0);
      formData.append("bestseller", bestseller);
      formData.append("featured", false);
      formData.append("video", video || "");
      formData.append("videoFr", videoFr || "");

      const res = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { "Content-Type": "multipart/form-data", token }
      });

      if (res.data.success) {
        toast.success("Product added successfully!");
        setName(""); setShortDesc(""); setLongDesc(""); setPrice(""); setBrand({ id: "", name: "" });
        setCategory({ id: "", name: "" }); setSubCategory({ id: "", name: "" }); setSizes(""); setQty("");
        setMiniQty(""); setVideo(""); setVideoFr(""); setBestseller(false);
        setImages([null, null, null, null, null, null, null]);
      } else {
        toast.error("Failed to add product: " + res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <form onSubmit={handleSubmit} className="max-w-5xl mt-9 mx-auto p-8 bg-white shadow-lg rounded-xl space-y-8">

        {/* Image Upload Section */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Product Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <label htmlFor={`image${i}`} className="group relative cursor-pointer border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center h-24 hover:border-blue-500 transition">
                  <input type="file" id={`image${i}`} hidden onChange={(e) => handleImageSelect(e, i)} />
                  {img ? (
                    <img src={img.preview} alt={`Image ${i + 1}`} className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500">
                      <span className="text-2xl font-bold">+</span>
                      <span className="text-xs mt-1">Upload</span>
                    </div>
                  )}
                </label>
                {img && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="relative">
          <input type="text" id="productName" className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={name} onChange={(e) => setName(e.target.value)} required />
          <label htmlFor="productName" className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">Product Name</label>
        </div>

        {/* Brand + Category + SubCategory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SearchableDropdown id="brand" label="Brand" items={brands} selectedId={brand.id} selectedName={brand.name} onSelect={(id, name) => setBrand({ id, name })} />
          <SearchableDropdown id="category" label="Category" items={categories} selectedId={category.id} selectedName={category.name} onSelect={(id, name) => setCategory({ id, name })} />
          <SearchableDropdown id="subCategory" label="SubCategory" items={subCategories} selectedId={subCategory.id} selectedName={subCategory.name} onSelect={(id, name) => setSubCategory({ id, name })} />
        </div>

        {/* Price */}
        <div className="relative">
          <input type="number" id="price" className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <label htmlFor="price" className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">Price</label>
        </div>

        {/* Sizes + Quantity + Mini Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <input type="text" id="sizes" className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={sizes} onChange={(e) => setSizes(e.target.value)} />
            <label htmlFor="sizes" className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">Sizes (S,M,L)</label>
          </div>
          <div className="relative">
            <input type="number" id="qty" className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={qty} onChange={(e) => setQty(e.target.value)} />
            <label htmlFor="qty" className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">Quantity</label>
          </div>
          <div className="relative">
            <input type="number" id="miniQty" className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={miniQty} onChange={(e) => setMiniQty(e.target.value)} />
            <label htmlFor="miniQty" className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">Mini Quantity</label>
          </div>
        </div>

        {/* Short & Long Description */}
        <div className="space-y-4">
          <div className="relative">
            <textarea className="peer w-full h-64 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" rows={3} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} required />
            <label htmlFor="shortDesc" className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">Short Description</label>
          </div>
          <div className="relative">
            <textarea className="peer w-full h-64 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" rows={5} value={longDesc} onChange={(e) => setLongDesc(e.target.value)} required />
            <label htmlFor="longDesc" className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">Long Description</label>
          </div>
        </div>

        {/* Optional Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <input type="text" id="video" className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" value={video} onChange={(e) => setVideo(e.target.value)} />
            <label htmlFor="video" className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">Video URL (optional)</label>
          </div>
          <select value={videoFr} onChange={(e) => setVideoFr(e.target.value)} className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-400 transition appearance-none w-full">
            <option value="">Select source (optional)</option>
            <option value="YouTube">YouTube</option>
            <option value="Drive">Google Drive</option>
          </select>
        </div>

        {/* Bestseller Toggle */}
        <div className="flex items-center gap-4">
          <span className="font-semibold">Bestseller:</span>
          <label htmlFor="bestseller" className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="bestseller" className="sr-only peer" checked={bestseller} onChange={() => setBestseller(!bestseller)} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
            <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${bestseller ? "translate-x-5" : ""}`}></div>
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading} className={`w-full md:w-48 bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </>
  );
};

export default AddProducts;
