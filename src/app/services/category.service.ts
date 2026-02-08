import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  private mockCategories: Category[] = [
    { categoryId: 1, name: 'Food & Dining', applicableTo: 'BOTH' as any },
    { categoryId: 2, name: 'Transportation', applicableTo: 'BOTH' as any },
    { categoryId: 3, name: 'Shopping', applicableTo: 'BOTH' as any },
    { categoryId: 4, name: 'Entertainment', applicableTo: 'PERSONAL' as any },
    { categoryId: 5, name: 'Utilities', applicableTo: 'BOTH' as any },
    { categoryId: 6, name: 'Healthcare', applicableTo: 'PERSONAL' as any },
    { categoryId: 7, name: 'Travel', applicableTo: 'BOTH' as any },
    { categoryId: 8, name: 'Office Supplies', applicableTo: 'ORGANIZATIONAL' as any }
  ];

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    if (environment.useMockData) {
      return of(this.mockCategories).pipe(delay(300));
    }
    return this.http.get<Category[]>(this.apiUrl);
  }
}
