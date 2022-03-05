import { Component, OnInit, ViewChild } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ReportService } from 'src/app/services/report.service';
import { ProjectUnitService } from 'src/app/services/project-unit.service';

export interface MainContractor {
  name: string;
}
export interface Project {
  name: string;
}
export interface ProjectUnit {
  name: string;
}
export interface UnitNumber {
  name: string;
}

@Component({
  selector: 'app-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss'],
})
export class ReportFilterComponent implements OnInit {
  protected mainContractor: MainContractor[] = [];

  public mainContractorMultiCtrl: FormControl = new FormControl();
  public mainContractorMultiFilterCtrl: FormControl = new FormControl();
  public projectUnitMultiCtrl: FormControl = new FormControl();
  public startDate: FormControl = new FormControl();
  public endDate: FormControl = new FormControl();

  public filteredMainContractorsMulti: ReplaySubject<MainContractor[]> =
    new ReplaySubject<MainContractor[]>(1);
  @ViewChild('mainContractorMultiSelect', { static: true })
  mainContractorMultiSelect!: MatSelect;
  protected _onDestroyMainContractor = new Subject<void>();

  protected project: Project[] = [];
  public projectMultiCtrl: FormControl = new FormControl();
  public projectMultiFilterCtrl: FormControl = new FormControl();
  public filteredProjectsMulti: ReplaySubject<Project[]> = new ReplaySubject<
    Project[]
  >(1);
  @ViewChild('projectMultiSelect', { static: true })
  projectMultiSelect!: MatSelect;
  protected _onDestroyProject = new Subject<void>();

  protected unitNumber: UnitNumber[] = [];
  public unitNumberMultiCtrl: FormControl = new FormControl();
  public unitNumberMultiFilterCtrl: FormControl = new FormControl();
  public filteredUnitNumbersMulti: ReplaySubject<UnitNumber[]> =
    new ReplaySubject<UnitNumber[]>(1);
  @ViewChild('unitNumberMultiSelect', { static: true })
  unitNumberMultiSelect!: MatSelect;
  protected _onDestroyUnitNumber = new Subject<void>();

  projectUnits: any[] = [];
  constructor(
    private reportService: ReportService,
    private projectUnitService: ProjectUnitService
  ) {}

  ngOnInit(): void {
    this.getMainContractor();
    this.getProjects();
    this.getProjectUnits();
    this.getUnitNumbers();

    this.mainContractorMultiCtrl.valueChanges.subscribe((selected) => {
      this.getProjects(selected);
      this.getProjectUnits(selected, this.projectMultiCtrl.value);
      this.getUnitNumbers(
        selected,
        this.projectMultiCtrl.value,
        this.projectUnitMultiCtrl.value
      );
    });

    this.projectMultiCtrl.valueChanges.subscribe((selected) => {
      this.getProjectUnits(this.mainContractorMultiCtrl.value, selected);
      this.getUnitNumbers(
        this.mainContractorMultiCtrl.value,
        selected,
        this.projectUnitMultiCtrl.value
      );
    });

    this.projectUnitMultiCtrl.valueChanges.subscribe((selected) => {
      console.log(selected);
      this.getUnitNumbers(
        this.mainContractorMultiCtrl.value,
        this.projectMultiCtrl.value,
        selected
      );
    });
  }

  ngAfterViewInit() {
    this.setInitialMainContractorValue();
    this.setInitialProjectValue();
  }

