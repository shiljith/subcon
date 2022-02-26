import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  constructor() {}
  projects: any[] = [];
  displayedColumns: string[] = ['slno', 'pNumber', 'name', 'contractor'];
  reportForm!: FormGroup;

  ngOnInit(): void {}

  // generatePDF() {
  //   let docDefinition = {
  //     content: [
  //       // Previous configuration
  //       {
  //         text: 'Project Report',
  //         style: 'sectionHeader',
  //       },
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['*', 'auto', 'auto', 'auto'],
  //           body: [
  //             ['Name', 'Amount', 'Expense', 'Profit'],
  //             ...this.filteredData.map((p) => [
  //               p.name,
  //               p.estimatedAmount,
  //               p.estimatedExpense,
  //               p.estimatedProfit,
  //             ]),
  //           ],
  //         },
  //       },
  //     ],
  //     // Common Styles
  //   };

  //   pdfMake.createPdf(docDefinition).open();
  // }
}
