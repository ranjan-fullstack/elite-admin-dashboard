import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsersAPI,
  addUserAPI,
  deleteUserAPI,
  updateUserAPI,
} from "../../services/userService";
import { showSuccess, showError } from "../../utils/toast";


/* 🔥 Async Thunks */

// FETCH USERS
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUsersAPI();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ADD USER
export const addUserAsync = createAsyncThunk(
  "users/addUser",
  async (user, { rejectWithValue }) => {
    try {
      return await addUserAPI(user);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// DELETE USER
export const deleteUserAsync = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteUserAPI(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATE USER
export const updateUserAsync = createAsyncThunk(
  "users/updateUser",
  async (updatedUser, { rejectWithValue }) => {
    try {
      return await updateUserAPI(updatedUser);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* 🔥 Slice */

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showError("Failed to fetch users");
      })

      // ADD
      .addCase(addUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        showSuccess("User added successfully");
      })
      .addCase(addUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload
        );
        showSuccess("User deleted successfully");
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
