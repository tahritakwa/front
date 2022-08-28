import {Component, Input, OnInit} from '@angular/core';
import {DataResult, State} from '@progress/kendo-data-query';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {DocumentAccountConstant} from '../../../constant/accounting/document-account.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {NumberFormatOptions} from '@progress/kendo-angular-intl';
import {HistoryConstant} from '../../../constant/accounting/historic.constant';
import { TranslateService } from '@ngx-translate/core';
import { IntlService } from "@progress/kendo-angular-intl";

@Component({
  selector: 'app-historic-details-document-account',
  templateUrl: './historic-details-document-account.component.html',
  styleUrls: ['./historic-details-document-account.component.scss']
})
export class HistoricDetailsDocumentAccountComponent implements OnInit {

  @Input()
  public historicItem: any;
  @Input('formatNumberOptions')
  public formatNumberOptions: NumberFormatOptions;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public formatDateTime = this.translate.instant(SharedConstant.DATE_FORMAT);

  public columnsConfig: ColumnSettings[] = [
    {
      field: HistoryConstant.CONCERNED_ELEMENT_FIELD,
      title: HistoryConstant.CONCERNED_ELEMENT_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.OLD_VALUE_FIELD,
      title: HistoryConstant.OLD_VALUE_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.NEW_VALUE_FIELD,
      title: HistoryConstant.NEW_VALUE_COLUMN,
      filterable: true
    }
  ];
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public columnsDocumentAccountLineConfig: ColumnSettings[] = [
    {
      field: DocumentAccountConstant.ACCOUNT_CODE_FIELD,
      title: DocumentAccountConstant.ACCOUNT_CODE_TITLE,
      tooltip: DocumentAccountConstant.ACCOUNT_CODE_TITLE,
      filterable: true,
    },
    {
      field: DocumentAccountConstant.ACCOUNT_NAME_FIELD,
      title: DocumentAccountConstant.ACCOUNT_NAME_TITLE,
      tooltip: DocumentAccountConstant.ACCOUNT_NAME_TITLE,
      filterable: true,
    },
    {
      field: DocumentAccountConstant.DOCUMENT_LINE_DATE_FIELD,
      title: DocumentAccountConstant.DOCUMENT_LINE_DATE_TITLE,
      tooltip: DocumentAccountConstant.DOCUMENT_LINE_DATE_TITLE,
      filterable: true,
    },
    {
      field: DocumentAccountConstant.REFERENCE_FIELD,
      title: DocumentAccountConstant.REFERENCE_TITLE,
      tooltip: DocumentAccountConstant.REFERENCE_TITLE,
      filterable: true
    },
    {
      field: DocumentAccountConstant.LABEL_FIELD,
      title: DocumentAccountConstant.LABEL_TITLE,
      tooltip: DocumentAccountConstant.LABEL_TITLE,
      filterable: true
    },
    {
      field: DocumentAccountConstant.DEBIT_AMOUNT_FIELD,
      title: DocumentAccountConstant.TOTAL_DEBIT_AMOUNT_TITLE,
      tooltip: DocumentAccountConstant.TOTAL_DEBIT_AMOUNT_TITLE,
      filterable: false,
    },
    {
      field: DocumentAccountConstant.CREDIT_AMOUNT_FIELD,
      title: DocumentAccountConstant.TOTAL_CREDIT_AMOUNT_TITLE,
      tooltip: DocumentAccountConstant.TOTAL_CREDIT_AMOUNT_TITLE,
      filterable: false
    }
  ];

  public gridStateDocumentAccountLine: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettingsDocumentAccountLine: GridSettings = {
    state: this.gridStateDocumentAccountLine,
    columnsConfig: this.columnsDocumentAccountLineConfig
  };


  public gridStateDocumentAccount: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettingsDocumentAccount: GridSettings = {
    state: this.gridStateDocumentAccount,
    columnsConfig: this.columnsConfig
  };

  constructor(private translate: TranslateService, public intl: IntlService)
  {}

  ngOnInit()
  {
    this.initGridStateLine(this.historicItem.documentAccountLineAffected);
    this.initGridState(this.historicItem.historicList);
  }


  checkEntityDocumentAccountLine(dataItem: any, index?: number): boolean {
    return dataItem.entity === 'DOCUMENT_ACCOUNT_LINE';
  }

  checkActionUpdate(dataItem: any, index?: number): boolean {
    return dataItem.action === 'UPDATED' && dataItem.entity !== 'DOCUMENT_ACCOUNT_LINE';
  }


  public getListFromDataHistoric(dataItemList): DataResult {
    this.loadItemsHistoric(dataItemList);
    return this.gridSettingsDocumentAccount.gridData;
  }

  public getListFromLineDataHistoric(dataItemList , itemId) {
return dataItemList.filter(item => item.entityId ===  itemId);
  }

  public onPageChangeDocument(event, dataItem) {
    this.gridStateDocumentAccount.skip = event.skip;
    this.loadItemsHistoric(dataItem);
  }

  loadItemsHistoric(dataItemList) {
    this.gridSettingsDocumentAccount.gridData = {
      data: dataItemList.slice(this.gridStateDocumentAccount.skip,
        this.gridStateDocumentAccount.skip + this.gridStateDocumentAccount.take),
      total: dataItemList.length
    };
  }

  public getListFromData(dataItemList): DataResult {
    this.loadItems(dataItemList);
    return this.gridSettingsDocumentAccountLine.gridData;
  }

  public onPageChangeDocumentLine(event, dataItem) {
    this.gridStateDocumentAccountLine.skip = event.skip;
    this.loadItems(dataItem);
  }

  loadItems(dataItemList) {
    this.gridSettingsDocumentAccountLine.gridData = {
      data: dataItemList.slice(this.gridStateDocumentAccountLine.skip,
        this.gridStateDocumentAccountLine.skip + this.gridStateDocumentAccountLine.take),
      total: dataItemList.length
    };
  }

  initGridStateLine(dataItemList) {
    this.gridStateDocumentAccountLine.skip = NumberConstant.ZERO;
    this.gridStateDocumentAccountLine.take = NumberConstant.TEN;
    this.loadItems(dataItemList);

  }

  initGridState(dataItemList) {
    this.gridStateDocumentAccount.skip = NumberConstant.ZERO;
    this.gridStateDocumentAccount.take = NumberConstant.TEN;
    this.loadItemsHistoric(dataItemList);
  }

  checkLine(dataItem: any, index?: number): boolean {
    return (dataItem.action === 'UPDATED' && dataItem.entity === 'DOCUMENT_ACCOUNT_LINE' && dataItem.historicList.length > 0);
  }
}
