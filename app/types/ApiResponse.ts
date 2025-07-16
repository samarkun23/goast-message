// import { Message } from "./app/models/User";
import { Message } from "../models/User";
export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;      
    messages?: Array<Message>
}