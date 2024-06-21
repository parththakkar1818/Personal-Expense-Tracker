import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router'; 
import { FormComponent } from './MyComponents/form/form.component';
import { HomeComponent } from './MyComponents/home/home.component';
import { DashboardComponent } from './MyComponents/dashboard/dashboard.component';

export const routes: Routes = [
    {path:"", component:DashboardComponent},
    {path:"additem", component:FormComponent}
];
