import { Component, Input, OnInit } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, State } from '@progress/kendo-data-query';
import { CompanyService } from '../../../../../administration/services/company/company.service';
import { SharedConstant } from '../../../../../constant/shared/shared.constant';
import { TreasuryConstant } from '../../../../../constant/treasury/treasury.constant';
import { NumberConstant } from '../../../../../constant/utility/number.constant';
import { Currency } from '../../../../../models/administration/currency.model';
import { PaymentStatusEnumerator } from '../../../../../models/enumerators/payment-status.enum';
import { ColumnSettings } from '../../../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../../../shared/utils/grid-settings.interface';
import {LocalStorageService} from '../../../../../login/Authentification/services/local-storage-service';
@Component({
  selector: 'app-wallet-grid',
  templateUrl: './wallet-grid.component.html',
  styleUrls: ['./wallet-grid.component.scss']
})
export class WalletGridComponent implements OnInit {

  @Input() walletType: string;
  @Input() typeTiers: string;
  paymentStatus = PaymentStatusEnumerator;
  language: string;
  userCurrency: Currency;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  columnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.CODE_FIELD,
      title: TreasuryConstant.CODE_SETTLEMENT_TITLE,
      filterable: false
    },
    {
      field: TreasuryConstant.TIERS_NAVIGATION,
      title: TreasuryConstant.CLIENT,
      filterable: false
    },
    {
      field: TreasuryConstant.SETTLEMENT_DATE,
      title: TreasuryConstant.SETTLEMENT_DATE_TITLE,
      filterable: false
    },
    {
      field: TreasuryConstant.COMMITMENT_DATE,
      title: TreasuryConstant.COMMITMENT_DATE_TITLE,
      filterable: false
    },
    {
      field: TreasuryConstant.AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.AMOUNT,
      filterable: false
    },
    {
      field: TreasuryConstant.ID_PAYMENT_STATUS,
      title: TreasuryConstant.STATUS,
      filterable: false
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

  gridData: DataResult = new Object() as DataResult;

  gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
    gridData: this.gridData
  };

  constructor(private companyService: CompanyService, private localStorageService : LocalStorageService) {
      this.language = this.localStorageService.getLanguage();

  }

  ngOnInit() {
    this.companyService.getCurrentCompany().subscribe(company => {
      this.userCurrency = company.IdCurrencyNavigation;
    });
    this.initGridDataSource();
  }

  initGridDataSource() {
    const data = [];
    this.gridSettings.gridData.data = data ? data : [];
    this.gridSettings.gridData.total = data ? data.length : 0;
  }

  dataStateChange($event: State) {
    this.gridSettings.state = $event;
    this.initGridDataSource();
  }
}
