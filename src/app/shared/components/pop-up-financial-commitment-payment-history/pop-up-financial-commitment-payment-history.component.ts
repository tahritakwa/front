import { Component, OnInit, ComponentRef } from '@angular/core';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { Currency } from '../../../models/administration/currency.model';
import { SettlementCommitment } from '../../../models/payment/settlement-commitment.model';
import { Subject } from 'rxjs/Subject';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { FinancialCommitment } from '../../../models/sales/financial-commitment.model';
import { DataResult, State } from '@progress/kendo-data-query';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ColumnSettings } from '../../utils/column-settings.interface';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';
import { LanguageService } from '../../services/language/language.service';
import { UserCurrentInformationsService } from '../../services/utility/user-current-informations.service';
import { TranslateService } from '@ngx-translate/core';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-pop-up-financial-commitment-payment-history',
  templateUrl: './pop-up-financial-commitment-payment-history.component.html',
  styleUrls: ['./pop-up-financial-commitment-payment-history.component.scss']
})
export class PopUpFinancialCommitmentPaymentHistoryComponent implements OnInit {

  options: Partial<IModalDialogOptions<any>>;
  closeDialogSubject: Subject<any>;
  tiersCurrency: Currency;
  language: string;
  settlementCommitments: SettlementCommitment[] = [];
  financialCommitment: FinancialCommitment;
  gridData: DataResult;
  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  columnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.COMMITMENT_TO_SETTLEMENT_CODE,
      title: TreasuryConstant.CODE,
      tooltip: TreasuryConstant.CODE_SETTLEMENT_TITLE,
      filterable: true,
    },
    {
      field: TreasuryConstant.COMMITMENT_TO_SETTLEMENT_DATE,
      title: TreasuryConstant.SETTLEMENT_DATE_TITLE,
      tooltip: TreasuryConstant.SETTLEMENT_DATE_TITLE,
      filterable: true,
    },
    {
      field: TreasuryConstant.COMMITMENT_TO_SETTLEMENT_AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      tooltip: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE,
      filterable: true,
    },
    {
      field: TreasuryConstant.COMMITMENT_TO_SETTLEMENT_WITHHOLDING_TAX,
      title: TreasuryConstant.TOTAL_WITHHOLDING_TAX,
      tooltip: TreasuryConstant.TOTAL_WITHHOLDING_TAX,
      filterable: true,
    },
    {
      field: TreasuryConstant.ASSIGNED_AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.ASSIGNED_AMOUNT,
      tooltip: TreasuryConstant.ASSIGNED_AMOUNT,
      filterable: true,
    },
    {
      field: TreasuryConstant.ASSIGNED_WITHHOLDING_TAX_WITH_CURRENCY,
      title: TreasuryConstant.ASSIGNED_WITHHOLDING_TAX,
      tooltip: TreasuryConstant.ASSIGNED_WITHHOLDING_TAX,
      filterable: true,
    }
  ];


  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private localStorageService : LocalStorageService, private translate: TranslateService) {
    this.language = this.localStorageService.getLanguage();
  }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.gridData = new Object() as DataResult;
    this.gridData.data = this.settlementCommitments;
    this.gridData.total = this.settlementCommitments.length;
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.options = options;
    this.settlementCommitments = Object.assign([], this.options.data);
    this.tiersCurrency = this.settlementCommitments[0].Commitment.IdCurrencyNavigation;
    this.financialCommitment = this.settlementCommitments[0].Commitment;
    this.closeDialogSubject = options.closeDialogSubject;
  }

}
