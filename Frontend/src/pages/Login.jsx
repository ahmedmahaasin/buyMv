import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import backend URL & navigate from ShopContext (ONLY backend from context)
import { ShopConstext } from "../context/ShopContext";

const Login = () => {
  const adminUrl = import.meta.env.VITE_ADMINURL;
  const [currentState, setCurrentState] = useState("Sign in");
  const { setToken, navigate, backendUrl } = useContext(ShopConstext);

  // Admin URL pulled directly from Vite env
 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const goToAdmin = () => {
    if (adminUrl) {
      window.open(adminUrl, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Admin URL not defined!");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentState === "Sign up") {
        const res = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          setToken(res.data.token);
          toast.success("Registered successfully!");
          navigate("/");
        } else {
          toast.error(res.data.message || "Registration failed!");
        }
      } else {
        const res = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          setToken(res.data.token);
          toast.success("Login successful!");
          navigate("/");
        } else {
          toast.error(res.data.message || "Login failed!");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-full max-w-md bg-white rounded-2xl shadow-lg p-8 gap-6 text-gray-800"
      >
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-2">{currentState}</h2>
          <div className="w-16 h-[2px] bg-gray-800 mx-auto rounded-full animate-pulse"></div>
        </div>

        {/* Name Field for Sign Up */}
        {currentState === "Sign up" && (
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Options */}
        <div className="w-full flex justify-between text-sm">
          <p className="cursor-pointer text-gray-600 hover:text-blue-500">
            Forgot password?
          </p>

          {currentState === "Sign in" ? (
            <p
              onClick={() => setCurrentState("Sign up")}
              className="cursor-pointer text-blue-500 font-medium"
            >
              Create an Account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Sign in")}
              className="cursor-pointer text-blue-500 font-medium"
            >
              Sign in
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium text-white ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-black hover:bg-gray-900"
          }`}
        >
          {loading
            ? currentState === "Sign in"
              ? "Signing in..."
              : "Signing up..."
            : currentState === "Sign in"
            ? "Sign in"
            : "Sign up"}
        </button>

        {/* Go to Admin Panel Button */}
        <button
          type="button"
          onClick={goToAdmin}
          className="mt-2 text-blue-500 hover:underline text-sm"
        >
          Go to Admin Panel
        </button>
      </form>
    </div>
  );
};

export default Login;
