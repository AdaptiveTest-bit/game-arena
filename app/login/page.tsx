
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Trophy, Star, Sparkles } from "lucide-react";

interface User {
  id: string;
  studentId: string;
  name: string;
  class: string;
  avatar: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    studentId: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Not logged in, stay on login page
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Success - redirect to home
      router.push("/");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat flex items-center justify-center p-4"
      style={{ backgroundImage: 'url(/login_landing.png)' }}
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

      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-xl mb-4">
            <span className="text-4xl">🎮</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Game Arena
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Master CBSE Class 5 Skills Through Fun Games!
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Welcome Back! 🎯
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg text-gray-800 placeholder-gray-400"
                placeholder="Enter your Student ID"
                required
                disabled={isLoading}
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
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg text-gray-800 placeholder-gray-400"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              New to Game Arena?{" "}
              <Link
                href="/register"
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
              >
                Register Now!
              </Link>
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white/60 backdrop-blur rounded-2xl">
              <div className="text-3xl mb-2">📚</div>
              <p className="text-sm font-medium text-gray-700">CBSE Aligned</p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur rounded-2xl">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-sm font-medium text-gray-700">Track Progress</p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur rounded-2xl">
              <div className="text-3xl mb-2">✨</div>
              <p className="text-sm font-medium text-gray-700">Fun Learning</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

