import { AddTodo, Data, Query, Status, Todo } from "../types/types";
import axios from "./axios";

export const fetchAllTasks = async (query: Query): Promise<Data> => {
  return (
    await axios.get(
      `/tasks?page=${query.page}&limit=${query.limit}${
        query.status !== Status.all ? `&status=${query.status}` : ""
      }`
    )
  ).data;
};

export const deleteTaskById = async (id: number): Promise<Todo> => {
  return (await axios.delete(`/tasks/${id}`)).data;
};

export const addTask = async (task: AddTodo): Promise<Todo> => {
  return (await axios.post(`/tasks`, task)).data;
};

export const updateTask = async (task: Todo): Promise<Todo> => {
  return (await axios.patch(`/tasks/${task.id}`, task)).data;
};
