// Data type for the Project Config
interface ConfigData {
  nodeEnv: string;
  port: number;
  apiVersion: string;
  apiPrefix: string;
  logLevel: string;
}

// Generating the Config Stuff
export const config: ConfigData = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number.parseInt(process.env.PORT || '3000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  apiPrefix: process.env.API_PREFIX || '/api',
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default config;
