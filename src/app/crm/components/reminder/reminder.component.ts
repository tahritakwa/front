import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit {
  reminderFormGroup: FormGroup;
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private formBuilder: FormBuilder,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.reminderFormGroup = this.formBuilder.group({
      topic: ['']
    });
  }

}
