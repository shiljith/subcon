import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectComponent } from './components/project/project.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { AddProjectComponent } from './components/project/add-project/add-project.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginComponent } from './components/login/login.component';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderComponent } from './shared/components/header/header.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DeleteConfirmationComponent } from './components/project/delete-confirmation/delete-confirmation.component';
import { ViewProjectComponent } from './components/project/view-project/view-project.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AddProjectUnitComponent } from './components/project/add-project-unit/add-project-unit.component';
import { ViewProjectUnitComponent } from './components/project/view-project-unit/view-project-unit.component';
import { ReportsComponent } from './components/reports/reports.component';
import { NgChartsModule } from 'ng2-charts';
import { TokenInterceptorService } from './interceptors/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    AddProjectComponent,
    LoginComponent,
    HeaderComponent,
    LayoutComponent,
    DeleteConfirmationComponent,
    ViewProjectComponent,
    DashboardComponent,
    UserManagementComponent,
    AddProjectUnitComponent,
    ViewProjectUnitComponent,
    ReportsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressBarModule,
    MatSidenavModule,
    NgChartsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
