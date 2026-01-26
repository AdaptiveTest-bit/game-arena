"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, BookOpen, Lock, Smile, Sparkles, Star, Check } from "lucide-react";

// Avatar options - fun cartoon characters
const AVATARS = [
  { emoji: "🦊", name: "Fox" },
  { emoji: "🐻", name: "Bear" },
  { emoji: "🐼", name: "Panda" },
  { emoji: "🦁", name: "Lion" },
  { emoji: "🐨", name: "Koala" },
  { emoji: "🐯", name: "Tiger" },
  { emoji: "🐸", name: "Frog" },
  { emoji: "🐵", name: "Monkey" },
];

export function RegisterForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    class: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].emoji);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match! Please try again.");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters long.");
      setIsLoading(false);
      return;
    }

    if (formData.studentId.length < 3) {
      setError("Student ID must be at least 3 characters.");
      setIsLoading(false);
      return;
    }

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
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.details || data.error || "Registration failed";
        setError(errorMessage);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?registered=true&studentId=" + encodeURIComponent(formData.studentId));
      }, 2000);

    } catch (err) {
      setError("Cannot connect to server. Please check your internet connection.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Account Created!
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Welcome aboard, {formData.name}!
            </p>
            <p className="text-purple-600 font-medium">
              Your Student ID: <strong>{formData.studentId}</strong>
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <Smile className="w-10 h-10 text-orange-600" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Join Game Arena!
          </h2>
          <p className="text-orange-100 text-lg">
            Start your learning adventure today
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Create Your Account
          </h3>
          
          {/* Avatar Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Choose Your Character
            </label>
            <div className="flex flex-wrap justify-center gap-2">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.emoji}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.emoji)}
                  className={`text-3xl p-2 rounded-xl transition-all ${
                    selectedAvatar === avatar.emoji
                      ? "bg-orange-100 scale-110 ring-2 ring-orange-400"
                      : "hover:bg-gray-100"
                  }`}
                  title={avatar.name}
                >
                  {avatar.emoji}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              Selected: <span className="text-2xl">{selectedAvatar}</span>
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Choose a Student ID"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <div className="relative">
                <Smile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Account
                  <Star className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <p className="text-center text-white/80 text-sm mt-6">
          Made for young learners
        </p>
      </div>
    </div>
  );
}

