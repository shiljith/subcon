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
import { MatSnackBar } from '@angular/material/snack-bar';
import { WipTimelineComponent } from './wip-timeline/wip-timeline.component';

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
    'invoiceNumber',
    'percentage',
    'amount',
    'comments',
    'updatedBy',
    'status',
    'actions',
  ];
  isAdminAccess: boolean = false;
  selectedWipId!: number | undefined;
  isVisibleWipControls: boolean = true;

  constructor(
    private projectUnitService: ProjectUnitService,
    private wipService: WipService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) private projectUnitId: number,
    private dialogRef: MatDialogRef<ViewProjectUnitComponent>,
    private _snackBar: MatSnackBar,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.isAdminAccess = this.authService.isAdminAccess();
    if (this.isAdminAccess) {
      this.displayedColumns.push('approval');
    }
    this.unitId = this.projectUnitId;
    console.log(this.unitId);
    this.wipForm = this.fb.group({
      percentage: ['', Validators.required],
      amount: ['', Validators.required],
      comments: ['', Validators.required],
      invoiceNumber: [''],
    });
    this.getProjectUnit();
  }

  getProjectUnit() {
    this.projectUnitService
      .get(this.unitId)
      .subscribe((project: ProjectUnit) => {
        console.log(project);
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
      createdBy: this.authService.getUser()?.id,
      updatedBy: this.authService.getUser()?.id,
    };
    this.wipService.add(data).subscribe((res) => {
      console.log('ADDED', res);
      const description = `
        Invoice No: <strong>${this.wipForm.value.invoiceNumber}</strong><br/>
        Percentage: <strong>${this.wipForm.value.percentage}%</strong><br/>
        Amount: <strong>${this.wipForm.value.amount}</strong><br/>
        Comments: <strong>${this.wipForm.value.comments}</strong>
      `;
      this.addTimeline(res.wipId, 'Added', description, 'add');
      this.getWip();
      this.wipForm.reset();
      this.wipForm.markAsPristine();
      this.wipForm.markAsUntouched();
    });
  }

  getWip() {
    this.wipService.getAll(this.projectUnit.id).subscribe((wip: WIP[]) => {
      this.dataSource = wip;
      const wipTotal = wip
        .filter((e: WIP) => e.status === 1)
        .reduce((acc, value) => {
          return acc + value.amount;
        }, 0);
      this.balance = this.projectUnit.unitValue - wipTotal;
      if (this.balance <= 0) {
        this.isVisibleWipControls = false;
      } else {
        this.isVisibleWipControls = true;
      }
    });
  }

  onEdit(wip: any): void {
    this.wipForm.patchValue({
      percentage: wip.percentage,
      amount: wip.amount,
      comments: wip.comments,
      invoiceNumber: wip.invoiceNumber,
    });
    this.selectedWipId = wip.id;
  }

  onEditProgress() {
    const data = {
      ...this.wipForm.value,
      updatedBy: this.authService.getUser()?.id,
    };
    const wipId = Number(this.selectedWipId);
    this.wipService.update(data, wipId).subscribe((res) => {
      if (res) {
        const description = `
          Invoice No: <strong>${this.wipForm.value.invoiceNumber}</strong><br/>
          Percentage: <strong>${this.wipForm.value.percentage}%</strong><br/>
          Amount: <strong>${this.wipForm.value.amount}</strong><br/>
          Comments: <strong>${this.wipForm.value.comments}</strong>
      `;
        this.addTimeline(wipId, 'Updated', description, 'edit');
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

  onChangePercentage(event: any) {
    const percentage: number = Number(event.target.value);
    if (percentage && percentage > 0 && percentage <= 100) {
      console.log(percentage);
      const amount = (this.projectUnit.unitValue * percentage) / 100;
      this.wipForm.controls['amount'].setValue(amount);

      if (amount > this.balance) {
        this.wipForm.controls['amount'].setErrors({
          balance_validator: 'The percentage amout is grater than balance',
        });
      }
    } else {
      this.wipForm.controls['amount'].setValue('');
    }
  }

  onStatusChange(wip: WIP, status: number) {
    const checkBalance = this.balance - wip.amount;
    if (checkBalance < 0 && status === 1) {
      this._snackBar.open(
        `You can't approve this wip the amount is grather than balance. Please approve accordingly.`,
        'Close',
        {
          duration: 5000,
        }
      );
    } else {
      this.wipService.updateStatus({ status }, wip.id).subscribe((res) => {
        console.log(res);

        if (res) {
          const statusText = status === 1 ? 'Approved' : 'Rejected';
          const icon = status === 1 ? 'check' : 'close';
          const description = ``;
          this.addTimeline(wip.id, statusText, description, icon);
          this.getProjectUnit();
          this._snackBar.open(
            `The wip status has been ${this.getStatus(status)}`,
            'Close',
            {
              duration: 5000,
            }
          );
        }
      });
    }
  }
  getProjectUnitStatus(status: any) {
    return this.projectService.getStatus(status);
  }
  getStatus(status: number) {
    let statusText = '';
    switch (status) {
      case 0:
        statusText = 'Pending';
        break;
      case 1:
        statusText = 'Approved';
        break;
      case 2:
        statusText = 'Rejected';
        break;
    }
    return statusText;
  }

  openTimeLine(wip: WIP) {
    const dialogRef = this.dialog.open(WipTimelineComponent, {
      width: '800px',
      height: '500px',
      data: wip.id,
      autoFocus: false,
    });
  }

  addTimeline(
    wipId: number,
    action: string,
    description: string,
    icon: string
  ) {
    const data = {
      wipId,
      action,
      description,
      icon,
      createdBy: this.authService.getUser().id,
    };
    this.wipService.addTimeline(data).subscribe((res) => {
      if (res) {
        console.log(res);
      }
    });
  }
}
