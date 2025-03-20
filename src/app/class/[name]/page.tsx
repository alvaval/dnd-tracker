"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClassInfo as fetchClassInfo, getSubclassInfo, getSubclasses } from "@/utils/api";

export default function ClassPage() {
  const router = useRouter();
  const params = useParams();
  const className = decodeURIComponent(params.name as string);
  
  interface ClassInfo {
    name: string;
    hit_die: number;
    proficiencies?: { name: string }[];
    saving_throws?: { name: string }[];
    subclasses?: { index: string, name: string }[];
  }

  interface SubclassInfo {
    index: string;
    name: string;
    desc: string[];
  }

  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [subclasses, setSubclasses] = useState<SubclassInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClass = async () => {
      console.log(`Fetching information for class: ${className}`); // Debugging log
      const info = await fetchClassInfo(className);
      if (info) {
        console.log(`Fetched information:`, info); // Debugging log
        setClassInfo(info);
        setError(null);
      } else {
        setError(`Failed to fetch class information for ${className}`);
      }
    };

    const fetchSubclasses = async () => {
      const subclassList = await getSubclasses(className);
      if (!subclassList || subclassList.length === 0) {
        setError(`Failed to fetch subclasses for ${className}`);
        return;
      }
      console.log(`Fetched subclass list:`, subclassList); // Debugging log
      const subclassInfoPromises: Promise<SubclassInfo>[] = subclassList.map(
        async (subclass): Promise<SubclassInfo> => {
          const info: SubclassInfo = await getSubclassInfo(subclass.index);
          return info;
        }
      );
      const subclassInfoResults = await Promise.all(subclassInfoPromises);
      console.log(`Fetched subclass information:`, subclassInfoResults); // Debugging log
      setSubclasses(subclassInfoResults);
    };

    fetchClass();
    fetchSubclasses();
  }, [className]);

  if (error) {
    return <div className="p-4">{error}</div>;
  }

  if (!classInfo) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-8">
      <button onClick={() => router.push("/")} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mb-4">Back</button>
      <h1 className="text-4xl font-bold">{classInfo.name || "Unknown Class"}</h1>
      <p><strong>Hit Die:</strong> d{classInfo.hit_die}</p>
      {classInfo.proficiencies && classInfo.proficiencies.length > 0 && (
        <p><strong>Proficiencies:</strong> {classInfo.proficiencies.map(proficiency => proficiency.name).join(", ")}</p>
      )}
      {classInfo.saving_throws && classInfo.saving_throws.length > 0 && (
        <p><strong>Saving Throws:</strong> {classInfo.saving_throws.map(savingThrow => savingThrow.name).join(", ")}</p>
      )}
      {subclasses.length > 0 && (
        <div>
          <strong>Subclasses:</strong>
          {subclasses.map((subclass) => (
            <div key={subclass.index} className="mt-4">
              <h2 className="text-2xl font-semibold">{subclass.name}</h2>
              <p>{subclass.desc.join(" ")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}