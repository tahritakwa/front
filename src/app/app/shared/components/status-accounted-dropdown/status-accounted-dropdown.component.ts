import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ImportDocumentConstants} from '../../../../constant/accounting/import-document.constant';
import {accountingStatus} from '../../../../models/enumerators/document.enum';
import {TranslateService} from '@ngx-translate/core';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {FormGroup} from '@angular/forms';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-status-accounted-dropdown',
  templateUrl: './status-accounted-dropdown.component.html',
  styleUrls: ['./status-accounted-dropdown.component.scss']
})
export class StatusAccountedDropdownComponent implements OnInit {
  @Input() form: FormGroup;
  public dropDownFilterData: any;
  public statusCode = accountingStatus;
  public accountedList = false;
  // choosenFilter name proprety
  public choosenFilter: string;
  public isAccounted = false;
  public status = NumberConstant.TWO;
  @Output() selectedValue = new EventEmitter<Number>();
  @ViewChild(ComboBoxComponent) public statusAccountedComponent: ComboBoxComponent;
  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.initDropDownFilterList();
  }
  initDropDownFilterList() {
    this.dropDownFilterData = [{
      text: this.translate.instant(ImportDocumentConstants.ALL),
      value: this.statusCode.All
    }, {
      text: this.translate.instant(ImportDocumentConstants.ACCOUNTED),
      value: this.statusCode.Accounted
    }, {
      text: this.translate.instant(ImportDocumentConstants.NOT_ACCOUNTED),
      value: this.statusCode.NotAccounted
    }];
  }
  public onChangeStatus(status: number) {
    if (status === this.statusCode.All) {
      this.choosenFilter = this.translate.instant(ImportDocumentConstants.ALL);
      this.accountedList = false;
      this.isAccounted = null;
    } else if (status === this.statusCode.Accounted) {
      this.choosenFilter = this.translate.instant(ImportDocumentConstants.ACCOUNTED);
      this.accountedList = true;
      this.isAccounted = true;
    } else {
      this.choosenFilter = this.translate.instant(ImportDocumentConstants.NOT_ACCOUNTED);
      this.accountedList = false;
      this.isAccounted = false;
    }
    this.status = status;
    this.selectedValue.emit(status);
  }
}
