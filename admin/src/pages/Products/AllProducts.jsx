import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import EditProductPopup from "../../components/EditProductPopup";

const AllProducts = ({ token }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { token },
        params: { page: pageNum },
      });

      if (res.data.success) {
        const formattedProducts = (res.data.products || []).map((p) => ({
          ...p,
          displayImage:
            Array.isArray(p.image) && p.image.length > 0 ? p.image[0] : "/placeholder.png",
          totalStock: p?.quantity ?? 0,
        }));

        setAllProducts(formattedProducts);
        setProducts(formattedProducts);
        setTotalPages(res.data.totalPages || 1);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page, token]);

  const handleSearch = () => {
    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProducts(filtered);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id: productToDelete._id },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Product deleted successfully");
        fetchProducts(page);
      } else {
        toast.error(res.data.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting product");
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleEdit = (product) => {
    setProductToEdit(product._id);
    setShowEditPopup(true);
  };

  const handleProductUpdated = () => {
    fetchProducts(page);
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">All Products</h1>

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
        {/* RESPONSIVE TABLE WRAPPER */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 min-w-[100px] font-semibold text-gray-700 border-b">Image</th>
                  <th className="p-3 min-w-[180px] font-semibold text-gray-700 border-b">Name</th>
                  <th className="p-3 min-w-[150px] font-semibold text-gray-700 border-b">Added</th>
                  <th className="p-3 min-w-[120px] font-semibold text-gray-700 border-b">
                    Stock
                  </th>
                  <th className="p-3 min-w-[180px] font-semibold text-gray-700 border-b text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500 text-lg"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500 text-lg"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition border-b"
                    >
                      {/* IMAGE */}
                      <td className="p-3">
                        <img
                          src={product.displayImage}
                          alt={product.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-md bg-gray-100"
                        />
                      </td>

                      {/* NAME */}
                      <td className="p-3 font-medium text-gray-800">
                        <span className="block truncate max-w-[180px]">
                          {product.name}
                        </span>
                        {product.qty <= product.miniQty && (
                          <span className="text-red-600 font-medium">
                            Warning: Stock level is low
                          </span>
                        )}

                      </td>

                      {/* DATE */}
                      <td className="p-3 text-gray-600">
                        {new Date(product.date).toLocaleDateString()}
                      </td>

                      {/* STOCK */}
                      <td className={`p-3 text-gray-800 font-medium ${product.qty <= product.miniQty ? "text-red-600 font-semibold" : ""}`}>
                        {product.qty}
                      </td>



                      {/* ACTION BUTTONS */}
                      <td className="p-3 flex items-center justify-center gap-2 sm:gap-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="px-2 py-2 sm:px-3 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1 sm:gap-2 text-sm"
                        >
                          <FiEdit size={16} /> <span className="hidden sm:inline">Edit</span>
                        </button>

                        <button
                          onClick={() => confirmDelete(product)}
                          className="px-2 py-2 sm:px-3 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-1 sm:gap-2 text-sm"
                        >
                          <FiTrash2 size={16} />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 sm:gap-3 mt-8 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-2 rounded-full border text-sm sm:text-base ${page === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-center">Confirm Delete</h2>
              <p className="text-center text-gray-600">
                Delete <strong>{productToDelete?.name}</strong>?
              </p>

              <div className="flex justify-between gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT POPUP */}
        {showEditPopup && productToEdit && (
          <EditProductPopup
            token={token}
            productId={productToEdit}
            onClose={() => setShowEditPopup(false)}
            onUpdated={handleProductUpdated}
          />
        )}
      </div>
    </>
  );
};

export default AllProducts;
