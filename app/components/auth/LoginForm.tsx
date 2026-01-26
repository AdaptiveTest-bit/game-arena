"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Lock, Gamepad2, Sparkles, ArrowRight } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const registered = searchParams.get("registered");
  const registeredStudentId = searchParams.get("studentId");
  
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDebug, setShowDebug] = useState(false);

  // Auto-fill student ID from registration redirect
  useEffect(() => {
    if (registered && registeredStudentId) {
      setStudentId(registeredStudentId);
      setSuccessMessage(`Account created! Your Student ID is: ${registeredStudentId}`);
    }
  }, [registered, registeredStudentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        studentId,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Student ID or Password is wrong. Please check and try again!");
        setShowDebug(true);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Cannot connect to server. Please check your internet!");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setStudentId("student001");
    setPassword("demo123");
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        studentId: "student001",
        password: "demo123",
        redirect: false,
      });

      if (result?.error) {
        setError("Demo account not found. Please register first!");
        setShowDebug(true);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Server error. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-400 via-purple-400 to-pink-400 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <Gamepad2 className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Game Arena
          </h2>
          <p className="text-purple-100 text-lg">
            Ready to play and learn? 
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Welcome Back!
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter your Student ID"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Debug Info */}
            {showDebug && (
              <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl text-sm">
                <p className="font-bold">Tips:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Make sure you registered first</li>
                  <li>Student ID is case-sensitive</li>
                  <li>Demo account: student001 / demo123</li>
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Sign In to Play
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <span>Try Demo Account</span>
          </button>

          {/* Register Link */}
          <p className="text-center mt-6 text-gray-600">
            New player?{" "}
            <Link href="/register" className="text-purple-600 font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          Made for young learners
        </p>
      </div>
    </div>
  );
}

