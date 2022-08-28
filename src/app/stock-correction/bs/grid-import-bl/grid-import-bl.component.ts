import { Component, OnInit, ViewChild, HostListener, Output, EventEmitter, Input, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GridDataResult, GridComponent, SelectAllCheckboxState, PageChangeEvent } from '@progress/kendo-angular-grid';
import { DocumentService } from '../../../sales/services/document/document.service';
import { Document } from '../../../models/sales/document.model';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { StockCorrectionConstant } from '../../../constant/stock-correction/stock-correction.constant';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { isBetweenKendoDropdowns } from '../../../shared/helpers/component.helper';
import { NumberConstant } from '../../../constant/utility/number.constant';
export const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
const formGroupImportBl = dataItem => new FormGroup({
  'DocumentCode': new FormControl(dataItem.DocumentCode),
  'Designation': new FormControl(dataItem.Designation),
  'MovementQty': new FormControl(dataItem.MovementQty, [Validators.required, Validators.minLength(1),
  Validators.min(0),
  Validators.max(NumberConstant.MAX_QUANTITY),
  Validators.pattern('[-+]?[0-9]*\.?[0-9]*')]),
  'TaxeString': new FormControl(dataItem.TaxeString),
  'HtUnitAmountWithCurrency': new FormControl(dataItem.HtUnitAmountWithCurrency),
  'HtTotalLineWithCurrency': new FormControl(dataItem.HtTotalLineWithCurrency),
  'HtAmountWithCurrency': new FormControl(dataItem.HtAmountWithCurrency),
  'DiscountPercentage': new FormControl(dataItem.DiscountPercentage),
  'Id': new FormControl(dataItem.Id)
});
@Component({
  selector: 'app-grid-import-bl',
  templateUrl: './grid-import-bl.component.html',
  styleUrls: ['./grid-import-bl.component.scss']
})
export class GridImportBlComponent implements OnInit {
  public formatForSalesOptions;
  public formGroupImportBl: FormGroup;
  private editedRowIndexImportBl: number;
  blList: Document[] = [];
  public filtredBlList: Document[] = [];
  public IdBl: number[];
  public initListDocumentLineBL: GridDataResult;
  public allListDocumentLineBL: GridDataResult;
  public listDocumentLineBL: GridDataResult;
  public listBlWithFilter: any;
  public docClickSubscription: any;
  @ViewChild(GridComponent) public gridImportBL: GridComponent;

  public mySelection: number[] = [];
  public selectAllState: SelectAllCheckboxState = 'unchecked';

  public pageSize = 20;
  public skip = 0;
  disableButtonImport: boolean;
  @Output() importLineBl: EventEmitter<DocumentLine[]> = new EventEmitter();
  public selectedLineBlList: DocumentLine[] = [];
  @Input() currencyId: number;
  @Input() tiersId: number;
  public sumHT = 0;

  codeSearch: any;
  descriptionSearch: any;
  qtySearch: any;
  puSearch: any;
  netPriceSearch: any;
  amountHtSearch: any;

  constructor(private documentService: DocumentService, private validationService: ValidationService, private growlService: GrowlService,
    private translate: TranslateService, private currencyService: CurrencyService, private renderer: Renderer2) {
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === KeyboardConst.ESCAPE) {
      this.closeEditor();
    }
    const keyName = event.key;
    let OpenLineIndex: number;
    // get data from grid
    const dataGrid = this.gridImportBL.data as { data, total };
    /* escape keyboard click */
    if (keyName === KeyboardConst.ENTER) {
      this.verifLine();
    }

