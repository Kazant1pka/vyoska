import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { ArticleComponent } from './pages/company/article.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreateArticleComponent } from './pages/create-article/create-article.component';
import { EditArticleComponent } from './pages/edit-article/edit-article.component';
import { InstitutionsComponent } from './pages/institutions/institutions.component';
import { ErrorComponent } from './pages/error/error.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/main' },
  { path: 'main', component: MainComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'company', component: ArticleComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent }, 
  { path: 'create', component: CreateArticleComponent },
  { path: 'edit', component: EditArticleComponent },
  { path: 'institutions', component: InstitutionsComponent },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' }
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
