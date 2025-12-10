import React from "react";

const OrderActions = ({ status, paymentStatus, onChangeStatus, onChangePayment, updating }) => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Order Status Dropdown */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Change Order Status</label>
        <select
          value={status}
          onChange={(e) => onChangeStatus(e.target.value)}
          className="border rounded-xl p-2 w-full"
          disabled={updating}
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Payment Status Dropdown */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Change Payment Status</label>
        <select
          value={paymentStatus ? "Paid" : "Unpaid"}
          onChange={(e) => onChangePayment(e.target.value === "Paid")}
          className="border rounded-xl p-2 w-full"
          disabled={updating}
        >
          <option value="Unpaid">Unpaid</option>
          
          <option value="Paid">Paid</option>
          
        </select>
      </div>
    </div>
  );
};

export default OrderActions;
