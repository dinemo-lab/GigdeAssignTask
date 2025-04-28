import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch projects');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/projects`, projectData, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to create project');
    }
  }
);

export const getProjectById = createAsyncThunk(
  'projects/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch project');
    }
  }
);


export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (projectId, { rejectWithValue }) => {
      try {
        await axios.delete(`${API_URL}/projects/${projectId}`,getAuthHeader());
        return projectId;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload
        );
      });
      ;
  }
});

export const { clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;