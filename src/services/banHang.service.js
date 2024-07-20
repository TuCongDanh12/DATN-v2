import axios from "axios";
import authHeader from "./auth-header";

const API_URL = `${process.env.REACT_APP_SERVER_URL}`;

const getListDonBanHang = () => {
    return axios.get(`${API_URL}/don-ban-hang`,
        {
            headers: authHeader()
        });
};

const getDonBanHang = ({ id }) => {
    return axios.get(`${API_URL}/don-ban-hang/${id}`,
        {
            headers: authHeader()
        });
};

const postDonBanHang = ({ values }) => {
    return axios.post(`${API_URL}/don-ban-hang`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};






const getListChungTuBan = () => {
    return axios.get(`${API_URL}/ctban`,
        {
            headers: authHeader()
        });
};

const getChungTuBan = ({ id }) => {
    return axios.get(`${API_URL}/ctban/${id}`,
        {
            headers: authHeader()
        });
};

const postChungTuBan = ({ values }) => {
    return axios.post(`${API_URL}/ctban`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};



const getListEmployeeWarehouseKeeper = () => {
    return axios.get(`${API_URL}/employee/warehouse-keeper`,
        {
            headers: authHeader()
        });
};










const getListPhieuThuTienMat = () => {
    return axios.get(`${API_URL}/phieu-thu-tien-mat`,
        {
            headers: authHeader()
        });
};

const getPhieuThuTienMat = ({ id }) => {
    return axios.get(`${API_URL}/phieu-thu-tien-mat/${id}`,
        {
            headers: authHeader()
        });
};

const postPhieuThuTienMat = ({ values }) => {
    return axios.post(`${API_URL}/phieu-thu-tien-mat`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};







const getListPhieuThuTienGui = () => {
    return axios.get(`${API_URL}/phieu-thu-tien-gui`,
        {
            headers: authHeader()
        });
};

const getPhieuThuTienGui = ({ id }) => {
    return axios.get(`${API_URL}/phieu-thu-tien-gui/${id}`,
        {
            headers: authHeader()
        });
};

const postPhieuThuTienGui = ({ values }) => {
    return axios.post(`${API_URL}/phieu-thu-tien-gui`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};





const banHangService = {
    getListDonBanHang,
    getDonBanHang,
    postDonBanHang,

    getListChungTuBan,
    getChungTuBan,
    postChungTuBan,

    getListEmployeeWarehouseKeeper,

    getListPhieuThuTienMat,
    getPhieuThuTienMat,
    postPhieuThuTienMat,

    getListPhieuThuTienGui,
    getPhieuThuTienGui,
    postPhieuThuTienGui,

};

export default banHangService;