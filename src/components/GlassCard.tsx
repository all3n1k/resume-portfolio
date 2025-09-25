"use client";

import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function GlassCard({ className = "", children, ...rest }: Props) {
  return (
    <div
      className={`glass p-6 md:p-8 border-white/10 text-[--color-foreground] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}