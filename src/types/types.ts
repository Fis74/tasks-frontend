export type Todo = {
  id: number;
  title: string;
  status: Status;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export enum Status {
  success = "success",
  pending = "pending",
  progress = "progress",
  all = "all",
}

export enum Type {
  add = "add",
  update = "update",
}

export type AddTodo = {
  title: string;
  status: string;
  description: string;
};

export type Data = [Todo[], number];

export type Query = {
  page: number;
  limit: number;
  status: Status;
};
