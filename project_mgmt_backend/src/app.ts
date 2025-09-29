import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';

const app = express();

// Middlewares
app.use(helmet()); 
app.use(cors());
app.use(express.json()); 
app.use(morgan('dev')); 


// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});


app.use(errorHandler);

export default app;
