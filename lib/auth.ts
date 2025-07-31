import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import dbConnect from './dbConnect'
import UserModel from './models/UserModels'
import NextAuth from 'next-auth'

export const config = {
  providers: [
    // credential provider log in with facebook, google, email or anything else
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect()
        if (credentials == null) return null

        const user = await UserModel.findOne({ email: credentials.email })

        if (user) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          )
          if (isMatch) {
            return user
          }
        }
        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          avatar: profile.picture, // Use picture as avatar
        }
      }
    })
  ],
  pages: {
    signIn: '/signin',
    newUser: '/register',
    error: '/signin',
  },
  callbacks: {

    async jwt({ user, trigger, session, token, account, profile }: any) {

      if (account?.provider === 'google' && profile) {
        let existingUser = await UserModel.findOne({ email: profile.email })
        if (!existingUser) {
          existingUser = await UserModel.create({
            name: profile.name,
            email: profile.email,
            googleId: profile.sub,
            avatar: profile.picture,
            isAdmin: false,
          })
        }

        token.user = {
          _id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
          isAdmin: existingUser.isAdmin,
          avatar: existingUser.avatar || '',
        }
      }

      // Handle Credentials Provider
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          avatar: user.avatar || '',
        }
      }
      if (trigger === 'update' && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name: session.user.name,
        }
      }
      return token
    },
    session: async ({ session, token }: any) => {
      if (token) {
        session.user = token.user
      }
      return session
    },
  },
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config)
