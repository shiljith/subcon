import { Component, OnInit } from '@angular/core';
import {
  ChartConfiguration,
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
} from 'chart.js';
import { NgChartsConfiguration } from 'ng2-charts';
import { DashboardService } from 'src/app/services/dashboard.service';

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

  constructor(private dasboardService: DashboardService) {}

  ngOnInit(): void {
    this.getDashboardTileValues();
    this.getWorkValueData();
    this.getProjectStatus();
    this.getManHour();
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
