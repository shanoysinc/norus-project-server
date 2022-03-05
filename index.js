import { startServer } from "./app.js";
import logger from "loglevel";

const isTest = process.env.NODE_ENV !== "test";
const logLevel = isTest ? "info" : "warn";

logger.setLevel(logLevel);
startServer();
