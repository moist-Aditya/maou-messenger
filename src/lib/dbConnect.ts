import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

const dbConnect = async (): Promise<void> => {
    if(connection.isConnected) {
        console.log("Already connected to database");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {
            dbName: "maou-messenger"
        });

        connection.isConnected = db.connection.readyState

        console.log("DB connected Successfully");
        
    } catch (error) {
        console.log("DB connection Failed");
        
        process.exit(1)
    }
}

export default dbConnect;