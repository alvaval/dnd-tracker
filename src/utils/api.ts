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