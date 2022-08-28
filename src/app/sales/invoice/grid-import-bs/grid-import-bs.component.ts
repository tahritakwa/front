import { Component, OnInit, ViewChild, HostListener, Output, EventEmitter, Input, Renderer2, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GridDataResult, SelectableSettings, GridComponent, SelectAllCheckboxState, PageChangeEvent } from '@progress/kendo-angular-grid';
import { DocumentService } from '../../../sales/services/document/document.service';
import { Document } from '../../../models/sales/document.model';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { ValidationService, dateValueLT, dateValueGT } from '../../../shared/services/validation/validation.service';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { Observable } from 'rxjs/Observable';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { isBetweenKendoDropdowns } from '../../../shared/helpers/component.helper';
import { formatDate } from '@progress/kendo-angular-intl';
import { NumberConstant } from '../../../constant/utility/number.constant';
export const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
const formGroupImportBs = dataItem => new FormGroup({
  'DocumentCode': new FormControl(dataItem.IdDocumentAssociatedNavigation.DocumentCode),
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
  'IdDocumentLineAssociated': new FormControl(dataItem.IdDocumentLineAssociated),
  'CreatorFullName':  new FormControl(dataItem.CreatorFullName),
  'IdUser': new FormControl(dataItem.IdUser),
});
const START_DATE = 'StartDate';
const END_DATE = 'EndDate';

