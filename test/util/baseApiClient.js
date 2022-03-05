import axios from "axios";

let baseURL = "http://localhost:8000";
export const baseApiClient = axios.create({ baseURL });
