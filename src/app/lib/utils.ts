import mongoose, { Error } from "mongoose";

interface ConnectionState {
  isConnected?: number;
}

const connection: ConnectionState = {};

export const connectToDB = async (): Promise<void> => {
  try {
    if (connection.isConnected) return;
     const db = await mongoose.connect(process.env.MONGO as string);
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log(error);
    throw new Error((error as Error).message);
  }
};
