import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/User";
import { z } from 'zod';

//we need schema also if you remember we return schema and signup schema username validation is over here
import { usernameValidation } from "@/app/schemas/signUpSchema";
// with the user of usernamevalidation we make query schema 
//query schema -> just for checking the syntex


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

// now we just write get method is your name is valid or not ? 
//Functionality when user is type there username in the bottom we show that this username is not avilable 
export async function GET(request: Request) { 
   
    await dbConnect();

    try {
        //we checking username with url when someone is checking username they send my query ? in the url
        const { searchParams } = new URL(request.url) //this is whole url
        const queryParam = {
            username: searchParams.get('username')
        }
        //validate from zod 
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result); //TODO: REmove
        
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: "Invalid parameter"
                },
                {
                    status: 400
                }
            ) 
        }

        const {username} = result.data;

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already exists"
                },
                {
                    status: 400
                }
            ) 
        }

        return Response.json({
            success: true, 
            message: "Username is unique"
        },{status: 200})

    } catch (error) {
        console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status: 500
            }
        )
    }
}




















