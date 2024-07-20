import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";
import banHangService from "../../services/banHang.service";
import congNoService from "../../services/congNo.service";

export const getListCongNo = createAsyncThunk(
    "congNo/getListCongNo",
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









export const getListReportDCCN = createAsyncThunk(
    "congNo/getListReportDCCN",
    async (thunkAPI) => {
        try {
            const response = await congNoService.getListReportDCCN();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);




export const getReportDCCN = createAsyncThunk(
    "congNo/getReportDCCN",
    async ({ id }, thunkAPI) => {
        try {
            const response = await congNoService.getReportDCCN({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postReportDCCN = createAsyncThunk(
    "congNo/postReportDCCN",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await congNoService.postReportDCCN({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postReportDCCNRaw = createAsyncThunk(
    "congNo/postReportDCCNRaw",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await congNoService.postReportDCCNRaw({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deleteReportDCCN = createAsyncThunk(
    "congNo/deleteReportDCCN",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await congNoService.deleteReportDCCN({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);




export const getListReportTHCN = createAsyncThunk(
    "congNo/getListReportTHCN",
    async (thunkAPI) => {
        try {
            const response = await congNoService.getListReportTHCN();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getReportTHCN = createAsyncThunk(
    "congNo/getReportTHCN",
    async ({ id }, thunkAPI) => {
        try {
            const response = await congNoService.getReportTHCN({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postReportTHCN = createAsyncThunk(
    "congNo/postReportTHCN",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await congNoService.postReportTHCN({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postReportTHCNRaw = createAsyncThunk(
    "congNo/postReportTHCNRaw",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await congNoService.postReportTHCNRaw({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const deleteReportTHCN = createAsyncThunk(
    "congNo/deleteReportTHCN",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await congNoService.deleteReportTHCN({ values });
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

    isSuccessGetListCongNo: false,

    isSuccessGetListReportDCCN: false,
    isSuccessGetReportDCCN: false,
    isSuccessPostReportDCCN: false,
    isSuccessPostReportDCCNRaw: false,
    isSuccessDeleteReportDCCN: false,


    isSuccessGetListReportTHCN: false,
    isSuccessGetReportTHCN: false,
    isSuccessPostReportTHCN: false,
    isSuccessPostReportTHCNRaw: false,
    isSuccessDeleteReportTHCN: false,


    isError: false,
    message: "",

    listCongNo: [],

    listReportDCCNData: [],
    reportDCCNData: [],

    listReportTHCNData: [],
    reportTHCNData: [],

    description: {}
};


export const congNoSlice = createSlice({
    name: "congNo",
    initialState,
    reducers: {
        clearState: (state) => {
            state.isError = false;

            state.isSuccessGetListCongNo = false;

            state.isSuccessGetListReportDCCN = false;
            state.isSuccessGetReportDCCN = false;
            state.isSuccessPostReportDCCN = false;
            state.isSuccessPostReportDCCNRaw = false;
            state.isSuccessDeleteReportDCCN = false;

            state.isSuccessGetListReportTHCN = false;
            state.isSuccessGetReportTHCN = false;
            state.isSuccessPostReportTHCN = false;
            state.isSuccessPostReportTHCNRaw = false;
            state.isSuccessDeleteReportTHCN = false;

            state.isFetching = false;
            state.message = "";
            return state;
        },

        resetData: (state, action) => {
            state.reportDCCNData = [];
            state.reportTHCNData = [];
            return state;
        }
    },

    extraReducers: (builder) => {
        builder.addCase(getListCongNo.pending, (state) => {
            console.log("getListCongNo.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListCongNo.fulfilled, (state, action) => {
            console.log("getListCongNo.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListCongNo = true;

            const dataAddKey = action.payload.result.data.map(item => { return { ...item, key: item.id } });

            const dataSet = new Set();
            dataAddKey.forEach(hoaDon => {
                dataSet.add(hoaDon.donBanHang.customer.id);
            })

            const dataFilter_PaymentStatus_BEING_PAID_NOT_PAID = dataAddKey.filter(hoaDon => hoaDon.paymentStatus === "BEING_PAID" || hoaDon.paymentStatus === "NOT_PAID")

            let dataConvert = {};

            dataFilter_PaymentStatus_BEING_PAID_NOT_PAID.forEach(hoaDon => {
                if (!dataConvert[hoaDon.donBanHang.customer.id]) {
                    dataConvert[hoaDon.donBanHang.customer.id] = [hoaDon]
                }
                else {
                    dataConvert[hoaDon.donBanHang.customer.id].push(hoaDon);
                }
            })

            let results = []

            Object.entries(dataConvert).forEach(([key, value]) => results.push(value))

            // for (const item of dataFilter_PaymentStatus_BEING_PAID_NOT_PAID) {
            //     const { id } = item.donBanHang.customer.id;

            //     // Kiểm tra nếu id có trong dataSet
            //     if (dataSet.has(id)) {
            //       // Nếu chưa có danh sách các phần tử cho id này, khởi tạo một danh sách rỗng
            //       if (!dataConvert[id]) {
            //         dataConvert[id] = [];
            //       }

            //       // Thêm phần tử vào danh sách của id tương ứng
            //       dataConvert[id].push(item);
            //     }
            //   }

            // dataSet.forEach(data => dataConvert.set(data:[]))

            // dataFilter_PaymentStatus_BEING_PAID_NOT_PAID.map(item => {
            //     return {
            //         hoaDon.donBanHang.customer.id:
            //     }
            // })

            console.log("results", results)

            state.listCongNo = results;
        })

        builder.addCase(getListCongNo.rejected, (state, action) => {
            console.log("getListCongNo.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })












        builder.addCase(getListReportDCCN.pending, (state) => {
            console.log("getListReportDCCN.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListReportDCCN.fulfilled, (state, action) => {
            console.log("getListReportDCCN.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListReportDCCN = true;

            state.listReportDCCNData = action.payload.result.data.map(item => { return { ...item, key: `${item.id}DCCN`, type: "DCCN", time: `Từ ${item.startDate} đến ${item.endDate}` } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListReportDCCN.rejected, (state, action) => {
            console.log("getListReportDCCN.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getReportDCCN.pending, (state) => {
            console.log("getReportDCCN.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getReportDCCN.fulfilled, (state, action) => {
            console.log("getReportDCCN.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetReportDCCN = true;
            state.reportDCCNData = action.payload.result.data?.reportDccnDetails;
            state.description = action.payload.result.data;
            // key: action.payload.result.data.reportDccnDetails.id,


            //   state.message = action.payload.message;
        })

        builder.addCase(getReportDCCN.rejected, (state, action) => {
            console.log("getReportDCCN.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postReportDCCN.pending, (state) => {
            console.log("postReportDCCN.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postReportDCCN.fulfilled, (state, action) => {
            console.log("postReportDCCN.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostReportDCCN = true;
            // state.reportDCCNData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postReportDCCN.rejected, (state, action) => {
            console.log("postReportDCCN.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })



        builder.addCase(postReportDCCNRaw.pending, (state) => {
            console.log("postReportDCCNRaw.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postReportDCCNRaw.fulfilled, (state, action) => {
            console.log("postReportDCCNRaw.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostReportDCCNRaw = true;
            state.reportDCCNData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(postReportDCCNRaw.rejected, (state, action) => {
            console.log("postReportDCCNRaw.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })



        builder.addCase(deleteReportDCCN.pending, (state) => {
            console.log("deleteReportDCCN.pending", state)
            state.isFetching = true;
        })

        builder.addCase(deleteReportDCCN.fulfilled, (state, action) => {
            console.log("deleteReportDCCN.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessDeleteReportDCCN = true;
            // state.customerGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(deleteReportDCCN.rejected, (state, action) => {
            console.log("deleteReportDCCN.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })









        builder.addCase(getListReportTHCN.pending, (state) => {
            console.log("getListReportTHCN.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListReportTHCN.fulfilled, (state, action) => {
            console.log("getListReportTHCN.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListReportTHCN = true;

            state.listReportTHCNData = action.payload.result.data.map(item => { return { ...item, key: `${item.id}THCN`, type: "THCN", time: `Từ ${item.startDate} đến ${item.endDate}` } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListReportTHCN.rejected, (state, action) => {
            console.log("getListReportTHCN.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getReportTHCN.pending, (state) => {
            console.log("getReportTHCN.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getReportTHCN.fulfilled, (state, action) => {
            console.log("getReportTHCN.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetReportTHCN = true;
            state.reportTHCNData = action.payload.result.data?.reportThcnDetails;
            state.description = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(getReportTHCN.rejected, (state, action) => {
            console.log("getReportTHCN.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postReportTHCN.pending, (state) => {
            console.log("postReportTHCN.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postReportTHCN.fulfilled, (state, action) => {
            console.log("postReportTHCN.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostReportTHCN = true;
            // state.reportTHCNData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postReportTHCN.rejected, (state, action) => {
            console.log("postReportTHCN.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })



        builder.addCase(postReportTHCNRaw.pending, (state) => {
            console.log("postReportTHCNRaw.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postReportTHCNRaw.fulfilled, (state, action) => {
            console.log("postReportTHCNRaw.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostReportTHCNRaw = true;
            state.reportTHCNData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(postReportTHCNRaw.rejected, (state, action) => {
            console.log("postReportTHCNRaw.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })



        builder.addCase(deleteReportTHCN.pending, (state) => {
            console.log("deleteReportTHCN.pending", state)
            state.isFetching = true;
        })

        builder.addCase(deleteReportTHCN.fulfilled, (state, action) => {
            console.log("deleteReportTHCN.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessDeleteReportTHCN = true;
            // state.customerGroupData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(deleteReportTHCN.rejected, (state, action) => {
            console.log("deleteReportTHCN.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })


    }
});

export const { clearState, resetData } = congNoSlice.actions;

export const congNoSelector = (state) => state.congNo;