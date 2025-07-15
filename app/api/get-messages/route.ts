import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/User";
import { getServerSession, User } from 'next-auth'
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            }, { status: 401 }
        )
    }

    //user is string so when we apply pipeline so there is might be causing issue 
    const userId = new mongoose.Types.ObjectId(user._id);
    //so thats why we convert into mongoose onject it
    try {
        const user = await UserModel.aggregate([
            //id match  
            { $match: { id: userId } },
            //arrays unwind bec our message is in the array form 
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } }, //latest message
            //time to group of those
            { $group: { _id: '_id', messages: { $push: '$messages' } } }
        ])
        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, { status: 401 }
            )
        }
        return Response.json(
            {
                success: true,
                messages: user[0].messages
            }, { status: 200 }
        )
    } catch (error) {
        console.log("An unexpected error occured: ", error);
        return Response.json(
            {
                success: false,
                message: "An unexpected error"
            }, { status: 500 }
        )
    }

}

















