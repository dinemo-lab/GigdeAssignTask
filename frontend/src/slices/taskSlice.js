import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async ({ projectId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/projects/${projectId}/tasks`, 
        taskData, 
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ projectId, taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/projects/${projectId}/tasks/${taskId}`, 
        taskData, 
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_URL}/projects/${projectId}/tasks/${taskId}`, 
        getAuthHeader()
      );
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;