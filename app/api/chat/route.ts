import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.DRAGON_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const response = await fetch('https://www.dragonai.systems/api/v1/chat', {
      method: 'POST',
      headers: {
        'Dragon-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dragon AI Error response:', errorText);
      return NextResponse.json({ error: 'Failed to communicate with Dragon AI' }, { status: response.status });
    }

    // Pass the stream directly back to the client
    return new Response(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
