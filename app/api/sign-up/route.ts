import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                succcess: false,
                message: "Username is already register"
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({
            email,
        })
        // If user existed than if condition , but if user does not exited than its else statement 

        //Verify code 
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (existingUserByEmail) {
            //if user existed there are 2 cases 1st is email is verifed 2nd is not verified 
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User allready existed with this email"
                }, {status:400}) 
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                //password is overwrite 
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        } else {
            //user does not exits so we are create new user  
            const hashedPassword = await bcrypt.hash(password, 10);
            //verifyCodeExpiry is expirydate
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse) {
            return Response.json({
                succcess: false,
                message: "Email verify code failed to send"
            }, { status: 500 })
        }
        
        return Response.json({
                succcess: true,
                message: "User registered seccessfully. Please verify your email"
            }, { status: 201 })


    } catch (error) {
        console.error("Error registering user", error)
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        })
    }
}












































