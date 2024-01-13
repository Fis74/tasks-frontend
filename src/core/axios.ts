import axios from "axios";

const instance = axios.create({
  baseURL: "https://tasks-tlqp.onrender.com",
});

export default instance;
