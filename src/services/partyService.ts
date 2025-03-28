import { transformSupabaseCharacter } from '@/utils/characterTransformer';
import { Character } from '@/types/Character';

export async function getPartyById(partyId: string): Promise<Character[]> {
    try {
        const response = await fetch(`/api/parties/${partyId}/characters`);

        if (!response.ok) {
            throw new Error(`Failed to fetch party characters: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Fetched party characters with ID ${partyId}:`, data);

        // Transform each character in the party
        const transformedParty = data.map((character: any) => transformSupabaseCharacter(character));
        console.log(`Transformed party with ID ${partyId}:`, transformedParty);

        return transformedParty;
    } catch (error) {
        console.error(`Error fetching party characters by ID ${partyId}:`, error);
        return [];
    }
}

export async function getPartyInfoById(partyId: string): Promise<any> {
    try {
        const response = await fetch(`/api/parties/${partyId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch party info: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Fetched party info with ID ${partyId}:`, data);

        console.log(data);

        return data;
    } catch (error) {
        console.error(`Error fetching party info by ID ${partyId}:`, error);
        return null;
    }
}