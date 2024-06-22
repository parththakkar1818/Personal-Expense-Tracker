import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpenseItem } from '../../ExpenseItem';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  itemName: string = '';
  description: string = '';
  cost: number = 0;
  selectedCategories: Array<string> = [];
  paymentVia: boolean = false;
  shopDetails = {
    shopName: '',
    shopAddress: '',
  };

  localItem: string | null = null;
  expenses: ExpenseItem[] = [];
  editingIndex: number | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {
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
    { name: 'Other', value: 'other' },
  ];

  onCategoryChange(event: any, category: string) {
    if (event.target.checked) {
      if(!this.selectedCategories.includes(category)){
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
    const formData = {
      itemName: this.itemName,
      description: this.description,
      cost: this.cost,
      categories: this.selectedCategories,
      paymentVia: this.paymentVia,
      shopDetails: this.shopDetails,
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


    // console.log('Form Data:', formData);
    // this.addExpense(formData);
    // this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log("params: ",params)
      if (params['itemName']) {
        this.itemName = params['itemName'];
        this.description = params['description'];
        this.cost = +params['cost'];
        this.selectedCategories = params['categories'];
        this.selectedCategories.forEach(category => {
          console.log("in loop: ",category);
          const checkbox = document.getElementById(category) as HTMLInputElement;
          if (checkbox) {
            checkbox.checked = true;
          }
          else{
            console.log("No checkbox found");
          }
        
        });
        this.paymentVia = params['paymentVia'] === true;
        this.shopDetails = {
          shopName: params['shopName'],
          shopAddress: params['shopAddress']
        };
        this.editingIndex = +params['index'];
      }
      console.log("from here:",this.selectedCategories);
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
