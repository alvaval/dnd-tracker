"use client";

import React from "react";
import { useRouter } from "next/navigation";

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Oops! Page Not Found</h2>
      <p className="text-lg text-gray-400 mb-6">
        We couldn't find the page you're looking for. Sorry about that!
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFoundPage;