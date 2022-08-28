import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FundsTransferDataSet } from './funds-transfer-section-data';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { FundsTransferConstant } from '../../../../constant/treasury/funds-transfer.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { FormModalDialogService } from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { CashRegisterConstant } from '../../../../constant/treasury/cash-register.constant';
import { FundsTransferAddComponent } from '../../funds-tranfer/funds-transfer-add/funds-transfer-add.component';

@Component({
  selector: 'app-cash-register-funds-transfer-section',
  templateUrl: './cash-register-funds-transfer-section.component.html',
  styleUrls: ['./cash-register-funds-transfer-section.component.scss']
})
export class CashRegisterFundsTransferSectionComponent implements OnInit {

  public gridData = FundsTransferDataSet.cashRegiisterFundsTransferData;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public columnsConfig: ColumnSettings[] = [
    {
      field: FundsTransferConstant.TRANSFER_DATE,
      title: FundsTransferConstant.DATE_TITLE.toUpperCase(),
      filterable: true
    },
    {
      field: FundsTransferConstant.CODE,
      title: FundsTransferConstant.CODE.toUpperCase(),
      filterable: true
    },
    {
      field: FundsTransferConstant.TYPE,
      title: FundsTransferConstant.TYPE.toUpperCase(),
      filterable: true
    },
    {
      field: FundsTransferConstant.SOURCE,
      title: FundsTransferConstant.SOURCE.toUpperCase(),
      filterable: true
    },
    {
      field: FundsTransferConstant.DESTINATION,
      title: FundsTransferConstant.DESTINATION.toUpperCase(),
      filterable: true
    },
    {
      field: FundsTransferConstant.AMOUNT,
      title: FundsTransferConstant.AMOUNT.toUpperCase(),
      filterable: true
    }
  ];

  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  constructor(private modalDialogService: FormModalDialogService, private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
  }

  doSearch() {

  }

  addNewFundTransfert() {
    this.modalDialogService.openDialog(CashRegisterConstant.ADD_CASH_FUND_TRANSFERT,
      FundsTransferAddComponent, this.viewContainerRef, null, null, false, SharedConstant.MODAL_DIALOG_SIZE_ML);
  }

}
