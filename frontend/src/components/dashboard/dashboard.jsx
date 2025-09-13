// components/dashboard/dashboard.jsx
import React from "react";
import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#0A0A0A]">
      <Sidebar />

      <main className="flex-1 overflow-auto p-6">
        {/* child routes will render here */}
        <Outlet />
      </main>
    </div>
  );
}
