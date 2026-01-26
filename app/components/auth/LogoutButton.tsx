
"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <LogOut size={18} />
          <span>Logout</span>
        </>
      )}
    </button>
  );
}

