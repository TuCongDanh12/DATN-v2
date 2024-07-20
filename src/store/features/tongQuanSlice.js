import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";
import tongQuanService from './../../services/tongQuan.service';
import { VND } from "../../utils/func";
import congNoService from "../../services/congNo.service";
import baoCaoService from "../../services/baoCao.service";

export const getChartRevenueYear = createAsyncThunk(
    "tongQuan/getChartRevenueYear",
    async ({ values }, thunkAPI) => {
        try {
            const response = await tongQuanService.getChartRevenueYear({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getChartRevenueYearOld = createAsyncThunk(
    "tongQuan/getChartRevenueYearOld",
    async ({ values }, thunkAPI) => {
        try {
            const response = await tongQuanService.getChartRevenueYear({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getChartRevenueMonth = createAsyncThunk(
    "tongQuan/getChartRevenueMonth",
    async ({ values }, thunkAPI) => {
        try {
            const response = await tongQuanService.getChartRevenueMonth({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const getChartRevenueMonthOld = createAsyncThunk(
    "tongQuan/getChartRevenueMonthOld",
    async ({ values }, thunkAPI) => {
        try {
            const response = await tongQuanService.getChartRevenueMonth({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const getChartRevenueQuarter = createAsyncThunk(
    "tongQuan/getChartRevenueQuarter",
    async ({ values }, thunkAPI) => {
        try {
            const response = await tongQuanService.getChartRevenueQuarter({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getChartRevenueQuarterOld = createAsyncThunk(
    "tongQuan/getChartRevenueQuarterOld",
    async ({ values }, thunkAPI) => {
        try {
            const response = await tongQuanService.getChartRevenueQuarter({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);



export const getChartProduct = createAsyncThunk(
    "tongQuan/getChartProduct",
    async ({ values }, thunkAPI) => {
        try {
            const response = await tongQuanService.getChartProduct({ values });
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const postReportTHCNRaw = createAsyncThunk(
    "tongQuan/postReportTHCNRaw",
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






export const postReportDTBHRaw = createAsyncThunk(
    "tongQuan/postReportDTBHRaw",
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



const initialState = {
    isFetching: false,

    isSuccessGetChartRevenue: false,
    isSuccessGetChartRevenueOld: false,

    isSuccessGetChartProduct: false,

    isError: false,
    message: "",

    chartRevenueData: [],
    chartRevenueDataOld: [],
    chartProductData: [],
    reportTHCNData: [],
    isSuccessPostReportTHCNRaw: false,

    reportDTBHData: [],
    isSuccessPostReportDTBHRaw: false,


    noti: 0,
};


export const tongQuanSlice = createSlice({
    name: "tongQuan",
    initialState,
    reducers: {
        clearState: (state) => {
            state.isError = false;

            state.isSuccessGetChartRevenue = false;
            state.isSuccessGetChartRevenueOld = false;
            state.isSuccessGetChartProduct = false;
            state.isSuccessPostReportTHCNRaw = false;
            state.isSuccessPostReportDTBHRaw = false;

            state.isFetching = false;
            state.message = "";
            return state;
        },

        resetData: (state, action) => {
            state.chartRevenueData = [];
            state.chartRevenueDataOld = [];
            state.chartProductData = [];
            return state;
        },

        setNoti: (state, action) => {
            state.noti = action.payload;
            console.log("xxx", action)
            return state;
        }
    },

    extraReducers: (builder) => {
        builder.addCase(getChartRevenueYear.pending, (state) => {
            console.log("getChartRevenueYear.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getChartRevenueYear.fulfilled, (state, action) => {
            console.log("getChartRevenueYear.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetChartRevenue = true;

            state.chartRevenueData = action.payload.result.data.map(item => {
                return {
                    name: `Tháng ${item.month}`,
                    "Doanh thu năm nay": item.totalProductValue - item.totalDiscountValue,
                    key: item.month
                }
            }
            );
        })

        builder.addCase(getChartRevenueYear.rejected, (state, action) => {
            console.log("getChartRevenueYear.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })







        builder.addCase(getChartRevenueYearOld.pending, (state) => {
            console.log("getChartRevenueYearOld.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getChartRevenueYearOld.fulfilled, (state, action) => {
            console.log("getChartRevenueYearOld.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetChartRevenueOld = true;

            state.chartRevenueDataOld = action.payload.result.data.map(item => {
                return {
                    name: `Tháng ${item.month}`,
                    "Doanh thu năm trước": item.totalProductValue - item.totalDiscountValue,
                    key: item.month
                }
            }
            );
        })

        builder.addCase(getChartRevenueYearOld.rejected, (state, action) => {
            console.log("getChartRevenueYearOld.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })








        builder.addCase(getChartRevenueMonth.pending, (state) => {
            console.log("getChartRevenueMonth.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getChartRevenueMonth.fulfilled, (state, action) => {
            console.log("getChartRevenueMonth.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetChartRevenue = true;

            state.chartRevenueData = action.payload.result.data.map(item => {
                return {
                    name: `${item.day}`,
                    "Doanh thu năm nay": item.totalProductValue - item.totalDiscountValue,
                    key: item.day
                }
            }
            );
        })

        builder.addCase(getChartRevenueMonth.rejected, (state, action) => {
            console.log("getChartRevenueMonth.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })





        builder.addCase(getChartRevenueMonthOld.pending, (state) => {
            console.log("getChartRevenueMonthOld.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getChartRevenueMonthOld.fulfilled, (state, action) => {
            console.log("getChartRevenueMonthOld.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetChartRevenueOld = true;

            state.chartRevenueDataOld = action.payload.result.data.map(item => {
                return {
                    name: `${item.day}`,
                    "Doanh thu năm trước": item.totalProductValue - item.totalDiscountValue,
                    key: item.day
                }
            }
            );
        })

        builder.addCase(getChartRevenueMonthOld.rejected, (state, action) => {
            console.log("getChartRevenueMonthOld.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })





        builder.addCase(getChartRevenueQuarter.pending, (state) => {
            console.log("getChartRevenueQuarter.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getChartRevenueQuarter.fulfilled, (state, action) => {
            console.log("getChartRevenueQuarter.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetChartRevenue = true;

            state.chartRevenueData = action.payload.result.data.map(item => {
                return {
                    name: `Tháng ${item.month}`,
                    "Doanh thu năm nay": item.totalProductValue - item.totalDiscountValue,
                    key: item.day
                }
            }
            );
        })

        builder.addCase(getChartRevenueQuarter.rejected, (state, action) => {
            console.log("getChartRevenueQuarter.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })







        builder.addCase(getChartRevenueQuarterOld.pending, (state) => {
            console.log("getChartRevenueQuarterOld.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getChartRevenueQuarterOld.fulfilled, (state, action) => {
            console.log("getChartRevenueQuarterOld.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetChartRevenueOld = true;

            state.chartRevenueDataOld = action.payload.result.data.map(item => {
                return {
                    name: `Tháng ${item.month}`,
                    "Doanh thu năm trước": item.totalProductValue - item.totalDiscountValue,
                    key: item.day
                }
            }
            );
        })

        builder.addCase(getChartRevenueQuarterOld.rejected, (state, action) => {
            console.log("getChartRevenueQuarterOld.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
        })





        builder.addCase(getChartProduct.pending, (state) => {
            console.log("getChartProduct.pending", state)
            state.isFetching = true;
        })

        builder.addCase(getChartProduct.fulfilled, (state, action) => {
            console.log("getChartProduct.fulfilled", action.payload)
            state.isFetching = false;
            state.isSuccessGetChartProduct = true;

            state.chartProductData = action.payload.result.data

            // state.chartProductData = action.payload.result.data.map(item => {
            //     return {
            //         name: `Tháng ${item.month}`,
            //         "Doanh thu năm nay": item.totalProductValue - item.totalDiscountValue,
            //         key: item.month
            //     }
            // }
            // ).reverse();
        })

        builder.addCase(getChartProduct.rejected, (state, action) => {
            console.log("getChartProduct.rejected", action)
            state.isFetching = false;
            state.isError = true;
            // state.message = action.payload.message;
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


    }
});

export const { clearState, resetData, setNoti } = tongQuanSlice.actions;

export const tongQuanSelector = (state) => state.tongQuan;