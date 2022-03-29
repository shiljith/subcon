import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Account } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account.service';
import { ProjectUnitService } from 'src/app/services/project-unit.service';
import { ProjectService } from 'src/app/services/project.service';
import { ReportService } from 'src/app/services/report.service';
import { ReportFilterComponent } from './report-filter/report-filter.component';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  @ViewChild('wipFilter')
  reportFilter!: ReportFilterComponent;
  @ViewChild('ipoFilter')
  reportFilterIPO!: ReportFilterComponent;

  reportForm!: FormGroup;
  account!: Account;
  wipReport: any[] = [];
  ipoReport: any[] = [];
  projectUnits: any[] = [];
  filterIPOForm!: FormGroup;
  filterWIPForm!: FormGroup;

  wipTableColumns: Array<any> = [
    { title: 'No.', value: 'slno' },
    { title: 'Main Contractor', value: 'contractor' },
    { title: 'Project', value: 'name' },
    { title: 'PO Number', value: 'poNumber' },
    { title: 'Project Unit', value: 'projectUnit' },
    { title: 'Unit ID', value: 'unitNumber' },
    { title: 'Unit Value', value: 'unitValue' },
    { title: 'Total WIP(%)', value: 'totalWIP' },
    { title: 'Total Billed Value', value: 'totalBilledValue' },
    { title: 'Balance WIP(%)', value: 'balance' },
    { title: 'Balance Unit Value', value: 'balanceUnitValue' },
    { title: 'Status', value: 'status' },
    { title: 'Start Date', value: 'startDate' },
    { title: 'End Date', value: 'endDate' },
  ];
  ipoTableColumns: Array<any> = [
    { title: 'No.', value: 'slno' },
    { title: 'Main Contractor', value: 'contractor' },
    { title: 'Project', value: 'name' },
    { title: 'Project Unit', value: 'projectUnit' },
    { title: 'Unit ID', value: 'unitNumber' },
    { title: 'Unit Value', value: 'unitValue' },
    { title: 'Admin Cost(%)', value: 'adminCost' },
    { title: 'Days', value: 'days' },
    { title: 'Est.Cost', value: 'estimatedCost' },
    { title: 'Est.Margin', value: 'estimatedProfit' },
    { title: 'Actual Cost', value: 'actualCost' },
    { title: 'Actual Profit', value: 'actualProfit' },
    { title: 'Actual hours(T)', value: 'actualTMH' },
    { title: 'Actual hours(H)', value: 'actualHMH' },
    { title: 'Start Date', value: 'startDate' },
    { title: 'End Date', value: 'endDate' },
  ];

  constructor(
    private reportService: ReportService,
    private router: Router,
    private accountService: AccountService,
    private projectUnitService: ProjectUnitService,
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.filterIPOForm = this.fb.group({
      mainContractor: [''],
      projectName: [''],
      projectUnit: [''],
      unitId: [''],
    });
    this.filterWIPForm = this.fb.group({
      mainContractor: [null],
      projectName: [null],
      projectUnit: [null],
      unitId: [null],
    });
    this.getWorkInProgressReport();
    this.getInstallationProgressOverviewReport();
    this.getProjectUnits();
    this.accountService.get().subscribe((account: Account) => {
      this.account = account;
    });
  }

  getProjectUnits() {
    this.projectUnitService.getUnits().subscribe((units) => {
      this.projectUnits = units;
    });
  }

  getTotalWip(key: string) {
    return this.wipReport
      .map((t) => t[key])
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalIpo(key: string) {
    return this.ipoReport
      .map((t) => t[key])
      .reduce((acc, value) => acc + value, 0);
  }

  getWorkInProgressReport() {
    const filter = {
      mainContractor: this.reportFilter?.mainContractorMultiCtrl?.value
        ? this.covertToWhereIN(
            this.reportFilter?.mainContractorMultiCtrl?.value
          )
        : '',
      projectName: this.reportFilter?.projectMultiCtrl?.value
        ? this.covertToWhereIN(this.reportFilter?.projectMultiCtrl?.value)
        : '',
      projectUnit: this.reportFilter?.projectUnitMultiCtrl?.value
        ? this.covertToWhereIN(this.reportFilter?.projectUnitMultiCtrl?.value)
        : '',
      unitNumber: this.reportFilter?.unitNumberMultiCtrl?.value
        ? this.covertToWhereIN(this.reportFilter?.unitNumberMultiCtrl?.value)
        : '',
      startDate: this.reportFilter?.startDate?.value
        ? moment(this.reportFilter?.startDate?.value).format('MM/DD/YYYY')
        : '',
      endDate: this.reportFilter?.endDate?.value
        ? moment(this.reportFilter?.endDate?.value).format('MM/DD/YYYY')
        : '',
    };
    console.log('WIP', filter);

    this.reportService.getWorkInProgressReport(filter).subscribe((res) => {
      this.wipReport = res;
    });
  }

  covertToWhereIN(selected: Array<any>) {
    return selected.reduce((acc, value, i) => {
      if (i === selected.length - 1) {
        return (acc += `'${value.name}')`);
      }
      return `${acc}'${value.name}',`;
    }, '(');
  }

  getInstallationProgressOverviewReport() {
    const filter = {
      mainContractor: this.reportFilterIPO?.mainContractorMultiCtrl?.value
        ? this.covertToWhereIN(
            this.reportFilterIPO?.mainContractorMultiCtrl?.value
          )
        : '',
      projectName: this.reportFilterIPO?.projectMultiCtrl?.value
        ? this.covertToWhereIN(this.reportFilterIPO?.projectMultiCtrl?.value)
        : '',
      projectUnit: this.reportFilterIPO?.projectUnitMultiCtrl?.value
        ? this.covertToWhereIN(
            this.reportFilterIPO?.projectUnitMultiCtrl?.value
          )
        : '',
      unitNumber: this.reportFilterIPO?.unitNumberMultiCtrl?.value
        ? this.covertToWhereIN(this.reportFilterIPO?.unitNumberMultiCtrl?.value)
        : '',
      startDate: this.reportFilterIPO?.startDate?.value
        ? moment(this.reportFilterIPO?.startDate?.value).format('MM/DD/YYYY')
        : '',
      endDate: this.reportFilterIPO?.endDate?.value
        ? moment(this.reportFilterIPO?.endDate?.value).format('MM/DD/YYYY')
        : '',
    };
    console.log('WIP', filter);
    this.reportService
      .getInstallationProgressOverviewReport(filter)
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
        total: [
          { name: 'Total Unit Value', key: 'unitValue', isCurrency: true },
          //{ name: 'Total WIP', key: 'totalWIP', isCurrency: false },
          {
            name: 'Total Billed Value',
            key: 'totalBilledValue',
            isCurrency: true,
          },
          //{ name: 'Balance', key: 'balance', isCurrency: false },
          {
            name: 'Balance Unit Value',
            key: 'balanceUnitValue',
            isCurrency: true,
          },
        ].map((t) => {
          return {
            name: t.name,
            value: this.getTotalWip(t.key),
            isCurrency: t.isCurrency,
          };
        }),
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
        total: [
          { name: 'Total Unit Value', key: 'unitValue' },
          { name: 'Estimated Cost', key: 'estimatedCost' },
          { name: 'Estimated Profit', key: 'estimatedProfit' },
          { name: 'Actual Cost', key: 'actualCost' },
          { name: 'Actual Profit', key: 'actualProfit' },
        ].map((t) => {
          return {
            name: t.name,
            value: this.getTotalIpo(t.key),
            isCurrency: true,
          };
        }),
      },
    };
    this.router.navigate(['/report/preview']);
  }

  getColumns(columns: Array<Object>) {
    return columns.map((m: any) => m.value);
  }

  filterWIPReport() {
    this.getWorkInProgressReport();
  }
  filterIPOReport() {
    this.getInstallationProgressOverviewReport();
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

  getStatus(value: number) {
    return this.projectService.getStatus(value);
  }

  clearAllFilters(event: boolean) {
    if (event) {
      this.getWorkInProgressReport();
      this.getInstallationProgressOverviewReport();
    }
  }
}
