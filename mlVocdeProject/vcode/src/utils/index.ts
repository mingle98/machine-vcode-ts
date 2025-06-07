import { Http } from "./axios";
const axiosInstance = new Http({
  baseURL: window.location.href,
  timeout: 1000 * 60 * 10
})

export default {
  $https: axiosInstance,
}