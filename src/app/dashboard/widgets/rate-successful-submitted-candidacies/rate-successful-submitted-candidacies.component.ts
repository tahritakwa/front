import {Component, ElementRef, Input, OnInit, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {DashboardConstant} from '../../../constant/dashboard/dashboard.constant';
import {TranslateService} from '@ngx-translate/core';
import {period} from '../../../constant/shared/services.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {changeChartSize, gaugeChart, setLabel} from '../../../shared/helpers/chart.helper';
import {Candidacy} from '../../../models/dashboard/candidacy.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HrDashboardService} from '../../services/hr-dashboard/hr-dashboard.service';

@Component({
  selector: 'app-rate-successful-submitted-candidacies',
  templateUrl: './rate-successful-submitted-candidacies.component.html',
  styleUrls: ['./rate-successful-submitted-candidacies.component.scss']
})

export class RateSuccessfulSubmittedCandidaciesComponent implements OnInit {

  @ViewChildren(DashboardConstant.RATE_SUCCESSFUL_SUBMITTED_CANDIDACIES_CHART) chartDiv: QueryList<ElementRef>;

  @Input() dateFormat: string;
  @Input() genderList: string[];
  @Input() officeList: string[];
  @Input() contractList: string[];

  rateList: Array<Candidacy>;
  dataLoading: boolean;
  ratePeriod: string;
  startDate: Date;
  endDate: Date;
  rateChart;
  echarts = require('echarts');

  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  rateData: any;
  hasRateData: boolean;
  rateFilterForm: FormGroup;
  isFilterOn = false;
  clearFilters = false;


  constructor(public dashService: HrDashboardService, private fb: FormBuilder, private translate: TranslateService) {
  }

  ngOnInit() {
    this.createRateFilterForm();
    this.changeChart(this.periodEnum);
  }

  changeChart(periodEnum?: number) {
    this.clearCharts();
    this.initRateChart(periodEnum);
    this.ngAfterViewInit();
  }

  private clearCharts() {
    this.rateList = null;
    this.hasRateData = false;
  }

  private initRateChart(periodEnum = this.periodEnum) {
    this.dataLoading = true;
    this.periodEnum = periodEnum;
    this.ratePeriod = period[periodEnum];
    if (this.rateFilterForm) {
      this.dashService.getKPIFromRateSuccessfulSubmittedCandidaciesStoredProcedure(periodEnum, this.rateFilterForm.getRawValue())
        .subscribe((data) => {
          this.initChart(data);
        });
    }
  }

  private initChart(data: any) {
    this.rateList = data;
    this.rateData = this.getRateData(this.rateList);
    if (this.rateList.length > NumberConstant.ZERO) {
      this.hasRateData = true;
      this.startDate = this.rateList[NumberConstant.ZERO].StartPeriod;
      this.endDate = this.rateList[NumberConstant.ZERO].EndPeriod;
    } else {
      this.clearTtfCharts();
    }
    this.dataLoading = false;
  }

  private getRateData(rateList: Candidacy[]): any {
    const data: { submittedCandidacies: number, successfulCandidacies: number } = {
      submittedCandidacies: 0,
      successfulCandidacies: 0
    };
    rateList.forEach((x) => {
      if (x.Label === 'SubmittedCandidacies') {
        data.submittedCandidacies += x.TotalNumber;
      } else {
        data.successfulCandidacies += x.TotalNumber;
      }
    });
    return data;
  }


  private clearTtfCharts() {
    this.rateList = null;
    this.hasRateData = false;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({first: elm}) => {
        if (elm) {
          this.rateChart = this.echarts.init(elm.nativeElement);
          const rateChartOption = gaugeChart(this.rateData);
          this.rateChart.setOption(rateChartOption);
          setLabel(this.rateChart);
          changeChartSize(this.rateChart);
        }
      });
    }
  }

  onSelectGender(sex: any[]) {
    if (sex.length) {
      const x = [];
      sex.forEach(s => s[NumberConstant.ZERO] === 'F' ? x.push('Femme') : x.push('Homme'));
      this.rateFilterForm.controls['Sex'].patchValue(x);
      this.isFilterOn = true;
    } else {
      this.rateFilterForm.controls['Sex'].patchValue(null);
      this.checkForm(this.rateFilterForm);
    }
    this.changeChart();
  }

  onSelectContract(contract: any[]) {
    if (contract.length) {
      this.rateFilterForm.controls['Contract'].patchValue(contract);
      this.isFilterOn = true;
    } else {
      this.rateFilterForm.controls['Contract'].patchValue(null);
      this.checkForm(this.rateFilterForm);
    }
    this.changeChart();
  }

  onSelectOffice(office: any[]) {
    if (office.length) {
      this.rateFilterForm.controls['Office'].patchValue(office);
      this.isFilterOn = true;
    } else {
      this.rateFilterForm.controls['Office'].patchValue(null);
      this.checkForm(this.rateFilterForm);
    }
    this.changeChart();
  }

  private createRateFilterForm() {
    this.rateFilterForm = this.fb.group({
      Sex: [],
      Office: [],
      Contract: [],
    });
  }

  // tslint:disable-next-line:no-shadowed-variable
  changePeriod(period: number) {
    this.clearFilters = !this.clearFilters;
    this.rateFilterForm.reset();
    this.isFilterOn = false;
    this.changeChart(period);
  }

  private checkForm(fg: FormGroup) {
    if (!Object.keys(fg.value).some(k => !!fg.value[k])) {
      this.isFilterOn = false;
    }
  }
}
