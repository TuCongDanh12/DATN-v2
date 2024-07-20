import axios from "axios";
import authHeader from "./auth-header";
const API_URL = `${process.env.REACT_APP_SERVER_URL}`;
export const notification = {
  getAll(params) {
    return axios.get(`${API_URL}/announcement`, { params: params },
      {
        headers: authHeader()
      }
    );
  },
  updateResolve(id) {
    return axios.patch(`${API_URL}/announcement/${id}`, {
      isResolved: true,
    },
      {
        headers: authHeader()
      });
  },
  updateReadStatus(id) {
    return axios.patch(`${API_URL}/announcement/${id}`, {
      isRead: true,
    },
      {
        headers: authHeader()
      });
  },
};
