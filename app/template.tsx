"use client";

import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in zoom-in-[0.99] duration-300 ease-in-out">{children}</div>
  );
}