  getMainContractor(selected: MainContractor[] = []) {
    this.reportService.getMainContractors().subscribe((mainContractor) => {
      this.mainContractor = mainContractor;
      this.filteredMainContractorsMulti.next(this.mainContractor.slice());
      this.mainContractorMultiFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyMainContractor))
        .subscribe(() => {
          this.filterMainContractorsMulti();
        });
    });
  }

  getProjects(selected: Project[] = []) {
    let filter: string = this.covertToWhereIN(selected);
    this.reportService.getProjects(filter).subscribe((project) => {
      this.project = project;
      this.filteredProjectsMulti.next(this.project.slice());
      this.projectMultiFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyProject))
        .subscribe(() => {
          this.filterProjectsMulti();
        });
    });
  }

  getProjectUnits(
    mainContractor: MainContractor[] = [],
    projectName: Project[] = []
  ) {
    let filter = {
      mainContractor: this.covertToWhereIN(mainContractor),
      projectName: this.covertToWhereIN(projectName),
    };
    this.reportService.getProjectUnits(filter).subscribe((units) => {
      this.projectUnits = units;
    });
  }

  getUnitNumbers(
    mainContractor: MainContractor[] = [],
    projectName: Project[] = [],
    projectUnit: ProjectUnit[] = []
  ) {
    let filter = {
      mainContractor: this.covertToWhereIN(mainContractor),
      projectName: this.covertToWhereIN(projectName),
      projectUnit: this.covertToWhereIN(projectUnit),
    };
    console.log('Unit Number', filter);

    this.reportService.getUnitNumbers(filter).subscribe((unitNumber) => {
      this.unitNumber = unitNumber;
      this.filteredUnitNumbersMulti.next(this.unitNumber.slice());
      this.unitNumberMultiFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyUnitNumber))
        .subscribe(() => {
          this.filterUnitNumberMulti();
        });
    });
  }

  ngOnDestroy() {
    this._onDestroyMainContractor.next();
    this._onDestroyMainContractor.complete();
    this._onDestroyProject.next();
    this._onDestroyProject.complete();
    this._onDestroyUnitNumber.next();
    this._onDestroyUnitNumber.complete();
  }

  protected setInitialMainContractorValue() {
    this.filteredMainContractorsMulti
      .pipe(take(1), takeUntil(this._onDestroyMainContractor))
      .subscribe(() => {
        this.mainContractorMultiSelect.compareWith = (
          a: MainContractor,
          b: MainContractor
        ) => a && b && a.name == b.name;
      });
  }

  protected setInitialProjectValue() {
    this.filteredProjectsMulti
      .pipe(take(1), takeUntil(this._onDestroyProject))
      .subscribe(() => {
        this.projectMultiSelect.compareWith = (a: Project, b: Project) =>
          a && b && a.name == b.name;
      });
  }

  protected setInitialUnitNumberValue() {
    this.filteredUnitNumbersMulti
      .pipe(take(1), takeUntil(this._onDestroyUnitNumber))
      .subscribe(() => {
        this.unitNumberMultiSelect.compareWith = (
          a: UnitNumber,
          b: UnitNumber
        ) => a && b && a.name == b.name;
      });
  }

  protected filterMainContractorsMulti() {
    if (!this.mainContractor) {
      return;
    }
    let search = this.mainContractorMultiFilterCtrl.value;
    if (!search) {
      this.filteredMainContractorsMulti.next(this.mainContractor.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredMainContractorsMulti.next(
      this.mainContractor.filter(
        (mainContractor) =>
          mainContractor.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  protected filterProjectsMulti() {
    if (!this.project) {
      return;
    }
    let search = this.projectMultiFilterCtrl.value;
    if (!search) {
      this.filteredProjectsMulti.next(this.project.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredProjectsMulti.next(
      this.project.filter(
        (project) => project.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  protected filterUnitNumberMulti() {
    if (!this.unitNumber) {
      return;
    }
    let search = this.unitNumberMultiFilterCtrl.value;
    if (!search) {
      this.filteredUnitNumbersMulti.next(this.unitNumber.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUnitNumbersMulti.next(
      this.unitNumber.filter(
        (unitNumber) => unitNumber.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  covertToWhereIN(selected: Array<{ name: string }>) {
    if (selected && selected.length > 0) {
      return selected.reduce((acc, value, i) => {
        if (i === selected.length - 1) {
          return (acc += `'${value.name}')`);
        }
        return `${acc}'${value.name}',`;
      }, '(');
    } else {
      return '';
    }
  }
}
