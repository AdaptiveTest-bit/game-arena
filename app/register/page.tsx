
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Trophy, Star, Sparkles, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    class: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState("🦊");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const avatars = ["🦊", "🐼", "🐨", "🦁", "🐸", "🐯", "🐻", "🐰"];

  // Check if already logged in
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.authenticated) {
        router.push("/");
      }
    } catch {
      // Not logged in, stay on register page
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: formData.studentId,
          name: formData.name,
          class: formData.class,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          avatar: selectedAvatar,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.details || "Registration failed");
        return;
      }

      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat flex items-center justify-center p-4"
        style={{ backgroundImage: 'url(/signup_landing.png)' }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-2xl mb-6 animate-bounce">
            <CheckCircle size={60} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Registration Successful! 🎉
          </h1>
          <p className="text-green-700 text-lg mb-4">
            Welcome to Game Arena, {formData.name}!
          </p>
          <p className="text-gray-600">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat flex items-center justify-center p-4"
      style={{ backgroundImage: 'url(/signup_landing.png)' }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-4 left-4 text-yellow-400 opacity-80 drop-shadow-lg">
        <Star size={40} fill="currentColor" />
      </div>
      <div className="absolute top-8 right-8 text-purple-400 opacity-80 drop-shadow-lg">
        <Trophy size={50} fill="currentColor" />
      </div>
      <div className="absolute bottom-8 left-8 text-blue-400 opacity-80 drop-shadow-lg">
        <BookOpen size={60} fill="currentColor" />
      </div>
      <div className="absolute bottom-4 right-4 text-green-400 opacity-80 drop-shadow-lg">
        <Sparkles size={45} />
      </div>

      <div className="w-full max-w-lg">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl shadow-xl mb-4">
            <span className="text-4xl">🎮</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Join Game Arena!
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Create your account and start learning!
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Register Now 🚀
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Choose Your Avatar
              </label>
              <div className="flex flex-wrap gap-2 justify-center">
                {avatars.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`w-12 h-12 text-2xl rounded-xl transition-all ${
                      selectedAvatar === avatar
                        ? "bg-gradient-to-br from-green-400 to-blue-500 shadow-lg transform scale-110"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="studentId"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Student ID
              </label>
              <input
                id="studentId"
                type="text"
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all outline-none text-lg text-gray-800 placeholder-gray-400"
                placeholder="Create a Student ID"
                required
                disabled={isLoading}
                minLength={3}
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all outline-none text-lg text-gray-800 placeholder-gray-400"
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="class"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Class
              </label>
              <select
                id="class"
                value={formData.class}
                onChange={(e) =>
                  setFormData({ ...formData, class: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all outline-none text-lg bg-white text-gray-800"
                required
                disabled={isLoading}
              >
                <option value="">Select Class</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all outline-none text-lg text-gray-800 placeholder-gray-400"
                placeholder="Enter phone number"
                required
                disabled={isLoading}
                pattern="[0-9]{10}"
                title="Please enter a 10-digit phone number"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all outline-none text-lg text-gray-800 placeholder-gray-400"
                placeholder="Create a password (min 4 characters)"
                required
                disabled={isLoading}
                minLength={4}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all outline-none text-lg text-gray-800 placeholder-gray-400"
                placeholder="Confirm your password"
                required
                disabled={isLoading}
                minLength={4}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-green-600 font-semibold hover:text-green-700 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/60 backdrop-blur rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-green-500" size={20} />
                <span className="font-semibold text-gray-700">Free to Play</span>
              </div>
              <p className="text-sm text-gray-600">No hidden charges ever</p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-blue-500" size={20} />
                <span className="font-semibold text-gray-700">Track Progress</span>
              </div>
              <p className="text-sm text-gray-600">See your improvement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

