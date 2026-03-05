import 'dotenv/config';

interface Config {
  nodeEnv: string;
  port: number;
  apiVersion: string;
  apiPrefix: string;
  logLevel: string;
}

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  apiPrefix: process.env.API_PREFIX || '/api',
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default config;
