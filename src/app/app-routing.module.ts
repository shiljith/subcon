import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectComponent } from './components/project/project.component';
import { ViewProjectUnitComponent } from './components/project/view-project-unit/view-project-unit.component';
import { ViewProjectComponent } from './components/project/view-project/view-project.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'project',
    component: ProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'project/:id',
    component: ViewProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'project-unit/:unitId',
    component: ViewProjectUnitComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
