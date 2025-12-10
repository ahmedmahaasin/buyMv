import React from "react";

const InvoiceItems = ({ items, loading }) => {
  // Helper to get a valid image URL
  const getValidImage = (item) => {
    let url = "/placeholder.png"; // default fallback

    if (item.images && item.images.length > 0) {
      url = item.images[0];
    } else if (item.image) {
      url = Array.isArray(item.image) ? item.image[0] : item.image;
    }

    // Ensure the URL is a string and not empty
    if (!url || typeof url !== "string" || url.trim() === "") {
      url = "/placeholder.png";
    }

    return url;
  };

  return (
    <div className="mb-4">
      <h4 className="font-semibold mb-3 text-gray-700">Items</h4>
      {loading ? (
        <p className="text-gray-500">Loading items...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.productId || item._id}
              className="flex items-center gap-4 border rounded-2xl p-3 hover:shadow-md transition bg-gray-50"
            >
              <img
                src={getValidImage(item)}
                alt={item.name || "Product Image"}
                className="w-20 h-20 object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.onerror = null; // prevent infinite loop
                  e.currentTarget.src = "/placeholder.png"; // fallback
                }}
              />
              <div className="flex-1">
                <p className="font-medium text-gray-700">{item.name || "Unnamed Product"}</p>
                <p className="text-gray-500 text-sm">
                  Quantity: {item.quantity} | Size: {item.size || "N/A"} | Price: ${item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceItems;
