import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AddTodo, Query, Todo } from "../../types/types";
import {
  addTask,
  deleteTaskById,
  fetchAllTasks,
  updateTask,
} from "../../core/tasks";

export const fetchAll = createAsyncThunk(
  "todo/fetchAll",
  async (query: Query) => {
    const data = await fetchAllTasks(query);
    return data;
  }
);

export const deleteTodo = createAsyncThunk(
  "todo/deleteTask",
  async (id: number) => {
    const data = await deleteTaskById(id);
    return data;
  }
);

export const addTodo = createAsyncThunk(
  "todo/addTodo",
  async (todo: AddTodo) => {
    const data = await addTask(todo);
    return data;
  }
);

export const updateTodo = createAsyncThunk(
  "todo/updateTodo",
  async (todo: Todo) => {
    const data = await updateTask(todo);
    return data;
  }
);

interface TasksState {
  todoList: Todo[];
  loading: boolean;
  error: boolean;
  loadingDelete: boolean;
  errorDelete: boolean;
  filterStatus: string;
  loadingUpdate: boolean;
  loadingAdd: boolean;
  errorAddOrUpdate: boolean;
  count: number;
  page: number;
  limit: number;
}

const initialValue = {
  filterStatus: "all",
  todoList: [],
  loading: false,
  error: false,
  loadingDelete: false,
  errorDelete: false,
  loadingUpdate: false,
  loadingAdd: false,
  errorAddOrUpdate: false,
  count: 0,
  page: 1,
  limit: 7,
} as TasksState;

export const todoSlice = createSlice({
  name: "todo",
  initialState: initialValue,
  reducers: {
    updateFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
    updatePages: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAll.pending, (state) => {
      state.todoList = [];
      state.loading = true;
    }),
      builder.addCase(fetchAll.fulfilled, (state, action) => {
        const [tasks, count] = action.payload;
        state.todoList = tasks;
        state.count = count;
        state.loading = false;
      });
    builder.addCase(fetchAll.rejected, (state) => {
      state.todoList = [];
      state.error = true;
      state.loading = false;
      state.count = 0;
    });

    builder.addCase(deleteTodo.pending, (state) => {
      state.errorDelete = false;
      state.loadingDelete = true;
    }),
      builder.addCase(deleteTodo.fulfilled, (state, action) => {
        state.todoList = state.todoList.filter(
          (task) => task.id !== action.payload.id
        );
        state.loadingDelete = false;
      });
    builder.addCase(deleteTodo.rejected, (state) => {
      state.errorDelete = true;
      state.loadingDelete = false;
    });

    builder.addCase(addTodo.pending, (state) => {
      state.loadingAdd = true;
    }),
      builder.addCase(addTodo.fulfilled, (state, action) => {
        if (state.todoList.length === state.limit) {
          state.todoList = state.todoList.slice(0, 9);
        }
        state.todoList.unshift(action.payload);
        state.loadingAdd = false;
      });
    builder.addCase(addTodo.rejected, (state) => {
      state.loadingAdd = false;
      state.errorAddOrUpdate = true;
    });

    builder.addCase(updateTodo.pending, (state) => {
      state.loadingUpdate = true;
    }),
      builder.addCase(updateTodo.fulfilled, (state, action) => {
        state.todoList = state.todoList.map((todo: Todo) =>
          todo.id === action.payload.id ? action.payload : todo
        );
        state.loadingUpdate = false;
      });
    builder.addCase(updateTodo.rejected, (state) => {
      state.loadingUpdate = false;
      state.errorAddOrUpdate = true;
    });
  },
});
export const { updateFilterStatus, updatePages } = todoSlice.actions;
export default todoSlice.reducer;
