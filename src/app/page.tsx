"use client";
import React from "react";
import dynamic from "next/dynamic";

const Home = dynamic(() => import("../components/CharacterOverview"), { ssr: false });

export default function Page() {
  return <Home />;
}
