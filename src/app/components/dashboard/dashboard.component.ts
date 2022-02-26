import { Component, OnInit } from '@angular/core';
import {
  ChartConfiguration,
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
} from 'chart.js';
import { NgChartsConfiguration } from 'ng2-charts';
import { Project } from 'src/app/models/project';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ProjectService } from 'src/app/services/project.service';
const ELEMENT_DATA: any[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  lineChartData!: any;
  pieChartData: any;
  tileValues: any;
  manHour: any;
  projectCount: number = 0;
  totalWorkValue: number = 0;
  totalBilled: number = 0;
  balanceWorkValue: number = 0;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  pinnedProjects: Project[] = [];
  constructor(
    private dasboardService: DashboardService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.getProjectCount();
    this.getTotalWorkValue();
    this.getTotalBilled();
    this.getBalanceWorkValue();
    this.getWorkValueData();
    this.getProjectStatus();
    this.getPinnedProjects();
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
}
