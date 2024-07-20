import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";
import doiTuongService from "../../services/doiTuong.service";

export const getListSupplier = createAsyncThunk(
    "doiTuong/getListSupplier",
    async (thunkAPI) => {
        try {
            const response = await doiTuongService.getListSupplier();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getSupplier = createAsyncThunk(
    "doiTuong/getSupplier",
    async ({ id }, thunkAPI) => {
        try {
            const response = await doiTuongService.getSupplier({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postSupplier = createAsyncThunk(
    "doiTuong/postSupplier",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.postSupplier({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);






export const getListSupplierGroup = createAsyncThunk(
    "doiTuong/getListSupplierGroup",
    async (thunkAPI) => {
        try {
            const response = await doiTuongService.getListSupplierGroup();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getSupplierGroup = createAsyncThunk(
    "doiTuong/getSupplierGroup",
    async ({ id }, thunkAPI) => {
        try {
            const response = await doiTuongService.getSupplierGroup({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postSupplierGroup = createAsyncThunk(
    "doiTuong/postSupplierGroup",
    async ({ values }, thunkAPI) => {
        try {
            const response = await doiTuongService.postSupplierGroup({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);






export const getListCustomerGroup = createAsyncThunk(
    "doiTuong/getListCustomerGroup",
    async (thunkAPI) => {
        try {
            const response = await doiTuongService.getListCustomerGroup();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getCustomerGroup = createAsyncThunk(
    "doiTuong/getCustomerGroup",
    async ({ id }, thunkAPI) => {
        try {
            const response = await doiTuongService.getCustomerGroup({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postCustomerGroup = createAsyncThunk(
    "doiTuong/postCustomerGroup",
    async ({ values }, thunkAPI) => {
        try {
            const response = await doiTuongService.postCustomerGroup({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const updateCustomerGroup = createAsyncThunk(
    "doiTuong/updateCustomerGroup",
    async ({ values }, thunkAPI) => {
        try {
            const response = await doiTuongService.updateCustomerGroup({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);






export const getListCustomer = createAsyncThunk(
    "doiTuong/getListCustomer",
    async (thunkAPI) => {
        try {
            const response = await doiTuongService.getListCustomer();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getCustomer = createAsyncThunk(
    "doiTuong/getCustomer",
    async ({ id }, thunkAPI) => {
        try {
            const response = await doiTuongService.getCustomer({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postCustomer = createAsyncThunk(
    "doiTuong/postCustomer",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.postCustomer({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const updateCustomer = createAsyncThunk(
    "doiTuong/updateCustomer",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.updateCustomer({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);












export const getListProductGroup = createAsyncThunk(
    "doiTuong/getListProductGroup",
    async (thunkAPI) => {
        try {
            const response = await doiTuongService.getListProductGroup();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getProductGroup = createAsyncThunk(
    "doiTuong/getProductGroup",
    async ({ id }, thunkAPI) => {
        try {
            const response = await doiTuongService.getProductGroup({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postProductGroup = createAsyncThunk(
    "doiTuong/postProductGroup",
    async ({ values }, thunkAPI) => {
        try {
            const response = await doiTuongService.postProductGroup({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateProductGroup = createAsyncThunk(
    "doiTuong/updateProductGroup",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.updateProductGroup({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);








export const getListProduct = createAsyncThunk(
    "doiTuong/getListProduct",
    async (thunkAPI) => {
        try {
            const response = await doiTuongService.getListProduct();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getProduct = createAsyncThunk(
    "doiTuong/getProduct",
    async ({ id }, thunkAPI) => {
        try {
            const response = await doiTuongService.getProduct({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postProduct = createAsyncThunk(
    "doiTuong/postProduct",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.postProduct({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateProduct = createAsyncThunk(
    "doiTuong/updateProduct",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.updateProduct({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);






export const getListBankAccount = createAsyncThunk(
    "doiTuong/getListBankAccount",
    async (thunkAPI) => {
        try {
            const response = await doiTuongService.getListBankAccount();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getBankAccount = createAsyncThunk(
    "doiTuong/getBankAccount",
    async ({ id }, thunkAPI) => {
        try {
            const response = await doiTuongService.getBankAccount({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postBankAccount = createAsyncThunk(
    "doiTuong/postBankAccount",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.postBankAccount({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateBankAccount = createAsyncThunk(
    "doiTuong/updateBankAccount",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.updateBankAccount({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);








export const getListAccountant = createAsyncThunk(
    "doiTuong/getListAccountant",
    async (thunkAPI) => {
        try {
            const response = await doiTuongService.getListAccountant();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);







export const getListSalesperson = createAsyncThunk(
    "doiTuong/getListSalesperson",
    async (thunkAPI) => {
        try {
            const response = await doiTuongService.getListSalesperson();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);










export const getDieuKhoanThanhToanCustomer = createAsyncThunk(
    "doiTuong/getDieuKhoanThanhToanCustomer",
    async ({ id }, thunkAPI) => {
        try {
            const response = await doiTuongService.getDieuKhoanThanhToanCustomer({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const getListDieuKhoanThanhToan = createAsyncThunk(
    "doiTuong/getListDieuKhoanThanhToan",
    async (thunkAPI) => {
        try {
            const response = await doiTuongService.getListDieuKhoanThanhToan();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getDieuKhoanThanhToan = createAsyncThunk(
    "doiTuong/getDieuKhoanThanhToan",
    async ({ id }, thunkAPI) => {
        try {
            const response = await doiTuongService.getDieuKhoanThanhToan({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postDieuKhoanThanhToan = createAsyncThunk(
    "doiTuong/postDieuKhoanThanhToan",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.postDieuKhoanThanhToan({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateDieuKhoanThanhToan = createAsyncThunk(
    "doiTuong/updateDieuKhoanThanhToan",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.updateDieuKhoanThanhToan({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const deleteDieuKhoanThanhToan = createAsyncThunk(
    "doiTuong/deleteDieuKhoanThanhToan",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.deleteDieuKhoanThanhToan({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);







export const getCktmCustomer = createAsyncThunk(
    "doiTuong/getCktmCustomer",
    async ({ id }, thunkAPI) => {
        try {
            const response = await doiTuongService.getCktmCustomer({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const getListCktm = createAsyncThunk(
    "doiTuong/getListCktm",
    async (thunkAPI) => {
        try {
            const response = await doiTuongService.getListCktm();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getCktm = createAsyncThunk(
    "doiTuong/getCktm",
    async ({ id }, thunkAPI) => {
        try {
            const response = await doiTuongService.getCktm({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postCktm = createAsyncThunk(
    "doiTuong/postCktm",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.postCktm({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateCktm = createAsyncThunk(
    "doiTuong/updateCktm",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.updateCktm({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const deleteCktm = createAsyncThunk(
    "doiTuong/deleteCktm",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await doiTuongService.deleteCktm({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    isFetching: false,
    isSuccess: false,

    isSuccessGetListSupplier: false,
    isSuccessPostSupplier: false,
    isSuccessGetListSupplierGroup: false,
    isSuccessPostSupplierGroup: false,

    isSuccessGetListCustomer: false,
    isSuccessPostCustomer: false,
    isSuccessUpdateCustomer: false,

    isSuccessGetListCustomerGroup: false,
    isSuccessPostCustomerGroup: false,
    isSuccessUpdateCustomerGroup: false,

    isSuccessGetListProduct: false,
    isSuccessPostProduct: false,
    isSuccessUpdateProduct: false,

    isSuccessGetListProductGroup: false,
    isSuccessPostProductGroup: false,
    isSuccessUpdateProductGroup: false,

    isSuccessGetListBankAccount: false,
    isSuccessPostBankAccount: false,
    isSuccessUpdateBankAccount: false,

    isSuccessGetListAccountant: false,

    isSuccessGetListSalesperson: false,

    isSuccessGetListDieuKhoanThanhToan: false,
    isSuccessPostDieuKhoanThanhToan: false,
    isSuccessUpdateDieuKhoanThanhToan: false,
    isSuccessDeleteDieuKhoanThanhToan: false,

    isSuccessGetListCktm: false,
    isSuccessPostCktm: false,
    isSuccessUpdateCktm: false,
    isSuccessDeleteCktm: false,

    isError: false,
    message: "",
    listSupplierData: [],
    supplierData: {},
    listSupplierGroupData: [],
    supplierGroupData: {},

    listCustomerData: [],
    customerData: {},
    listCustomerGroupData: [],
    customerGroupData: {},

    listProductData: [],
    productData: {},
    listProductGroupData: [],
    productGroupData: {},

    listBankAccountData: [],
    bankAccountData: {},

    listAccountantData: [],

    listSalespersonData: [],

    listDieuKhoanThanhToanData: [],
    dieuKhoanThanhToanData: {},
    dieuKhoanThanhToanCustomerData: [],

    listCktmData: [],
    cktmData: {},
    cktmCustomerData: [],
};

export const doiTuongSlice = createSlice({
    name: "doiTuong",
    initialState,
    reducers: {
        clearState: (state) => {
            state.isError = false;

            state.isSuccessGetListSupplier = false;
            state.isSuccessPostSupplier = false;
            state.isSuccessGetListSupplierGroup = false;
            state.isSuccessPostSupplierGroup = false;

            state.isSuccessGetListCustomer = false;
            state.isSuccessPostCustomer = false;
            state.isSuccessUpdateCustomer = false;

            state.isSuccessGetListCustomerGroup = false;
            state.isSuccessPostCustomerGroup = false;
            state.isSuccessUpdateCustomerGroup = false;

            state.isSuccessGetListProduct = false;
            state.isSuccessPostProduct = false;
            state.isSuccessUpdateProduct = false;

            state.isSuccessGetListProductGroup = false;
            state.isSuccessPostProductGroup = false;
            state.isSuccessUpdateProductGroup = false;

            state.isSuccessGetListBankAccount = false;
            state.isSuccessPostBankAccount = false;
            state.isSuccessUpdateBankAccount = false;

            state.isSuccessGetListDieuKhoanThanhToan = false;
            state.isSuccessPostDieuKhoanThanhToan = false;
            state.isSuccessUpdateDieuKhoanThanhToan = false;
            state.isSuccessDeleteDieuKhoanThanhToan = false;

            state.isSuccessGetListCktm = false;
            state.isSuccessPostCktm = false;
            state.isSuccessUpdateCktm = false;
            state.isSuccessDeleteCktm = false;

            state.isFetching = false;
            state.message = "";
            return state;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(getListSupplier.pending, (state) => {
            console.log("getListSupplier.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListSupplier.fulfilled, (state, action) => {
            console.log("getListSupplier.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListSupplier = true;
            state.listSupplierData = action.payload.result.data.map(item => { return { ...item, key: item.id, supplierGroup: item.supplierGroup.id } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListSupplier.rejected, (state, action) => {
            console.log("getListSupplier.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getSupplier.pending, (state) => {
            console.log("getSupplier.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getSupplier.fulfilled, (state, action) => {
            console.log("getSupplier.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccess = true;
            state.supplierData = { ...action.payload.result.data, key: action.payload.result.data.id, supplierGroup: action.payload.result.data.supplierGroup.id };

            //   state.message = action.payload.message;
        })

        builder.addCase(getSupplier.rejected, (state, action) => {
            console.log("getSupplier.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postSupplier.pending, (state) => {
            console.log("postSupplier.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postSupplier.fulfilled, (state, action) => {
            console.log("postSupplier.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostSupplier = true;
            state.supplierData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postSupplier.rejected, (state, action) => {
            console.log("postSupplier.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })









        builder.addCase(getListSupplierGroup.pending, (state) => {
            console.log("getListSupplierGroup.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListSupplierGroup.fulfilled, (state, action) => {
            console.log("getListSupplierGroup.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListSupplierGroup = true;
            state.listSupplierGroupData = action.payload.result.data.map(item => { return { ...item, key: item.id, size: item.suppliers.length } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListSupplierGroup.rejected, (state, action) => {
            console.log("getListSupplierGroup.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getSupplierGroup.pending, (state) => {
            console.log("getSupplierGroup.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getSupplierGroup.fulfilled, (state, action) => {
            console.log("getSupplierGroup.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccess = true;
            state.supplierGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(getSupplierGroup.rejected, (state, action) => {
            console.log("getSupplierGroup.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postSupplierGroup.pending, (state) => {
            console.log("postSupplierGroup.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postSupplierGroup.fulfilled, (state, action) => {
            console.log("postSupplierGroup.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostSupplierGroup = true;
            state.supplierGroupData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postSupplierGroup.rejected, (state, action) => {
            console.log("postSupplierGroup.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })








        builder.addCase(getListCustomerGroup.pending, (state) => {
            console.log("getListCustomerGroup.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListCustomerGroup.fulfilled, (state, action) => {
            console.log("getListCustomerGroup.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListCustomerGroup = true;
            state.listCustomerGroupData = action.payload.result.data.map(item => { return { ...item, key: item.id, size: item.customers.length } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListCustomerGroup.rejected, (state, action) => {
            console.log("getListCustomerGroup.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getCustomerGroup.pending, (state) => {
            console.log("getCustomerGroup.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getCustomerGroup.fulfilled, (state, action) => {
            console.log("getCustomerGroup.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccess = true;
            state.customerGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(getCustomerGroup.rejected, (state, action) => {
            console.log("getCustomerGroup.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postCustomerGroup.pending, (state) => {
            console.log("postCustomerGroup.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postCustomerGroup.fulfilled, (state, action) => {
            console.log("postCustomerGroup.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostCustomerGroup = true;
            state.customerGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(postCustomerGroup.rejected, (state, action) => {
            console.log("postCustomerGroup.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })


        builder.addCase(updateCustomerGroup.pending, (state) => {
            console.log("updateCustomerGroup.pending", state)
            state.isFetching = true;
        })

        builder.addCase(updateCustomerGroup.fulfilled, (state, action) => {
            console.log("updateCustomerGroup.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessUpdateCustomerGroup = true;
            // state.customerGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(updateCustomerGroup.rejected, (state, action) => {
            console.log("updateCustomerGroup.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })









        builder.addCase(getListCustomer.pending, (state) => {
            console.log("getListCustomer.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListCustomer.fulfilled, (state, action) => {
            console.log("getListCustomer.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListCustomer = true;
            state.listCustomerData = action.payload.result.data.map(item => { return { ...item, key: item.id, customerGroup: item.customerGroup.id } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListCustomer.rejected, (state, action) => {
            console.log("getListCustomer.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getCustomer.pending, (state) => {
            console.log("getCustomer.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getCustomer.fulfilled, (state, action) => {
            console.log("getCustomer.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccess = true;
            state.customerData = { ...action.payload.result.data, key: action.payload.result.data.id, customerGroup: action.payload.result.data.customerGroup.id };

            //   state.message = action.payload.message;
        })

        builder.addCase(getCustomer.rejected, (state, action) => {
            console.log("getCustomer.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postCustomer.pending, (state) => {
            console.log("postCustomer.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postCustomer.fulfilled, (state, action) => {
            console.log("postCustomer.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostCustomer = true;
            state.customerData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postCustomer.rejected, (state, action) => {
            console.log("postCustomer.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(updateCustomer.pending, (state) => {
            console.log("updateCustomer.pending", state)
            state.isFetching = true;
        })

        builder.addCase(updateCustomer.fulfilled, (state, action) => {
            console.log("updateCustomer.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessUpdateCustomer = true;
            // state.customerGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(updateCustomer.rejected, (state, action) => {
            console.log("updateCustomer.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })





































        builder.addCase(getListProductGroup.pending, (state) => {
            console.log("getListProductGroup.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListProductGroup.fulfilled, (state, action) => {
            console.log("getListProductGroup.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListProductGroup = true;
            state.listProductGroupData = action.payload.result.data.map(item => { return { ...item, key: item.id, size: item.products.length } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListProductGroup.rejected, (state, action) => {
            console.log("getListProductGroup.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getProductGroup.pending, (state) => {
            console.log("getProductGroup.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getProductGroup.fulfilled, (state, action) => {
            console.log("getProductGroup.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccess = true;
            state.productGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(getProductGroup.rejected, (state, action) => {
            console.log("getProductGroup.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postProductGroup.pending, (state) => {
            console.log("postProductGroup.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postProductGroup.fulfilled, (state, action) => {
            console.log("postProductGroup.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostProductGroup = true;
            state.productGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(postProductGroup.rejected, (state, action) => {
            console.log("postProductGroup.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(updateProductGroup.pending, (state) => {
            console.log("updateProductGroup.pending", state)
            state.isFetching = true;
        })

        builder.addCase(updateProductGroup.fulfilled, (state, action) => {
            console.log("updateProductGroup.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessUpdateProductGroup = true;
            // state.customerGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(updateProductGroup.rejected, (state, action) => {
            console.log("updateProductGroup.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })











        builder.addCase(getListProduct.pending, (state) => {
            console.log("getListProduct.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListProduct.fulfilled, (state, action) => {
            console.log("getListProduct.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListProduct = true;
            state.listProductData = action.payload.result.data.map(item => { return { ...item, key: item.id, productGroupInfo: item.productGroup, productGroup: item.productGroup.id, tonghangtrongkho: item.ordered + item.category } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListProduct.rejected, (state, action) => {
            console.log("getListProduct.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getProduct.pending, (state) => {
            console.log("getProduct.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getProduct.fulfilled, (state, action) => {
            console.log("getProduct.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccess = true;
            state.productData = { ...action.payload.result.data, key: action.payload.result.data.id, productGroup: action.payload.result.data.productGroup.id };

            //   state.message = action.payload.message;
        })

        builder.addCase(getProduct.rejected, (state, action) => {
            console.log("getProduct.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postProduct.pending, (state) => {
            console.log("postProduct.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postProduct.fulfilled, (state, action) => {
            console.log("postProduct.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostProduct = true;
            state.productData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postProduct.rejected, (state, action) => {
            console.log("postProduct.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(updateProduct.pending, (state) => {
            console.log("updateProduct.pending", state)
            state.isFetching = true;
        })

        builder.addCase(updateProduct.fulfilled, (state, action) => {
            console.log("updateProduct.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessUpdateProduct = true;
            // state.customerGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(updateProduct.rejected, (state, action) => {
            console.log("updateProduct.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })












        builder.addCase(getListBankAccount.pending, (state) => {
            console.log("getListBankAccount.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListBankAccount.fulfilled, (state, action) => {
            console.log("getListBankAccount.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListBankAccount = true;
            state.listBankAccountData = action.payload.result.data.map(item => { return { ...item, key: item.id } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListBankAccount.rejected, (state, action) => {
            console.log("getListBankAccount.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getBankAccount.pending, (state) => {
            console.log("getBankAccount.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getBankAccount.fulfilled, (state, action) => {
            console.log("getBankAccount.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccess = true;
            state.bankAccountData = { ...action.payload.result.data, key: action.payload.result.data.id };

            //   state.message = action.payload.message;
        })

        builder.addCase(getBankAccount.rejected, (state, action) => {
            console.log("getBankAccount.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postBankAccount.pending, (state) => {
            console.log("postBankAccount.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postBankAccount.fulfilled, (state, action) => {
            console.log("postBankAccount.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostBankAccount = true;
            state.ankAccountData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postBankAccount.rejected, (state, action) => {
            console.log("postBankAccount.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })


        builder.addCase(updateBankAccount.pending, (state) => {
            console.log("updateBankAccount.pending", state)
            state.isFetching = true;
        })

        builder.addCase(updateBankAccount.fulfilled, (state, action) => {
            console.log("updateBankAccount.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessUpdateBankAccount = true;
            // state.customerGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(updateBankAccount.rejected, (state, action) => {
            console.log("updateBankAccount.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })







        builder.addCase(getListAccountant.pending, (state) => {
            console.log("getListAccountant.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListAccountant.fulfilled, (state, action) => {
            console.log("getListAccountant.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListAccountant = true;
            state.listAccountantData = action.payload.result.data.map(item => { return { ...item, key: item.id } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListAccountant.rejected, (state, action) => {
            console.log("getListAccountant.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })










        builder.addCase(getListSalesperson.pending, (state) => {
            console.log("getListSalesperson.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListSalesperson.fulfilled, (state, action) => {
            console.log("getListSalesperson.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListSalesperson = true;
            state.listSalespersonData = action.payload.result.data.map(item => { return { ...item, key: item.id } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListSalesperson.rejected, (state, action) => {
            console.log("getListBankAccount.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })












        builder.addCase(getDieuKhoanThanhToanCustomer.pending, (state) => {
            console.log("getDieuKhoanThanhToanCustomer.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getDieuKhoanThanhToanCustomer.fulfilled, (state, action) => {
            console.log("getDieuKhoanThanhToanCustomer.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccess = true;
            state.dieuKhoanThanhToanCustomerData = action.payload.result.data;

            //   state.message = action.payload.message;
        })

        builder.addCase(getDieuKhoanThanhToanCustomer.rejected, (state, action) => {
            console.log("getDieuKhoanThanhToanCustomer.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })


        builder.addCase(getListDieuKhoanThanhToan.pending, (state) => {
            console.log("getListDieuKhoanThanhToan.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListDieuKhoanThanhToan.fulfilled, (state, action) => {
            console.log("getListDieuKhoanThanhToan.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListDieuKhoanThanhToan = true;
            state.listDieuKhoanThanhToanData = action.payload.result.data.map(item => { return { ...item, key: item.id } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListDieuKhoanThanhToan.rejected, (state, action) => {
            console.log("getListDieuKhoanThanhToan.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getDieuKhoanThanhToan.pending, (state) => {
            console.log("getDieuKhoanThanhToan.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getDieuKhoanThanhToan.fulfilled, (state, action) => {
            console.log("getDieuKhoanThanhToan.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccess = true;
            state.dieuKhoanThanhToanData = { ...action.payload.result.data, key: action.payload.result.data.id };

            //   state.message = action.payload.message;
        })

        builder.addCase(getDieuKhoanThanhToan.rejected, (state, action) => {
            console.log("getDieuKhoanThanhToan.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postDieuKhoanThanhToan.pending, (state) => {
            console.log("postDieuKhoanThanhToan.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postDieuKhoanThanhToan.fulfilled, (state, action) => {
            console.log("postDieuKhoanThanhToan.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostDieuKhoanThanhToan = true;
            state.productData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postDieuKhoanThanhToan.rejected, (state, action) => {
            console.log("postDieuKhoanThanhToan.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })


        builder.addCase(updateDieuKhoanThanhToan.pending, (state) => {
            console.log("updateDieuKhoanThanhToan.pending", state)
            state.isFetching = true;
        })

        builder.addCase(updateDieuKhoanThanhToan.fulfilled, (state, action) => {
            console.log("updateDieuKhoanThanhToan.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessUpdateDieuKhoanThanhToan = true;
            // state.customerGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(updateDieuKhoanThanhToan.rejected, (state, action) => {
            console.log("updateDieuKhoanThanhToan.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })


        builder.addCase(deleteDieuKhoanThanhToan.pending, (state) => {
            console.log("deleteDieuKhoanThanhToan.pending", state)
            state.isFetching = true;
        })

        builder.addCase(deleteDieuKhoanThanhToan.fulfilled, (state, action) => {
            console.log("deleteDieuKhoanThanhToan.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessDeleteDieuKhoanThanhToan = true;
            // state.customerGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(deleteDieuKhoanThanhToan.rejected, (state, action) => {
            console.log("deleteDieuKhoanThanhToan.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })











        builder.addCase(getCktmCustomer.pending, (state) => {
            console.log("getCktmCustomer.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getCktmCustomer.fulfilled, (state, action) => {
            console.log("getCktmCustomer.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccess = true;
            state.cktmCustomerData = action.payload.result.data;

            //   state.message = action.payload.message;
        })

        builder.addCase(getCktmCustomer.rejected, (state, action) => {
            console.log("getCktmCustomer.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })


        builder.addCase(getListCktm.pending, (state) => {
            console.log("getListCktm.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListCktm.fulfilled, (state, action) => {
            console.log("getListCktm.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListCktm = true;
            state.listCktmData = action.payload.result.data.map(item => { return { ...item, key: item.id } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListCktm.rejected, (state, action) => {
            console.log("getListCktm.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getCktm.pending, (state) => {
            console.log("getCktm.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getCktm.fulfilled, (state, action) => {
            console.log("getCktm.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccess = true;
            state.cktmData = { ...action.payload.result.data, key: action.payload.result.data.id };

            //   state.message = action.payload.message;
        })

        builder.addCase(getCktm.rejected, (state, action) => {
            console.log("getCktm.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postCktm.pending, (state) => {
            console.log("postCktm.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postCktm.fulfilled, (state, action) => {
            console.log("postCktm.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostCktm = true;
            state.productData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postCktm.rejected, (state, action) => {
            console.log("postCktm.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(updateCktm.pending, (state) => {
            console.log("updateCktm.pending", state)
            state.isFetching = true;
        })

        builder.addCase(updateCktm.fulfilled, (state, action) => {
            console.log("updateCktm.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessUpdateCktm = true;
            // state.customerGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(updateCktm.rejected, (state, action) => {
            console.log("updateCktm.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })



        builder.addCase(deleteCktm.pending, (state) => {
            console.log("deleteCktm.pending", state)
            state.isFetching = true;
        })

        builder.addCase(deleteCktm.fulfilled, (state, action) => {
            console.log("deleteCktm.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessDeleteCktm = true;
            // state.customerGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(deleteCktm.rejected, (state, action) => {
            console.log("deleteCktm.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

    },
});

export const { clearState } = doiTuongSlice.actions;

export const doiTuongSelector = (state) => state.doiTuong;