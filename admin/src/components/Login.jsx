import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password });

            if (response.data.success) {
                setToken(response.data.token);
                toast.success("Login successful!");
            } else {
                toast.error(response.data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700">
                <h1 className="text-3xl font-bold text-center text-white mb-8 tracking-wide">
                    Admin Panel Login
                </h1>

                <form className="space-y-6" onSubmit={onSubmitHandler}>
                    <div>
                        <label className="text-gray-300 font-medium">Email Address</label>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="w-full px-4 py-3 mt-1 rounded-lg bg-gray-900 text-gray-200 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-gray-300 font-medium">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="w-full px-4 py-3 mt-1 rounded-lg bg-gray-900 text-gray-200 border border-gray-700
                        focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold
                       hover:bg-blue-700 shadow-lg hover:shadow-xl transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
