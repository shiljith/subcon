import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from 'src/app/services/account.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      technicianSalary: ['0.00', Validators.required],
      helperSalary: ['0.00', Validators.required],
    });
    this.getAccountDetails();
  }

  getAccountDetails() {
    this.accountService.get().subscribe((account) => {
      console.log(account);

      this.settingsForm.patchValue({
        name: account.name,
        address: account.address,
        technicianSalary: account.technicianSalary.toFixed(2),
        helperSalary: account.helperSalary.toFixed(2),
      });
    });
  }

  onSubmit() {
    this.accountService.update(this.settingsForm.value).subscribe((res) => {
      if (res) {
        this.snackBar.open('Account details updated successfully.', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  backup() {
    this.accountService.downloadBackup().subscribe((res) => {
      this.downloadFile(res,'WIP_Backup.csv');
    });
  }

  backupManHour() {
    this.accountService.downloadBackupManHour().subscribe((res) => {
      this.downloadFile(res,'Hour_Backup.csv');
    });
  }
  

  downloadFile(data: any,fileName: string) {
    console.log('Backup', data);
    const replacer = (key: any, value: any) => (value === null ? '' : value);
    const header = Object.keys(data[0]);
    let csv = data.map((row: any) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], { type: 'text/csv' });
    saveAs(blob, fileName);
  }
}
