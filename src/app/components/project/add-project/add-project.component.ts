import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from 'src/app/models/project';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
})
export class AddProjectComponent implements OnInit {
  projectForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public project: Project,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const today = moment().toDate();
    console.log(today);
    this.projectForm = this.formBuilder.group({
      poNumber: ['', Validators.required],
      name: ['', Validators.required],
      status: ['1', Validators.required],
      description: [''],
      contractor: [''],
      createdAt: [today, Validators.required],
    });
    if (this.project) {
      const data = {
        name: this.project.name,
        poNumber: this.project.poNumber,
        status: this.project.status.toString(),
        contractor: this.project.contractor,
        description: this.project.description,
        createdAt: this.project.createdAt,
      };
      this.projectForm.patchValue(data);
    }
  }

  onSubmit() {
    if (this.projectForm.invalid) return;

    const createdAt = moment(
      this.projectForm.controls['createdAt'].value
    ).format('YYYY-MM-DD HH:mm:ss');

    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    const project: Project = {
      ...this.projectForm.value,
      createdAt: createdAt,
      updatedAt: updatedAt,
      updatedBy: this.authService.getUser().id,
    };

    console.log(project);

    if (this.project) {
      this.projectService.update(project, this.project.id).subscribe((res) => {
        if (res) {
          this._snackBar.open('Project updated sucessfully', 'Close', {
            duration: 2000,
          });
          this.dialogRef.close();
        }
      });
    } else {
      project.createdBy = this.authService.getUser()?.id.toString();

      this.projectService.add(project).subscribe((res) => {
        console.log(res);
        if (res) {
          this._snackBar.open('Project created sucessfully', 'Close', {
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
