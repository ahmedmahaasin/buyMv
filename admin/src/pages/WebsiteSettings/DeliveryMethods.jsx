import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit, FiSearch, FiX } from "react-icons/fi";

const DeliveryMethods = ({ token }) => {
  const [methods, setMethods] = useState([]);
  const [filteredMethods, setFilteredMethods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [currentMethod, setCurrentMethod] = useState(null);
  const [editForm, setEditForm] = useState({
    method_name: "",
    service_areas: "",
    description: "",
    Delivery_charge: "",
    Limit_Unit_minimum: "",
    minimum_order_amount: "",
    apply_extra_charge_minimum: false,
    extra_charge_amount_minimum: "",
    display: false,
    images: [null, null, null],
  });
  const [saving, setSaving] = useState(false);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/delivery/list`, {
        headers: { token },
      });
      if (res.data.success) {
        const formattedMethods = (res.data.methods || []).map((m) => ({
          ...m,
          displayImage: m.image?.[0] || "/placeholder.png",
        }));
        setMethods(formattedMethods);
        setFilteredMethods(formattedMethods);
      } else {
        toast.error("Failed to fetch delivery methods");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching delivery methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, [token]);

  const handleSearch = () => {
    const filtered = methods.filter((m) =>
      m.method_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMethods(filtered);
  };

  const openEditModal = (method) => {
    setCurrentMethod(method);
    setEditForm({
      method_name: method.method_name || "",
      service_areas: method.service_areas || "",
      description: method.description || "",
      Delivery_charge: method.Delivery_charge || "",
      Limit_Unit_minimum: method.Limit_Unit_minimum || "",
      minimum_order_amount: method.minimum_order_amount || "",
      apply_extra_charge_minimum: method.apply_extra_charge_minimum || false,
      extra_charge_amount_minimum: method.extra_charge_amount_minimum || "",
      display: method.display || false,
      images: method.image
        ? method.image.map((url) => ({ url, file: null }))
        : [null, null, null],
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e, index = null) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "images" && index !== null) {
      const newImages = [...editForm.images];
      if (files && files[0]) {
        newImages[index] = { file: files[0], url: URL.createObjectURL(files[0]) };
      }
      setEditForm((prev) => ({ ...prev, images: newImages }));
    } else if (type === "checkbox") {
      setEditForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...editForm.images];
    newImages[index] = null;
    setEditForm((prev) => ({ ...prev, images: newImages }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!currentMethod) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("method_name", editForm.method_name);
      formData.append("service_areas", editForm.service_areas);
      formData.append("description", editForm.description);
      formData.append("Delivery_charge", editForm.Delivery_charge);
      formData.append("Limit_Unit_minimum", editForm.Limit_Unit_minimum);
      formData.append("minimum_order_amount", editForm.minimum_order_amount);
      formData.append(
        "apply_extra_charge_minimum",
        editForm.apply_extra_charge_minimum
      );
      formData.append("extra_charge_amount_minimum", editForm.extra_charge_amount_minimum);
      formData.append("display", editForm.display);

      editForm.images.forEach((img) => {
        if (img?.file) formData.append("images", img.file);
      });

      const existingImages = editForm.images
        .filter((img) => img && !img.file)
        .map((img) => img.url);
      formData.append("existingImages", JSON.stringify(existingImages));

      const res = await axios.put(
        `${backendUrl}/api/delivery/update/${currentMethod._id}`,
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success("Delivery method updated successfully!");
        fetchMethods();
        setShowEditModal(false);
        setCurrentMethod(null);
      } else {
        toast.error(res.data.message || "Failed to update delivery method");
      }
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Error updating delivery method");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Delivery Methods</h1>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search delivery methods..."
            className="w-full max-w-md p-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="p-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition"
          >
            <FiSearch size={20} />
          </button>
        </div>

        {/* Delivery Methods Grid */}
        {loading ? (
          <p className="text-center text-gray-500 py-10 text-lg">Loading delivery methods...</p>
        ) : filteredMethods.length === 0 ? (
          <p className="text-center text-gray-500 py-10 text-lg">No delivery methods found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {filteredMethods.map((method) => (
              <div
                key={method._id}
                className="flex flex-row items-center bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 gap-4"
              >
                <div className="w-1/3 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={method.displayImage}
                    alt={method.method_name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-2xl">{method.method_name}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Added: {new Date(method.date).toLocaleDateString()}
                    </p>
                    {method.description && (
                      <p className="text-gray-600 text-sm mt-1">{method.description}</p>
                    )}
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => openEditModal(method)}
                      className="py-2 px-4 w-full bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition flex items-center justify-center gap-2"
                    >
                      <FiEdit /> Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
              >
                <FiX size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center">Edit Delivery Method</h2>

              <form className="space-y-6" onSubmit={handleSaveEdit}>
                {/* Images Section */}
                <div>
                  <p className="font-semibold mb-2">Images</p>
                  <div className="grid grid-cols-3 gap-4">
                    {editForm.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <label className="group relative cursor-pointer border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center h-24 hover:border-blue-500 transition">
                          <input
                            type="file"
                            hidden
                            onChange={(e) => handleEditChange(e, idx)}
                            name="images"
                          />
                          {img ? (
                            <img
                              src={img.url || ""}
                              alt={`Image ${idx + 1}`}
                              className="w-full h-full object-contain rounded-xl"
                            />
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
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Text Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      { label: "Name", name: "method_name", type: "text", readOnly: true },
                      { label: "Service Areas", name: "service_areas", type: "text" },
                      { label: "Description", name: "description", type: "text" },
                      { label: "Delivery Charge", name: "Delivery_charge", type: "number" },
                    ].map((field) => (
                      <div key={field.name} className="relative">
                        <input
                          type={field.type}
                          name={field.name}
                          value={editForm[field.name]}
                          onChange={handleEditChange}
                          className={`peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            field.readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                          }`}
                          required={!field.readOnly}
                          readOnly={field.readOnly}
                        />
                        <label className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">
                          {field.label}
                        </label>
                      </div>
                    ))}

                    {/* Toggles */}
                    <div className="flex items-center justify-between gap-4 p-2 border rounded-xl bg-gray-50">
                      <span className="font-semibold">Apply Extra Charge Minimum</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="apply_extra_charge_minimum"
                          className="sr-only peer"
                          checked={editForm.apply_extra_charge_minimum}
                          onChange={handleEditChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
                        <div
                          className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${
                            editForm.apply_extra_charge_minimum ? "translate-x-5" : ""
                          }`}
                        ></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between gap-4 p-2 border rounded-xl bg-gray-50">
                      <span className="font-semibold">Display</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="display"
                          className="sr-only peer"
                          checked={editForm.display}
                          onChange={handleEditChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
                        <div
                          className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${
                            editForm.display ? "translate-x-5" : ""
                          }`}
                        ></div>
                      </label>
                    </div>
                  </div>

                  {/* Right Column Conditional Fields */}
                  <div className="space-y-4">
                    {editForm.apply_extra_charge_minimum && (
                      <>
                        <div className="relative">
                          <input
                            type="text"
                            name="Limit_Unit_minimum"
                            value={editForm.Limit_Unit_minimum}
                            onChange={handleEditChange}
                            className="peer w-full p-4 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          <label className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 transition-all">
                            Limit Unit
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            name="minimum_order_amount"
                            value={editForm.minimum_order_amount}
                            onChange={handleEditChange}
                            className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                          />
                          <label className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 transition-all">
                            Minimum Order Amount
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            name="extra_charge_amount_minimum"
                            value={editForm.extra_charge_amount_minimum}
                            onChange={handleEditChange}
                            className="peer w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                          />
                          <label className="absolute left-4 -top-2.5 text-gray-500 text-sm bg-white px-1 transition-all">
                            Extra Charge Amount Minimum
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition w-full"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeliveryMethods;
