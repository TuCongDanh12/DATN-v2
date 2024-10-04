import axios from "axios";
import authHeader from "./auth-header";

const API_URL = `${process.env.REACT_APP_SERVER_URL}`;

const user = JSON.parse(localStorage.getItem('user'));
  
const getListChungTuBan = () => {
    return axios.get(`${API_URL}/ctban`,
        {
            headers: authHeader()
        });
};






const getListReportDCCN = () => {
    return axios.get(`${API_URL}/report-dccn`,
        {
            headers: authHeader()
        });
};

const getReportDCCN = ({ id }) => {
    return axios.get(`${API_URL}/report-dccn/${id}`,
        {
            headers: authHeader()
        });
};

const postReportDCCN = ({ values }) => {
    return axios.post(`${API_URL}/report-dccn`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const postReportDCCNRaw = ({ values }) => {
    return axios.post(`${API_URL}/report-dccn/raw`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};


const deleteReportDCCN = ({ values }) => {
    let { id, ...newObj } = values;
    return axios.delete(`${API_URL}/report-dccn/${id}`,
        {
            // ...newObj
        },
        {
            // headers: authHeader()
        },
    );
};





const getListReportTHCN = () => {
    return axios.get(`${API_URL}/report-thcn`,
        {
            headers: authHeader()
        });
};

const getReportTHCN = (id) => {
    return axios.get(`${API_URL}/report-thcn/${id}`,
        {
            headers: authHeader()
        });
};

const postReportTHCN = (values) => {
    return axios.post(`${API_URL}/report-thcn`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const postReportTHCNRaw = (values) => {
    return axios.post(`${API_URL}/report-thcn/raw`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const deleteReportTHCN = (values) => {
    let { id, ...newObj } = values;
    return axios.delete(`${API_URL}/report-thcn/${id}`,
        {
            // ...newObj
        },
        {
            // headers: authHeader()
        },
    );
};

const postTransaction = (values) => {
    return axios.post(`${API_URL}/transaction`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};


const getAllTransactionBank = (id) => {
    return axios.get(`${API_URL}/transaction/bank/all/${id}`,
        {
            headers: authHeader()
        });
};


const combinedTransaction = (transactionId, id) => {
    return axios.patch(
      `${API_URL}/transaction/chi/${transactionId}/${id}`,
      {
        headers: {
          Authorization: 'Bearer ' + user.accessToken, // Cấu hình header đúng
        },
      },
      {
        headers: {
          Authorization: 'Bearer ' + user.accessToken, // Cấu hình header đúng
        },
      }
    );
  };
  

const congNoService = {
    getListChungTuBan,

    getListReportDCCN,
    getReportDCCN,
    postReportDCCN,
    postReportDCCNRaw,
    deleteReportDCCN,

    getListReportTHCN,
    getReportTHCN,
    postReportTHCN,
    postReportTHCNRaw,
    deleteReportTHCN,

    postTransaction,
    getAllTransactionBank,
    combinedTransaction,
};

export default congNoService;