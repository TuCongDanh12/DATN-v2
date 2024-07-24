import axios from "axios";
import authHeader from "./auth-header";

const API_URL = `${process.env.REACT_APP_SERVER_URL}`;

const getListDonMuahang = ({ requestParam }) => {

  //console.log("requestParam", requestParam)
  if(requestParam.sorts!=='undefined%3AASC'){
    return axios.get(`${API_URL}/don-mua-hang?currentPage=${requestParam.currentPage}&pageSize=${requestParam.pageSize}&sorts=${requestParam.sorts}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return axios.get(`${API_URL}/don-mua-hang?currentPage=${requestParam.currentPage}&pageSize=${requestParam.pageSize}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};


const getDonMuaHang = ({id} ) => {
  return axios.get(`${API_URL}/don-mua-hang/${id}`,
      {
          headers: authHeader()
      });
};

const postChungTuMua = async (values) => {
  try {
    console.log('Data sent to API:', values);
    const response = await axios.post(`${API_URL}/ctmua`, values, {
      headers: authHeader(),
    });
    return response;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

const muahangService = {
  getListDonMuahang,
  getDonMuaHang,
  postChungTuMua 
};

export default muahangService;
