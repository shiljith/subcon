import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.scss'],
})
export class ReportPreviewComponent implements OnInit {
  report: any;
  constructor(
    private reportService: ReportService,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.report = this.reportService.report;
    if (!this.report) {
      this.close();
    }
  }

  print() {
    window.print();
  }

  close() {
    this.router.navigate(['/report']);
  }

  getColumns() {
    return this.report?.tableSource?.header.map((m: any) => m.value);
  }

  getStatus(value: number) {
    return this.projectService.getStatus(value);
  }
}
