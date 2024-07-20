import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";
import baoCaoService from './../../services/baoCao.service';



export const getListReportDTBH = createAsyncThunk(
    "baoCao/getListReportDTBH",
    async (thunkAPI) => {
        try {
            const response = await baoCaoService.getListReportDTBH();
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);



export const getReportDTBH = createAsyncThunk(
    "baoCao/getReportDTBH",
    async ({ id }, thunkAPI) => {
        try {
            const response = await baoCaoService.getReportDTBH({ id });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postReportDTBH = createAsyncThunk(
    "baoCao/postReportDTBH",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await baoCaoService.postReportDTBH({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postReportDTBHRaw = createAsyncThunk(
    "baoCao/postReportDTBHRaw",
    async ({ values }, thunkAPI) => {
        try {
            console.log("values", values)
            const response = await baoCaoService.postReportDTBHRaw({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const getListSalesPerson = createAsyncThunk(
    "baoCao/getListSalesPerson",
    async (thunkAPI) => {
        try {
            const response = await baoCaoService.getListSalesPerson();
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

    isSuccessGetListReportDTBH: false,
    isSuccessGetReportDTBH: false,
    isSuccessPostReportDTBH: false,
    isSuccessPostReportDTBHRaw: false,

    isSuccessGetListSalesPerson: false,

    isError: false,
    message: "",

    listReportDTBHData: [],
    reportDTBHData: [],

    description: {},

    listSalesPersonData: [],
};


export const baoCaoSlice = createSlice({
    name: "baoCao",
    initialState,
    reducers: {
        clearState: (state) => {
            state.isError = false;

            state.isSuccessGetListCongNo = false;

            state.isSuccessGetListReportDTBH = false;
            state.isSuccessGetReportDTBH = false;
            state.isSuccessPostReportDTBH = false;
            state.isSuccessPostReportDTBHRaw = false;

            state.isSuccessGetListSalesPerson = false;

            state.isFetching = false;
            state.message = "";
            return state;
        },

        resetData: (state, action) => {
            state.reportDTBHData = [];
            return state;
        }
    },

    extraReducers: (builder) => {
        builder.addCase(getListReportDTBH.pending, (state) => {
            console.log("getListReportDTBH.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListReportDTBH.fulfilled, (state, action) => {
            console.log("getListReportDTBH.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListReportDTBH = true;

            state.listReportDTBHData = action.payload.result.data.map(item => {
                if (item?.name?.split(" ")[0] === "Chi") {
                    return { ...item, key: item.id, type: "DTBH", time: `Từ ${item.startDate} đến ${item.endDate}` }
                }
                return { ...item, key: item.id, type: "THDTBH", time: `Từ ${item.startDate} đến ${item.endDate}` }
            });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListReportDTBH.rejected, (state, action) => {
            console.log("getListReportDTBH.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })

        builder.addCase(getReportDTBH.pending, (state) => {
            console.log("getReportDTBH.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getReportDTBH.fulfilled, (state, action) => {
            console.log("getReportDTBH.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetReportDTBH = true;
            state.reportDTBHData = action.payload.result.data?.reportDtbhDetails;
            state.description = action.payload.result.data;
            // key: action.payload.result.data.reportDtbhDetails.id,


            //   state.message = action.payload.message;
        })

        builder.addCase(getReportDTBH.rejected, (state, action) => {
            console.log("getReportDTBH.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })

        builder.addCase(postReportDTBH.pending, (state) => {
            console.log("postReportDTBH.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postReportDTBH.fulfilled, (state, action) => {
            console.log("postReportDTBH.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostReportDTBH = true;
            // state.reportDTBHData = action.payload;
            //   state.message = action.payload.message;
        })

        builder.addCase(postReportDTBH.rejected, (state, action) => {
            console.log("postReportDTBH.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })



        builder.addCase(postReportDTBHRaw.pending, (state) => {
            console.log("postReportDTBHRaw.pending", state)
            state.isFetching = true;
        })

        builder.addCase(postReportDTBHRaw.fulfilled, (state, action) => {
            console.log("postReportDTBHRaw.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessPostReportDTBHRaw = true;
            state.reportDTBHData = action.payload.result.data;
            //   state.message = action.payload.message;
        })

        builder.addCase(postReportDTBHRaw.rejected, (state, action) => {
            console.log("postReportDTBHRaw.rejected", action)
            state.isFetching = false;
            state.isError = true;
            state.message = action.payload.message;
        })





        builder.addCase(getListSalesPerson.pending, (state) => {
            console.log("getListSalesPerson.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getListSalesPerson.fulfilled, (state, action) => {
            console.log("getListSalesPerson.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetListSalesPerson = true;
            state.listSalesPersonData = action.payload.result.data.map(item => { return { ...item, key: item.id } });
            //   state.message = action.payload.message;
        })

        builder.addCase(getListSalesPerson.rejected, (state, action) => {
            console.log("getListSalesPerson.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })
    }
});

export const { clearState, resetData } = baoCaoSlice.actions;

export const baoCaoSelector = (state) => state.baoCao;