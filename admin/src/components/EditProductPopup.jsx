import React, { useEffect, useState } from "react";
import axios from "axios";
import EditableDropdown from "../components/EditableDropdown";
import { backendUrl } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* --------------------------------------------------
   InputField Component (UPDATED WITH MULTILINE SUPPORT)
-------------------------------------------------- */
const InputField = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  multiline = false,
}) => {
  if (multiline) {
    return (
      <div className="relative">
        <textarea
          id={id}
          className="peer w-full p-4 border border-gray-300 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-blue-400
          resize-none h-32"
          value={value}
          onChange={onChange}
          required={required}
          placeholder=" "
        />
        <label
          htmlFor={id}
          className="absolute left-4 -top-2.5 text-gray-500 text-sm 
          bg-white px-1 
          peer-placeholder-shown:top-4 
          peer-placeholder-shown:text-gray-400 
          peer-placeholder-shown:text-base 
          transition-all"
        >
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        className="peer w-full p-4 border border-gray-300 rounded-xl 
        focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 
        peer-placeholder-shown:top-4 
        peer-placeholder-shown:text-gray-400 
        peer-placeholder-shown:text-base 
        transition-all"
      >
        {label}
      </label>
    </div>
  );
};

/* --------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------- */
const EditProductPopup = ({ token, productId, onClose, onUpdated }) => {
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
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

  /* --------------------------------------------
     Fetch product + dropdowns
  -------------------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, brandRes, categoryRes, subCatRes] = await Promise.all([
          axios.post(
            `${backendUrl}/api/product/single`,
            { productID: productId },
            { headers: { token } }
          ),
          axios.get(`${backendUrl}/api/brand/list`, { headers: { token } }),
          axios.get(`${backendUrl}/api/category/list`, { headers: { token } }),
          axios.get(`${backendUrl}/api/subcategory/list`, { headers: { token } }),
        ]);

        const p = productRes.data.product;

        // Map dropdown data
        const brandsData = (brandRes.data.brands || []).map((b) => ({
          id: b._id,
          name: b.Brand_name,
        }));
        const categoriesData = (categoryRes.data.categories || []).map((c) => ({
          id: c._id,
          name: c.cat_name,
        }));
        const subCategoriesData = (subCatRes.data.categories || []).map((sc) => ({
          id: sc._id,
          name: sc.cat_name,
        }));

        setBrands(brandsData);
        setCategories(categoriesData);
        setSubCategories(subCategoriesData);

        // Fill fields
        setName(p.name);
        setShortDesc(p.description);
        setLongDesc(p.long_description);
        setPrice(p.price);
        setSizes(p.sizes.join(","));
        setQty(p.qty);
        setMiniQty(p.miniQty);
        setBestseller(p.bestseller);
        setVideo(p.video || "");
        setVideoFr(p.videoFr || "");
        setExistingImages(p.image || []);

        // Selected dropdown values
        setBrand(brandsData.find((b) => b.id === p.brand) || { id: p.brand, name: "" });
        setCategory({ id: "", name: p.category });
        setSubCategory({ id: "", name: p.subCategory });
      } catch (err) {
        toast.error("Failed to load product");
      }
    };

    fetchData();
  }, [productId, token]);

  /* --------------------------------------------
     Image Selection
  -------------------------------------------- */
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const total = existingImages.length + images.length + files.length;
    if (total > 7) return toast.error("You can upload maximum 7 images");

    const newFiles = files.map((f) =>
      Object.assign(f, { preview: URL.createObjectURL(f) })
    );

    setImages([...images, ...newFiles]);
  };

  const handleRemoveNewImage = (i) => {
    const arr = [...images];
    URL.revokeObjectURL(arr[i].preview);
    arr.splice(i, 1);
    setImages(arr);
  };

  const handleRemoveExistingImage = async (imgUrl) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/product/remove-image`,
        { productId, imageUrl: imgUrl },
        { headers: { token } }
      );

      if (res.data.success) {
        setExistingImages(existingImages.filter((img) => img !== imgUrl));
      } else toast.error(res.data.message);
    } catch {
      toast.error("Error removing image");
    }
  };

  /* --------------------------------------------
     Submit
  -------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const formData = new FormData();

      images.forEach((img, i) => formData.append(`image${i + 1}`, img));
      existingImages.forEach((img) => formData.append(`existingImages[]`, img));

      formData.append("name", name);
      formData.append("description", shortDesc);
      formData.append("long_description", longDesc);
      formData.append("price", Number(price));
      formData.append("brand", brand.id);
      formData.append("category", category.name);
      formData.append("subCategory", subCategory.name);
      formData.append("sizes", sizes);
      formData.append("qty", Number(qty));
      formData.append("miniQty", Number(miniQty));
      formData.append("bestseller", bestseller);
      formData.append("featured", false);
      formData.append("video", video);
      formData.append("videoFr", videoFr);

      const res = await axios.put(
        `${backendUrl}/api/product/update/${productId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data", token } }
      );

      if (res.data.success) {
        toast.success("Product updated!");
        onUpdated();
        onClose();
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">

          <h2 className="text-2xl font-bold text-center mb-6">Edit Product</h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ---------------- Images ---------------- */}
            <div className="p-3 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="font-semibold mb-2">Product Images (Max 7)</h3>

              <div className="flex flex-wrap gap-2">
                {existingImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 border rounded-lg overflow-hidden shadow-sm"
                  >
                    <img src={img} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1 text-xs"
                    >
                      X
                    </button>
                  </div>
                ))}

                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 border rounded-lg overflow-hidden shadow-sm"
                  >
                    <img src={img.preview} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1 text-xs"
                    >
                      X
                    </button>
                  </div>
                ))}

                {existingImages.length + images.length < 7 && (
                  <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer">
                    <input type="file" hidden multiple onChange={handleImageSelect} />
                    <span className="text-gray-400 text-2xl">+</span>
                  </label>
                )}
              </div>
            </div>

            {/* ---------------- Basic Info ---------------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="productName"
                label="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <InputField
                id="price"
                type="number"
                label="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <InputField
                id="sizes"
                label="Sizes (S,M,L)"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
              />
              <InputField
                id="qty"
                type="number"
                label="Quantity"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
              <InputField
                id="miniQty"
                type="number"
                label="Mini Quantity"
                value={miniQty}
                onChange={(e) => setMiniQty(e.target.value)}
              />
            </div>

            {/* ---------------- Dropdowns ---------------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <EditableDropdown
                label="Brand"
                placeholder={brand.name || "Select Brand"}
                items={brands}
                selectedId={brand.id}
                selectedName={brand.name}
                onSelect={(id, name) => setBrand({ id, name })}
              />
              <EditableDropdown
                label="Category"
                placeholder={category.name || "Select Category"}
                items={categories}
                selectedId={category.id}
                selectedName={category.name}
                onSelect={(id, name) => setCategory({ id, name })}
              />
              <EditableDropdown
                label="SubCategory"
                placeholder={subCategory.name || "Select SubCategory"}
                items={subCategories}
                selectedId={subCategory.id}
                selectedName={subCategory.name}
                onSelect={(id, name) => setSubCategory({ id, name })}
              />
            </div>

            {/* ---------------- Descriptions (UPDATED) ---------------- */}
            <div className="grid grid-cols-1 gap-4">
              <InputField
                id="shortDesc"
                label="Short Description"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                multiline
              />
              <InputField
                id="longDesc"
                label="Long Description"
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
                multiline
              />
            </div>

            {/* ---------------- Videos ---------------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField
                id="videoUrl"
                label="Video URL"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
              />
              <select
                value={videoFr}
                onChange={(e) => setVideoFr(e.target.value)}
                className="p-4 border border-gray-300 rounded-xl w-full"
              >
                <option value="">Select source (optional)</option>
                <option value="YouTube">YouTube</option>
                <option value="Drive">Google Drive</option>
              </select>
            </div>

            {/* ---------------- Bestseller Switch ---------------- */}
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">Bestseller</span>
              <button
                type="button"
                onClick={() => setBestseller(!bestseller)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition
                ${bestseller ? "bg-blue-500 justify-end" : "bg-gray-300 justify-start"}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
              </button>
            </div>

            {/* ---------------- Buttons ---------------- */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 bg-gray-300 rounded-xl hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProductPopup;
