import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { CHARACTER_DATA } from '@/utils/dataHelpers';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const party_id = url.pathname.split('/').slice(-2, -1)[0]; // Get party_id from URL

        if (!party_id) {
            return NextResponse.json({ error: 'Party ID not provided' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('characters')
            .select(CHARACTER_DATA)
            .eq('party', party_id);

        if (error) {
            console.error('Error fetching party characters:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data || data.length === 0) {
            return NextResponse.json({ error: 'No characters found for this party' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Failed to fetch party characters' }, { status: 500 });
    }
}
