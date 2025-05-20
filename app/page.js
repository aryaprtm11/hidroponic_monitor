"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Redirect langsung ke home
    window.location.href = "/home";
  }, []);

  // Render null untuk menghindari flash content
  return null;
}