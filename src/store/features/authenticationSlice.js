import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";

export const signupUser = createAsyncThunk(
  "authentication/signupUser",
  async ({ username, email, address, phoneNumber, password, avatar }, thunkAPI) => {
    try {
      const response = await authService.register(username, email, address, phoneNumber, password, avatar);
      // thunkAPI.dispatch(setMessage(response.data.message));
      // console.log(response)
      return response.data;
    } catch (error) {
      // console.log(error)
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "authentication/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await authService.login(email, password);
      // console.log(data)
      // thunkAPI.dispatch(setMessage("Đăng nhập thành công!"));
      return { user: data };
    } catch (error) {
      // console.log(error)
      // const message =
      //   (error.response &&
      //     error.response.data &&
      //     error.response.data.message) ||
      //   error.message ||
      //   error.toString();
      // thunkAPI.dispatch(setMessage(message));
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


export const getProfile = createAsyncThunk(
  "authentication/getProfile",
  async (thunkAPI) => {
    try {
      const response = await authService.getProfile();
      // console.log("response", response);
      return response.data;
    } catch (error) {
      // console.log("error", error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "doiTuong/updateProfile",
  async ({ values }, thunkAPI) => {
    try {
      const response = await authService.updateProfile({ values });
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
  isError: false,
  message: "",
  profile: {}

};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      state.message = "";
      return state;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(signupUser.pending, (state) => {
      console.log("signupUser.pending", state)
      state.isFetching = true;
    })

    builder.addCase(signupUser.fulfilled, (state, action) => {
      console.log("signupUser.fulfilled", action.payload.message)
      state.isFetching = false;
      state.isSuccess = true;
      state.message = action.payload.message;
    })

    builder.addCase(signupUser.rejected, (state, action) => {
      console.log("signupUser.rejected", action)
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload.error;
    })

    builder.addCase(loginUser.pending, (state) => {
      console.log("loginUser.pending", state)
      state.isFetching = true;
    })

    builder.addCase(loginUser.fulfilled, (state, action) => {
      console.log("loginUser.fulfilled", action.payload.message)
      state.isFetching = false;
      state.isSuccess = true;
    })

    builder.addCase(loginUser.rejected, (state, action) => {
      console.log("loginUser.rejected", action)
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload.message;
    })

    builder.addCase(logout.pending, (state) => {
      console.log("logout.pending", state)
      state.isFetching = true;
    })

    builder.addCase(logout.fulfilled, (state, action) => {
      console.log("logout.fulfilled", action.payload.message)
      state.message = action.payload.message;
    })

    builder.addCase(logout.rejected, (state, action) => {
      console.log("logout.rejected", action)
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload.message;
    })






    builder.addCase(getProfile.pending, (state) => {
      console.log("getProfile.pending", state)
      state.isFetching = true;
    })

    builder.addCase(getProfile.fulfilled, (state, action) => {
      console.log("getProfile.fulfilled", action.payload)
      state.isFetching = false;
      // state.isSuccessGetDonBanHang = true;
      // state.profile = action.payload.result.data;

      //   state.message = action.payload.message;
    })

    builder.addCase(getProfile.rejected, (state, action) => {
      console.log("getProfile.rejected", action)
      state.isFetching = false;
      state.isError = true;
      // state.message = action.payload.message;
    })






    builder.addCase(updateProfile.pending, (state) => {
      console.log("updateProfile.pending", state)
      state.isFetching = true;
    })

    builder.addCase(updateProfile.fulfilled, (state, action) => {
      console.log("updateProfile.fulfilled", action.payload)
      state.isFetching = false;
      state.isSuccess = true;
      // state.profile = action.payload.result.data;

      //   state.message = action.payload.message;
    })

    builder.addCase(updateProfile.rejected, (state, action) => {
      console.log("updateProfile.rejected", action)
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload.error;
    })
  },
});

export const { clearState, setIsLogin } = authenticationSlice.actions;

export const authenticationSelector = (state) => state.authentication;