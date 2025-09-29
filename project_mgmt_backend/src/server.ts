import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connectDB from './config/mongoDB';
import {PORT, JWT_SECRET, JWT_EXPIRES_IN, DB_URI} from "../src/config/env";

console.log('JWT_SECRET:', JWT_SECRET);
console.log('JWT_EXPIRES_IN:', JWT_EXPIRES_IN);

connectDB(DB_URI as string).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
