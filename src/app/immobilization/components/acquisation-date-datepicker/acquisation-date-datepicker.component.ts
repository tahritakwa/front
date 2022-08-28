import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
@Component({
  selector: 'app-acquisation-date-datepicker',
  templateUrl: './acquisation-date-datepicker.component.html',
  styleUrls: ['./acquisation-date-datepicker.component.scss']
})
export class AcquisationDateDatepickerComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  @Input() DateName: string;
  @Input() change;
  @Input() max;
  @Input() min;
  constructor(private translate: TranslateService) { }
  ngOnInit() {
  }
  get AcquisationDate(): FormControl {
    return this.form.get('AcquisationDate') as FormControl;
  }
}
