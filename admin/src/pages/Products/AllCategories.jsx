import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiTrash2, FiSearch } from "react-icons/fi";

const AllCategories = ({ token }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/category/list`, {
        headers: { token },
      });

      if (res.data.success) {
        const formatted = res.data.categories.map((c) => ({
          ...c,
          displayImage: c.cat_image || "/placeholder.png",
        }));

        setAllCategories(formatted);
        setCategories(formatted);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  // Search
  const handleSearch = () => {
    const filtered = allCategories.filter((c) =>
      c.cat_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCategories(filtered);
  };

  // Delete
  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/category/remove`,
        { categoryID: categoryToDelete._id },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting category");
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  // Toggle Show Home
  const handleToggleShowHome = async (category) => {
    try {
      setUpdatingId(category._id);

      const res = await axios.patch(
        `${backendUrl}/api/category/updateShowHome/${category._id}`,
        { show_home: !category.show_home },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Show Home status updated");
        setCategories((prev) =>
          prev.map((c) =>
            c._id === category._id
              ? { ...c, show_home: res.data.category.show_home }
              : c
          )
        );
      } else {
        toast.error(res.data.message || "Failed to update Show Home");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating Show Home");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 truncate">All Categories</h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-6">
          <input
            type="text"
            className="w-full sm:w-96 p-3 border rounded-xl shadow"
            placeholder="Search category..."
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

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700">Image</th>
                <th className="p-4 text-left font-semibold text-gray-700">Category Name</th>
                <th className="p-4 text-left font-semibold text-gray-700">Added</th>
                <th className="p-4 text-center font-semibold text-gray-700">Show Home</th>
                <th className="p-4 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4">
                      <img
                        src={category.displayImage}
                        className="w-16 h-16 object-contain bg-gray-100 rounded"
                        alt={category.cat_name}
                      />
                    </td>

                    <td className="p-4 font-medium text-gray-800">{category.cat_name}</td>

                    <td className="p-4 text-gray-500">
                      {new Date(category.date).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={category.show_home}
                          disabled={updatingId === category._id}
                          onChange={() => handleToggleShowHome(category)}
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                      </label>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => confirmDelete(category)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 mx-auto"
                      >
                        <FiTrash2 size={18} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
              <h2 className="text-xl font-semibold text-center mb-3">Confirm Delete</h2>
              <p className="text-center text-gray-600 mb-4">
                Delete <strong>{categoryToDelete?.cat_name}</strong>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllCategories;
