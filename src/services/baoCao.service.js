import axios from "axios";
import authHeader from "./auth-header";

const API_URL = `${process.env.REACT_APP_SERVER_URL}`;


const getListReportDTBH = () => {
    return axios.get(`${API_URL}/report-dtbh`,
        {
            headers: authHeader()
        });
};

const getReportDTBH = ({ id }) => {
    return axios.get(`${API_URL}/report-dtbh/${id}`,
        {
            headers: authHeader()
        });
};

const postReportDTBH = ({ values }) => {
    return axios.post(`${API_URL}/report-dtbh`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const postReportDTBHRaw = ({ values }) => {
    return axios.post(`${API_URL}/report-dtbh/raw`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};



const getListSalesPerson = () => {
    return axios.get(`${API_URL}/employee/salesperson`,
        {
            headers: authHeader()
        });
};



const baoCaoService = {
    getListReportDTBH,
    getReportDTBH,
    postReportDTBH,
    postReportDTBHRaw,

    getListSalesPerson,
};

export default baoCaoService;