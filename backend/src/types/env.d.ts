declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    MONGO_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRE: string;
  }
}
