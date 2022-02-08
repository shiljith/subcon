import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from 'src/app/models/project';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';

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
    this.projectForm = this.formBuilder.group({
      poNumber: ['', Validators.required],
      name: ['', Validators.required],
      status: ['1', Validators.required],
      description: [''],
      contractor: [''],
    });
    if (this.project) {
      const data = {
        name: this.project.name,
        poNumber: this.project.poNumber,
        status: this.project.status.toString(),
        contractor: this.project.contractor,
        description: this.project.description,
      };
      this.projectForm.patchValue(data);
    }
  }

  onSubmit() {
    if (this.projectForm.invalid) return;

    const project: Project = {
      ...this.projectForm.value,
      updatedBy: this.authService.getUser().id,
    };

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
