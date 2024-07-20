import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";
import banHangService from "../../services/banHang.service";

export const getListDonBanHang = createAsyncThunk(
    "banHang/getListDonBanHang",
    async (thunkAPI) => {
        try {
            const response = await banHangService.getListDonBanHang();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getDonBanHang = createAsyncThunk(
    "banHang/getDonBanHang",
    async ({ id }, thunkAPI) => {
        try {
            const response = await banHangService.getDonBanHang({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postDonBanHang = createAsyncThunk(
    "banHang/postDonBanHang",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await banHangService.postDonBanHang({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);








export const getListChungTuBan = createAsyncThunk(
    "banHang/getListChungTuBan",
    async (thunkAPI) => {
        try {
            const response = await banHangService.getListChungTuBan();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getChungTuBan = createAsyncThunk(
    "banHang/getChungTuBan",
    async ({ id }, thunkAPI) => {
        try {
            const response = await banHangService.getChungTuBan({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postChungTuBan = createAsyncThunk(
    "banHang/postChungTuBan",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await banHangService.postChungTuBan({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);





export const getListEmployeeWarehouseKeeper = createAsyncThunk(
    "banHang/getListEmployeeWarehouseKeeper",
    async (thunkAPI) => {
        try {
            const response = await banHangService.getListEmployeeWarehouseKeeper();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);








export const getListPhieuThuTienMat = createAsyncThunk(
    "banHang/getListPhieuThuTienMat",
    async (thunkAPI) => {
        try {
            const response = await banHangService.getListPhieuThuTienMat();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getPhieuThuTienMat = createAsyncThunk(
    "banHang/getPhieuThuTienMat",
    async ({ id }, thunkAPI) => {
        try {
            const response = await banHangService.getPhieuThuTienMat({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postPhieuThuTienMat = createAsyncThunk(
    "banHang/postPhieuThuTienMat",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await banHangService.postPhieuThuTienMat({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);








export const getListPhieuThuTienGui = createAsyncThunk(
    "banHang/getListPhieuThuTienGui",
    async (thunkAPI) => {
        try {
            const response = await banHangService.getListPhieuThuTienGui();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getPhieuThuTienGui = createAsyncThunk(
    "banHang/getPhieuThuTienGui",
    async ({ id }, thunkAPI) => {
        try {
            const response = await banHangService.getPhieuThuTienGui({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postPhieuThuTienGui = createAsyncThunk(
    "banHang/postPhieuThuTienGui",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await banHangService.postPhieuThuTienGui({ values });
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

    isSuccessGetListDonBanHang: false,
    isSuccessGetDonBanHang: false,
    isSuccessPostDonBanHang: false,

    isSuccessGetListChungTuBan: false,
    isSuccessGetChungTuBan: false,
    isSuccessPostChungTuBan: false,

    isSuccessGetListEmployeeWarehouseKeeper: false,

    isSuccessGetListPhieuThuTienMat: false,
    isSuccessGetPhieuThuTienMat: false,
    isSuccessPostPhieuThuTienMat: false,

    isSuccessGetListPhieuThuTienGui: false,
    isSuccessGetPhieuThuTienGui: false,
    isSuccessPostPhieuThuTienGui: false,

    isError: false,
    message: "",

    listDonBanHangData: [],
    donBanHangData: {},

    listChungTuBanData: [],
    chungTuBanData: {},

    listEmployeeWarehouseKeeperData: [],

    listHoaDonSelected: [],

    listPhieuThuTienMatData: [],
    phieuThuTienMatData: {},

    listPhieuThuTienGuiData: [],
    phieuThuTienGuiData: {},
};


export const banHangSlice = createSlice({
    name: "banHang",
    initialState,
    reducers: {
        clearState: (state) => {
            state.isError = false;

            state.isSuccessGetListDonBanHang = false;
            state.isSuccessGetDonBanHang = false;
            state.isSuccessPostDonBanHang = false;

            state.isSuccessGetListChungTuBan = false;
            state.isSuccessGetChungTuBan = false;
            state.isSuccessPostChungTuBan = false;

            state.isSuccessGetListEmployeeWarehouseKeeper = false;

            state.isSuccessGetListPhieuThuTienMat = false;
            state.isSuccessGetPhieuThuTienMat = false;
            state.isSuccessPostPhieuThuTienMat = false;

            state.isSuccessGetListPhieuThuTienGui = false;
            state.isSuccessGetPhieuThuTienGui = false;
            state.isSuccessPostPhieuThuTienGui = false;

            state.isFetching = false;
            state.message = "";
            return state;
        },

        hoaDonSelected: (state, action) => {
            state.listHoaDonSelected = action.payload;
            return state;
        },

        donBanHangUploadFile: (state, action) => {
            // state.donBanHangData = action.payload;
            state.donBanHangData = {
                ...action.payload,
                key: action.payload.id,
                salesperson: action.payload.salespersonId,
                // address: action.payload.customer.address,
                namecCustomer: action.payload.customerId,
                // taxCode: action.payload.customer.taxCode
            };

            return state;

        }
    },

    extraReducers: (builder) => {
        builder.addCase(getListDonBanHang.pending, (state) => {
            console.log("getListDonBanHang.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListDonBanHang.fulfilled, (state, action) => {
            console.log("getListDonBanHang.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListDonBanHang = true;

            state.listDonBanHangData = action.payload.result.data.map(item => { return { ...item, key: item.id, customer: item.customer.name } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListDonBanHang.rejected, (state, action) => {
            console.log("getListDonBanHang.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getDonBanHang.pending, (state) => {
            console.log("getDonBanHang.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getDonBanHang.fulfilled, (state, action) => {
            console.log("getDonBanHang.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetDonBanHang = true;
            state.donBanHangData =
            {
                ...action.payload.result.data,
                key: action.payload.result.data.id,
                salesperson: action.payload.result.data.salesperson.name,
                address: action.payload.result.data.customer.address,
                namecCustomer: action.payload.result.data.customer.name,
                taxCode: action.payload.result.data.customer.taxCode
            };

            //   state.message = action.payload.message;
        })

        builder.addCase(getDonBanHang.rejected, (state, action) => {
            console.log("getDonBanHang.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postDonBanHang.pending, (state) => {
            console.log("postDonBanHang.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postDonBanHang.fulfilled, (state, action) => {
            console.log("postDonBanHang.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostDonBanHang = true;
            // state.donBanHangData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postDonBanHang.rejected, (state, action) => {
            console.log("postDonBanHang.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

















        builder.addCase(getListChungTuBan.pending, (state) => {
            console.log("getListChungTuBan.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListChungTuBan.fulfilled, (state, action) => {
            console.log("getListChungTuBan.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListChungTuBan = true;

            state.listChungTuBanData = action.payload.result.data.map(item => { return { ...item, key: item.id } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListChungTuBan.rejected, (state, action) => {
            console.log("getListChungTuBan.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getChungTuBan.pending, (state) => {
            console.log("getChungTuBan.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getChungTuBan.fulfilled, (state, action) => {
            console.log("getChungTuBan.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetChungTuBan = true;
            state.chungTuBanData =
            {
                ...action.payload.result.data,
                key: action.payload.result.data.id,
                namecCustomer: action.payload.result.data.donBanHang.customer.name,
                taxCode: action.payload.result.data.donBanHang.customer.taxCode,
                address: action.payload.result.data.donBanHang.customer.address,
                warehouseKeeperId: action.payload.result.data.warehouseKeeper.id
                // salesperson: action.payload.result.data.donBanHang.salesperson.name,
                // address: action.payload.result.data.customer.address,
                // namecCustomer: action.payload.result.data.customer.name,

            };

            //   state.message = action.payload.message;
        })

        builder.addCase(getChungTuBan.rejected, (state, action) => {
            console.log("getChungTuBan.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postChungTuBan.pending, (state) => {
            console.log("postChungTuBan.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postChungTuBan.fulfilled, (state, action) => {
            console.log("postChungTuBan.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostChungTuBan = true;
            state.chungTuBanData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postChungTuBan.rejected, (state, action) => {
            console.log("postChungTuBan.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })













        builder.addCase(getListEmployeeWarehouseKeeper.pending, (state) => {
            console.log("getListEmployeeWarehouseKeeper.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListEmployeeWarehouseKeeper.fulfilled, (state, action) => {
            console.log("getListEmployeeWarehouseKeeper.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListEmployeeWarehouseKeeper = true;

            state.listEmployeeWarehouseKeeperData = action.payload.result.data.map(item => { return { ...item, key: item.id } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListEmployeeWarehouseKeeper.rejected, (state, action) => {
            console.log("getListEmployeeWarehouseKeeper.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })














        builder.addCase(getListPhieuThuTienMat.pending, (state) => {
            console.log("getListPhieuThuTienMat.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListPhieuThuTienMat.fulfilled, (state, action) => {
            console.log("getListPhieuThuTienMat.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListPhieuThuTienMat = true;

            state.listPhieuThuTienMatData = action.payload.result.data.map(item => { return { ...item, key: `${item.id}CASH`, type: "CASH" } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListPhieuThuTienMat.rejected, (state, action) => {
            console.log("getListPhieuThuTienMat.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getPhieuThuTienMat.pending, (state) => {
            console.log("getPhieuThuTienMat.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getPhieuThuTienMat.fulfilled, (state, action) => {
            console.log("getPhieuThuTienMat.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetPhieuThuTienMat = true;
            state.phieuThuTienMatData =
            {
                ...action.payload.result.data,
                key: action.payload.result.data.id,
                paymentMethod: "CASH",
            };

            //   state.message = action.payload.message;
        })

        builder.addCase(getPhieuThuTienMat.rejected, (state, action) => {
            console.log("getPhieuThuTienMat.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postPhieuThuTienMat.pending, (state) => {
            console.log("postPhieuThuTienMat.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postPhieuThuTienMat.fulfilled, (state, action) => {
            console.log("postPhieuThuTienMat.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostPhieuThuTienMat = true;
            // state.chungTuBanData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postPhieuThuTienMat.rejected, (state, action) => {
            console.log("postPhieuThuTienMat.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })













        builder.addCase(getListPhieuThuTienGui.pending, (state) => {
            console.log("getListPhieuThuTienGui.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListPhieuThuTienGui.fulfilled, (state, action) => {
            console.log("getListPhieuThuTienGui.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListPhieuThuTienGui = true;

            state.listPhieuThuTienGuiData = action.payload.result.data.map(item => { return { ...item, key: `${item.id}TRANSFER`, type: "TRANSFER" } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListPhieuThuTienGui.rejected, (state, action) => {
            console.log("getListPhieuThuTienGui.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getPhieuThuTienGui.pending, (state) => {
            console.log("getPhieuThuTienGui.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getPhieuThuTienGui.fulfilled, (state, action) => {
            console.log("getPhieuThuTienGui.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetPhieuThuTienGui = true;
            state.phieuThuTienGuiData =
            {
                ...action.payload.result.data,
                key: action.payload.result.data.id,
                paymentMethod: "TRANSFER",

                // salesperson: action.payload.result.data.donBanHang.salesperson.name,
                // address: action.payload.result.data.customer.address,
                // namecCustomer: action.payload.result.data.customer.name,

            };

            //   state.message = action.payload.message;
        })

        builder.addCase(getPhieuThuTienGui.rejected, (state, action) => {
            console.log("getPhieuThuTienGui.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postPhieuThuTienGui.pending, (state) => {
            console.log("postPhieuThuTienGui.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postPhieuThuTienGui.fulfilled, (state, action) => {
            console.log("postPhieuThuTienGui.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostPhieuThuTienGui = true;
            // state.chungTuBanData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postPhieuThuTienGui.rejected, (state, action) => {
            console.log("postPhieuThuTienGui.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

    }
});

export const { clearState, hoaDonSelected, donBanHangUploadFile } = banHangSlice.actions;

export const banHangSelector = (state) => state.banHang;