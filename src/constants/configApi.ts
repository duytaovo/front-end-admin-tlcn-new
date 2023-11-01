const apiProduction = "http://localhost:8081/api/manage/";
const apiDev = "http://localhost:8081/api/manage/";
const config = {
  baseUrl: import.meta.env.MODE === "production" ? apiProduction : apiDev,
  maxSizeUploadImage: 2048576, // bytes
};
export default config;
