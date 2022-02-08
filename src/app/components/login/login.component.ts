import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe(
      (res: boolean) => {
        if (res) {
          this.router.navigate(['/dashboard']);
        }
      },
      (err) => {
        console.log('ERROR', err);
        this._snackBar.open(err, 'Close', {
          duration: 2000,
        });
      }
    );
  }
}
