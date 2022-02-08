import { Component, Inject, OnInit } from '@angular/core';
import { Project, ProjectUnit } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { WipService } from 'src/app/services/wip.service';
import { WIP } from 'src/app/models/wip';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectUnitService } from 'src/app/services/project-unit.service';
import { AddProjectUnitComponent } from '../add-project-unit/add-project-unit.component';

@Component({
  selector: 'app-view-project-unit',
  templateUrl: './view-project-unit.component.html',
  styleUrls: ['./view-project-unit.component.scss'],
})
export class ViewProjectUnitComponent implements OnInit {
  projectUnit!: ProjectUnit;
  unitId!: number;
  balance: number = 0;
  wipForm!: FormGroup;
  dataSource!: WIP[];
  displayedColumns: string[] = [
    'SlNo',
    'percentage',
    'amount',
    'updatedBy',
    'actions',
  ];
  isAdminAccess: boolean = false;
  selectedWipId!: number | undefined;

  constructor(
    private projectUnitService: ProjectUnitService,
    private wipService: WipService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) private projectUnitId: number,
    private dialogRef: MatDialogRef<ViewProjectUnitComponent>
  ) {}

  ngOnInit(): void {
    this.isAdminAccess = this.authService.isAdminAccess();
    this.unitId = this.projectUnitId;
    console.log(this.unitId);
    this.wipForm = this.fb.group({
      percentage: ['', Validators.required],
      amount: ['', Validators.required],
    });
    this.getProjectUnit();
  }

  getProjectUnit() {
    this.projectUnitService
      .get(this.unitId)
      .subscribe((project: ProjectUnit) => {
        if (project) {
          this.projectUnit = project;
          this.getWip();
        }
      });
  }

  onsubmitProgress() {
    if (this.wipForm.invalid) return;
    const data = {
      ...this.wipForm.value,
      projectUnitId: this.projectUnit.id,
      createdBy: this.authService.getUser().id,
      updatedBy: this.authService.getUser().id,
    };
    this.wipService.add(data).subscribe((res) => {
      console.log(res);
      this.getWip();
      this.wipForm.reset();
      this.wipForm.markAsPristine();
      this.wipForm.markAsUntouched();
    });
  }

  getWip() {
    this.wipService.getAll(this.projectUnit.id).subscribe((wip: WIP[]) => {
      this.dataSource = wip;
      const wipTotal = wip.reduce((acc, value) => {
        return acc + value.amount;
      }, 0);
      this.balance = this.projectUnit.estimatedAmount - wipTotal;
    });
  }

  onEdit(wip: any): void {
    this.wipForm.patchValue({
      percentage: wip.percentage,
      amount: wip.amount,
    });
    this.selectedWipId = wip.id;
  }

  onEditProgress() {
    const data = {
      ...this.wipForm.value,
      updatedBy: this.authService.getUser().id,
    };
    this.wipService
      .update(data, Number(this.selectedWipId))
      .subscribe((res) => {
        if (res) {
          this.getWip();
          this.onClearEdit();
        }
      });
  }

  onClearEdit() {
    this.selectedWipId = undefined;
    this.wipForm.reset();
    this.wipForm.markAsPristine();
    this.wipForm.markAsUntouched();
  }

  onDelete(wip: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: wip,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.wipService.delete(result.id).subscribe((res) => {
          if (res) {
            this.getWip();
          }
        });
      }
    });
  }

  onEditProjectUnit(projectUnit: ProjectUnit): void {
    const dialogRef = this.dialog.open(AddProjectUnitComponent, {
      data: {
        isEdit: true,
        project: projectUnit,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProjectUnit();
    });
  }

  onDeleteProjectUnit(projectUnit: ProjectUnit): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: projectUnit,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.projectUnitService.delete(result.id).subscribe((res) => {
          if (res) {
            this.dialogRef.close();
          }
        });
      }
    });
  }
}
