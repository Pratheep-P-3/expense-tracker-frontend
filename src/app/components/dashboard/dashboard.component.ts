import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';
import { User } from '../../models/user.model';
import { Expense } from '../../models/expense.model';
import { Category } from '../../models/category.model';
import { ExpenseType } from '../../models/expense-type.enum';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('expenseChart') expenseChartRef!: ElementRef<HTMLCanvasElement>;

  currentUser: User | null = null;
  expenses: Expense[] = [];
  categories: Category[] = [];
  loading = false;
  chart: Chart | null = null;

  // Filter properties
  selectedType: ExpenseType | '' = '';
  selectedCategoryId: number | null = null;
  startDate: string = '';
  endDate: string = '';

  // Summary properties
  totalExpenses = 0;
  personalTotal = 0;
  organizationalTotal = 0;
  maxDate: string; // For HTML max attribute on date inputs

  ExpenseType = ExpenseType; // Make enum available in template

  constructor(
    private authService: AuthService,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    // Set max date to today for filters
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.loadCategories();
      this.loadExpenses();
    }
  }

  ngAfterViewInit(): void {
    // Chart will be initialized after first data load
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  initializeChart(): void {
    if (!this.expenseChartRef) return;

    const ctx = this.expenseChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const chartData = this.prepareChartData();

    const config: ChartConfiguration = {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          title: {
            display: true,
            text: 'Expenses by Category',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                return value !== null ? `${label}: ₹${value.toFixed(2)}` : `${label}: ₹0.00`;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  prepareChartData(): any {
    // Group expenses by category
    const categoryMap = new Map<string, number>();

    this.expenses.forEach(expense => {
      const categoryName = expense.categoryName || 'Uncategorized';
      const currentAmount = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, currentAmount + expense.amount);
    });

    // Sort by amount descending
    const sortedEntries = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1]);

    const labels = sortedEntries.map(entry => entry[0]);
    const data = sortedEntries.map(entry => entry[1]);

    // Generate colors for each category
    const backgroundColors = this.generateColors(labels.length);

    return {
      labels: labels,
      datasets: [{
        label: 'Amount',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1
      }]
    };
  }

  generateColors(count: number): string[] {
    const colors = [
      'rgba(54, 162, 235, 0.7)',   // Blue
      'rgba(255, 99, 132, 0.7)',   // Red
      'rgba(75, 192, 192, 0.7)',   // Teal
      'rgba(255, 206, 86, 0.7)',   // Yellow
      'rgba(153, 102, 255, 0.7)',  // Purple
      'rgba(255, 159, 64, 0.7)',   // Orange
      'rgba(199, 199, 199, 0.7)',  // Gray
      'rgba(83, 102, 255, 0.7)',   // Indigo
      'rgba(255, 99, 255, 0.7)',   // Pink
      'rgba(99, 255, 132, 0.7)'    // Green
    ];

    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadExpenses(): void {
    if (!this.currentUser) return;

    this.loading = true;
    const type = this.selectedType || undefined;
    const categoryId = this.selectedCategoryId || undefined;

    this.expenseService.getAllExpenses(
      this.currentUser.userId,
      type as ExpenseType,
      this.startDate || undefined,
      this.endDate || undefined,
      categoryId
    ).subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.calculateSummary();
        this.loading = false;
        // Update chart after data is loaded
        setTimeout(() => this.initializeChart(), 0);
      },
      error: (error) => {
        console.error('Error loading expenses:', error);
        this.loading = false;
      }
    });
  }

  calculateSummary(): void {
    this.totalExpenses = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    this.personalTotal = this.expenses
      .filter(exp => exp.expenseType === ExpenseType.PERSONAL)
      .reduce((sum, exp) => sum + exp.amount, 0);
    this.organizationalTotal = this.expenses
      .filter(exp => exp.expenseType === ExpenseType.ORGANIZATIONAL)
      .reduce((sum, exp) => sum + exp.amount, 0);
  }

  applyFilters(): void {
    this.loadExpenses();
  }

  clearFilters(): void {
    this.selectedType = '';
    this.selectedCategoryId = null;
    this.startDate = '';
    this.endDate = '';
    this.loadExpenses();
  }

  deleteExpense(expenseId: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(expenseId).subscribe({
        next: () => {
          this.loadExpenses();
        },
        error: (error) => {
          console.error('Error deleting expense:', error);
          alert('Failed to delete expense');
        }
      });
    }
  }

  /**
   * Smart date validation: when start date changes, ensure end date is not before it
   */
  onStartDateChange(): void {
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      this.endDate = this.startDate;
    }
  }

  /**
   * Smart date validation: when end date changes, ensure start date is not after it
   */
  onEndDateChange(): void {
    if (this.startDate && this.endDate && this.endDate < this.startDate) {
      this.startDate = this.endDate;
    }
  }

  navigateToAddExpense(): void {
    this.router.navigate(['/expense/add']);
  }

  navigateToEditExpense(expenseId: number): void {
    this.router.navigate(['/expense/edit', expenseId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
