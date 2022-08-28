import { Injectable } from '@angular/core';
import { DocumentService } from '../../../sales/services/document/document.service';
import { Router } from '@angular/router';
import { SwalWarring } from '../../components/swal/swal-popup';
import { TranslateService } from '@ngx-translate/core';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../utils/column-settings.interface';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { GridSettings } from '../../utils/grid-settings.interface';
import { PredicateFormat } from '../../utils/predicate';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { ClaimConstant } from '../../../constant/helpdesk/claim.constant';
const AND = 'and';
@Injectable()
export class ListDocumentService {
  documentcode: DocumentEnumerator = new DocumentEnumerator();

  // Predicate proprety
  private predicate: PredicateFormat;
  choosenFilter;
  // choosenFilter number proprety
  choosenFilterNumber = NumberConstant.ZERO;
  constructor(private documentService: DocumentService, private router: Router, private swalWarrings: SwalWarring,
    private translate: TranslateService) { }
  /**
     * Grid state proprety
     */
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 50,
    filter: { // Initial filter descriptor
      logic: AND,
      filters: []
    }
  };
  /**
   * Grid columns proprety
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: DocumentConstant.ID_TIER_NAVIGATION_NAME,
      title: DocumentConstant.SUPPLIER,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_EIGHTY
    },
    {
      field: DocumentConstant.DOCUMENT_DATE,
      title: DocumentConstant.DATE,
      filterable: true,
      format: ClaimConstant.DOCUMENT_FORMAT,
      _width: NumberConstant.ONE_HUNDRED_EIGHTY
    },
    {
      field: DocumentConstant.CODE,
      title: DocumentConstant.CODE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FOURTY
    },
    {
      field: DocumentConstant.DPCUMENT_HTTPRICE_WITH_CURRENCY,
      title: DocumentConstant.AMOUNT_HT,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: NumberConstant.ONE_HUNDRED_SEVENTY
    },
    {
      field: DocumentConstant.DOCUMENT_TTC_PRICE_WITH_CURRENCY,
      title: DocumentConstant.AMOUNT_TTC,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: NumberConstant.ONE_HUNDRED_SEVENTY
    },
    {
      field: DocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION_LABEL,
      title: DocumentConstant.STATUS,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FOURTY
    },
    {
      field: DocumentConstant.INVOICING_TYPE,
      title: DocumentConstant.TYPE_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED
    },
    {
      field: DocumentConstant.VALIDATOR_NAME,
      title: DocumentConstant.USER,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_THIRTY
    },
    {
      field: DocumentConstant.ID_TIER_NAVIGATION_REGION,
      title: DocumentConstant.REGION,
      filterable: true,
      _width: NumberConstant.NINETY
    },
  ];


  /**
   * Grid columns proprety
   */
  public columnsConfigDocList: ColumnSettings[] = [
    {
      field: DocumentConstant.TIERS_NAME,
      title: DocumentConstant.SUPPLIER,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_EIGHTY
    },
    {
      field: DocumentConstant.DOCUMENT_DATE,
      title: DocumentConstant.DATE,
      filterable: true,
      format: ClaimConstant.DOCUMENT_FORMAT,
      _width: NumberConstant.ONE_HUNDRED_EIGHTY
    },
    {
      field: DocumentConstant.CODE,
      title: DocumentConstant.CODE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FOURTY
    },
    {
      field: DocumentConstant.DPCUMENT_HTTPRICE_WITH_CURRENCY,
      title: DocumentConstant.AMOUNT_HT,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: NumberConstant.ONE_HUNDRED_SEVENTY
    },
    {
      field: DocumentConstant.DOCUMENT_TTC_PRICE_WITH_CURRENCY,
      title: DocumentConstant.AMOUNT_TTC,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: NumberConstant.ONE_HUNDRED_SEVENTY
    },
    {
      field: DocumentConstant.DOCUMENT_STATUS,
      title: DocumentConstant.STATUS,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FOURTY
    },
    {
      field: DocumentConstant.INVOICING_TYPE,
      title: DocumentConstant.TYPE_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED
    },
    {
      field: DocumentConstant.VALIDATOR_NAME_DOC,
      title: DocumentConstant.USER,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_THIRTY
    },
    {
      field: DocumentConstant.DOC_REGION,
      title: DocumentConstant.REGION,
      filterable: true,
      _width: NumberConstant.NINETY
    },
    {
      field: DocumentConstant.IS_SYNCHRONIZED_BTOB,
      title: DocumentConstant.SYNCH_BTOB,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FOURTY
    },
  ];

  public excelColumnsConfig: ColumnSettings[] = [
    {
      field: DocumentConstant.TIERS_NAME,
      title: DocumentConstant.SUPPLIER,
      filterable: true,
      _width: 180
    },
    {
      field: DocumentConstant.DOCUMENT_DATE,
      title: DocumentConstant.DATE,
      filterable: true,
      format: ClaimConstant.DOCUMENT_FORMAT,
      _width: 100
    },
    {
      field: DocumentConstant.CODE,
      title: DocumentConstant.CODE,
      filterable: true,
      _width: 140
    },
    {
      field: DocumentConstant.DPCUMENT_HTTPRICE_WITH_CURRENCY,
      title: DocumentConstant.AMOUNT_HT,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: 140
    },
    {
      field: DocumentConstant.DOCUMENT_TTC_PRICE_WITH_CURRENCY,
      title: DocumentConstant.AMOUNT_TTC,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: 140
    },
    {
      field: DocumentConstant.DOCUMENT_STATUS,
      title: DocumentConstant.STATUS,
      filterable: true,
      _width: 180
    },
    {
      field: DocumentConstant.VALIDATOR_NAME_DOC,
      title: DocumentConstant.USER,
      filterable: true,
      _width: 180
    },
  ];
  /**
   * Grid columns proprety
   */
  public columnsConfigDocumentLine: ColumnSettings[] = [
    {
      field: DocumentConstant.IdItem,
      title: DocumentConstant.IdItem,
      filterable: true,
    },
    {
      field: DocumentConstant.RefItem,
      title: DocumentConstant.RefItem,
      filterable: true,
    },
    {
      field: DocumentConstant.MovementQty,
      title: DocumentConstant.MovementQty,
      filterable: true,
    },
    {
      field: DocumentConstant.RemainingQuantity,
      title: DocumentConstant.RemainingQuantity,
      filterable: false,
    },
    {
      field: DocumentConstant.UnitPriceFromQuotation,
      title: DocumentConstant.UnitPriceFromQuotation,
      filterable: false,
    },
    {
      field: DocumentConstant.HtUnitAmountWithCurrency,
      title: DocumentConstant.HtUnitAmountWithCurrency,
      filterable: true,
    },
    {
      field: DocumentConstant.HtUnitAmount,
      title: DocumentConstant.HtUnitAmount,
      filterable: false,
    },
    {
      field: DocumentConstant.UnitHtsalePrice,
      title: DocumentConstant.UnitHtsalePrice,
      filterable: true,
    },
    {
      field: DocumentConstant.IdMeasureUnit,
      title: DocumentConstant.IdMeasureUnit,
      filterable: true,
    },
    {
      field: DocumentConstant.DiscountPercentage,
      title: DocumentConstant.DiscountPercentage,
      filterable: true,
    },
    {
      field: DocumentConstant.HtTotalLineWithCurrency,
      title: DocumentConstant.HtTotalLineWithCurrency,
      filterable: true,
    }, {
      field: DocumentConstant.TtcTotalLineWithCurrency,
      title: DocumentConstant.TtcTotalLineWithCurrency,
      filterable: true,
    }
  ];
  /**
   * Billing term Grid columns proprety
   */
  public BillingTermscolumnsConfig: ColumnSettings[] = [
    {
      field: DocumentConstant.TIER_NAME,
      title: DocumentConstant.CUSTOMER,
      filterable: true,
      _width: 250
    },
    {
      field: DocumentConstant.HT_AMOUNT,
      title: DocumentConstant.AMOUNT_HT,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: 150
    },
    {
      field: DocumentConstant.NUMBER_OF_BL,
      title: DocumentConstant.BL_NUMBER,
      filterable: false,
      _width: 130
    },
    {
      field: DocumentConstant.SETTLEMENT_MODE_FIELD,
      title: DocumentConstant.SETTLEMENT_MODE_TITLE,
      filterable: false,
      _width: 200
    }
  ];


  /**
 * Billing term Grid columns proprety
 */
  public BillingTermsForIAcolumnsConfig: ColumnSettings[] = [
    {
      field: DocumentConstant.TIER_NAME,
      title: DocumentConstant.CUSTOMER,
      filterable: true,
      _width: 280
    },
    {
      field: DocumentConstant.HT_AMOUNT,
      title: DocumentConstant.AMOUNT_HT,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: 150
    },
    {
      field: DocumentConstant.NUMBER_OF_Ia,
      title: DocumentConstant.IA_NUMBER,
      filterable: false,
      _width: 100
    },
    {
      field: DocumentConstant.SETTLEMENT_MODE_FIELD,
      title: DocumentConstant.SETTLEMENT_MODE_TITLE,
      filterable: false,
      _width: 200
    }
  ];
  //excel gridsettings
  public excelGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.excelColumnsConfig
  };
  
  /**
   * Grid settingsproprety
   */
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  public gridSettingsDocList: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfigDocList
  };
  /**
   * Grid settingsproprety
   */
  public documentLineGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  /**
   * Grid settingsproprety
   */
  public gridSettingsBillingTermscolumnsConfig: GridSettings = {
    state: this.gridState,
    columnsConfig: this.BillingTermscolumnsConfig
  };

  /**
   * Grid settingsproprety
   */
  public gridSettingsBillingTermsForIacolumnsConfig: GridSettings = {
    state: this.gridState,
    columnsConfig: this.BillingTermsForIAcolumnsConfig
  };

  /*idTiers to keep if redirected*/
  public idClient = 0;

  /**getPredicate */
  getPredicate(documentType): PredicateFormat {
    return PredicateFormat.prepareDocumentPredicate(NumberConstant.ZERO, documentType);
  }

  /**
   * init the grid data source using presicate
   * */
  public initGridDataSource(state, predicate): any {
    return this.documentService.reloadServerSideData(state,
      predicate, DocumentConstant.GET_DATASOURCE_PREDICATE_DOCUMENT);
  }


  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state, predicate): any {
    return this.documentService.reloadServerSideData(state,
      predicate, DocumentConstant.GET_DATASOURCE_PREDICATE_DOCUMENT).subscribe(data => this.gridSettings.gridData = data);
  }

  /**
   * remove Handler
   * @param param0
   */
  public removeHandler(dataItem): any {
    return this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.documentService.removeDocument(dataItem);
      }
    });
  }
  getChoosenFilter(documentType): string {
    return this.translate.instant(documentType);
  }

  getColumnsConfig(documentType: string) {
    if (documentType !== null) {
      if (documentType[documentType.length - 1] === 'U') {
        this.columnsConfig[0].title = DocumentConstant.SUPPLIER;
        this.columnsConfigDocList[0].title = DocumentConstant.SUPPLIER;
      } else {
        this.columnsConfig[0].title = DocumentConstant.CUSTOMER;
        this.columnsConfigDocList[0].title = DocumentConstant.CUSTOMER;
      }
      if (documentType === 'BE-PU' || documentType === 'BS-SA') {
        this.columnsConfig[0].title = DocumentConstant.TIERS;
        this.columnsConfigDocList[0].title = DocumentConstant.TIERS;
      }
    } else {
      this.columnsConfig[0].title = DocumentConstant.TIERS;
      this.columnsConfigDocList[0].title = DocumentConstant.TIERS;
    }
    return (this.columnsConfig);
  }
}
