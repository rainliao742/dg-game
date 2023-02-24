import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageerrorComponent } from './pages/pageerror/pageerror.component';
import { HomeComponent } from './pages/home/home.component';
import { ActivityComponent } from './pages/activity/activity.component';
import { ActlistQueryComponent } from './pages/actlist/actlist-query.component';
import { ActlistDetailComponent } from './pages/actlist/actlist-detail.component';
import { ActlistMemberComponent } from './pages/actlist/actlist-member.component';

const routes: Routes = [

  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: HomeComponent }, 
  { path: 'activity/:id', component: ActivityComponent }, 
  { path: 'list', component: ActlistQueryComponent }, 
  { path: 'list/add', component: ActlistDetailComponent }, 
  { path: 'list/edit/:id', component: ActlistDetailComponent }, 
  { path: 'member/:id', component: ActlistMemberComponent }, 
  
  // error
  { path: '**', component: PageerrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
