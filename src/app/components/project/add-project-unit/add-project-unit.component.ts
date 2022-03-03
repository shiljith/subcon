import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project, ProjectUnit } from 'src/app/models/project';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectUnitService } from 'src/app/services/project-unit.service';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/account';

@Component({
  selector: 'app-add-project-unit',
  templateUrl: './add-project-unit.component.html',
  styleUrls: ['./add-project-unit.component.scss'],
})
export class AddProjectUnitComponent implements OnInit {
  projectForm!: FormGroup;
  projectUnits!: any[];
  projectId!: number;
  technicianSalary: number = 0;
  helperSalary: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private projectUnitService: ProjectUnitService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddProjectUnitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    console.log('DATA', this.data);
    this.projectId = this.data.project.projectId;
    this.getAccountDetails();
    this.projectForm = this.formBuilder.group({
      unitId: ['', Validators.required],
      unitNumber: ['', Validators.required],
      modelName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      days: ['', Validators.required],
      budgetTMH: [0, Validators.required],
      budgetHMH: [0, Validators.required],
      actualTMH: [0, Validators.required],
      actualHMH: [0, Validators.required],
      unitValue: ['0.00', Validators.required],
      adminCost: [0, Validators.required],
      estimatedCost: ['0.00', Validators.required],
      estimatedProfit: ['0.00', Validators.required],
      actualCost: ['0.00', Validators.required],
      actualProfit: ['0.00', Validators.required],
      status: ['', Validators.required],
      description: [''],
    });
    this.getProjectUnits();
    console.log('PROJECT', this.data);
    if (this.data.isEdit) {
      const data = {
        unitId: this.data.project.unitId,
        unitNumber: this.data.project.unitNumber,
        modelName: this.data.project.modelName,
        description: this.data.project.description,
        startDate: this.data.project.startDate,
        endDate: this.data.project.endDate,
        days: this.data.project.days,
        status: this.data.project.status.toString(),
        estimatedCost: this.data.project.estimatedCost,
        estimatedProfit: this.data.project.estimatedProfit,
        actualCost: this.data.project.actualCost,
        actualProfit: this.data.project.actualProfit,
        unitValue: this.data.project.unitValue,
        adminCost: this.data.project.adminCost,
        budgetTMH: this.data.project.budgetTMH,
        budgetHMH: this.data.project.budgetHMH,
        actualTMH: this.data.project.actualTMH,
        actualHMH: this.data.project.actualHMH,
      };
      this.projectForm.patchValue(data);
    }
  }

  getAccountDetails() {
    this.accountService.get().subscribe((account: Account) => {
      this.technicianSalary = account.technicianSalary;
      this.helperSalary = account.helperSalary;
    });
  }

  getProjectUnits() {
    this.projectUnitService.getUnits().subscribe((units) => {
      this.projectUnits = units;
    });
  }

  onSubmit() {
    if (this.projectForm.invalid) return;
    const project: ProjectUnit = {
      ...this.projectForm.value,
      updatedBy: this.authService.getUser().id,
    };
    project.startDate = project.startDate;
    project.endDate = project.endDate;

    if (this.data.isEdit) {
      this.projectUnitService
        .update(project, this.data.project.id)
        .subscribe((res) => {
          console.log(res);
          if (res) {
            this._snackBar.open('Project unit updated sucessfully', 'Close', {
              duration: 2000,
            });
            this.dialogRef.close();
          }
        });
    } else {
      project.createdBy = this.authService.getUser().id.toString();
      project.projectId = this.projectId;
      console.log(project);
      this.projectUnitService.add(project).subscribe((res) => {
        if (res) {
          this._snackBar.open('Project unit created sucessfully', 'Close', {
            duration: 2000,
          });
          this.dialogRef.close();
        }
      });
    }
  }

  parseDate(date: Date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  calculate(tmh: number, hmh: number) {
    const unitValue: number = Number(
      this.projectForm.controls['unitValue'].value
    );
    const adminCost: number = Number(
      this.projectForm.controls['adminCost'].value
    );

    const totalSalary = this.technicianSalary * tmh + this.helperSalary * hmh;
    const adminTotalCost = (unitValue * adminCost) / 100;
    const cost = totalSalary + adminTotalCost;
    const profit = unitValue - cost;
    console.log(
      unitValue,
      adminCost,
      totalSalary,
      adminTotalCost,
      cost,
      profit
    );
    return { cost, profit };
  }

  calculateAmount() {
    this.calculateEstimatedAmount();
    this.calculateActualAmount();
  }

  calculateEstimatedAmount() {
    const budgetTMH: number = Number(
      this.projectForm.controls['budgetTMH'].value
    );
    const budgetHMH: number = Number(
      this.projectForm.controls['budgetHMH'].value
    );
    const estimated = this.calculate(budgetTMH, budgetHMH);

    this.projectForm.controls['estimatedCost'].setValue(
      estimated.cost.toFixed(2)
    );
    this.projectForm.controls['estimatedProfit'].setValue(
      estimated.profit.toFixed(2)
    );
  }

  calculateActualAmount() {
    const actualTMH: number = Number(
      this.projectForm.controls['actualTMH'].value
    );
    const actualHMH: number = Number(
      this.projectForm.controls['actualHMH'].value
    );
    const actual = this.calculate(actualTMH, actualHMH);
    console.log(actual);

    this.projectForm.controls['actualCost'].setValue(actual.cost.toFixed(2));
    this.projectForm.controls['actualProfit'].setValue(
      actual.profit.toFixed(2)
    );
  }
}
