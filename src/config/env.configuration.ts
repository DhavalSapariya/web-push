import dotenv from "dotenv";
dotenv.config();

const env = process.env;

export const PORT = env.PORT;
export const DATABASE_URL = env.DATABASE_URL;
export const PUBLIC_KEY = env.PUBLIC_KEY;
export const PRIVATE_KEY = env.PRIVATE_KEY;

// firebase configurations
export const FIREBASE_CLIENT_EMAIL = env.FIREBASE_CLIENT_EMAIL;
export const FIREBASE_PRIVATE_KEY = env.FIREBASE_PRIVATE_KEY;
export const FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID;
