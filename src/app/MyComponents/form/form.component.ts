import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpenseItem } from '../../ExpenseItem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  

  
  itemName: string="";
  description: string = "";
  cost: number = 0;
  selectedCategories: Array<string> = [];
  paymentVia: boolean = false;
  shopDetails= {
    shopName: "",
    shopAddress: ""
  }

  localItem: string | null = null;
  expenses: ExpenseItem[] = [];

  constructor(private router: Router) {
    // router= new Router();
    this.localItem = this.getLocalStorageItem('Expenses');
    if (this.localItem === null || this.localItem.trim() === '') {
      this.expenses = [];
    } else {
      this.expenses = JSON.parse(this.localItem);
    }
  }

  

  categories = [
    { name: 'Grocery', value: 'grocery' },
    { name: 'Personal', value: 'personal' },
    { name: 'Electronics', value: 'electronics' },
    { name: 'Clothing', value: 'clothing' },
    { name: 'Other', value: 'other' }
  ];

  onCategoryChange(event: any, category: string) {
    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      const index = this.selectedCategories.indexOf(category);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }

  onSubmit() {
    const formData = {
      itemName: this.itemName,
      description: this.description,
      cost: this.cost,
      categories: this.selectedCategories,
      paymentVia: this.paymentVia,
      shopDetails: this.shopDetails,
    };
    console.log('Form Data:', formData);
    this.addExpense(formData);
    this.router.navigate(['/']);

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
    console.log("from Home: ",expense);
    this.expenses.push(expense);
    this.setLocalStorageItem('Expenses', JSON.stringify(this.expenses));
    console.log('updated ls');
  }

  
}
