import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { LanguageService } from '../../services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { TimeSheetConstant } from '../../../constant/rh/timesheet.constant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-action-dropdown',
  templateUrl: './action-dropdown.component.html',
  styleUrls: ['./action-dropdown.component.scss']
})
export class ActionDropdownComponent implements OnInit {


  @Input() Actions;
  @Input() selectedStatus;
  @Input() selectionLength;
  public ActionList = [];

  @Output() selectedValue = new EventEmitter<any>();

  constructor(public translate: TranslateService, private growlService: GrowlService) { }


  ngOnInit() {
    this.Actions.forEach(element => {
      element = this.translate.instant(element);
      this.ActionList.push(element);
    });
  }

  onSelect(x: string) {
    if (this.selectedStatus === false && this.selectionLength === NumberConstant.ZERO) {
          this.growlService.warningNotification(this.translate.instant(SharedConstant.STATUS_NOT_SET));
    } else {
      if (this.selectionLength === NumberConstant.ZERO ) {
        this.growlService.warningNotification(this.translate.instant(SharedConstant.DATA_NOT_SELECTED));
      } else {
      this.selectedValue.emit(x);
      this.selectedStatus = false ;
      }
    }
  }

}
