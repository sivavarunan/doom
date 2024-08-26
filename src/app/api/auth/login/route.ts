import { NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        const auth = getAuth();

        const userCredential = await auth.getUserByEmail(email);
        const customToken = await auth.createCustomToken(userCredential.uid);

        return NextResponse.json({ token: customToken });
    } catch (error: any) {
        console.error("Error during login:", error.message);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
