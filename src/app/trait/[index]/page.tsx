"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTraitInfo as fetchTraitInfo } from "@/utils/api";

export default function TraitPage() {
  const router = useRouter();
  const params = useParams();
  const traitIndex = decodeURIComponent(params.index as string);
  
  interface TraitInfo {
    name: string;
    desc: string[];
  }

  const [traitInfo, setTraitInfo] = useState<TraitInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrait = async () => {
      console.log(`Fetching information for trait: ${traitIndex}`); // Debugging log
      const info = await fetchTraitInfo(traitIndex);
      if (info) {
        console.log(`Fetched information:`, info); // Debugging log
        setTraitInfo(info);
        setError(null);
      } else {
        setError(`Failed to fetch trait information for ${traitIndex}`);
      }
    };

    fetchTrait();
  }, [traitIndex]);

  if (error) {
    return <div className="p-4">{error}</div>;
  }

  if (!traitInfo) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-8">
      <button onClick={() => router.push("/")} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mb-4">Back</button>
      <h1 className="text-4xl font-bold">{traitInfo.name || "Unknown Trait"}</h1>
      {traitInfo.desc && traitInfo.desc.length > 0 && (
        <div>
          <strong>Description:</strong>
          <ul>
            {traitInfo.desc.map((description, index) => (
              <li key={index}>{description}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}