@Component({
  selector: 'app-grid-import-bs',
  templateUrl: './grid-import-bs.component.html',
  styleUrls: ['./grid-import-bs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GridImportBsComponent implements OnInit {
  public formatForSalesOptions;
  @Input() formGroupImportBs: FormGroup;
  private editedRowIndexImportBs: number;
  bsList: Document[] = [];
  public filtredBsList: Document[] = [];
  public IdBs: number[];
  public initListDocumentLineBs: GridDataResult;
  public initListBs: GridDataResult;
  public listDocumentLineBs: GridDataResult;
  public listBsWithFilter: GridDataResult;
  public docClickSubscription: any;
  public selectableImportLineSettings: SelectableSettings;
  @ViewChild(GridComponent) public gridImportBs: GridComponent;
  format_date = this.translate.instant(SharedConstant.DATE_FORMAT);

  public mySelectionBs: number[] = [];
  public selectAllStateBs: SelectAllCheckboxState = 'unchecked';

  public pageSize = 20;
  public skip = 0;

  @Output() importLineBs: EventEmitter<DocumentLine[]> = new EventEmitter();
  public selectedLineBsList: DocumentLine[] = [];
  @Input() currencyId: number;
  @Input() tiersId: number;
  
  @Input() containerRef;
  public sumHT = 0;
  public sumAllHT = 0;
  currentYear: number = new Date().getFullYear();
  formGroupFilter: FormGroup;
  private oldStartDateValue: Date;
  private oldEndDateValue: Date;
  public minEndDate: Date;
  public minStartDate: Date;
  public maxStartDate: Date;
  public  startDateToSend:Date;
  public endDateToSend:Date;
  public idUser ;

  @Output() disableImportOtherButton = new EventEmitter<boolean>();
  @Output() initImportOtherData = new EventEmitter<boolean>();
  public articleReference = '';

  codeSearch: any;
  descriptionSearch: any;
  qtySearch: any;
  puSearch: any;
  amountHtSearch: any;
  @Input() showGrid: boolean = false;

  constructor(private documentService: DocumentService, private validationService: ValidationService, private growlService: GrowlService,
    private translate: TranslateService, private currencyService: CurrencyService, private renderer: Renderer2
    , private fb: FormBuilder, private cdRef: ChangeDetectorRef) {
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === KeyboardConst.ESCAPE) {
      this.closeEditor();
    }
    const keyName = event.key;
    let OpenLineIndex: number;
    // get data from grid
    const dataGrid = this.gridImportBs.data as { data, total };
    /* escape keyboard click */
    if (!isBetweenKendoDropdowns(event)) {
      if (event.key === KeyboardConst.ARROW_DOWN && dataGrid && dataGrid.data &&
        this.editedRowIndexImportBs < dataGrid.data.length - 1) {

        // get next index
        OpenLineIndex = this.editedRowIndexImportBs + 1;
        this.moveToNexLine(OpenLineIndex, dataGrid);
      } else if (event.key === KeyboardConst.ARROW_UP && dataGrid && dataGrid.data && this.editedRowIndexImportBs > 0) {

        // get previous index
        OpenLineIndex = this.editedRowIndexImportBs - 1;
        this.moveToNexLine(OpenLineIndex, dataGrid);

        // if it is the first or last line at the grid
      } else if ((event.key === KeyboardConst.ARROW_DOWN || event.key === KeyboardConst.ARROW_UP)) {
        this.verifLine();
      }
    }
    
  }

  moveToNexLine(OpenLineIndex: number, dataGrid) {
    if (this.verifLine()) {
      this.editedRowIndexImportBs = OpenLineIndex;
      this.formGroupImportBs = formGroupImportBs(dataGrid.data[OpenLineIndex]);
      this.gridImportBs.editRow(this.editedRowIndexImportBs);
      this.disableOrEnableImportButtonBs();
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
    let viewBs = this.loadItems(this.listBsWithFilter.data);
    this.listDocumentLineBs = viewBs;
  }


  public ngOnInit() {
    this.createForm();
    this.getSelectedCurrency();
    this.disableImportOtherButton.emit(true);
    this.initImportOtherData.emit(true);
    if(this.showGrid){
      this.initGrid();
    }
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
  }
  public initGrid(){
    this.initOtherImport();
  }

  public disableOrEnableImportButtonBs() {
    if (this.mySelectionBs && this.mySelectionBs.length > 0 && !this.isInEditingModeImportBs) {
      this.disableImportOtherButton.emit(false);
    } else {
      this.disableImportOtherButton.emit(true);
    }
  }

  public onDocumentClick(e: any): void {
    if (!matches(e.target, 'tbody *, .k-grid-toolbar .k-button, .k-grid-add-command, .k-link, .input-checkbox100, .label-checkbox100')
      && (e.target.parentElement &&
        !matches(e.target.parentElement, '.k-grid-add-command, .k-animation-container, .k-animation-container-show'))
      && !(e.path.find(x => x.tagName === 'APP-FETCH-PRODUCTS'))) {
      this.closeEditor();
    }
  }

  public initOtherImport() {
    this.codeSearch = undefined;
    this.descriptionSearch = undefined;
    this.qtySearch = undefined;
    this.puSearch = undefined;
    this.amountHtSearch = undefined;
    this.pageSize = 20;
    this.skip = 0;
    this.initListDocumentLineBs = undefined;
    this.listDocumentLineBs = undefined;
    this.initListBs = undefined;
    this.IdBs = [];
    this.selectedLineBsList = [];
    this.mySelectionBs = [];
    this.sumHT = 0;
    this.sumAllHT = 0;
    this.selectAllStateBs = 'unchecked';
    this.formGroupFilter.controls['StartDate'].setValue('');
    this.formGroupFilter.controls['EndDate'].setValue('');
    if (this.isInEditingModeImportBs) {
      this.closeEditor();
    } else {
      this.disableOrEnableImportButtonBs();
    }

    this.initGridDataSource();
  }

  initGridDataSource() {
    this.getData();
  }

  getData(year?, startDate?, endDate?) {
    this.gridImportBs.loading = true;
    this.documentService.getDocumentLineOfBsNotAssociated(year, startDate, endDate).subscribe(x => {
      let viewBs = this.loadItems(x);
      this.listDocumentLineBs = viewBs;
      let dataWithoutPaging = {
        data: x,
        total: x.length
      };
      this.initListDocumentLineBs = JSON.parse(JSON.stringify(dataWithoutPaging));
      this.initListBs = JSON.parse(JSON.stringify(dataWithoutPaging));
      this.sumAllHT = this.getSumAllLine();
      this.setListDocument();
      this.gridImportBs.loading = false;
    });
  }

  getSumAllLine(): number {
    let sumAllLines: number = 0;
    if (this.initListDocumentLineBs && this.initListDocumentLineBs.data.length > 0) {
     const add = (a, b) => a + b;
      sumAllLines = this.initListDocumentLineBs.data.map((item) => item.HtTotalLineWithCurrency).reduce(add);
    }
    return sumAllLines;
  }


  setListDocument() {
    const distinctDocLine = this.initListDocumentLineBs.data.filter(
      (thing, i, arr) => arr.findIndex(t => t.IdDocumentAssociated === thing.IdDocumentAssociated) === i
    );
    this.bsList = distinctDocLine.map(item => item.IdDocumentAssociatedNavigation);
    this.filtredBsList = this.bsList.slice(0);
  }

  handleFilter(value: string): void {
    this.filtredBsList = this.bsList.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase()));
  }
  
  public loadItems(dataLineBs): any {
    return {
      data: dataLineBs.slice(this.skip, this.skip + this.pageSize),
      total: dataLineBs.length
    };
  }

  /* verify if the grid is in editing mode  */
  public get isInEditingModeImportBs(): boolean {
    return this.editedRowIndexImportBs !== undefined;
  }

  public editHandlerImportBs({ rowIndex, dataItem }: any): void {
    this.closeEditor();
    this.editedRowIndexImportBs = rowIndex;
    this.gridImportBs.editRow(rowIndex);
    this.formGroupImportBs = formGroupImportBs(dataItem);
    this.disableOrEnableImportButtonBs();
  }
  /* * close grid edit cell */
  closeEditor(): void {

    this.gridImportBs.closeRow(this.editedRowIndexImportBs);
    this.editedRowIndexImportBs = undefined;
    this.formGroupImportBs = undefined;
    this.disableOrEnableImportButtonBs();
  }

  public verifLine(): boolean {
    if (this.formGroupImportBs) {
      if (this.formGroupImportBs.valid) {
        if (this.isgridImportBsValuesAreValid()) {
          this.closeEditor();
          return true;
        }
      } else {
        this.validationService.validateAllFormFields(this.formGroupImportBs);
      }
    }
   
    return false;
  }

  isgridImportBsValuesAreValid(): boolean {
    const lineBs: DocumentLine[] = this.listDocumentLineBs.data.filter(x => x.IdDocumentLineAssociated == this.formGroupImportBs.controls['IdDocumentLineAssociated'].value);
   const initLineBs: DocumentLine[] = this.initListDocumentLineBs.data.filter(x => x.IdDocumentLineAssociated == this.formGroupImportBs.controls['IdDocumentLineAssociated'].value);
    const filtredlineBs: DocumentLine[] = this.listBsWithFilter.data.filter(x => x.IdDocumentLineAssociated == this.formGroupImportBs.controls['IdDocumentLineAssociated'].value);
    const initBsWithoutChange: DocumentLine[] = this.initListBs.data.filter(x => x.IdDocumentLineAssociated == this.formGroupImportBs.controls['IdDocumentLineAssociated'].value);
    if (initBsWithoutChange && initBsWithoutChange.length) {
      if (initBsWithoutChange[0].MovementQty < this.formGroupImportBs.controls['MovementQty'].value) {
        this.growlService.warningNotification(this.translate.instant('ERROR_QUANTITY_BS') + " : " + initBsWithoutChange[0].MovementQty);
        // Afficher une notification front La Quantité saisie ne doit pas dépasser la quantité de la ligne Bs
        return false;
      } else if (this.formGroupImportBs.controls['MovementQty'].value <= 0) {
        this.growlService.warningNotification(this.translate.instant('CHECK_QUANTITY_POSITIVE'));
        return false;
      }
      lineBs[0].MovementQty = this.formGroupImportBs.controls['MovementQty'].value;
      initLineBs[0].MovementQty = this.formGroupImportBs.controls['MovementQty'].value;
      filtredlineBs[0].MovementQty = this.formGroupImportBs.controls['MovementQty'].value;

      lineBs[0].HtTotalLineWithCurrency = lineBs[0].HtUnitAmountWithCurrency * lineBs[0].MovementQty;
      initLineBs[0].HtTotalLineWithCurrency = initLineBs[0].HtUnitAmountWithCurrency * initLineBs[0].MovementQty;
      filtredlineBs[0].HtTotalLineWithCurrency = filtredlineBs[0].HtUnitAmountWithCurrency * filtredlineBs[0].MovementQty;

    }
    this.sumHT = this.getSumSelectedLine();
    return true;
  }

  public onSelectAllChangeBs(checkedState: SelectAllCheckboxState) {
    if (checkedState === 'checked') {
      if (this.listDocumentLineBs) {
        Array.prototype.push.apply(this.mySelectionBs, this.listDocumentLineBs.data.map((item) => item.IdDocumentLineAssociated));
        this.mySelectionBs = this.mySelectionBs.filter(
          (thing, i, arr) => arr.findIndex(t => t === thing) === i
        );
      }
      this.selectAllStateBs = 'checked';
    } else {
      let listToUncheck = this.listDocumentLineBs.data.map((item) => item.IdDocumentLineAssociated);
      if (listToUncheck && listToUncheck.length > 0) {
        listToUncheck.forEach(y => this.mySelectionBs.splice(y));
      }
      this.selectAllStateBs = 'unchecked';
    }
  }

  public onSelectedKeysChangeBs(e?) {
    let len = this.mySelectionBs.length;
    this.sumHT = this.getSumSelectedLine();


    let lenListInGrid = this.initListDocumentLineBs.data.map((item) => item.IdDocumentLineAssociated).length;
    if (len === 0) {
      this.selectAllStateBs = 'unchecked';
    } else if (len > 0 && len < lenListInGrid) {
      this.selectAllStateBs = 'indeterminate';
    } else {
      this.selectAllStateBs = 'checked';
    }
    this.disableOrEnableImportButtonBs();
  }

  getSumSelectedLine(): number {
    let sumLines: number = 0;
    if (this.mySelectionBs.length > 0) {
      this.selectedLineBsList = this.initListDocumentLineBs.data.filter(x => this.mySelectionBs.find(y => y == x.IdDocumentLineAssociated));
      const add = (a, b) => a + b;
      sumLines = this.selectedLineBsList.map((item) => item.HtTotalLineWithCurrency).reduce(add);
    }
    return sumLines;
  }
  onFocusOutMvtQuantity() {
    if (this.isInEditingModeImportBs) {
      this.closeEditor();
    }

  }

  filterData() {
    let filtredList = this.initListDocumentLineBs.data;
    if (this.isInEditingModeImportBs) {
      this.closeEditor();
    }
    this.pageSize = 20;
    this.skip = 0;

    filtredList = filtredList.filter(x =>
      (this.idUser ? (x.IdUser && x.IdUser == this.idUser): true) && 
      ((this.IdBs && this.IdBs.length > 0) ? (this.IdBs.find(y => y == x.IdDocumentAssociated)): true) &&

      (this.codeSearch ? (x.IdDocumentAssociatedNavigation && x.IdDocumentAssociatedNavigation.Code &&
        x.IdDocumentAssociatedNavigation.Code.indexOf(this.codeSearch) >= 0): true) &&

      (this.descriptionSearch ?  ((x.CodeItem && x.CodeItem.indexOf(this.descriptionSearch) >= 0) ||
        (x.DesignationItem && x.DesignationItem.indexOf(this.descriptionSearch) >= 0)): true) &&

      ((this.qtySearch || this.qtySearch == 0) ? (x.MovementQty && x.MovementQty == this.qtySearch): true) &&

      ((this.puSearch || this.puSearch == 0) ? (x.HtUnitAmountWithCurrency && x.HtUnitAmountWithCurrency == this.puSearch): true) &&

      ((this.amountHtSearch || this.amountHtSearch == 0) ? (x.HtTotalLineWithCurrency && x.HtTotalLineWithCurrency == this.amountHtSearch): true) &&

      (this.startDateToSend ? (new Date(x.IdDocumentAssociatedNavigation.DocumentDate))>=(new Date(this.startDateToSend)) : true) &&

      (this.endDateToSend ?(new Date(x.IdDocumentAssociatedNavigation.DocumentDate))<= (new Date(this.endDateToSend)): true )
    );

    this.listBsWithFilter = {
      data: filtredList,
      total: filtredList.length
    }
    let viewBL = this.loadItems(this.listBsWithFilter.data);
    this.listDocumentLineBs = viewBL;
  }

  private createForm(): void {
    this.formGroupFilter = this.fb.group({
      StartDate: new FormControl(''),
      EndDate: new FormControl(''),
      IdUser: new FormControl(''),
    });

    this.addDependentDateControls(this.formGroupFilter);
  }


  private addDependentDateControls(currentformGroup: FormGroup) {
    this.setStartDateControl(currentformGroup);
    this.setEndDateControl(currentformGroup);
    currentformGroup.get(START_DATE).valueChanges.subscribe(() => {
      if (currentformGroup.get(END_DATE).hasError('dateValueGT')) {
        currentformGroup.get(END_DATE).setErrors(null);
      }
    });
    currentformGroup.get(END_DATE).valueChanges.subscribe(() => {
      if (currentformGroup.get(START_DATE).hasError('dateValueLT')) {
        currentformGroup.get(START_DATE).setErrors(null);
      }
    });

  }
  private setStartDateControl(currentformGroup: FormGroup) {
    const oEndDate = new Observable<Date>(observer => observer.next(currentformGroup.get(END_DATE).value));
    currentformGroup.setControl(START_DATE, this.fb.control(currentformGroup.value.startDate,
      [dateValueLT(oEndDate)]));
  }
  private setEndDateControl(currentformGroup: FormGroup) {
    const oStartDate = new Observable<Date>(observer => observer.next(currentformGroup.get(START_DATE).value));
    currentformGroup.setControl(END_DATE, this.fb.control(currentformGroup.value.endDate,
      [dateValueGT(oStartDate)]));
  }

  changeStartDate() {
    if (this.formGroupFilter.get(START_DATE).value !== this.oldStartDateValue) {
      this.oldStartDateValue = this.formGroupFilter.get(START_DATE).value;
      if (!this.oldStartDateValue) {
        this.minEndDate = undefined;
      } else {
        this.minEndDate = this.oldStartDateValue;
      }
      this.cdRef.detectChanges();
    }
  }

  changeEndDate() {
    if (this.formGroupFilter.get(END_DATE).value !== this.oldEndDateValue) {
      this.oldEndDateValue = this.formGroupFilter.get(END_DATE).value;

      if (!this.oldEndDateValue) {
        this.maxStartDate = undefined;
      } else {
        this.maxStartDate = this.oldEndDateValue;
      }
      this.cdRef.detectChanges();
    }
  }

  setDataSourceWithSpecificDates(){
    let  startDate :Date = this.formGroupFilter.get(START_DATE).value;
    let  endDate :Date = this.formGroupFilter.get(END_DATE).value;
   
    if(startDate){
      this.startDateToSend = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
    }else{
      this.startDateToSend=undefined;
    }
    if(endDate){
      this.endDateToSend = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
    }else{
      this.endDateToSend = undefined;
    }
    if(this.formGroupFilter && this.formGroupFilter.controls['IdUser'] && this.formGroupFilter.controls['IdUser'].value ){
      this.idUser = this.formGroupFilter.controls['IdUser'].value;
    }else{
      this.idUser = undefined;
    }
        this.filterData();
      
}
}
