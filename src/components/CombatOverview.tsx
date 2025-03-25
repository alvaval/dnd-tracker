"use client";

import React, { useState, useEffect } from "react";
import { inknutAntiqua } from "@/lib/fonts";


// Start/end button (reset?)
// On start -> Pick players, add allies/enemies (choose HP/name) -> roll for order (initiative for each) -> place them in order
// In combat -> Note active player -> Place damage, note actions/spell slots, note downed/dead
// End -> go back to default, save/cache player HP 

const CombatOverview: React.FC = () => {

  return (
    <div className={`flex flex-row justify-center gap-4 pt-15 ${inknutAntiqua.className} text-[15px]`}>
      
    </div>
  );
};

export default CombatOverview;