import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { Category } from '../../models/category.model';
import { ExpenseType } from '../../models/expense-type.enum';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;
  categories: Category[] = [];
  loading = false;
  submitted = false;
  error = '';
  isEditMode = false;
  expenseId: number | null = null;
  maxDate: string; // For HTML max attribute

  ExpenseType = ExpenseType; // Make enum available in template

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {
    // Set max date to today
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    this.expenseId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.expenseId;

    this.initializeForm();
    this.loadCategories();

    if (this.isEditMode) {
      this.loadExpense();
    }
  }

  // Custom validator to prevent future dates
  noFutureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return { futureDate: true };
    }
    return null;
  }

  initializeForm(): void {
    this.expenseForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      expenseDate: ['', [Validators.required, this.noFutureDateValidator.bind(this)]],
      description: ['', Validators.required],
      expenseType: [ExpenseType.PERSONAL, Validators.required],
      categoryId: ['', Validators.required]
    });
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

  loadExpense(): void {
    if (!this.expenseId) return;

    this.expenseService.getExpenseById(this.expenseId).subscribe({
      next: (expense) => {
        this.expenseForm.patchValue({
          amount: expense.amount,
          expenseDate: expense.expenseDate,
          description: expense.description,
          expenseType: expense.expenseType,
          categoryId: expense.categoryId
        });
      },
      error: (error) => {
        console.error('Error loading expense:', error);
        this.error = 'Failed to load expense';
      }
    });
  }

  get f() {
    return this.expenseForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.expenseForm.invalid) {
      return;
    }

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.error = 'User not logged in';
      return;
    }

    this.loading = true;

    const expenseRequest = {
      ...this.expenseForm.value,
      userId: currentUser.userId
    };

    const operation = this.isEditMode && this.expenseId
      ? this.expenseService.updateExpense(this.expenseId, expenseRequest)
      : this.expenseService.createExpense(expenseRequest);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to save expense';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
