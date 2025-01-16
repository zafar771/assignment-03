import axios from "axios";

// Make sure the URL matches your backend
const api = axios.create({
    baseURL: "https://cart-app-sandy-three.vercel.app/", // Make sure this is your correct backend URL
});

export { api };
