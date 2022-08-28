import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FiscalYearStateEnumerator} from '../../../models/enumerators/fiscal-year-state-enumerator.enum';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {TranslateService} from '@ngx-translate/core';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-closing-state',
  templateUrl: './closing-state.component.html',
  styleUrls: ['./closing-state.component.scss']
})
export class ClosingStateComponent implements OnInit {
  @ViewChild(ComboBoxComponent) public closingState: ComboBoxComponent;
  @Input() group;
  public closingStateFilteredList: any;
  public closingStateList: any;
  public selectedClosingStateInFilter: any;
  @Output() selectedValue = new EventEmitter<boolean>();

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    this.initClosingStateList();
  }

  initClosingStateList() {
    this.closingStateList = [{
      value: FiscalYearStateEnumerator.Closed,
      text: this.translate.instant(SharedAccountingConstant.CLOSED),
      disable: true
    },
      {
        value: FiscalYearStateEnumerator.PartiallyClosed,
        text: this.translate.instant(SharedAccountingConstant.PARTIALLY_CLOSED),
        disable: true
      },
      {
        value: FiscalYearStateEnumerator.Open,
        text: this.translate.instant(SharedAccountingConstant.OPEN),
        disable: true
      },
      {
        value: FiscalYearStateEnumerator.Concluded,
        text: this.translate.instant(SharedAccountingConstant.CONCLUDED),
        disable: true
      }];
    this.closingStateFilteredList = this.closingStateList;
  }

  handleFilterClosingState(writtenValue) {
    this.closingStateFilteredList = this.closingStateList.filter((s) =>
      s.text.toLowerCase().includes(writtenValue.toLowerCase())
      || s.text.toLocaleLowerCase().includes(writtenValue.toLowerCase())
    );
  }
  closingStateValueChange($event) {
    this.selectedValue.emit($event);
  }
}
