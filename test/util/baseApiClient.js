import axios from "axios";
let baseURL = `http://localhost:${process.env.PORT}`;
export const baseApiClient = axios.create({ baseURL });
