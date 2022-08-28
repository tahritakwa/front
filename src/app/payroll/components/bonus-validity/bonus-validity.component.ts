import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BonusConstant } from '../../../constant/payroll/bonus.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';


@Component({
  selector: 'app-bonus-validity',
  templateUrl: './bonus-validity.component.html',
  styleUrls: ['./bonus-validity.component.scss']
})
export class BonusValidityComponent implements OnInit {
  @Input() ValidityFormGroup: FormGroup;
  @Output() valueChange = new EventEmitter<any>();
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

  get Value(): FormControl {
    return this.ValidityFormGroup.get(BonusConstant.VALUE) as FormControl;
  }
  get StartDate(): FormControl {
    return this.ValidityFormGroup.get(BonusConstant.START_DATE) as FormControl;
  }
  startDateChanged($event) {
    this.valueChange.emit($event);
  }
}
