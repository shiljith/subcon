import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  getAccountDetails() {
    this.accountService.get().subscribe((res) => {
      this.settingsForm.patchValue(res);
    });
  }

  onSubmit() {}
}
