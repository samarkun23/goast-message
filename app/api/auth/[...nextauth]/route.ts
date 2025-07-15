import NextAuth from "next-auth";
import { authOptions } from "./options";

//NextAuth is a method who recevie options
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }; //exporting handler as GET and POST for Next.js API routes
//GET and POST are the methods that NextAuth will handle for authentication requests
//This allows NextAuth to handle both GET and POST requests for authentication, such as sign-in and sign-out operations.














