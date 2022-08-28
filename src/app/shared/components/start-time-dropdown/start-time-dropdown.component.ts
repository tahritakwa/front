import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Time } from '@angular/common';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { PeriodService } from '../../../administration/services/period/period.service';
import { FormGroup, FormArray } from '@angular/forms';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { LeaveRequestConstant } from '../../../constant/payroll/leave.constant';

@Component({
  selector: 'app-start-time-dropdown',
  templateUrl: './start-time-dropdown.component.html',
  styleUrls: ['./start-time-dropdown.component.scss']
})
export class StartTimeDropdownComponent implements OnInit, OnChanges {
  @Input() group: FormGroup;
  @Input() timeSheetDay: FormGroup;
  @Input() allowCustom;
  @Input() disabled;
  @Input() startDateTime: Date;
  @Output() Selected = new EventEmitter<number>();
  public timeFiltredDataSource: Time[];
  constructor(private periodService: PeriodService) { }

  ngOnInit() {
    if (this.timeSheetDay) {
      this.timeFiltredDataSource = this.Hours.value as Time[];
    } else {
      this.initTimeDataSource();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only run when property startDateTime changed
    if (changes[LeaveRequestConstant.START_DATE_TIME]) {
      this.startDateTime = changes[LeaveRequestConstant.START_DATE_TIME].currentValue;
      this.initTimeDataSource();
    }
  }

  /**
   * Initialize the data source of Time comboboxs
  */
  private initTimeDataSource(): void {
    if (this.startDateTime) {
      this.periodService.GetHoursPeriodOfDate(this.startDateTime).subscribe(data => {
        this.timeFiltredDataSource = data;
      });
    }
  }

  public onSelectTime($event) {
    this.Selected.emit($event);
  }

  get Hours() {
    return this.timeSheetDay.get(ProjectConstant.HOURS) as FormArray;
  }

}
