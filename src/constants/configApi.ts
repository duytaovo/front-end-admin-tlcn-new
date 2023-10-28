const apiProduction = "https://jsonserv.glitch.me";
const apiDev = "https://jsonserv.glitch.me";
const config = {
  baseUrl: import.meta.env.MODE === "production" ? apiProduction : apiDev,
  maxSizeUploadImage: 2048576, // bytes
};
export default config;
