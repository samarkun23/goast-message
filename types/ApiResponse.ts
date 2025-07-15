// import { Message } from "./app/models/User";
// import { Message } from "./app/models/User";
// Update the import path below to the correct location of your Message type/interface
// Example: import { Message } from "../models/User";
// If Message type is not available, define it here as a temporary fix:
export interface Message {
    id: string;
    content: string;
    // add other properties as needed
}
export interface ApiResponse {
    success: boolean;
    message: string;
    isAccesptingMessages?: boolean;      
    messages?: Array<Message>
}