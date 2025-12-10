import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";

const OrderForm = ({ order, status, paymentStatus }) => {
    // Local state to reflect changes
    const [currentStatus, setCurrentStatus] = useState(status);
    const [currentPayment, setCurrentPayment] = useState(order.payment);

    // Update local state if props change
    useEffect(() => {
        setCurrentStatus(status);
    }, [status]);

    useEffect(() => {
        setCurrentPayment(paymentStatus ?? order.payment);
    }, [paymentStatus, order.payment]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "confirmed":
                return "bg-blue-100 text-blue-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "out for delivery":
                return "bg-purple-100 text-purple-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPaymentColor = (paid) =>
        paid ? "bg-green-200 text-green-800" :  "bg-red-200 text-red-800";

    const formatPaymentMethod = (method) => {
        if (!method) return "-";
        return method.toUpperCase() === "COD" ? "Cash on Delivery" : method;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                <img
                    src={assets.parcel_icon}
                    alt="Parcel"
                    className="h-20  object-contain rounded-xl bg-white/60 backdrop-blur-md shadow-md p-3 border border-white/40"
                />


                {/* Left section: Order Info */}
                <div className="flex-1 space-y-2">
                    <p className="text-gray-800 font-semibold text-lg">Order ID: {order._id}</p>
                    <p className="text-gray-500 text-sm">
                        <strong>Date:</strong> {new Date(order.date).toLocaleString()}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div>
                            <p className="text-gray-600 text-sm">
                                <strong>Payment Status:</strong>{" "}
                                <span
                                    className={`ml-1 px-2 py-0.5 rounded font-semibold text-xs ${getPaymentColor(currentPayment)}`}
                                >
                                    {currentPayment ? "Paid" : "Unpaid"}
                                </span>
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-600 text-sm">
                                <strong>Payment Method:</strong>{" "}
                                <span className="ml-1 text-gray-800 font-medium text-sm">
                                    {formatPaymentMethod(order.paymentMethod)}
                                </span>
                            </p>
                        </div>

                        <div className="sm:col-span-2">
                            <p className="text-gray-600 text-sm">
                                <strong>Amount:</strong>{" "}
                                <span className="ml-1 text-gray-800 font-medium text-sm">
                                    ${order.amount}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right section: Status Badge */}
                <div className="flex-shrink-0">
                    <span
                        className={`px-3 py-1 rounded-full font-semibold text-sm ${getStatusColor(currentStatus)}`}
                    >
                        {currentStatus}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
