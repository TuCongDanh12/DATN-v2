import axios from "axios";
import authHeader from "./auth-header";

const API_URL = `${process.env.REACT_APP_SERVER_URL}`;

// /api/v1/ctban/report-revenue-of-year/{year}
const getChartRevenueYear = ({ values }) => {

    return axios.get(`${API_URL}/ctban/report-revenue-of-year/${values?.year}`,
        {
            headers: authHeader()
        });
};

const getChartRevenueMonth = ({ values }) => {

    return axios.get(`${API_URL}/ctban/report-revenue-of-month/${values?.year}/${values?.month}`,
        {
            headers: authHeader()
        });
};

const getChartRevenueQuarter = ({ values }) => {

    return axios.get(`${API_URL}/ctban/report-revenue-of-quarter/${values?.year}/${values?.quarter}`,
        {
            headers: authHeader()
        });
};


const getChartProduct = ({ values }) => {
    return axios.post(`${API_URL}/ctban/report-by-product`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};


const getMuaHangChartRevenueYear = ({ values }) => {

    return axios.get(`${API_URL}/ctmua/report-revenue-of-year/${values?.year}`,
        {
            headers: authHeader()
        });
};

const getMuaHangChartRevenueMonth = ({ values }) => {

    return axios.get(`${API_URL}/ctmua/report-revenue-of-month/${values?.year}/${values?.month}`,
        {
            headers: authHeader()
        });
};

const getMuaHangChartRevenueQuarter = ({ values }) => {

    return axios.get(`${API_URL}/ctmua/report-revenue-of-quarter/${values?.year}/${values?.quarter}`,
        {
            headers: authHeader()
        });
};


const tongQuanService = {
    getChartRevenueYear,
    getChartRevenueMonth,
    getChartRevenueQuarter,
    getChartProduct,
    getMuaHangChartRevenueQuarter,
    getMuaHangChartRevenueMonth,
    getMuaHangChartRevenueYear,
};

export default tongQuanService;