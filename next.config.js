/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    NEXTAUTH_URL:process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET:process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_SPREADSHEET_ID:process.env.NEXT_PUBLIC_SPREADSHEET_ID,
    NEXT_PUBLIC_CLIENT_EMAIL:process.env.NEXT_PUBLIC_CLIENT_EMAIL,
    NEXT_PUBLIC_PRIVATE_KEY:process.env.NEXT_PUBLIC_PRIVATE_KEY,
    SECRET_KEY_CRYPTO: process.env.SECRET_KEY_CRYPTO
  },
  images: {
    domains: ["tecdn.b-cdn.net","mdbcdn.b-cdn.net","www.decea.mil.br"],
  },
}

module.exports = nextConfig
