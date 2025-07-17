import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/User";

 

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentails",

            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsimit@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        //or is a mongoose method go and read 
                        $or: [
                            //why identifie bec in nextauth email will received by this
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    }) 
                    if (!user) {
                        throw new Error('No user found with this email') 
                    }

                    if (!user.isVerified) {
                        throw new Error('Please verify your account before login')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user
                        //where user is going its going to providers authoptions
                    }else{
                        throw new Error('Incorrect Password')
        
                    }

                } catch (err: any) {
                    // try and catch everywhere according to nextauth docs need to return something  
                    throw new Error(err) 
                }
            }
        })
    ],
    callbacks:{
        //plan see -> in the token their is only user id avilable ok , so we want that we make token so much stronger than all the value i want i fetch from token i agree playload size will we increase optimization will down if we take token short than database quiry we do again and again so we do that we put maximum to maximum data in the token or than session ke andar bhi same data put kar du so we access token or session we fetch the data

        async jwt({token, user}){
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }


            return token
        },
        async session({session,token}){
            if (token && session.user) {
                session.user._id = token._id; 
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            } 
            return session
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}



















