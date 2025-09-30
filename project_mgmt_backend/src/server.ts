import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connectDB from './config/mongoDB';
import {PORT, JWT_SECRET, JWT_EXPIRES_IN, DB_URI} from "../src/config/env";

connectDB(DB_URI as string).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
