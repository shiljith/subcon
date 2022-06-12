import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, ProjectUnit } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { AuthService } from 'src/app/services/auth.service';
import { AddProjectUnitComponent } from '../add-project-unit/add-project-unit.component';
import { ProjectUnitService } from 'src/app/services/project-unit.service';
import { AddProjectComponent } from '../add-project/add-project.component';
import { ViewProjectUnitComponent } from '../view-project-unit/view-project-unit.component';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss'],
})
export class ViewProjectComponent implements OnInit {
  projectId!: number;
  project!: Project;
  displayedColumns: string[] = [
    'slno',
    'unitIdName',
    'modelName',
    'unitValue',
    'startDate',
    'endDate',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource([]);

  searchKey: string = '';
  isFilterEnabled: boolean = false;
  projectFilterForm!: FormGroup;
  filteredData!: Project[];
  isAdminAccess: boolean = false;
  projectUnits!: any[];
  units: any[] = [];
  projectUnitFilter: any = '0';

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
    private projectUnitService: ProjectUnitService,
    public dialog: MatDialog,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isAdminAccess = this.authService.isAdminAccess();

    this.route.params.subscribe((params: any) => {
      this.projectId = +params.id;
      this.getProject();
      this.getProjectUnits();
      this.getUnits();
    });
  }

  getProject() {
    this.projectService.get(this.projectId).subscribe(
      (project: Project) => {
        this.project = project;
      },
      (err) => {
        this.router.navigate(['/project']);
      }
    );
  }

  onEditProject(project: Project): void {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      data: project,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProject();
    });
  }

  onDeleteProject(project: Project): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: project,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.projectService.delete(result.id).subscribe((res) => {
          if (res) {
            this.router.navigate(['/project']);
          }
        });
      }
    });
  }

  applyFilter(event: Event) {
    this.searchKey = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  getUnits() {
    this.projectUnitService.getUnits().subscribe((units) => {
      this.units = units;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddProjectUnitComponent, {
      data: {
        isEdit: false,
        project: {
          projectId: this.projectId,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProjectUnits();
    });
  }

  onEdit(projectUnit: ProjectUnit): void {
    const dialogRef = this.dialog.open(AddProjectUnitComponent, {
      data: {
        isEdit: true,
        project: projectUnit,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProjectUnits();
    });
  }

  onView(projectUnit: ProjectUnit) {
    const dialogRef = this.dialog.open(ViewProjectUnitComponent, {
      width: '1000px',
      height: '600px',
      data: projectUnit.id,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProjectUnits();
    });
  }

  onDelete(projectUnit: ProjectUnit): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: projectUnit,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.projectUnitService.delete(result.id).subscribe((res) => {
          if (res) {
            this.getProjectUnits();
          }
        });
      }
    });
  }

  getProjectUnits() {
    this.projectUnitService
      .getAll(this.projectId, this.projectUnitFilter)
      .subscribe((project: any) => {
        this.dataSource.data = project;
        this.filteredData = project;
      });
  }

  onFilterChange() {
    console.log('Chaged', this.projectFilterForm.value);
    this.projectService
      .filter(this.projectFilterForm.value)
      .subscribe((res) => {
        this.dataSource = res;
        this.filteredData = res;
      });
  }

  setStatus(status: number) {
    let statusText = '';
    switch (status) {
      case 1:
        statusText = 'In Progress';
        break;
      case 2:
        statusText = 'On Hold';
        break;
      case 3:
        statusText = 'Completed';
        break;
    }
    return statusText;
  }
}
