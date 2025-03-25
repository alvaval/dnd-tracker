"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBackgroundInfo } from "@/utils/api";
import { Background } from "@/types/Background";

export default function BackgroundPage() {
  const router = useRouter();
  const params = useParams();
  const backgroundName = decodeURIComponent(params.name as string);

  const [backgroundInfo, setBackgroundInfo] = useState<Background | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackground = async () => {
      const info = await getBackgroundInfo(backgroundName);
      if (info) {
        setBackgroundInfo(info);
        setError(null);
      } else {
        setError(`Failed to fetch background information for ${backgroundName}`);
      }
    };

    fetchBackground();
  }, [backgroundName]);

  if (error) {
    return <div className="p-4">{error}</div>;
  }

  if (!backgroundInfo) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-8">
      <button onClick={() => router.push("/")} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mb-4">Back</button>
      <h1 className="text-4xl font-bold">{backgroundInfo.name || "Unknown Background"}</h1>
      <p><strong>Starting Proficiencies:</strong> {backgroundInfo.starting_proficiencies?.map(proficiency => proficiency.name).join(", ") || "None"}</p>
      <p><strong>Starting Equipment:</strong> {backgroundInfo.starting_equipment?.map(equipment => `${equipment.equipment.name} (x${equipment.quantity})`).join(", ") || "None"}</p>
      <p><strong>Feature:</strong> {backgroundInfo.feature?.name || "None"}</p>
      <p>{backgroundInfo.feature?.desc.join(" ") || ""}</p>
    </div>
  );
}