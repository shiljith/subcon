import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user!: User;
  isAdminAccess: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.isAdminAccess = this.authService.isAdminAccess();
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
