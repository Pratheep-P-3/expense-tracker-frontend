import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Expense } from '../models/expense.model';
import { ExpenseRequest } from '../models/request.model';
import { ExpenseType } from '../models/expense-type.enum';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  private mockExpenses: Expense[] = [
    {
      expenseId: 1,
      userId: 1,
      username: 'demo',
      categoryId: 1,
      categoryName: 'Food & Dining',
      description: 'Lunch at restaurant',
      amount: 45.50,
      expenseDate: '2026-02-01',
      expenseType: ExpenseType.PERSONAL,
      createdAt: '2026-02-01T12:00:00Z'
    },
    {
      expenseId: 2,
      userId: 1,
      username: 'demo',
      categoryId: 2,
      categoryName: 'Transportation',
      description: 'Gas for car',
      amount: 60.00,
      expenseDate: '2026-02-02',
      expenseType: ExpenseType.PERSONAL,
      createdAt: '2026-02-02T08:30:00Z'
    },
    {
      expenseId: 3,
      userId: 1,
      username: 'demo',
      categoryId: 8,
      categoryName: 'Office Supplies',
      description: 'Printer paper and ink',
      amount: 85.00,
      expenseDate: '2026-02-03',
      expenseType: ExpenseType.ORGANIZATIONAL,
      createdAt: '2026-02-03T14:15:00Z'
    },
    {
      expenseId: 4,
      userId: 1,
      username: 'demo',
      categoryId: 3,
      categoryName: 'Shopping',
      description: 'New laptop',
      amount: 1200.00,
      expenseDate: '2026-02-04',
      expenseType: ExpenseType.ORGANIZATIONAL,
      createdAt: '2026-02-04T10:00:00Z'
    },
    {
      expenseId: 5,
      userId: 1,
      username: 'demo',
      categoryId: 4,
      categoryName: 'Entertainment',
      description: 'Movie tickets',
      amount: 30.00,
      expenseDate: '2026-02-05',
      expenseType: ExpenseType.PERSONAL,
      createdAt: '2026-02-05T19:00:00Z'
    },
    {
      expenseId: 6,
      userId: 1,
      username: 'demo',
      categoryId: 1,
      categoryName: 'Food & Dining',
      description: 'Team lunch meeting',
      amount: 150.00,
      expenseDate: '2026-02-05',
      expenseType: ExpenseType.ORGANIZATIONAL,
      createdAt: '2026-02-05T13:00:00Z'
    },
    {
      expenseId: 7,
      userId: 1,
      username: 'demo',
      categoryId: 5,
      categoryName: 'Utilities',
      description: 'Internet bill',
      amount: 75.00,
      expenseDate: '2026-02-01',
      expenseType: ExpenseType.PERSONAL,
      createdAt: '2026-02-01T09:00:00Z'
    },
    {
      expenseId: 8,
      userId: 1,
      username: 'demo',
      categoryId: 7,
      categoryName: 'Travel',
      description: 'Business flight',
      amount: 450.00,
      expenseDate: '2026-01-28',
      expenseType: ExpenseType.ORGANIZATIONAL,
      createdAt: '2026-01-28T06:00:00Z'
    },
    {
      expenseId: 9,
      userId: 1,
      username: 'demo',
      categoryId: 6,
      categoryName: 'Healthcare',
      description: 'Dental checkup',
      amount: 120.00,
      expenseDate: '2026-01-30',
      expenseType: ExpenseType.PERSONAL,
      createdAt: '2026-01-30T15:00:00Z'
    },
    {
      expenseId: 10,
      userId: 1,
      username: 'demo',
      categoryId: 2,
      categoryName: 'Transportation',
      description: 'Taxi to airport',
      amount: 35.00,
      expenseDate: '2026-01-28',
      expenseType: ExpenseType.ORGANIZATIONAL,
      createdAt: '2026-01-28T05:00:00Z'
    },
    {
      expenseId: 11,
      userId: 1,
      username: 'demo',
      categoryId: 1,
      categoryName: 'Food & Dining',
      description: 'Grocery shopping',
      amount: 95.50,
      expenseDate: '2026-02-06',
      expenseType: ExpenseType.PERSONAL,
      createdAt: '2026-02-06T11:00:00Z'
    },
    {
      expenseId: 12,
      userId: 1,
      username: 'demo',
      categoryId: 3,
      categoryName: 'Shopping',
      description: 'Clothing',
      amount: 180.00,
      expenseDate: '2026-02-04',
      expenseType: ExpenseType.PERSONAL,
      createdAt: '2026-02-04T16:00:00Z'
    }
  ];

  private nextExpenseId = 13;

  constructor(private http: HttpClient) { }

  createExpense(expenseRequest: ExpenseRequest): Observable<Expense> {
    if (environment.useMockData) {
      const newExpense: Expense = {
        expenseId: this.nextExpenseId++,
        userId: expenseRequest.userId,
        username: 'demo',
        categoryId: expenseRequest.categoryId,
        categoryName: this.getCategoryName(expenseRequest.categoryId),
        description: expenseRequest.description,
        amount: expenseRequest.amount,
        expenseDate: expenseRequest.expenseDate,
        expenseType: expenseRequest.expenseType,
        createdAt: new Date().toISOString()
      };
      this.mockExpenses.push(newExpense);
      return of(newExpense).pipe(delay(300));
    }
    return this.http.post<Expense>(this.apiUrl, expenseRequest);
  }

  updateExpense(expenseId: number, expenseRequest: ExpenseRequest): Observable<Expense> {
    if (environment.useMockData) {
      const index = this.mockExpenses.findIndex(e => e.expenseId === expenseId);
      if (index !== -1) {
        const updatedExpense: Expense = {
          ...this.mockExpenses[index],
          categoryId: expenseRequest.categoryId,
          categoryName: this.getCategoryName(expenseRequest.categoryId),
          description: expenseRequest.description,
          amount: expenseRequest.amount,
          expenseDate: expenseRequest.expenseDate,
          expenseType: expenseRequest.expenseType
        };
        this.mockExpenses[index] = updatedExpense;
        return of(updatedExpense).pipe(delay(300));
      }
    }
    return this.http.put<Expense>(`${this.apiUrl}/${expenseId}`, expenseRequest);
  }

  deleteExpense(expenseId: number): Observable<void> {
    if (environment.useMockData) {
      const index = this.mockExpenses.findIndex(e => e.expenseId === expenseId);
      if (index !== -1) {
        this.mockExpenses.splice(index, 1);
      }
      return of(void 0).pipe(delay(300));
    }
    return this.http.delete<void>(`${this.apiUrl}/${expenseId}`);
  }

  getExpenseById(expenseId: number): Observable<Expense> {
    if (environment.useMockData) {
      const expense = this.mockExpenses.find(e => e.expenseId === expenseId);
      return of(expense!).pipe(delay(300));
    }
    return this.http.get<Expense>(`${this.apiUrl}/${expenseId}`);
  }

  getAllExpenses(
    userId: number,
    type?: ExpenseType,
    startDate?: string,
    endDate?: string,
    categoryId?: number
  ): Observable<Expense[]> {
    if (environment.useMockData) {
      return of(this.mockExpenses).pipe(
        delay(500),
        map(expenses => {
          let filtered = expenses.filter(e => e.userId === userId);

          if (type) {
            filtered = filtered.filter(e => e.expenseType === type);
          }

          if (categoryId) {
            filtered = filtered.filter(e => e.categoryId === categoryId);
          }

          if (startDate) {
            filtered = filtered.filter(e => e.expenseDate >= startDate);
          }

          if (endDate) {
            filtered = filtered.filter(e => e.expenseDate <= endDate);
          }

          return filtered;
        })
      );
    }

    let params = new HttpParams().set('userId', userId.toString());

    if (type) {
      params = params.set('type', type);
    }
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }

    return this.http.get<Expense[]>(this.apiUrl, { params });
  }

  private getCategoryName(categoryId: number): string {
    const categoryMap: { [key: number]: string } = {
      1: 'Food & Dining',
      2: 'Transportation',
      3: 'Shopping',
      4: 'Entertainment',
      5: 'Utilities',
      6: 'Healthcare',
      7: 'Travel',
      8: 'Office Supplies'
    };
    return categoryMap[categoryId] || 'Other';
  }
}
