import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";
import muahangService from "../../services/muahang.service";

export const getListDonMuahang = createAsyncThunk(
  "muahang/getListDonMuahang",
  async ({ requestParam }, thunkAPI) => {
    try {
      const response = await muahangService.getListDonMuahang({ requestParam });
      // console.log(response)
      return response.data;
    } catch (error) {
      // console.log("error",error)
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const logout = createAsyncThunk(
  "authentication/logout",
  async (thunkAPI) => {
    try {
      const response = await authService.logout();
      localStorage.removeItem("user");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isFetching: false,
  isSuccess: false,
  isSuccessGetListDonMuahang: false,
  isError: false,
  message: "",
  listDonMuahangData: [],
  pagination: {}
};

export const muahangSlice = createSlice({
  name: "muahang",
  initialState,
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isSuccessGetListDonMuahang = false;
      state.isFetching = false;
      state.message = "";
      return state;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getListDonMuahang.pending, (state) => {
      console.log("getListDonMuahang.pending", state)
      state.isFetching = true;
    })

    builder.addCase(getListDonMuahang.fulfilled, (state, action) => {
      console.log("getListDonMuahang.fulfilled", action.payload)
      state.isFetching = false;
      state.isSuccessGetListDonMuahang = true;
      state.pagination = action.payload.meta.pagination;
      state.listDonMuahangData = action.payload.result.data;
      // state.listDonMuahangData = action.payload;
      // state.message = action.payload.message;
    })

    builder.addCase(getListDonMuahang.rejected, (state, action) => {
      console.log("getListDonMuahang.rejected", action)
      state.isFetching = false;
      state.isError = true;
      //   state.message = action.payload.message;
    })


  },
});

export const { clearState } = muahangSlice.actions;

export const muahangSelector = (state) => state.muahang;