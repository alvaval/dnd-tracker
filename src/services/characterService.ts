import { transformSupabaseCharacter } from '@/utils/characterTransformer';
import { Character } from '@/types/Character';

export async function getCharacterById(characterId: string): Promise<Character | null> {
    try {
        const response = await fetch(`/api/characters/${characterId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch character: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Fetched character with ID ${characterId}:`, data);

        // Transform the Supabase response into a Character object
        const transformedCharacter = transformSupabaseCharacter(data);
        console.log(`Transformed character with ID ${characterId}:`, transformedCharacter);

        return transformedCharacter;
    } catch (error) {
        console.error(`Error fetching character by ID ${characterId}:`, error);
        return null;
    }
}
