import { Component, Input, OnChanges, SimpleChanges  } from '@angular/core';
import Chart from 'chart.js/auto';
import { ExpenseItem } from '../../ExpenseItem';

@Component({
  selector: 'app-analysis',
  standalone: true,
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnChanges {
  @Input() expenses: ExpenseItem[] = [];
  @Input() myName: ExpenseItem[] = [];
  
  public chart: any;

  createChart(categoryData: { [key: string]: number }) {
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    const backgroundColors = labels.map(() => this.getRandomColor());

    this.chart = new Chart("MyChart", {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Category Wise Spend',
          data: data,
          backgroundColor: backgroundColors,
          hoverOffset: 10
        }]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenses']) {
      const categoryData = this.calculateCategoryWiseSpend();
      if (this.chart) {
        this.chart.destroy();
      }
      this.createChart(categoryData);
    }
  }

  calculateCategoryWiseSpend(): { [key: string]: number } {
    const categoryWiseSpend: { [key: string]: number } = {};
    this.expenses.forEach(expense => {
      expense.categories.forEach(category => {
        if (!categoryWiseSpend[category]) {
          categoryWiseSpend[category] = 0;
        }
        categoryWiseSpend[category] += expense.cost;
      });
    });
    return categoryWiseSpend;
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
