import axios from "axios";
import authHeader from "./auth-header";

const API_URL = `${process.env.REACT_APP_SERVER_URL}`;

const getListSupplier = () => {
    return axios.get(`${API_URL}/supplier`,
        {
            headers: authHeader()
        });
};

const getSupplier = ({ id }) => {
    return axios.get(`${API_URL}/supplier/${id}`,
        {
            headers: authHeader()
        });
};

const postSupplier = ({ values }) => {
    return axios.post(`${API_URL}/supplier`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};




const getListSupplierGroup = () => {
    return axios.get(`${API_URL}/supplier-group`,
        {
            headers: authHeader()
        });
};

const getSupplierGroup = ({ id }) => {
    return axios.get(`${API_URL}/supplier-group/${id}`,
        {
            headers: authHeader()
        });
};

const postSupplierGroup = ({ values }) => {
    return axios.post(`${API_URL}/supplier-group`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};




const getListCustomerGroup = () => {
    return axios.get(`${API_URL}/customer-group`,
        {
            headers: authHeader()
        });
};

const getCustomerGroup = ({ id }) => {
    return axios.get(`${API_URL}/customer-group/${id}`,
        {
            headers: authHeader()
        });
};

const postCustomerGroup = ({ values }) => {
    return axios.post(`${API_URL}/customer-group`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};


const updateCustomerGroup = ({ values }) => {
    let { id, ...newObj } = values;
    return axios.patch(`${API_URL}/customer-group/${id}`,
        {
            ...newObj
        },
        {
            // headers: authHeader()
        },
    );
};




const getListCustomer = () => {
    return axios.get(`${API_URL}/customer`,
        {
            headers: authHeader()
        });
};

const getCustomer = ({ id }) => {
    return axios.get(`${API_URL}/customer/${id}`,
        {
            headers: authHeader()
        });
};

const postCustomer = ({ values }) => {
    return axios.post(`${API_URL}/customer`,
        {
            ...values,
            "status": "ACTIVE",
        },
        {
            headers: authHeader()
        });
};


const updateCustomer = ({ values }) => {
    let { id, customerGroup, ...newObj } = values;
    return axios.patch(`${API_URL}/customer/${id}`,
        {
            ...newObj
        },
        {
            // headers: authHeader()
        },
    );
};







const getListProductGroup = () => {
    return axios.get(`${API_URL}/product-group`,
        {
            headers: authHeader()
        });
};

const getProductGroup = ({ id }) => {
    return axios.get(`${API_URL}/product-group/${id}`,
        {
            headers: authHeader()
        });
};

const postProductGroup = ({ values }) => {
    return axios.post(`${API_URL}/product-group`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const updateProductGroup = ({ values }) => {
    let { id, ...newObj } = values;
    return axios.patch(`${API_URL}/product-group/${id}`,
        {
            ...newObj
        },
        {
            // headers: authHeader()
        },
    );
};





const getListProduct = () => {
    return axios.get(`${API_URL}/product`,
        {
            headers: authHeader()
        });
};

const getProduct = ({ id }) => {
    return axios.get(`${API_URL}/product/${id}`,
        {
            headers: authHeader()
        });
};

const postProduct = ({ values }) => {
    return axios.post(`${API_URL}/product`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const updateProduct = ({ values }) => {
    let { id, productGroup, ...newObj } = values;
    return axios.patch(`${API_URL}/product/${id}`,
        {
            ...newObj
        },
        {
            // headers: authHeader()
        },
    );
};

const addProductForSup = ({ values }) => {
    const { id, productIds } = values;
    return axios.patch(`${API_URL}/supplier/${id}/add-product`, {
        productIds,
    });
};



const getListBankAccount = () => {
    return axios.get(`${API_URL}/bank-account`,
        {
            headers: authHeader()
        });
};

const getBankAccount = ({ id }) => {
    return axios.get(`${API_URL}/bank-account/${id}`,
        {
            headers: authHeader()
        });
};

const postBankAccount = ({ values }) => {
    return axios.post(`${API_URL}/bank-account`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const updateBankAccount = ({ values }) => {
    let { id, ...newObj } = values;
    return axios.patch(`${API_URL}/bank-account/${id}`,
        {
            ...newObj
        },
        {
            // headers: authHeader()
        },
    );
};






const getListAccountant = () => {
    return axios.get(`${API_URL}/employee/accountant`,
        {
            headers: authHeader()
        });
};

const getListWarehouseKeeper = () => {
    return axios.get(`${API_URL}/employee/warehouse-keeper`,
        {
            headers: authHeader()
        });
};






const getListSalesperson = () => {
    return axios.get(`${API_URL}/employee/salesperson`,
        {
            headers: authHeader()
        });
};







const getDieuKhoanThanhToanCustomer = ({ id }) => {
    return axios.get(`${API_URL}/dieu-khoan/customer/${id}`,
        {
            headers: authHeader()
        });
};


const getListDieuKhoanThanhToan = () => {
    return axios.get(`${API_URL}/dieu-khoan`,
        {
            headers: authHeader()
        });
};

const getDieuKhoanThanhToan = ({ id }) => {
    return axios.get(`${API_URL}/dieu-khoan/${id}`,
        {
            headers: authHeader()
        });
};

const postDieuKhoanThanhToan = ({ values }) => {
    return axios.post(`${API_URL}/dieu-khoan`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const updateDieuKhoanThanhToan = ({ values }) => {
    let { id, ...newObj } = values;
    return axios.patch(`${API_URL}/dieu-khoan/${id}`,
        {
            ...newObj
        },
        {
            // headers: authHeader()
        },
    );
};

const deleteDieuKhoanThanhToan = ({ values }) => {
    let { id, ...newObj } = values;
    return axios.delete(`${API_URL}/dieu-khoan/${id}`,
        {
            // ...newObj
        },
        {
            // headers: authHeader()
        },
    );
};







const getCktmCustomer = ({ id }) => {
    return axios.get(`${API_URL}/cktm/customer/${id}`,
        {
            headers: authHeader()
        });
};

const getListCktm = () => {
    return axios.get(`${API_URL}/cktm`,
        {
            headers: authHeader()
        });
};

const getCktm = ({ id }) => {
    return axios.get(`${API_URL}/cktm/${id}`,
        {
            headers: authHeader()
        });
};

const postCktm = ({ values }) => {
    return axios.post(`${API_URL}/cktm`,
        {
            ...values
        },
        {
            headers: authHeader()
        });
};

const updateCktm = ({ values }) => {
    let { id, ...newObj } = values;
    return axios.patch(`${API_URL}/cktm/${id}`,
        {
            ...newObj
        },
        {
            // headers: authHeader()
        },
    );
};

const deleteCktm = ({ values }) => {
    let { id, ...newObj } = values;
    return axios.delete(`${API_URL}/cktm/${id}`,
        {
            // ...newObj
        },
        {
            // headers: authHeader()
        },
    );
};


const doiTuongService = {
    getListSupplier,
    getSupplier,
    postSupplier,

    getListSupplierGroup,
    getSupplierGroup,
    postSupplierGroup,

    getListCustomerGroup,
    getCustomerGroup,
    postCustomerGroup,
    updateCustomerGroup,

    getListCustomer,
    getCustomer,
    postCustomer,
    updateCustomer,

    getListProductGroup,
    getProductGroup,
    postProductGroup,
    updateProductGroup,

    getListProduct,
    getProduct,
    postProduct,
    updateProduct,
    addProductForSup ,

    getListBankAccount,
    getBankAccount,
    postBankAccount,
    updateBankAccount,

    getListAccountant,
    getListWarehouseKeeper,
    getListSalesperson,

    getDieuKhoanThanhToanCustomer,
    getListDieuKhoanThanhToan,
    getDieuKhoanThanhToan,
    postDieuKhoanThanhToan,
    updateDieuKhoanThanhToan,
    deleteDieuKhoanThanhToan,

    getCktmCustomer,
    getListCktm,
    getCktm,
    postCktm,
    updateCktm,
    deleteCktm,
};

export default doiTuongService;