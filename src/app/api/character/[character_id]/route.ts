import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { CHARACTER_DATA } from '@/utils/dataHelpers';

export async function GET(request: Request, { params }: { params: { character_id: string } }) {
    try {
        const { character_id } = params;

        if (!character_id) {
            return NextResponse.json({ error: 'Character ID not provided' }, { status: 400 });
        }

        // Fetch the character from Supabase using the character_id
        const { data, error } = await supabase
            .from('character')
            .select(CHARACTER_DATA)
            .eq('character_id', character_id)
            .single(); // Since we expect only one character with a given ID

        if (error) {
            console.error('Error fetching character:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: 'Character not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Failed to fetch character' }, { status: 500 });
    }
}
