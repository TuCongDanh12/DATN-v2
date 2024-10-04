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

const getReportDCCN = () => {
    return axios.get(`${API_URL}/report-dccn`,
        {
            headers: authHeader()
        });
}

const postReportDCCNRaw = ( values ) => {
    return axios.post(`${API_URL}/report-dccn/raw`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const postReportDCCN = ( values ) => {
    return axios.post(`${API_URL}/report-dccn`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};



const getDetailReportDCCN = ( id ) => {
    return axios.get(`${API_URL}/report-dccn/${id}`,
        {
            headers: authHeader()
        });
};
const getReportNoPhaiTra = (  ) => {
    return axios.get(`${API_URL}/report-no-phai-tra`,
        {
            headers: authHeader()
        });
};

const getDetailReportNoPhaiTra = ( id ) => {
    return axios.get(`${API_URL}/report-no-phai-tra/${id}`,
        {
            headers: authHeader()
        });
};


const postReportNoPhaiTra = ( values ) => {
    return axios.post(`${API_URL}/report-no-phai-tra`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const postReportNoPhaiTraRaw = ( values ) => {
    return axios.post(`${API_URL}/report-no-phai-tra/raw`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const postReportChiPhiRaw = ( values ) => {
    return axios.post(`${API_URL}/report-cost/raw`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};
const postReportChiPhi = ( values ) => {
    return axios.post(`${API_URL}/report-cost`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};
const getDetailChiPhi = ( id ) => {
    return axios.get(`${API_URL}/report-cost/${id}`,
        {
            headers: authHeader()
        });
};

const getReportChiPhi = (  ) => {
    return axios.get(`${API_URL}/report-cost`,
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
    getDetailReportNoPhaiTra,
    getReportNoPhaiTra,
    postReportNoPhaiTra,
    postReportNoPhaiTraRaw,

    getReportChiPhi,
    getDetailChiPhi,
    postReportChiPhi,
    postReportChiPhiRaw,

    getDetailReportDCCN,
    postReportDCCN,
    postReportDCCNRaw,
    getReportDCCN,

};

export default baoCaoService;