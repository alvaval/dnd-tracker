"use client";
import React from "react";
import dynamic from "next/dynamic";

const Home = dynamic(() => import("../components/PartyOverview"), { ssr: false });

export default function Page() {
  return <Home />;
}
