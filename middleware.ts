import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';

const authConfig = {
  providers: [],
  callbacks: {
    authorized({ request, auth }: any) {
      const { pathname } = request.nextUrl;

      // Protect authenticated user pages
      const protectedPaths = [
        /\/shipping/,
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      if (protectedPaths.some((regex) => regex.test(pathname))) {
        return !!auth;
      }

      // OTP verification required for `/reset-password`
      if (pathname === '/reset-password') {
        const otpVerified = request.cookies.get('otp_verified')?.value;
        return otpVerified === 'true';
      }

      // Public paths
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

