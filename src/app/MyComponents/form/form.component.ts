import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpenseItem } from '../../ExpenseItem';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  localItem: string | null = null;
  cookiesItem: string | null = null;

  expenses: ExpenseItem[] = [];
  expensesLocalStorage: ExpenseItem[] = [];
  expensesCookies: ExpenseItem[] = [];
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
    this.localItem = this.getLocalStorageItem('Expenses');
    this.cookiesItem = this.getCookieItem('Expenses');

    if (this.localItem !== null && this.localItem.trim() !== '') {
      this.expensesLocalStorage = JSON.parse(this.localItem);
    } else {
      console.log('nothing found in localstorage');
    }

    if (this.cookiesItem !== null && this.cookiesItem.trim() !== '') {
      this.expensesCookies = JSON.parse(this.cookiesItem);
    } else {
      console.log('nothing found in cookies');
    }

    // Merge expenses alternatively
    let maxLength = Math.max(
      this.expensesLocalStorage.length,
      this.expensesCookies.length
    );
    for (let i = 0; i < maxLength; i++) {
      if (i < this.expensesLocalStorage.length) {
        this.expenses.push(this.expensesLocalStorage[i]);
      }
      if (i < this.expensesCookies.length) {
        this.expenses.push(this.expensesCookies[i]);
      }
    }
    // console.log("from line 69: ",this.expenses);

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
    console.log(this.isSubmitButtonPressed);
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
        this.expenses.push(formData);

        if (this.expenses.length % 2 === 1) {
          console.log('Storing in localStorage');
          this.expensesLocalStorage.push(formData);
          this.setLocalStorageItem(
            'Expenses',
            JSON.stringify(this.expensesLocalStorage)
          );
        } else {
          console.log('Storing in cookies');
          this.expensesCookies.push(formData);
          this.setCookieItem('Expenses', JSON.stringify(this.expensesCookies));
        }
      }

      this.router.navigate(['/']);
    } else {
      console.log('Data not valid');
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
        console.log('selected category: ', this.selectedCategories);
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

  setCookieItem(key: string, value: string): void {
    if (typeof document !== 'undefined') {
      document.cookie = `${key}=${value}; path=/;`;
    }
  }

  getCookieItem(key: string): string | null {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split('; ');
      const cookie = cookies.find((cookie) => cookie.startsWith(`${key}=`));
      if (cookie) {
        // console.log('cookie value found..');
        // console.log(JSON.parse(cookie.split('=')[1]));
        return cookie.split('=')[1];
      }
    }
    // console.log('no cookie found');
    return null;
  }

  addExpense(expense: ExpenseItem) {
    // console.log('from Home: ', expense);
    this.expenses.push(expense);
    this.setLocalStorageItem('Expenses', JSON.stringify(this.expenses));
    // console.log('updated ls');
  }
}
