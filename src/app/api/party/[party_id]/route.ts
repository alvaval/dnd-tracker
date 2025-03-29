import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const party_id = url.pathname.split('/').pop();

        if (!party_id) {
            return NextResponse.json({ error: 'Party ID not provided' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('party')
            .select('*')
            .eq('party_id', party_id)
            .single();

        if (error) {
            console.error('Error fetching party info:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: 'Party not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Failed to fetch party info' }, { status: 500 });
    }
}
