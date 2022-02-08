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

@Component({
  selector: 'app-add-project-unit',
  templateUrl: './add-project-unit.component.html',
  styleUrls: ['./add-project-unit.component.scss'],
})
export class AddProjectUnitComponent implements OnInit {
  projectForm!: FormGroup;
  projectUnits!: any[];
  projectId!: number;

  constructor(
    private formBuilder: FormBuilder,
    private projectUnitService: ProjectUnitService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddProjectUnitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('DATA', this.data);
    this.projectId = this.data.project.projectId;

    this.projectForm = this.formBuilder.group({
      unitId: ['', Validators.required],
      unitNumber: ['', Validators.required],
      modelName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      days: ['', Validators.required],
      estimatedCost: ['', Validators.required],
      estimatedProfit: ['', Validators.required],
      estimatedAmount: ['', Validators.required],
      status: ['', Validators.required],
      budgetTMH: [''],
      budgetHMH: [''],
      actualTMH: [''],
      actualHMH: [''],
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
        estimatedAmount: this.data.project.estimatedAmount,
        budgetTMH: this.data.project.budgetTMH,
        budgetHMH: this.data.project.budgetHMH,
        actualTMH: this.data.project.actualTMH,
        actualHMH: this.data.project.actualHMH,
      };
      this.projectForm.patchValue(data);
    }
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
}
