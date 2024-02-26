import axios from "axios";
import moment from "moment";
import Cookies from "js-cookie";

const API_URL = "http://localhost:3000"; // TODO: 환경변수로 변경 (백엔드 주소 입력)

const ApiManager = axios.create({
  baseURL: API_URL,
  responseType: "json",
  withCredentials: true,
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshPromise : Promise<string> | null = null;

ApiManager.interceptors.request.use(async (config) => {
  // 토큰과 만료 시간 가져오기
  let token = localStorage.getItem("_auth");
  const expireAt = localStorage.getItem("_auth_storage");
  const refreshToken = Cookies.get("refreshToken");

  // 토큰이 만료되었을 때
  if (moment(expireAt).diff(moment()) < 0) {
    if (!isRefreshing) { // 갱신 중이 아닌 경우에만 갱신 요청 보내기
      isRefreshing = true;
      refreshPromise = await ApiManager.post("/auth/refresh", { refreshToken }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        const newAccessToken = response.data.newAccessToken;
        localStorage.setItem("_auth", newAccessToken);
        localStorage.setItem("_auth_storage", moment().add(15, "minute").format("yyyy-MM-DD HH:mm:ss"));
        isRefreshing = false;
        return newAccessToken;
      }).catch((error) => {
        console.error("Error refreshing token:", error);
        isRefreshing = false;
        throw error;
      });
    }

    // 갱신된 토큰이 설정될 때까지 대기
    token = await refreshPromise;
  }

  // 갱신된 토큰을 사용하여 요청 헤더 설정
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default ApiManager;
