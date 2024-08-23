//imports the axios library to send HTTP requests to a server and handle responses.
import axios from "axios";

// creates a default base URL for all requests made with this axios instance
const axiosBase = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default axiosBase;
