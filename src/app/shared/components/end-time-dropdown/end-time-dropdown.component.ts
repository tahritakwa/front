import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Time } from '@angular/common';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { PeriodService } from '../../../administration/services/period/period.service';
import { FormGroup, FormArray } from '@angular/forms';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { LeaveRequestConstant } from '../../../constant/payroll/leave.constant';

@Component({
  selector: 'app-end-time-dropdown',
  templateUrl: './end-time-dropdown.component.html',
  styleUrls: ['./end-time-dropdown.component.scss']
})
export class EndTimeDropdownComponent implements OnInit, OnChanges {
  @Input() group: FormGroup;
  @Input() timeSheetDay: FormGroup;
  @Input() allowCustom;
  @Input() disabled;
  @Input() endDateTime: Date;
  @Output() Selected = new EventEmitter<number>();
  public timeFiltredDataSource: Time[];
  constructor(private periodService: PeriodService) { }

  ngOnInit() {
    if (this.timeSheetDay) {
      this.timeFiltredDataSource = this.Hours.value as Time[];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only run when property startDateTime changed
    if (changes[LeaveRequestConstant.END_DATE_TIME]) {
      this.endDateTime = changes[LeaveRequestConstant.END_DATE_TIME].currentValue;
      this.initTimeDataSource();
    }
  }

  /**
   * Initialize the data source of Time comboboxs
  */
  private initTimeDataSource(): void {
    if (this.endDateTime) {
      this.periodService.GetHoursPeriodOfDate(this.endDateTime).subscribe(data => {
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
