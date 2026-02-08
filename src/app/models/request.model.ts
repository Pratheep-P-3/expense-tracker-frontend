import { ExpenseType } from './expense-type.enum';

export interface UserRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ExpenseRequest {
  amount: number;
  expenseDate: string;
  description: string;
  expenseType: ExpenseType;
  userId: number;
  categoryId: number;
}
