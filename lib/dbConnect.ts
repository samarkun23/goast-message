import mongoose from "mongoose";

//if you know what object return than define otherwise its fine
type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already connected through database");
        return;
    }
    
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        
        connection.isConnected = db.connections[0].readyState
        //top we give number that is we are returning readystate its self a number that why 
        //we you cannot do so its not a big deal

        console.log("DB Connected Successfully"); 

    } catch (error) {
        console.log("Database connection fail", error); 
        //process.env ko gressfully exit bec if db not connected application did'nt work
        process.exit(1);     
    }
}

export default dbConnect;

































