import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/User";
import { Message } from "@/app/models/User";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json()
    try {
        const user = await UserModel.findOne({ username })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, { status: 400 }
            )
        }

        //is user accepting the messsage
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages"
                }, { status: 403 }
            )
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message);
        await user.save()

        return Response.json(
                {
                    success: true,
                    message: "Message send successfully"
                },{ status: 200 }
            ) 
    } catch (error) {
        console.log("Error adding messages", error); 
        return Response.json(
                {
                    success: false,
                    message: "Internal server error"
                },{ status: 500 }
            )  
    }


}























