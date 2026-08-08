import React from "react";

const GlassPanel = ({ children, className = "", hover = true }) => {
  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-white/10 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl ${hover ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.45)]" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
