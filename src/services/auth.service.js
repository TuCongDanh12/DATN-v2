import axios from "axios";
import authHeader from "./auth-header";

const API_URL = `${process.env.REACT_APP_SERVER_URL}`;

const register = (username, email, address, phoneNumber, password, avatar) => {
  return axios.post(`${API_URL}/employee/accountant`,
    {
      name: username,
      email,
      phone: phoneNumber,
      address,
      password,
      avatar
    },
    {
      headers: {
        "Content-Type": "application/json",
      }
    });
};


const login = (email, password) => {
  return axios
    .post(`${API_URL}/auth/login`, {
      email, password
    })
    .then((response) => {
      if (response.data.result.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data.result.data));
      }

      return response.data;
    });
};

const logout = () => {
  return axios.post(`${API_URL}/logout`,
    {
    },
    {
      headers: authHeader()
    },
  );
};


const getProfile = () => {
  return axios.get(`${API_URL}/auth/me`,
      {
        headers: authHeader()
      });
};

const updateProfile = ({ values }) => {
  return axios.patch(`${API_URL}/auth/me`,
      {
          ...values
      },
      {
          headers: authHeader()
      },
  );
};



const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};

export default authService;
