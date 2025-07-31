
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModels';
export async function POST(req: NextRequest) {
  try {
    const otpVerified = req.cookies.get('otp_verified')?.value;

    if (otpVerified !== 'true') {
      return NextResponse.json({ error: 'OTP not verified' }, { status: 401 });
    }

    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and new password are required' }, { status: 400 });
    }

    await dbConnect();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    // Clear OTP verification cookie after successful password reset
    const response = NextResponse.json({
      success: true,
      message: 'Password reset successful',
    });

    response.cookies.set('otp_verified', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error('Password reset error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
