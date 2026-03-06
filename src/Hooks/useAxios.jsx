import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://smart-deals-server-part2-indol.vercel.app",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
