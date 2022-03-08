const PORT = 8000 + Number(process.env.JEST_WORKER_ID);
process.env.PORT = PORT;
export const serverConfig = {
  PORT: PORT,
  DB_URL: "mongodb://localhost:27017/docapp-test",
  ORIGIN: "*",
  CORS_CREDENTIALS: false,
};
