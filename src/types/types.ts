export type Todo = {
  id: number;
  title: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type Status = "success" | "pending" | "progress";

export type AddTodo = {
  title: string;
  status: string;
  description: string;
};

export type Data = [Todo[], number];

export type Query = {
  page: number;
  limit: number;
  status: string;
};
