import React from "react";

const DashboardHome = () => {
  return (
    <div className="p-6 sm:p-8 lg:p-12 min-h-screen bg-gray-900 text-white">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Home</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">
          Welcome back! Here is an overview of your activity.
        </p>
      </div>

      {/* Stats / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-gray-400 text-sm">Total Users</h2>
          <p className="text-xl font-bold mt-2">1,245</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-gray-400 text-sm">Active Projects</h2>
          <p className="text-xl font-bold mt-2">58</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-gray-400 text-sm">Pending Tasks</h2>
          <p className="text-xl font-bold mt-2">12</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-4 shadow">
        <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-700">
          <li className="py-2 flex justify-between text-sm sm:text-base">
            <span>John Doe completed "Project A"</span>
            <span className="text-gray-400">2h ago</span>
          </li>
          <li className="py-2 flex justify-between text-sm sm:text-base">
            <span>Jane Smith uploaded a file</span>
            <span className="text-gray-400">5h ago</span>
          </li>
          <li className="py-2 flex justify-between text-sm sm:text-base">
            <span>New user registered: Mike</span>
            <span className="text-gray-400">1d ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;

