export class ExpenseItem {
    itemName: string = "";
    description: string = "";
    cost: number = 0;
    categories: Array<string> = [];
    paymentVia: boolean = false;
    shopDetails={
      shopName: "",
      shopAddress: ""
    };
  }
  