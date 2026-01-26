
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { LogoutButton } from "./LogoutButton";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, checkSession, setLoading } = useAuthStore();

  useEffect(() => {
    // Check session on mount
    checkSession();
  }, [checkSession]);

  // Show loading state while checking session
  if (user === undefined || user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4 animate-pulse">
            <span className="text-3xl">🎮</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header with user info and logout */}
      {user && (
        <header className="bg-white/80 backdrop-blur-lg shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{user.avatar || "😊"}</span>
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">
                  Class {user.class} • {user.studentId}
                </p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </header>
      )}
      {children}
    </div>
  );
}

