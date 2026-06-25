import React, { Children } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900">
        {/* Unique Custom Loading Animation */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Outer glowing ripple */}
          <div className="absolute inset-0 rounded-full border border-[#44C7D4]/30 animate-ping"></div>
          
          {/* Forward spinning outer ring */}
          <div className="absolute inset-2 rounded-full border-y-2 border-[#44C7D4] animate-[spin_2s_linear_infinite]"></div>
          
          {/* Reverse spinning inner ring */}
          <div className="absolute inset-4 rounded-full border-x-2 border-[#44C7D4]/80 animate-[spin_3s_linear_infinite_reverse]"></div>
          
          {/* Center glowing core */}
          <div className="absolute w-4 h-4 rounded-full bg-[#44C7D4] shadow-[0_0_20px_#44C7D4] animate-pulse"></div>
        </div>
        
        {/* Stylized Loading Text */}
        <p className="mt-8 text-[#44C7D4] font-medium tracking-[0.25em] text-xs sm:text-sm uppercase animate-pulse drop-shadow-[0_0_8px_rgba(68,199,212,0.5)]">
          Authenticating...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;