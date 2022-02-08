import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { AddProjectComponent } from './add-project/add-project.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { AuthService } from 'src/app/services/auth.service';
import { fromEvent } from 'rxjs';
import {
  filter,
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  @ViewChild('projectSearchInput', { static: true })
  projectSearchInput!: ElementRef;

  projectSearchForm!: FormGroup;
  projects: Project[] = [];
  projectForm!: FormGroup;
  searchKey: string = '';
  isAdminAccess: boolean = false;
  isSearching: boolean = false;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdminAccess = this.authService.isAdminAccess();

    this.projectSearchForm = this.fb.group({
      search: [''],
      status: ['0'],
    });
    this.getProjects();
    this.projectSearchForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((searchTerms) => this.projectService.filter(searchTerms))
      )
      .subscribe((projects: Project[]) => {
        console.log('Filter', projects);
        this.projects = projects;
      });
  }

  applyFilter(event: Event) {
    this.searchKey = (event.target as HTMLInputElement).value;
    //this.projects.filter = this.searchKey.trim().toLowerCase();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProjects();
    });
  }

  onEdit(project: Project): void {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      data: project,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProjects();
    });
  }

  onView(project: Project) {
    this.router.navigate(['/project', project.id]);
  }

  onDelete(project: Project): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: project,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.projectService.delete(result.id).subscribe((res) => {
          console.log(res);
          if (res) {
            this.getProjects();
          }
        });
      }
    });
  }

  getProjects() {
    console.log(this.projectSearchForm);
    this.projectService
      .filter(this.projectSearchForm.value)
      .subscribe((project: Project[]) => {
        this.projects = project;
      });
  }

  resetSearchValue() {
    this.projectSearchForm.controls['search'].setValue('');
  }
}
