import {Component, ElementRef, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DashboardConstant} from '../../../constant/dashboard/dashboard.constant';
import {Candidacy} from '../../../models/dashboard/candidacy.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HrDashboardService} from '../../services/hr-dashboard/hr-dashboard.service';
import {TranslateService} from '@ngx-translate/core';
import {period} from '../../../constant/shared/services.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {changeChartSize, InitLabels, setLabel, timeToFillBarChartOption} from '../../../shared/helpers/chart.helper';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-avg-ttf',
  templateUrl: './avg-ttf.component.html',
  styleUrls: ['./avg-ttf.component.scss']
})
export class AvgTtfComponent implements OnInit {

  @ViewChildren(DashboardConstant.AVERAGE_TIME_TO_FILL_CHART) chartDiv: QueryList<ElementRef>;

  @Input() dateFormat: string;
  @Input() genderList: string[];
  @Input() officeList: string[];
  @Input() recruitmentDescriptionList: string[];

  ttfList: Array<Candidacy>;
  dataLoading: boolean;
  ttfPeriod: string;
  startDate: Date;
  endDate: Date;
  ttfChart;
  echarts = require('echarts');

  periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  ttfData: any;
  hasTtfData: boolean;
  ttfFilterForm: FormGroup;
  isFilterOn = false;
  clearFilters = false;

  labels: any;


  constructor(public dashService: HrDashboardService, private fb: FormBuilder, private translate: TranslateService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    this.createTtfFilterForm();
    this.changeChart(this.periodEnum);
  }

  changeChart(periodEnum?: number) {
    this.clearCharts();
    this.initTtfChart(periodEnum);
    this.ngAfterViewInit();
  }

  private clearCharts() {
    this.ttfList = null;
    this.hasTtfData = false;
  }

  private initTtfChart(periodEnum = this.periodEnum) {
    this.dataLoading = true;
    this.labels = InitLabels(this.localStorageService.getLanguage());
    this.periodEnum = periodEnum;
    this.ttfPeriod = period[periodEnum];
    if (this.ttfFilterForm) {
      this.dashService.getKPIFromAverageTimeToFillStoredProcedure(periodEnum, this.ttfFilterForm.getRawValue())
        .subscribe((data) => {
          this.initChart(data);
        });
    }
  }

  private initChart(data: any) {
    this.ttfList = data;
    this.ttfData = this.getTtfData(this.ttfList);
    if (this.ttfList.length > NumberConstant.ZERO) {
      this.hasTtfData = true;
      this.startDate = this.ttfList[NumberConstant.ZERO].StartPeriod;
      this.endDate = this.ttfList[NumberConstant.ZERO].EndPeriod;
    } else {
      this.clearTtfCharts();
    }
    this.dataLoading = false;
  }

  private getTtfData(rateList: Candidacy[]): any {
    const recruitmentDescriptionList = [];
    const delayBeforeRecruitmentList = [];
    const recruitmentDurationList = [];
    const dataList = this.groupByKey(rateList, DashboardConstant.RECRUITMENT_DESCRIPTION);
    const keys = Object.keys(dataList);
    keys.forEach(k => {
      let delayBeforeRecruitment = NumberConstant.ZERO;
      let recruitmentDuration = NumberConstant.ZERO;
      dataList[k].forEach(employee => {
        delayBeforeRecruitment += employee.DelayBeforeRecruitment;
        recruitmentDuration += employee.RecruitmentDuration;
      });
      recruitmentDescriptionList.push(k);
      delayBeforeRecruitmentList.push(delayBeforeRecruitment);
      recruitmentDurationList.push(recruitmentDuration);
    });

    const dataGlobal = {
      ['RecruitmentDescription']: recruitmentDescriptionList,
      ['DelayBeforeRecruitment']: delayBeforeRecruitmentList,
      ['RecruitmentDuration']: recruitmentDurationList
    };
    return dataGlobal;
  }


  private clearTtfCharts() {
    this.ttfList = null;
    this.hasTtfData = false;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.chartDiv) {
      this.chartDiv.changes.subscribe(({first: elm}) => {
        if (elm) {
          this.ttfChart = this.echarts.init(elm.nativeElement);
          const ttfChartOption = timeToFillBarChartOption(this.ttfData, this.labels.time_to_fill_labels, this.translate,
            this.localStorageService.getLanguage());
          this.ttfChart.setOption(ttfChartOption);
          setLabel(this.ttfChart);
          changeChartSize(this.ttfChart);
        }
      });
    }
  }

  onSelectGender(sex: any[]) {
    if (sex.length) {
      const x = [];
      sex.forEach(s => s[NumberConstant.ZERO] === 'F' ? x.push('Femme') : x.push('Homme'));
      this.ttfFilterForm.controls['Sex'].patchValue(x);
      this.isFilterOn = true;
    } else {
      this.ttfFilterForm.controls['Sex'].patchValue(null);
      this.checkForm(this.ttfFilterForm);
    }
    this.changeChart();
  }

  onSelectRecruitmentDescription(recruitment: any[]) {
    if (recruitment.length) {
      this.ttfFilterForm.controls['RecruitmentDescription'].patchValue(recruitment);
      this.isFilterOn = true;
    } else {
      this.ttfFilterForm.controls['RecruitmentDescription'].patchValue(null);
      this.checkForm(this.ttfFilterForm);
    }
    this.changeChart();
  }

  onSelectOffice(office: any[]) {
    if (office.length) {
      this.ttfFilterForm.controls['Office'].patchValue(office);
      this.isFilterOn = true;
    } else {
      this.ttfFilterForm.controls['Office'].patchValue(null);
      this.checkForm(this.ttfFilterForm);
    }
    this.changeChart();
  }

  private createTtfFilterForm() {
    this.ttfFilterForm = this.fb.group({
      Sex: [],
      Office: [],
      RecruitmentDescription: []
    });
  }

  // tslint:disable-next-line:no-shadowed-variable
  changePeriod(period: number) {
    this.clearFilters = !this.clearFilters;
    this.ttfFilterForm.reset();
    this.isFilterOn = false;
    this.changeChart(period);
  }

  private checkForm(fg: FormGroup) {
    if (!Object.keys(fg.value).some(k => !!fg.value[k])) {
      this.isFilterOn = false;
    }
  }


  groupByKey(array, key) {
    return array
      .reduce((hash, obj) => {
        if (obj[key] === undefined) {
          return hash;
        }
        return Object.assign(hash, {[obj[key]]: (hash[obj[key]] || []).concat(obj)});
      }, {});
  }

}

