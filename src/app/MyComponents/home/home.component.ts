import { Component, Input } from '@angular/core';
import { ExpenseItem } from '../../ExpenseItem';
import { CommonModule } from '@angular/common';
import { FormComponent } from '../form/form.component';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormComponent, RouterModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // localItem: string | null = null;
  // expenses: ExpenseItem[] = [];

  

  
  // constructor() {
  //   this.localItem = this.getLocalStorageItem('Expenses');
  //   if (this.localItem === null || this.localItem.trim() === '') {
  //     this.expenses = [];
  //   } else {
  //     this.expenses = JSON.parse(this.localItem);
  //   }
  // }

  // setLocalStorageItem(key: string, value: string): void {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem(key, value);
  //   }
  // }
  // getLocalStorageItem(key: string): string | null {
  //   if (typeof window !== 'undefined') {
  //     return localStorage.getItem(key);
  //   }
  //   return null;
  // }
  
  // addExpense(expense: ExpenseItem) {
  //   console.log("from Home: ",expense);
  //   this.expenses.push(expense);
  //   this.setLocalStorageItem('Expenses', JSON.stringify(this.expenses));
  //   console.log('updated ls');
  // }
}
