import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {DashboardConstant} from '../../../constant/dashboard/dashboard.constant';
import {HrDashboardService} from '../../services/hr-dashboard/hr-dashboard.service';

@Component({
  selector: 'app-top-employee-day-off',
  templateUrl: './top-employee-day-off.component.html',
  styleUrls: ['./top-employee-day-off.component.scss']
})
export class TopEmployeeDayOffComponent implements OnInit {

  @Input() dateFormat: string;
  @Input() seniorityRange: string[];
  @Input() ageRange: string[];
  @Input() gender: string[];
  @Input() office: string[];
  @Input() teamName: string[];
  @Input() contract: string[];

  hasTopEmployeeDayOff: boolean;
  startDate: Date;
  endDate: Date;

  numberOfRows = NumberConstant.FIVE;
  isUpButtonVisible = true;
  isDownButtonVisible = true;
  clearDayOffFilter = false;
  dayOffTypeFilter = null;
  listAbsence: any[];
  private periodEnum = DashboardConstant.DEFAULT_PERIOD_ENUM;
  clearDayOffTypeFilter = false;
  private isFirstChange = true;
  typeDayOffList: string[];


  constructor(public dashService: HrDashboardService) {
  }

  ngOnInit() {
    this.getListDayOffType();
  }

  changeList(periodEnum = this.periodEnum) {
    this.dashService.getKPIDayOffPerFamilyTypeEmployeePerPeriod(periodEnum, this.gender, this.teamName, this.ageRange, this.seniorityRange,
      this.contract, this.office, this.numberOfRows, this.dayOffTypeFilter)
      .subscribe((data) => {
        if (data.length) {
          this.hasTopEmployeeDayOff = true;
          this.startDate = data[NumberConstant.ZERO].StartPeriod;
          this.endDate = data[NumberConstant.ZERO].EndPeriod;
          this.initDataList(this.groupByKey(data, DashboardConstant.EMPLOYEE_ID));
        } else {
          this.hasTopEmployeeDayOff = false;
          this.listAbsence = [];
        }
      });
  }

  private initDataList(dataList: any[]) {
    const keys = Object.keys(dataList);
    this.listAbsence = [];
    keys.forEach(k => {
      let numberDayOff = 0;
      dataList[k].forEach(employee => {
        numberDayOff += employee.TotalDayOff;
      });
      this.listAbsence.push({
        FirstName: dataList[k][NumberConstant.ZERO].FirstName,
        LastName: dataList[k][NumberConstant.ZERO].LastName,
        TotalDayOff: numberDayOff
      });
    });
    this.listAbsence.sort((a, b) => (a.TotalDayOff < b.TotalDayOff) ? 1 : -1);
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

  ChangeNumberOfRows(newNumber: number) {
    this.numberOfRows = newNumber;
    this.changeList();
  }

  onSelectTypeDayOff(dayOffType: string[]) {
    if (!dayOffType.length) {
      this.dayOffTypeFilter = [];
      this.dayOffTypeFilter.push(this.typeDayOffList[NumberConstant.ZERO]);
    } else {
      this.dayOffTypeFilter = dayOffType;
    }
    this.changeList(this.periodEnum);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    if (this.isFirstChange) {
      this.isFirstChange = false;
    } else {
      this.changeList();
    }
  }

  changePeriod(period: number) {
    this.periodEnum = period;
    this.changeList();
  }

  private getListDayOffType() {
    this.dashService.getDayOffType().subscribe(data => {
      this.typeDayOffList = data;
      if (this.typeDayOffList.length) {
        this.dayOffTypeFilter = [];
        this.dayOffTypeFilter.push(this.typeDayOffList[NumberConstant.ZERO]);
      }
      this.changeList(this.periodEnum);
    });
  }
}
