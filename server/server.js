import dns from 'dns';
// Set DNS servers to Google DNS to resolve MongoDB Atlas SRV records (fixes querySrv ECONNREFUSED)
dns.setServers(['8.8.8.8', '8.8.4.4']);

import app from './src/app.js';
import logger from './src/config/logger.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});