import { skip } from 'rxjs/operator/skip';
import { Component, ViewChild, Input, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { GridComponent, PageChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { IntlService } from '@progress/kendo-angular-intl';
import { CostPriceConstant } from '../../../constant/purchase/cost-price-constant';
import { ItemService } from '../../../inventory/services/item/item.service';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { SearchConstant } from '../../../constant/search-item';
import { CrudGridService } from '../../../sales/services/document-line/crud-grid.service';
import { DocumentService } from '../../../sales/services/document/document.service';
import { InputToCalculatePriceCost } from '../../../models/purchase/input-to-calculate-price-cost.model';
import { DocumentLinesWithPaging } from '../../../models/sales/document-lines-with-paging.model';
import { SalePolicy } from '../../../constant/inventory/item.enum';
import { isBetweenKendoDropdowns } from '../../../shared/helpers/component.helper';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { Currency } from '../../../models/administration/currency.model';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';

const createFormGroup = dataItem => new FormGroup({
  'Id': new FormControl(dataItem.Id),
  'LabelItem': new FormControl(dataItem.LabelItem),
  'IdPolicyValorization': new FormControl(dataItem.SalePolitique),
  'ConclusiveSellingPrice': new FormControl(dataItem.ConclusiveSellingPrice),
  'IdItem': new FormControl(dataItem.IdItem),
  'PercentageMargin': new FormControl(dataItem.PercentageMargin, Validators.compose([
    Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'),
    Validators.min(NumberConstant.ZERO)
  ])),
  'CostPrice': new FormControl(dataItem.CostPrice),
  'SellingPrice': new FormControl(dataItem.SellingPrice),
  'Quantity': new FormControl(dataItem.Quantity),
  'ItemUnitAmount': new FormControl(dataItem.ItemUnitAmount),
  'LineHtAmount': new FormControl(dataItem.LineHtAmount),
  'SalePolicy': new FormControl(dataItem.SalePolicy)
});
@Component({
  selector: 'app-cost-price',
  templateUrl: './cost-price.component.html',
  styleUrls: ['./cost-price.component.scss']
})

export class CostPriceComponent implements OnInit {
  public companyFormatOptions: any;
  @Input() documentCurrency: string;
  @Input() companyCurrency: string;
  @Input() companyPrecision: number;
  @Input() documentPrecision: number;
  @Input() isDisabled;
  @Input() idDocument: number;
  SalePolicyEnum = SalePolicy;
  dataItem: any;
  rowIndex: any;
  public showImportLines: boolean;
  /**showing search field */
  @Input() showSearch = true;
  keyAction;
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 50,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: 'IdItem',
      title: 'ITEM',
      filterable: true
    },
    {
      field: 'CodeItem',
      title: 'Ref',
      filterable: true
    },
    {
      field: 'DesignationItem',
      title: 'DESIGNATION',
      filterable: true
    },
    {
      field: 'NetPrice',
      title: 'NET_PRICE',
      filterable: true
    },
    {
      field: 'OldPrice',
      title: 'OLD_NET_PRICE',
      filterable: true
    },
    {
      field: 'ItemUnitAmount',
      title: 'PU',
      filterable: true
    },
    {
      field: 'Quantity',
      title: 'ON_ORDER_QUANTITY',
      filterable: true
    },
    {
      field: 'StockQty',
      title: 'AVAILABLE_QUANTITY',
      filterable: true
    },
    {
      field: 'CostPrice',
      title: 'COST',
      filterable: true
    },
    {
      field: 'Currency',
      title: 'CURRENCY',
      filterable: true
    },
    {
      field: 'PercentageMargin',
      title: 'MARGIN',
      filterable: true
    },
    {
      field: 'OldSellingPrice',
      title: 'OLD_SALES_NET_PRICE',
      filterable: true
    },
    {
      field: 'SellingPrice',
      title: 'INCREASED_SALES_PRICE',
      filterable: true
    },
    {
      field: 'SalePolicy',
      title: 'POLICY',
      filterable: true
    },
    {
      field: 'ConclusiveSellingPrice',
      title: 'SALES_PRICE',
      filterable: true
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  formatPurchaseOptions: any;

  private coefficient: number;
  public view: Array<any>;
  public formGroup: FormGroup;
  private isNew: boolean;
  private editedRowIndex: number;
  public isEditingMode = false;
  public closeRow = false;
  public margin: number;
  articleReference = '';
  filteredview: GridDataResult;
  public docClickSubscription: any;
  public gridObject;
  public PercentageMargin;
  @ViewChild(GridComponent) private grid: GridComponent;
  public currencyCode: any;
  public companyCurrencyCode: any;
  currencyPrecision: any;
  tndPrecision = '#,##.000';
  constructor(public service: CrudGridService, public intl: IntlService,
    private itemService: ItemService, private validationService: ValidationService,
    private documentService: DocumentService, private currencyService: CurrencyService, private companyService: CompanyService, private localStorageService : LocalStorageService) {
    this.margin = 0;
    this.keyAction = (event) => {
      const keyName = event.key;
      /*escape keyboard click */
      if (keyName === KeyboardConst.ESCAPE) {
        this.closeEditor();
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);
  }

  @HostListener('keyup', ['$event'])
  keyEvent(event) {
    // get data from grid
    const dataGrid = this.grid.data as { data, total };
    if (dataGrid) {
      this.callNexTLine(dataGrid, event);
    }
    this.closeLine(event);
    // used to prevent saveCurrent to be executed many times when using "tab" key instaed of "enter"
    if (event.key === KeyboardConst.ENTER && document.activeElement.id !== 'btnSave') {
      this.prepareRowObject(this.editedRowIndex + 1);
      this.saveCurrent();
    }
  }
  showactionForMargin(event) {
    if (event.data === undefined) {
      this.clearfilterfield();
    }

  }
  ArrowRigthPress() {
    if (document.getElementsByClassName('k-dropdown-wrap k-state-default')[8]) {
      const warehouse = document.getElementsByName('IdPolicyValorization')[0].getElementsByClassName('k-input')[0] as any;
      warehouse.focus();
    }
  }
  ArrowLeftPress() {
    const mvq = document.getElementsByName('PercentageMargin')[0] as any;
    if (mvq) {
      mvq.focus();
      mvq.select();
    }
  }
  pressKeybordEnter(event) {
    if (event.charCode === 13) {
      this.filteritem();
    }
  }

  filteritem() {
    this.gridState.skip = 0;
    this.initDataSource();
  }

  showaction(event?) {
    if (event.data === undefined) {
      this.clearfilterfield();
    }

  }

  clearfilterfield() {
    this.articleReference = '';
    this.initDataSource();
  }

  /*initilize cost price grid*/
  public initDataSource() {

    this.formatPurchaseOptions = {
      style: undefined,
      currency: undefined,
      currencyDisplay: undefined,
      minimumFractionDigits: this.currencyPrecision
    };
    const documentLinesWithPaging = new DocumentLinesWithPaging(this.idDocument, this.gridState.take, this.gridState.skip);
    documentLinesWithPaging.RefDescription = this.articleReference;
    this.documentService.getCostPriceWithPaging(documentLinesWithPaging).subscribe(GridData => {
      this.gridSettings.gridData = {
        data: GridData.listData,
        total: GridData.total
      };
    });
  }

  callNexTLine(dataGrid, event) {
    let pageeditedRowIndex = this.editedRowIndex - this.gridState.skip

    if (pageeditedRowIndex >= 0 && dataGrid.data.length - 1 && !isBetweenKendoDropdowns(event)) {

      if (event.key === KeyboardConst.ARROW_DOWN &&
        pageeditedRowIndex < dataGrid.data.length - 1) {

        // get next index
        this.moveToNexLine(this.editedRowIndex + 1);

      } else if (event.key === KeyboardConst.ARROW_UP && pageeditedRowIndex > 0) {

        // get previous index
        this.moveToNexLine(this.editedRowIndex - 1);

        // if it is the first or last line at the grid
      } else if ((event.key === KeyboardConst.ARROW_DOWN || event.key === KeyboardConst.ARROW_UP)) {
        this.saveCurrent();
      }
    }
  }
  moveToNexLine(OpenLineIndex: number) {
    this.gridObject = { isEdited: false, rowIndex: OpenLineIndex };
    this.saveCurrent();
  }
  /*close grid edit cell */
  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.isNew = false;
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }


  saveLine(event) {
    const dataGrid = this.grid.data as { data, total };
    if (event.rowIndex !== undefined) {
      this.prepareRowObject(event.rowIndex + 1);
      this.saveCurrent();
    } else {
      this.callNexTLine(dataGrid, event);
    }
  }
  prepareRowObject(rowToSelect) {
    if (this.gridSettings.gridData.data.length > rowToSelect - this.gridState.skip) {
      this.gridObject = { isEdited: false, rowIndex: rowToSelect };
    }
  }
  /**Save current line */
  public saveCurrent(): void {
    this.assignMargin(false, true);
  }
  /*
* on click documentline cell
*/
  public documentLineClickHandler({ isEdited, rowIndex }): void {
    this.isNew = false;
    if (isEdited || (this.formGroup && !this.formGroup.valid) || this.isInEditingMode || !this.isDisabled) {
      return;
    }
    let index = rowIndex - this.gridState.skip;
    let dataItem: any;
    if (this.gridSettings.gridData) {
      dataItem = this.gridSettings.gridData.data[index];
    }
    const policy = this.SalePolicyEnum[dataItem.SalePolicy];
    dataItem.SalePolitique = policy;
    this.formGroup = createFormGroup(dataItem);
    this.formGroup.controls[DocumentConstant.LABEL_ITEM].disable();
    this.formGroup.controls[CostPriceConstant.COST_PRICE].disable();
    this.formGroup.controls[CostPriceConstant.SELLING_PRICE].disable();
    this.formGroup.controls[CostPriceConstant.ITEM_UNIT_AMOUNT].disable();
    this.formGroup.controls[CostPriceConstant.CONCLUSIVE_SELLING_PRICE].disable();
    this.formGroup.controls[CostPriceConstant.CMD].disable();
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.formGroup);
    this.gridObject = undefined;
    this.PercentageMargin = dataItem.PercentageMargin;
  }

  public setCoefficient(coef: number) {
    this.coefficient = coef;
  }

  assignAllLineMarging() {

    let inputToCalculatePriceCost: InputToCalculatePriceCost;
    this.margin = this.getMarginValue(this.margin);
    inputToCalculatePriceCost = new InputToCalculatePriceCost(this.idDocument, this.margin, this.coefficient, 0);
    this.documentService.assingMargin(inputToCalculatePriceCost).subscribe(x => {
      this.initDataSource();
    });

  }
  assignOneLineMarging(isTosaveLine?: boolean) {
    if (this.formGroup) {
      this.formGroup.controls[CostPriceConstant.PERCENTAGE_MARGIN].setValue(this.PercentageMargin);
      this.formGroup.controls[CostPriceConstant.PERCENTAGE_MARGIN].enable();
      this.formGroup.updateValueAndValidity();
      if (this.formGroup.valid) {

        let inputToCalculatePriceCost: InputToCalculatePriceCost;

        const margin = this.getMarginValue(this.PercentageMargin);
        inputToCalculatePriceCost = new InputToCalculatePriceCost(this.idDocument,
          margin, this.coefficient, this.formGroup.controls['Id'].value);

        this.documentService.assingMargin(inputToCalculatePriceCost).subscribe(x => {
          if (this.formGroup.controls['Id'].value === x.objectData.Id) {
            this.formGroup.patchValue(x.objectData);
          }
          if (isTosaveLine) {
            this.saveNeChangesAndOpenNexLine();
          }
        });

      } else {
        this.validationService.validateAllFormFields(this.formGroup);
      }

    }
  }

  /**assing margin for all items */
  public assignMargin(assignAllLine: boolean, isTosaveLine?: boolean) {

    if (assignAllLine) {
      this.assignAllLineMarging();
    } else {
      this.assignOneLineMarging(isTosaveLine);
    }

  }
  private saveNeChangesAndOpenNexLine() {
    Object.assign(this.gridSettings.gridData.data.find(({ Id }) => Id === this.formGroup.controls['Id'].value),
      this.formGroup.getRawValue());
    this.closeEditor();
    if (this.gridObject) {
      this.documentLineClickHandler(this.gridObject);
    }
  }

  getMarginValue(recievedMargin: number): number {
    let margin = Number(Number(recievedMargin).toFixed(NumberConstant.TWO));
    if (margin < NumberConstant.ZERO) {
      margin = NumberConstant.ZERO;
    }
    return margin;
  }
  /*
   * verify if the grid is in editing mode
   */
  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }
  /*
  *cancel changes
  */
  public cancelHandler(): void {
    this.closeEditor();
  }

  public pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    this.initDataSource();
  }

  changePlicyValue(event, forSingleLine: boolean) {
    if (event) {
      if (forSingleLine) {
        this.documentService.setDocumentLineSalePolicy(this.idDocument, event, this.formGroup.controls['Id'].value).subscribe(x => {
          this.documentService.getDocumentLineCost(this.formGroup.controls['Id'].value).subscribe(res => {
            if (this.formGroup && this.formGroup.controls['Id'].value === res.Id) {
              this.formGroup.patchValue(res);
              this.dataItem = res;
            }
          });
        });
      } else {
        this.documentService.setDocumentLineSalePolicy(this.idDocument, event, null).subscribe(x => {
          this.reloadData();
        });
      }
    }
  }

  private reloadData() {
    this.gridState.skip = 0;
    this.gridState.take = 50;
    this.initDataSource();
  }

  ngOnInit() {
    this.gridObject = undefined;
    this.loadTierCurrencyCode();
    this.getCompanyCurrency();
  }

  public closeLine(event) {
    if (event.key === KeyboardConst.ESCAPE) {
      if (!this.showImportLines) {
        this.closeLineOperation();
      } else {
        // in assets --> modal of import item from invoice should be closed with ESCAPE btn
        this.showImportLines = false;
      }
    }
  }
  public closeLineOperation() {
    this.closeEditor();
    this.isNew = false;

  }
  public loadTierCurrencyCode() {
    this.currencyService.getById(this.documentPrecision).subscribe(value => {
      this.currencyCode = value.Code;
      this.currencyPrecision = value.Precision;
    });
  }
  getCompanyCurrency() {
      this.companyCurrencyCode = this.localStorageService.getCurrencyCode();
      
        this.companyFormatOptions = {
          style: 'currency',
          currency: this.localStorageService.getCurrencyCode(),
          currencyDisplay: 'symbol',
          minimumFractionDigits: this.localStorageService.getCurrencyPrecision()
        };
  }

}

