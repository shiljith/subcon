import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ChartConfiguration,
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
} from 'chart.js';
import { NgChartsConfiguration } from 'ng2-charts';
import { Account } from 'src/app/models/account';
import { Project } from 'src/app/models/project';
import { AccountService } from 'src/app/services/account.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        display: true,
        beginAtZero: true,

        title: {
          display: true,
          text: 'Amount',
        },
        ticks: {
          callback: function (value, index, values) {
            if (value >= 1000) {
              return Number(value) / 1000 + 'k';
            }
            return value;
          },
        },
      },
    },
  };
  lineChartData!: any;
  pieChartData: any;
  tileValues: any;
  manHour: any;
  projectCount: number = 0;
  totalWorkValue: number = 0;
  totalBilled: number = 0;
  balanceWorkValue: number = 0;
  displayedColumns: string[] = ['slNo', 'name', 'contractor', 'status'];
  pinnedProjects: Project[] = [];
  projectUnitCount: any = {
    escalator: 0,
    elevator: 0,
    travalator: 0,
  };
  technicianSalary: number = 0;
  helperSalary: number = 0;

  constructor(
    private dasboardService: DashboardService,
    private projectService: ProjectService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getProjectCount();
    this.getTotalWorkValue();
    this.getTotalBilled();
    this.getBalanceWorkValue();
    this.getWorkValueData();
    this.getProjectStatus();
    this.getPinnedProjects();
    this.getProjectUnitCount();
    this.getManHour();
    this.getAccountDetails();
  }

  getAccountDetails() {
    this.accountService.get().subscribe((account: Account) => {
      console.log('ACCOUNT', account);

      this.technicianSalary = account.technicianSalary;
      this.helperSalary = account.helperSalary;
    });
  }

  getProjectUnitCount() {
    this.dasboardService.getProjectUnitCount().subscribe((res) => {
      this.projectUnitCount = res;
    });
  }

  getPinnedProjects() {
    this.projectService.getPinned().subscribe((projects) => {
      this.pinnedProjects = projects;
    });
  }

  getProjectCount() {
    this.dasboardService.getProjectCount().subscribe((result) => {
      this.projectCount = result ? result : 0;
    });
  }

  getTotalWorkValue() {
    this.dasboardService.getTotlaWorkValue().subscribe((result) => {
      this.totalWorkValue = result ? result : 0;
    });
  }

  getTotalBilled() {
    this.dasboardService.getTotalBilled().subscribe((result) => {
      this.totalBilled = result ? result : 0;
    });
  }

  getBalanceWorkValue() {
    this.dasboardService.getBalanceWorkValue().subscribe((result) => {
      this.balanceWorkValue = result.reduce(
        (acc: any, value: any) => acc + value.balanceWorkValue,
        0
      );
    });
  }

  getDashboardTileValues() {
    this.dasboardService.getTileValues().subscribe((tileValues) => {
      this.tileValues = tileValues;
    });
  }

  getProjectStatus() {
    this.dasboardService.getProjectStatus().subscribe((data: any) => {
      this.pieChartData = data;
    });
  }

  getWorkValueData() {
    this.dasboardService.getWorkValueData().subscribe((data: any) => {
      this.lineChartData = data;
    });
  }

  getManHour() {
    this.dasboardService.getManHour().subscribe((data: any) => {
      this.manHour = data;
    });
  }

  setStatus(status: number) {
    return this.projectService.getStatus(status);
  }

  goToProject(id: number) {
    this.router.navigate(['/project', id]);
  }

  formatCurrency(actualAmount: number): number {
    let amount = 0;
    console.log(actualAmount);
    if (actualAmount >= 1000 && actualAmount < 1000000) {
      amount = actualAmount / 1000;
    } else if (actualAmount >= 1000000) {
      amount = actualAmount / 1000000;
    } else {
      amount = actualAmount;
    }
    console.log(amount);
    return amount;
  }
  getCurrencySymbol(actualAmount: number): string {
    let symbol = '';
    if (actualAmount >= 1000 && actualAmount < 1000000) {
      symbol = 'K';
    } else if (actualAmount >= 1000000) {
      symbol = 'M';
    }
    return symbol;
  }
}
