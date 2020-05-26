import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { ErrorComponent } from '../pages/error/error.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '', component: AdminPageComponent, children: [
                    {path:'', redirectTo: '/admin/login', pathMatch: 'full'},
                    {path:'login', component:LoginPageComponent},
                    
                    {path:'edit', component:EditPageComponent},
                    { path: '404', component: ErrorComponent }
                ]
            },
            {path:'dashboard', component:DashboardPageComponent}
        ])
    ],
    exports: [RouterModule],
    declarations: [AdminPageComponent, LoginPageComponent, DashboardPageComponent, EditPageComponent, ErrorComponent]
})
export class AdminModule {

}