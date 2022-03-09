import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-total',
  templateUrl: './report-total.component.html',
  styleUrls: ['./report-total.component.scss'],
})
export class ReportTotalComponent implements OnInit {
  @Input('reportTotal') reportTotal: Array<any> = [];
  constructor() {}

  ngOnInit(): void {}
}
