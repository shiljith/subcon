import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Account } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account.service';
import { ReportService } from 'src/app/services/report.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  reportForm!: FormGroup;
  account!: Account;
  wipReport: any[] = [];
  ipoReport: any[] = [];
  wipTableColumns: Array<any> = [
    { title: 'Sl.No.', value: 'slno' },
    { title: 'Main Contractor', value: 'contractor' },
    { title: 'Project Name', value: 'name' },
    { title: 'PO Number', value: 'poNumber' },
    { title: 'Unit ID', value: 'unitId' },
    { title: 'Unit Value', value: 'unitValue' },
    { title: 'Totoal WIP', value: 'totalWIP' },
    { title: 'Total Billed Value', value: 'totalBilledValue' },
    { title: 'Balance', value: 'balance' },
    { title: 'Balance Unit Value', value: 'balanceUnitValue' },
    { title: 'Status', value: 'status' },
  ];
  ipoTableColumns: Array<any> = [
    { title: 'Sl.No.', value: 'slno' },
    { title: 'Main Contractor', value: 'contractor' },
    { title: 'Project Name', value: 'name' },
    { title: 'Project Unit Name', value: 'projectUnit' },
    { title: 'Unit Number', value: 'unitNumber' },
    { title: 'Model Name', value: 'modelName' },
    { title: 'Unit Value', value: 'unitValue' },
    { title: 'Admin Cost', value: 'adminCost' },
    { title: 'Days', value: 'days' },
    { title: 'Estimated Cost', value: 'estimatedCost' },
    { title: 'Estimated Profit', value: 'estimatedProfit' },
    { title: 'Actual Cost', value: 'actualCost' },
    { title: 'Actual Profit', value: 'actualProfit' },
    { title: 'Budget HMH', value: 'budgetTMH' },
    { title: 'Budget HMH', value: 'budgetHMH' },
    { title: 'Actual HMH', value: 'actualTMH' },
    { title: 'Actual HMH', value: 'actualHMH' },
    { title: 'Start Date', value: 'startDate' },
    { title: 'End Date', value: 'endDate' },
  ];

  constructor(
    private reportService: ReportService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getWorkInProgressReport();
    this.getInstallationProgressOverviewReport();
    this.accountService.get().subscribe((account: Account) => {
      this.account = account;
    });
  }

  getWorkInProgressReport() {
    this.reportService.getWorkInProgressReport().subscribe((res) => {
      this.wipReport = res;
    });
  }

  getInstallationProgressOverviewReport() {
    this.reportService
      .getInstallationProgressOverviewReport()
      .subscribe((res) => {
        this.ipoReport = res;
      });
  }

  previewWIPReport() {
    this.reportService.report = {
      account: this.account,
      name: 'Work In Progress Report',
      tableSource: {
        header: this.wipTableColumns,
        data: this.wipReport,
      },
    };
    this.router.navigate(['/report/preview']);
  }

  previewIPOReport() {
    this.reportService.report = {
      account: this.account,
      name: 'Installation Progress Overview',
      tableSource: {
        header: this.ipoTableColumns,
        data: this.ipoReport,
      },
    };
    this.router.navigate(['/report/preview']);
  }

  getColumns(columns: Array<Object>) {
    return columns.map((m: any) => m.value);
  }

  generateWIPReportPDF() {
    let docDefinition = {
      content: [
        // Previous configuration
        {
          text: 'Project Report',
          style: 'sectionHeader',
        },
        {
          table: {
            headerRows: 1,
            widths: [
              '*',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
            ],
            body: [
              [
                'slno',
                'contractor',
                'name',
                'pNumber',
                'unitId',
                'unitValue',
                'totalWip',
                'totalBilledValue',
                'balance',
                'balanceUnitValue',
                'status',
              ],
              ...this.wipReport.map((p) => [
                p.name,
                p.contractor,
                p.name,
                p.pNumber,
                p.unitId,
                p.unitValue,
                p.totalWip,
                p.totalBilledValue,
                p.balance,
                p.balanceUnitValue,
                p.status,
              ]),
            ],
          },
        },
      ],
      // Common Styles
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
