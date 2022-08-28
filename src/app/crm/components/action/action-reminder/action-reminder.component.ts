import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EnumValues} from 'enum-values';
import {TranslateService} from '@ngx-translate/core';
import {ReminderTypeEnum} from '../../../../models/crm/enums/reminderType.enum';
import {FrequencyUnity} from '../../../../models/crm/enums/frequencyUnity';
import {GenericCrmService} from '../../../generic-crm.service';

@Component({
  selector: 'app-action-reminder',
  templateUrl: './action-reminder.component.html',
  styleUrls: ['./action-reminder.component.scss']
})
export class ActionReminderComponent implements OnInit {

  @Input() reminderFG: FormGroup;
  @Input() disabled = false;

  public reminderTypes = [];
  public reminderFrequencyUnities = [];

  /**
   *
   * @param translate
   * @param genericCrmService
   */
  constructor(private translate: TranslateService, private genericCrmService: GenericCrmService) {
  }

  ngOnInit() {
    this.getRemindersType();
    this.getRemindersFrequencyUnities();
  }

  public getRemindersType() {
    const reminderTypes = EnumValues.getNames(ReminderTypeEnum);
    this.reminderTypes = reminderTypes.map((reminderType: any) => {
      return reminderType = {enumValue: reminderType, enumText: this.translate.instant(reminderType)};
    });
  }

  get delayUnity(): FormControl {
    return this.reminderFG.get('delayUnity') as FormControl;
  }

  public getUnityText() {
    if (this.delayUnity.value) {
      return this.delayUnity.value.enumText;
    } else {
      return '';
    }
  }

  public getRemindersFrequencyUnities() {
    const reminderTypes = EnumValues.getNames(FrequencyUnity);
    this.reminderFrequencyUnities = reminderTypes.map((unity: any) => {
      return unity = {enumValue: unity, enumText: this.translate.instant(unity)};
    });
  }

  numberOnly(event: KeyboardEvent) {
    return this.genericCrmService.isNumber(event);
  }
}
