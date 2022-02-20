import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeleteConfirmationComponent } from '../project/delete-confirmation/delete-confirmation.component';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  userForm!: FormGroup;
  dataSource!: User[];
  displayedColumns: string[] = ['SlNo', 'name', 'username', 'role', 'actions'];
  roles: any[] = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Project Engineer' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.getUsers();
  }

  getUsers() {
    this.userService.getAll().subscribe((users: User[]) => {
      this.dataSource = users;
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    this.userService.add(this.userForm.value).subscribe((res) => {
      this.userForm.reset();
      this.userForm.markAsPristine();
      this.userForm.markAsUntouched();
      this.getUsers();
    });
  }

  onDelete(user: User): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((user: User) => {
      if (user) {
        this.userService.delete(user.id).subscribe((res) => {
          if (res) {
            this.getUsers();
          }
        });
      }
    });
  }
}
