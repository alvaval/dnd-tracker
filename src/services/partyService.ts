import { transformSupabaseCharacter } from '@/utils/characterTransformer';
import { Character } from '@/types/Character';

export async function getPartyById(partyId: string): Promise<Character[]> {
    try {
        const response = await fetch(`/api/party/${partyId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch party: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Fetched party with ID ${partyId}:`, data);

        // Transform each character in the party
        const transformedParty = data.map((character: any) => transformSupabaseCharacter(character));
        console.log(`Transformed party with ID ${partyId}:`, transformedParty);

        return transformedParty;
    } catch (error) {
        console.error(`Error fetching party by ID ${partyId}:`, error);
        return [];
    }
}
