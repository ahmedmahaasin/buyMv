import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiTrash2, FiSearch } from "react-icons/fi";

const AllSubCategories = ({ token }) => {
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/subcategory/list`, {
        headers: { token },
      });
      if (res.data.success) {
        const formatted = res.data.categories.map((s) => ({
          ...s,
          displayImage: s.cat_image || "/placeholder.png",
        }));
        setAllSubCategories(formatted);
        setSubCategories(formatted);
      } else {
        toast.error("Failed to fetch subcategories");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching subcategories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, [token]);

  const handleSearch = () => {
    const filtered = allSubCategories.filter((s) =>
      s.cat_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSubCategories(filtered);
  };

  const confirmDelete = (subCategory) => {
    setSubCategoryToDelete(subCategory);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!subCategoryToDelete) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/subcategory/remove`,
        { categoryID: subCategoryToDelete._id },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Subcategory deleted");
        fetchSubCategories();
      } else {
        toast.error("Failed to delete subcategory");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting subcategory");
    } finally {
      setShowDeleteModal(false);
      setSubCategoryToDelete(null);
    }
  };

  const handleToggleShowHome = async (subCategory) => {
    try {
      setUpdatingId(subCategory._id);
      const res = await axios.patch(
        `${backendUrl}/api/subcategory/updateShowHome/${subCategory._id}`,
        { show_home: !subCategory.show_home },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Show Home status updated");
        setSubCategories((prev) =>
          prev.map((s) =>
            s._id === subCategory._id
              ? { ...s, show_home: res.data.subCategory.show_home }
              : s
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
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold mb-6 text-center truncate">
          All Subcategories
        </h1>

        {/* Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-6">
          <input
            type="text"
            className="w-full sm:w-96 p-3 border rounded-xl shadow"
            placeholder="Search subcategory..."
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
          <table className="min-w-full table-auto bg-white border border-gray-200">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-700">Image</th>
                <th className="p-3 text-left font-semibold text-gray-700">Subcategory Name</th>
                <th className="p-3 text-left font-semibold text-gray-700">Added</th>
                <th className="p-3 text-center font-semibold text-gray-700">Show in Home</th>
                <th className="p-3 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : subCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No subcategories found
                  </td>
                </tr>
              ) : (
                subCategories.map((sub) => (
                  <tr key={sub._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-2 sm:p-4">
                      <img
                        src={sub.displayImage}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-contain bg-gray-100 rounded"
                        alt={sub.cat_name}
                      />
                    </td>
                    <td className="p-2 sm:p-4 font-medium text-gray-800">{sub.cat_name}</td>
                    <td className="p-2 sm:p-4 text-gray-500">
                      {new Date(sub.date).toLocaleDateString()}
                    </td>
                    <td className="p-2 sm:p-4 text-center">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={sub.show_home}
                          disabled={updatingId === sub._id}
                          onChange={() => handleToggleShowHome(sub)}
                        />
                        <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                      </label>
                    </td>
                    <td className="p-2 sm:p-4 text-center">
                      <button
                        onClick={() => confirmDelete(sub)}
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1 sm:gap-2 mx-auto"
                      >
                        <FiTrash2 size={16} /> Delete
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
            <div className="bg-white p-4 sm:p-6 rounded-xl w-72 sm:w-80 shadow-xl">
              <h2 className="text-xl font-semibold text-center mb-3 truncate">Confirm Delete</h2>
              <p className="text-center text-gray-600 mb-4 truncate">
                Delete <strong>{subCategoryToDelete?.cat_name}</strong>?
              </p>
              <div className="flex gap-2 sm:gap-3">
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

export default AllSubCategories;
