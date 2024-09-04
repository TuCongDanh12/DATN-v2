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


const postReportCPMHRaw = ( values ) => {
    return axios.post(`${API_URL}/report-cpmh/raw`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const postReportCPMH = ( values ) => {
    return axios.post(`${API_URL}/report-cpmh`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const getReportCPMH = (  ) => {
    return axios.get(`${API_URL}/report-cpmh`,
        {
            headers: authHeader()
        });
};

const getDetailReportCPMH = ( id ) => {
    return axios.get(`${API_URL}/report-cpmh/${id}`,
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

    postReportCPMHRaw,
    postReportCPMH,
    getReportCPMH,
    getDetailReportCPMH,
};

export default baoCaoService;