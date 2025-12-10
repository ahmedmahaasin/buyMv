import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";

const AllBrands = ({ token }) => {
  const [allBrands, setAllBrands] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState(null);
  const [editData, setEditData] = useState({ Brand_name: "", show_home: false, Brand_image: "" });
  const [newImage, setNewImage] = useState(null);
  const [removeImageFlag, setRemoveImageFlag] = useState(false);
  const [updating, setUpdating] = useState(false);

  /* ------------------------- FETCH BRANDS ------------------------- */
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/brand/list`, { headers: { token } });

      if (res.data.success) {
        const formatted = res.data.brands.map((b) => ({
          ...b,
          displayImage: b.Brand_image || "/placeholder.png",
        }));
        setAllBrands(formatted);
        setBrands(formatted);
      } else {
        toast.error("Failed to fetch brands");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [token]);

  /* ------------------------- SEARCH ------------------------- */
  const handleSearch = () => {
    const filtered = allBrands.filter((b) =>
      b.Brand_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setBrands(filtered);
  };

  /* ------------------------- DELETE ------------------------- */
  const confirmDelete = (brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/brand/remove`,
        { brandID: brandToDelete._id },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Brand deleted");
        fetchBrands();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete error");
    } finally {
      setShowDeleteModal(false);
      setBrandToDelete(null);
    }
  };

  /* ------------------------- EDIT ------------------------- */
  const openEditModal = (brand) => {
    setBrandToEdit(brand);
    setEditData({
      Brand_name: brand.Brand_name,
      show_home: brand.show_home,
      Brand_image: brand.Brand_image,
    });
    setNewImage(null);
    setRemoveImageFlag(false);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, type, value, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (newImage?.preview) URL.revokeObjectURL(newImage.preview);
    setNewImage(Object.assign(file, { preview: URL.createObjectURL(file) }));
    setRemoveImageFlag(false);
  };

  const handleRemoveImage = () => {
    if (newImage?.preview) URL.revokeObjectURL(newImage.preview);
    setNewImage(null);
    setRemoveImageFlag(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!brandToEdit) return;

    try {
      setUpdating(true);
      const formData = new FormData();

      formData.append("Brand_name", editData.Brand_name);
      formData.append("show_home", editData.show_home);

      if (removeImageFlag) formData.append("remove_image", "true");
      if (newImage) formData.append("Brand_image", newImage);

      const res = await axios.put(
        `${backendUrl}/api/brand/update/${brandToEdit._id}`,
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success("Brand Updated");
        fetchBrands();
        setShowEditModal(false);
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  /* ------------------------- UI ------------------------- */

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">All Brands</h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-6">
          <input
            type="text"
            className="w-full sm:w-96 p-3 border rounded-xl shadow"
            placeholder="Search brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="p-3 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition"
          >
            <FiSearch size={20} />
          </button>
        </div>

        {/* TABLE (desktop) & CARDS (mobile) */}
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : brands.length === 0 ? (
          <p className="text-center  py-10 text-gray-500">No brands found</p>
        ) : (
          <div className="overflow-x-auto hidden md:block  rounded-xl shadow-md ">
            <table className="w-full border overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Brand Name</th>
                  <th className="py-3 px-4 text-left">Added Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {brands.map((b) => (
                  <tr key={b._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img src={b.displayImage} className="w-16 h-16 object-contain rounded" />
                    </td>

                    <td className="py-3 px-4 font-semibold">{b.Brand_name}</td>

                    <td className="py-3 px-4 text-gray-500">
                      {new Date(b.date).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 flex justify-center gap-3">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        <FiEdit size={18} />
                      </button>

                      <button
                        onClick={() => confirmDelete(b)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MOBILE CARDS */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {brands.map((b) => (
            <div key={b._id} className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
              <img src={b.displayImage} className="w-20 h-20 object-contain rounded" />

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{b.Brand_name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(b.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => openEditModal(b)}
                  className="p-2 bg-blue-500 text-white rounded-lg"
                >
                  <FiEdit size={18} />
                </button>
                <button
                  onClick={() => confirmDelete(b)}
                  className="p-2 bg-red-500 text-white rounded-lg"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
              <h2 className="text-xl font-bold text-center">Confirm Delete</h2>
              <p className="text-center mt-2">
                Delete <strong>{brandToDelete?.Brand_name}</strong>?
              </p>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <form
              onSubmit={handleUpdate}
              className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-5"
            >
              <h2 className="text-2xl font-bold text-center">Edit Brand</h2>

              <div>
                <label className="block mb-1">Brand Name</label>
                <input
                  type="text"
                  name="Brand_name"
                  value={editData.Brand_name}
                  onChange={handleEditChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <span>Show on Homepage</span>
                <input
                  type="checkbox"
                  name="show_home"
                  checked={editData.show_home}
                  onChange={handleEditChange}
                />
              </div>

              <div>
                <label className="block mb-1">Brand Image</label>

                <div className="relative border rounded-lg p-3 h-44 flex items-center justify-center overflow-hidden bg-gray-100 cursor-pointer">
                  <input type="file" className="absolute inset-0 opacity-0" onChange={handleImageSelect} />

                  {newImage ? (
                    <img src={newImage.preview} className="w-full h-full object-contain" />
                  ) : editData.Brand_image && !removeImageFlag ? (
                    <img src={editData.Brand_image} className="w-full h-full object-contain" />
                  ) : (
                    <p className="text-gray-400">Click to upload</p>
                  )}

                  {(newImage || (editData.Brand_image && !removeImageFlag)) && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-white ${
                  updating ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {updating ? "Updating..." : "Update"}
              </button>

              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-full py-3 mt-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default AllBrands;
