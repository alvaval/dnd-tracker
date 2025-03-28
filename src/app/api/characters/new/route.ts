import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Insert character data without providing character_id
        const { data: characterDataResponse, error: characterError } = await supabase
            .from('characters')
            .insert([body])
            .select();

        if (characterError) {
            console.error('Error adding character:', characterError.message);
            return NextResponse.json({ error: characterError.message }, { status: 500 });
        }

        // Get the auto-generated character_id from the response
        const character_id = characterDataResponse[0]?.character_id;

        if (!character_id) {
            throw new Error("Character ID not returned from Supabase.");
        }

        revalidatePath('@app/');
        return NextResponse.json({ message: 'Character added successfully', character_id });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Failed to add character' }, { status: 500 });
    }
}
