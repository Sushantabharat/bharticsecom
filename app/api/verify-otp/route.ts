import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
      return NextResponse.json({ error: 'OTP expired or not found' }, { status: 410 });
    }

    if (storedOtp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    await redis.del(`otp:${email}`);

    const response = NextResponse.json({ message: 'OTP verified successfully' });
    response.cookies.set({
      name: 'otp_verified',
      value: 'true',
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60,
    });
    return response;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
