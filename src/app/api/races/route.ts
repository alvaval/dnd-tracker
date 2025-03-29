import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'Races.json');
    console.log('File path:', filePath);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const races = JSON.parse(fileContent);

    console.log(races);

    return NextResponse.json(races, { status: 200 });
  } catch (error) {
    console.error('Error loading races:', error);
    return NextResponse.json({ error: 'Unable to load races' }, { status: 500 });
  }
}
