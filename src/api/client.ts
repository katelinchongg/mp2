// src/api/client.ts
import axios from "axios";

// Example: PokeAPI
export const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 10000, // optional: 10 second timeout
});