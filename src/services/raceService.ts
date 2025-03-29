export async function getAllRaces() {
    try {
      const response = await fetch('/api/races');
  
      if (!response.ok) {
        throw new Error(`Error fetching races: ${response.statusText}`);
      }
  
      const races = await response.json();

      console.log(races);
      return races;
    } catch (error) {
      console.error('Failed to fetch races:', error);
      return [];
    }
  }
  