    if (!isBetweenKendoDropdowns(event)) {
      if (event.key === KeyboardConst.ARROW_DOWN &&
        this.editedRowIndexImportBl < dataGrid.data.length - 1) {

        // get next index
        OpenLineIndex = this.editedRowIndexImportBl + 1;
        this.moveToNexLine(OpenLineIndex, dataGrid);
      } else if (event.key === KeyboardConst.ARROW_UP && this.editedRowIndexImportBl > 0) {

        // get previous index
        OpenLineIndex = this.editedRowIndexImportBl - 1;
        this.moveToNexLine(OpenLineIndex, dataGrid);

        // if it is the first or last line at the grid
      } else if ((event.key === KeyboardConst.ARROW_DOWN || event.key === KeyboardConst.ARROW_UP)) {
        this.verifLine();
      }
    }
    
  }

  moveToNexLine(OpenLineIndex: number, dataGrid) {
    if (this.verifLine()) {
      this.editedRowIndexImportBl = OpenLineIndex;
      this.formGroupImportBl = formGroupImportBl(dataGrid.data[OpenLineIndex]);
      this.gridImportBL.editRow(this.editedRowIndexImportBl);
      this.disableOrEnableImportButton();
    }
  }
  /**get tiers Currency symbol */
  getSelectedCurrency() {
    this.currencyService.getById(this.currencyId).subscribe(currency => {
      this.formatForSalesOptions = {
        style: 'currency',
        currency: currency.Code,
        currencyDisplay: 'symbol',
        minimumFractionDigits: currency.Precision
      };
    });
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    const data = this.listBlWithFilter.data ? this.listBlWithFilter.data : this.listBlWithFilter;
    let viewBL = this.loadItems(data);
    this.listDocumentLineBL = viewBL;
  }


  public ngOnInit() {
    this.codeSearch = undefined;
    this.descriptionSearch = undefined;
    this.qtySearch = undefined;
    this.puSearch = undefined;
    this.netPriceSearch = undefined;
    this.amountHtSearch = undefined;

    this.pageSize = 20;
    this.skip = 0;
    this.getSelectedCurrency();
    this.initListDocumentLineBL = undefined;
    this.allListDocumentLineBL = undefined;
    this.listDocumentLineBL = undefined;
    this.IdBl = undefined;
    this.selectedLineBlList = [];
    this.mySelection = [];
    this.sumHT = 0;
    this.selectAllState = 'unchecked';

    if (this.isInEditingModeImportBl) {
      this.closeEditor();
    } else {
      this.disableOrEnableImportButton();
    }
    this.gridImportBL.loading = true;
    this.documentService.getDocumentLineOfBlNotAssociated(this.tiersId).subscribe(x => {
      let viewBL = this.loadItems(x);
      this.listDocumentLineBL = viewBL;
      this.listBlWithFilter = x;
      let dataWithoutPaging = {
        data: x,
        total: x.length
      };
      this.initListDocumentLineBL = JSON.parse(JSON.stringify(dataWithoutPaging));
      this.allListDocumentLineBL = JSON.parse(JSON.stringify(dataWithoutPaging));
      this.setListDocument();
      this.gridImportBL.loading = false;
    });
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
  }

  public onDocumentClick(e: any): void {
    if (!matches(e.target, 'tbody *, .k-grid-toolbar .k-button, .k-grid-add-command, .k-link, .input-checkbox100, .label-checkbox100')
      && (e.target.parentElement &&
        !matches(e.target.parentElement, '.k-grid-add-command, .k-animation-container, .k-animation-container-show'))
      && !(e.path.find(x => x.tagName === 'APP-FETCH-PRODUCTS'))) {
      this.closeEditor();
    }
  }

  // Extract list bl (dropdown bl)
  setListDocument() {
    const distinctDocLine = this.initListDocumentLineBL.data.filter(
      (thing, i, arr) => arr.findIndex(t => t.IdDocument === thing.IdDocument) === i
    );
    this.blList = distinctDocLine.map(item => item.IdDocumentNavigation);
    this.filtredBlList = this.blList.slice(0);
  }

  // Filter in dropdown bl
  handleFilter(value: string): void {
    this.filtredBlList = this.blList.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase()));
  }

  // Load list line bl with paging
  public loadItems(dataLineBl): any {
    return {
      data: dataLineBl.slice(this.skip, this.skip + this.pageSize),
      total: dataLineBl.length
    };
  }

  /* verify if the grid is in editing mode  */
  public get isInEditingModeImportBl(): boolean {
    return this.editedRowIndexImportBl !== undefined;
  }

  public editHandlerImportBl({ rowIndex, dataItem }: any): void {
    this.closeEditor();
    this.editedRowIndexImportBl = rowIndex;
    this.gridImportBL.editRow(rowIndex);
    this.formGroupImportBl = formGroupImportBl(dataItem);
    this.disableOrEnableImportButton();
  }
  /* * close grid edit cell */
  closeEditor(): void {

    this.gridImportBL.closeRow(this.editedRowIndexImportBl);
    this.editedRowIndexImportBl = undefined;
    this.formGroupImportBl = undefined;
    this.disableOrEnableImportButton();
  }

  public verifLine(): boolean {
    if (this.formGroupImportBl) {
      if (this.formGroupImportBl.valid) {
        if (this.isGridImportBlValuesAreValid()) {
          this.closeEditor();
          return true;
        }
      } else {
        this.validationService.validateAllFormFields(this.formGroupImportBl);
      }
    }
    return false;
  }

  isGridImportBlValuesAreValid(): boolean {
    const lineBl: DocumentLine[] = this.listDocumentLineBL.data.filter(x => x.Id == this.formGroupImportBl.controls['Id'].value);
    const lineBlFromAllLine: DocumentLine[] =
      this.allListDocumentLineBL.data.filter(x => x.Id == this.formGroupImportBl.controls['Id'].value);


    const filtredlineBl: DocumentLine[] = this.listBlWithFilter.data ?
      this.listBlWithFilter.data.filter(x => x.Id == this.formGroupImportBl.controls['Id'].value) :
      this.listBlWithFilter.filter(x => x.Id == this.formGroupImportBl.controls['Id'].value);


    const initLineBl: DocumentLine[] = this.initListDocumentLineBL.data.filter(x => x.Id == this.formGroupImportBl.controls['Id'].value);
    if (initLineBl && initLineBl.length) {
      if (initLineBl[0].MovementQty < this.formGroupImportBl.controls['MovementQty'].value) {
        this.growlService.warningNotification(this.translate.instant(StockCorrectionConstant.ERROR_QUANTITY) + " : " + initLineBl[0].MovementQty);
        // Afficher une notification front La Quantité saisie ne doit pas dépasser la quantité de la ligne Bl
        return false;
      } else if (this.formGroupImportBl.controls['MovementQty'].value <= 0) {
        this.growlService.warningNotification(this.translate.instant(StockCorrectionConstant.CHECK_QUANTITY_POSITIVE));
        return false;
      }
      lineBl[0].MovementQty = this.formGroupImportBl.controls['MovementQty'].value;
      lineBlFromAllLine[0].MovementQty = this.formGroupImportBl.controls['MovementQty'].value;
      filtredlineBl[0].MovementQty = this.formGroupImportBl.controls['MovementQty'].value;

      lineBl[0].HtTotalLineWithCurrency = lineBl[0].HtAmountWithCurrency * lineBl[0].MovementQty;
      lineBlFromAllLine[0].HtTotalLineWithCurrency = lineBlFromAllLine[0].HtAmountWithCurrency * lineBlFromAllLine[0].MovementQty;
      filtredlineBl[0].HtTotalLineWithCurrency = filtredlineBl[0].HtAmountWithCurrency * filtredlineBl[0].MovementQty;

    }
    this.sumHT = this.getSumSelectedLine();
    return true;
  }

  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === 'checked') {
      if (this.listDocumentLineBL) {
        Array.prototype.push.apply(this.mySelection, this.listDocumentLineBL.data.map((item) => item.Id));
        this.mySelection = this.mySelection.filter(
          (thing, i, arr) => arr.findIndex(t => t === thing) === i
        );
      }
      this.selectAllState = 'checked';
    } else {
      let listToUncheck = this.listDocumentLineBL.data.map((item) => item.Id);
      if (listToUncheck && listToUncheck.length > 0) {
        listToUncheck.forEach(y => this.mySelection.splice(y));
      }
      this.selectAllState = 'unchecked';
    }
  }

  public onSelectedKeysChange(e?) {
    let len = this.mySelection.length;
    this.sumHT = this.getSumSelectedLine();


    let lenListInGrid = this.allListDocumentLineBL.data.map((item) => item.Id).length;
    if (len === 0) {
      this.selectAllState = 'unchecked';
    } else if (len > 0 && len < lenListInGrid) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = 'checked';
    }
    this.disableOrEnableImportButton();
  }

  public disableOrEnableImportButton() {
    if (this.mySelection && this.mySelection.length > 0 && !this.isInEditingModeImportBl) {
      this.disableButtonImport = false;
    } else {
      this.disableButtonImport = true;
    }
  }

  saveImportedLine() {
    this.selectedLineBlList = this.allListDocumentLineBL.data.filter(x => this.mySelection.find(y => y == x.Id));
    this.importLineBl.emit(this.selectedLineBlList);
  }

  getSumSelectedLine(): number {
    let sumLines: number = 0;
    if (this.mySelection.length > 0) {
      this.selectedLineBlList = this.allListDocumentLineBL.data.filter(x => this.mySelection.find(y => y == x.Id));
      const add = (a, b) => a + b;
      sumLines = this.selectedLineBlList.map((item) => item.HtTotalLineWithCurrency).reduce(add);
    }
    return sumLines;
  }
  onFocusOutMvtQuantity() {
    if (this.isInEditingModeImportBl) {
      this.closeEditor();
    }

  }

  filterData() {
    let filtredList = this.initListDocumentLineBL.data;
    if (this.isInEditingModeImportBl) {
      this.closeEditor();
    }
    this.pageSize = 20;
    this.skip = 0;
    filtredList = filtredList.filter(x =>
      ((this.IdBl && this.IdBl.length > 0) ? this.IdBl.find(y => y == x.IdDocument) : true) &&

      (this.codeSearch ? (x.IdDocumentNavigation && x.IdDocumentNavigation.Code &&
        x.IdDocumentNavigation.Code.indexOf(this.codeSearch) >= 0) : true) &&

      (this.descriptionSearch ? (((x.IdItemNavigation.Code && x.IdItemNavigation.Code.indexOf(this.descriptionSearch) >= 0) ||
        (x.IdItemNavigation.Description && x.IdItemNavigation.Description.indexOf(this.descriptionSearch) >= 0))) : true) &&

      ((this.qtySearch || this.qtySearch == 0) ? (x.MovementQty && x.MovementQty == this.qtySearch) : true) &&

      ((this.puSearch || this.puSearch == 0) ? (x.HtUnitAmountWithCurrency && x.HtUnitAmountWithCurrency == this.puSearch) : true) &&

      ((this.netPriceSearch || this.netPriceSearch == 0) ? (x.HtAmountWithCurrency && x.HtAmountWithCurrency == this.netPriceSearch) : true) &&

      ((this.amountHtSearch || this.amountHtSearch == 0) ? (x.HtTotalLineWithCurrency && x.HtTotalLineWithCurrency == this.amountHtSearch) : true)

    );

    this.listBlWithFilter = {
      data: filtredList,
      total: filtredList.length
    }
    let viewBL = this.loadItems(this.listBlWithFilter.data);
    this.listDocumentLineBL = viewBL;
  }
}
