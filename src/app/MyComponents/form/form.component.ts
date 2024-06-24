import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpenseItem } from '../../ExpenseItem';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  localItem: string | null = null;
  expenses: ExpenseItem[] = [];
  editingIndex: number | null = null;
  expenseForm: FormGroup;
  selectedCategories: Array<string> = [];
  categories = [
    { name: 'Grocery', value: 'grocery' },
    { name: 'Personal', value: 'personal' },
    { name: 'Electronics', value: 'electronics' },
    { name: 'Clothing', value: 'clothing' },
    { name: 'Other', value: 'other' },
  ];
  isSubmitButtonPressed: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // router= new Router();
    this.localItem = this.getLocalStorageItem('Expenses');
    if (this.localItem === null || this.localItem.trim() === '') {
      this.expenses = [];
    } else {
      this.expenses = JSON.parse(this.localItem);
    }
    this.expenseForm = this.fb.group({
      itemName: ['', Validators.required],
      description: ['', Validators.required],
      cost: [0, [Validators.required, Validators.min(0.01)]],
      categories: ['', Validators.required],
      paymentVia: [false, Validators.required],
      shopName: ['', Validators.required],
      shopAddress: ['', Validators.required],
    });
  }

  onCategoryChange(event: any, category: string) {
    if (event.target.checked) {
      if (!this.selectedCategories.includes(category)) {
        this.selectedCategories.push(category);
      }
    } else {
      const index = this.selectedCategories.indexOf(category);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }

  onSubmit() {
    this.isSubmitButtonPressed = true;
    console.log(this.isSubmitButtonPressed)
    if (this.selectedCategories.length === 0) {
      this.expenseForm.get('categories')?.setErrors({ required: true });
    } else {
      this.expenseForm.get('categories')?.setErrors(null);
    }
    this.expenseForm.markAllAsTouched(); // This will ensure that all form controls are marked as touched

    if (this.expenseForm.valid) {
      const formData: ExpenseItem = {
        itemName: this.expenseForm.value.itemName,
        description: this.expenseForm.value.description,
        cost: this.expenseForm.value.cost,
        categories: this.selectedCategories,
        paymentVia: this.expenseForm.value.paymentVia,
        shopDetails: {
          shopName: this.expenseForm.value.shopName,
          shopAddress: this.expenseForm.value.shopAddress,
        },
      };

      if (this.editingIndex !== null) {
        // Update existing expense
        this.expenses[this.editingIndex] = formData;
      } else {
        // Add new expense
        this.expenses.push(formData);
      }

      this.setLocalStorageItem('Expenses', JSON.stringify(this.expenses));
      this.router.navigate(['/']);
    }
    else{
      console.log("Data not valid");
    }
  }

  ngOnInit(): void {
    this.isSubmitButtonPressed = false;
    this.route.queryParams.subscribe((params) => {
      if (params['itemName']) {
        this.expenseForm.patchValue({
          itemName: params['itemName'],
          description: params['description'],
          cost: +params['cost'],
          paymentVia: params['paymentVia'] === 'true',
          shopName: params['shopName'],
          shopAddress: params['shopAddress'],
        });

        this.selectedCategories = params['categories'] || [];
        console.log("selected category: ",this.selectedCategories)
        this.editingIndex = +params['index'];
        console.log(this.expenseForm.value.paymentVia);

      }
    });
  }

  setLocalStorageItem(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }
  getLocalStorageItem(key: string): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  addExpense(expense: ExpenseItem) {
    console.log('from Home: ', expense);
    this.expenses.push(expense);
    this.setLocalStorageItem('Expenses', JSON.stringify(this.expenses));
    console.log('updated ls');
  }
}
