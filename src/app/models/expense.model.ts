import { ExpenseType } from './expense-type.enum';

export interface Expense {
  expenseId: number;
  amount: number;
  expenseDate: string;
  description: string;
  expenseType: ExpenseType;
  createdAt: string;
  userId: number;
  username: string;
  categoryId: number;
  categoryName: string;
}
