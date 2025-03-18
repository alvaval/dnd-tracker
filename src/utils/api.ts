export const getSpellInfo = async (spellName: string) => {
  console.log(`Fetching information for spell: ${spellName}`); // Debugging log

  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow" as RequestRedirect
  };

  try {
    const formattedSpellName = spellName.toLowerCase().replace(/ /g, '-');
    console.log(`Formatted spell name: ${formattedSpellName}`); // Debugging log

    const response = await fetch(`https://www.dnd5eapi.co/api/spells/${formattedSpellName}`, requestOptions);
    
    if (!response.ok) {
        console.warn(`Failed to fetch spell information for ${spellName}, using fallback.`);
        return { name: spellName, desc: ["Spell not found"] }; // Safe fallback message
    }

    const result = await response.json();
    console.log(`Fetched information for spell: ${spellName}`, result); // Debugging log
    return result;
  } catch (error) {
    console.error(`Error fetching spell information for ${spellName}:`, error);
    return { name: spellName, desc: ["Failed to fetch spell information"] }; // Ensures UI still renders
  }
};

export async function getRaceInfo(raceName: string) {
  try {
    const response = await fetch(`https://www.dnd5eapi.co/api/races/${raceName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch race information for ${raceName}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTraitInfo(traitIndex: string) {
  try {
    const response = await fetch(`https://www.dnd5eapi.co/api/traits/${traitIndex}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch trait information for ${traitIndex}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getSubraces(raceIndex: string) {
  try {
    const response = await fetch(`https://www.dnd5eapi.co/api/races/${raceIndex}/subraces`);
    if (!response.ok) {
      throw new Error(`Failed to fetch subraces for race ${raceIndex}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getSubraceInfo(subraceIndex: string) {
  try {
    const response = await fetch(`https://www.dnd5eapi.co/api/subraces/${subraceIndex}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch subrace information for ${subraceIndex}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getClassInfo(className: string) {
  try {
    const response = await fetch(`https://www.dnd5eapi.co/api/classes/${className}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch class information for ${className}`);
    }
    const data = await response.json();

    // Fetch subclasses separately
    const subclassResponse = await fetch(`https://www.dnd5eapi.co/api/classes/${className}/subclasses`);
    if (!subclassResponse.ok) {
      throw new Error(`Failed to fetch subclasses for ${className}`);
    }
    const subclassData = await subclassResponse.json();

    return { ...data, subclasses: subclassData.results }; // Include subclasses in response
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getSubclasses(classIndex: string) {
  try {
    const response = await fetch(`https://www.dnd5eapi.co/api/classes/${classIndex}/subclasses`);
    if (!response.ok) {
      throw new Error(`Failed to fetch subclasses for class ${classIndex}`);
    }
    const data = await response.json();
    console.log(`Fetched subclasses data:`, data); // Debugging log
    return data.results || []; // Ensure this matches the API response structure
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getSubclassInfo(subclassIndex: string) {
  try {
    const response = await fetch(`https://www.dnd5eapi.co/api/subclasses/${subclassIndex}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch subclass information for ${subclassIndex}`);
    }
    const data = await response.json();
    console.log(`Fetched subclass information for ${subclassIndex}:`, data); // Debugging log
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}