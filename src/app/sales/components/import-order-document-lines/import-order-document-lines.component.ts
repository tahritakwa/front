import {
  Component, OnInit, Input, OnDestroy,
  ViewChild, EventEmitter, Output, ComponentRef, ChangeDetectorRef, ViewContainerRef
} from '@angular/core';
import { PagerSettings, SelectableSettings, GridComponent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ListDocumentService } from '../../../shared/services/document/list-document.service';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { DocumentService } from '../../services/document/document.service';
import { ReduisDocument } from '../../../models/sales/reduis-document.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { ValidationService, dateValueGT, dateValueLT } from '../../../shared/services/validation/validation.service';
import { Document } from '../../../models/sales/document.model';
import { CrudGridService } from '../../services/document-line/crud-grid.service';
import {
  IModalDialog, IModalDialogOptions
} from 'ngx-modal-dialog'; import { ImportDocuments } from '../../../models/sales/import-documents.model';
import { Observable } from 'rxjs/Observable';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { SearchItemService } from '../../services/search-item/search-item.service';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { TicketService } from '../../../treasury/services/ticket/ticket.service';
import { Subject } from 'rxjs/Subject';

const START_DATE = 'StartDate';
const END_DATE = 'EndDate';

@Component({
  selector: 'app-import-order-document-lines',
  templateUrl: './import-order-document-lines.component.html',
  styleUrls: ['./import-order-document-lines.component.scss']
})
export class ImportOrderDocumentLinesComponent implements OnInit, OnDestroy, IModalDialog {
  @Input() itemForm: FormGroup;
  @Input() documentAssociatedType: string;
  @Input() documentType: string;
  @Input() LinesOnly: boolean;
  @Input() blOnly: boolean;
  @Input() idItem: number;
  @ViewChild('gridBalance') private grid: GridComponent;
  isNotForImport: boolean;
  options: Partial<IModalDialogOptions<any>>;
  public closeDialogSubject: Subject<any>;
  public format = this.translate.instant(SharedConstant.DATE_FORMAT);

  // Selection in OrderPurchase setting
  public selectableSettings: SelectableSettings;
  public selectableBalancesSettings: SelectableSettings;

  public documentView: Document[] = [];
  public filtredList: Document[];
  public balancesView: DocumentLine[] = [];
  public formatFoSalesOptions;
  // Edit in form Attributs
  public formGroup: FormGroup;
  private editedRowIndex: number;
  private isNew: boolean;
  public selectAllState: SelectAllCheckboxState = 'unchecked';
  public selectAllOtherState: SelectAllCheckboxState = 'unchecked';
  public selectedBalancedLines = [];
  public isToMergeBL = false;
  public shearchCodeRef: string;
  public shearchCodeDocRef: string;
  public shearchDescRef: string;
  public isFromCounterSale: boolean;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  /** Reduis Document */
  public reduisDocument: ReduisDocument;

  /**event emit to disable or enable import button */
  @Output() disableImportButton = new EventEmitter<boolean>();
  @Input() containerRef;

  private oldStartDateValue: Date;
  private oldEndDateValue: Date;
  public minEndDate: Date;
  public minStartDate: Date;
  public maxStartDate: Date;
  public filtedList: DocumentLine[] = [];
  // FormGroup
  formGroupFilter: FormGroup;
  amountHtSearch: number;
  amountTtcSearch: number;
  public sumHT = 0;
  public sumAllHT = 0;
  
  // enums
  public statusCode = documentStatusCode;

  constructor(public documentService: DocumentService, public purchaseOrderListService: ListDocumentService,
    public service: CrudGridService, public validationService: ValidationService, private fb: FormBuilder,
    private cdRef: ChangeDetectorRef, public viewRef: ViewContainerRef, protected searchItemService: SearchItemService,
    private modalService: ModalDialogInstanceService, private translate: TranslateService,public ticketService:TicketService) {
    this.setSelectableSettings();
  }
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isNotForImport = true;
    if (options.data.isToMergeBl) {
      this.itemForm = options.data.formGroup;
      this.isToMergeBL = options.data.isToMergeBl;
    } if(options.data.isFromCounterSale) {
      this.itemForm = options.data.formGroup;
      this.documentType = options.data.documentType;
      this.documentAssociatedType = options.data.documentAssociatedType,
      this.blOnly = true;
      this.isFromCounterSale = true;
      this.isNotForImport = false;
      this.options = options;
      this.closeDialogSubject = options.closeDialogSubject;
    } else {
      this.itemForm = options.data;
    }
  }

  /*
    * verify if the grid is in editing mode
    */
  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }

  public shearchCode() {
    if (this.reduisDocument) {
      this.reduisDocument.serachCode = this.shearchCodeRef;
    }

    if (this.isNotForImport) {
      this.initBLs();
    } else {
      this.getData();
    }
  }
  ngOnInit() {
    this.documentView = [];
    this.balancesView = [];
    this.service.DataToImport = [];
    this.createForm();
    this.formGroupFilter.controls['StartDate'].setValue(new Date());
    this.formGroupFilter.controls['EndDate'].setValue(new Date());
    // isNotForImport: the same component used to show provisional bls to merge them
    this.setSelectableSettings();
    this.initGridDataSource();
    this.disableImportButton.emit(true);
    this.selectAllState = 'unchecked';
    this.selectAllOtherState = 'unchecked';
    this.selectedBalancedLines = [];
  }


  /**
  *  prepare the form to do Search
  */
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

  ngOnDestroy() {
    this.service.otherData = new Array();
    this.service.DataToImport = new Array();
  }

  /**get selected rows index */
  selectBalance($event) {
    this.service.otherData = [];
    $event.forEach(selected => {
      this.service.otherData.push(this.balancesView.filter(p => p.Id === selected)[0]);
    });
    this.updateOtherQuantity();
    this.checkOrUncheckButtonOfOther();
    this.disableOrEnableImportButton();
  }
  updateOtherQuantity() {
    this.service.otherData.forEach(selected => {
      /* if received quantity has never been edited when row is selected then set received
       quantity with the remaining quantity automatically */
      if (selected.ReceivedQuantity === 0) {
        selected.ReceivedQuantity = selected.RemainingQuantity;
      }
    });
  }
  checkOrUncheckButtonOfOther() {
    const len = this.service.otherData.length;
    const lenListInGrid = this.balancesView.length;
    if (len === 0) {
      this.selectAllOtherState = 'unchecked';
    } else if (len > 0 && len < lenListInGrid) {
      this.selectAllOtherState = 'indeterminate';
    } else {
      this.selectAllOtherState = 'checked';
    }
  }
  onSelectAllOtherChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === 'checked') {
      Array.prototype.push.apply(this.selectedBalancedLines, this.balancesView.map((item) => item.Id));
      Array.prototype.push.apply(this.service.otherData, this.balancesView);
      this.selectedBalancedLines = this.selectedBalancedLines.filter(
        (thing, i, arr) => arr.findIndex(t => t === thing) === i
      );
      this.selectAllOtherState = 'checked';
      this.updateOtherQuantity();
    } else {
      const listToUncheck = this.balancesView.map((item) => item.Id);
      const listItemToUncheck = this.balancesView;
      if (listToUncheck && listToUncheck.length > 0) {
        listToUncheck.forEach(y => this.selectedBalancedLines.splice(this.selectedBalancedLines.indexOf(y), 1));
        listItemToUncheck.forEach(y => this.service.otherData.splice(this.service.otherData.indexOf(y), 1));
      }
      this.selectAllOtherState = 'unchecked';
    }

  }
  /**selection grid settings */
  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: true,
      mode: !this.blOnly ? 'multiple' : 'single'
    };
    this.selectableBalancesSettings = {
      checkboxOnly: true,
      mode: 'multiple'
    };
  }

  selectOrderRow($event) {
    this.sumHT = this.getSumSelectedLine();
    this.checkOrUncheckButton();
    this.disableOrEnableImportButton();
  }

  getSumSelectedLine(): number {
    let sumLines: number = 0;
    if (this.service.DataToImport.length > 0) {
      var selectedLineBsList = this.documentView.filter(x => this.service.DataToImport.find(y => y == x.Id));
      const add = (a, b) => a + b;
      if (selectedLineBsList && selectedLineBsList.length > 0) {
        sumLines = selectedLineBsList.map((item) => item.DocumentTtcpriceWithCurrency).reduce(add);
      }
    }
    return sumLines;
  }

  checkOrUncheckButton() {
    const len = this.service.DataToImport.length;
    const lenListInGrid = this.documentView.map((item) => item.Id).length;
    if (len === 0) {
      this.selectAllState = 'unchecked';
    } else if (len > 0 && len < lenListInGrid) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = 'checked';
    }
  }
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === 'checked') {
      Array.prototype.push.apply(this.service.DataToImport, this.documentView.map((item) => item.Id));
      this.service.DataToImport = this.service.DataToImport.filter(
        (thing, i, arr) => arr.findIndex(t => t === thing) === i
      );
      this.selectAllState = 'checked';
    } else {
      const listToUncheck = this.documentView.map((item) => item.Id);
      if (listToUncheck && listToUncheck.length > 0) {
        listToUncheck.forEach(y => this.service.DataToImport.splice(this.service.DataToImport.indexOf(y), 1));
      }
      this.selectAllState = 'unchecked';
    }
  }

  public disableOrEnableImportButton() {
    if ((this.service.DataToImport && this.service.DataToImport.length > 0) ||
      (this.service.otherData && this.service.otherData.length > 0)) {
      this.disableImportButton.emit(false);
    } else {
      this.disableImportButton.emit(true);
    }
  }


  /*
   * init the grid data source using presicate
   */
  initGridDataSource() {
    this.setDataSourceWithSpecificDates();
  }

  getData() {
    this.reduisDocument.CurrentDocumentId = this.itemForm.controls['Id'].value;
    this.reduisDocument.DocumentAssociatedType = this.documentAssociatedType;
    if (this.documentType) {
      this.reduisDocument.DocumentType = this.documentType;
    }
    this.documentService.getDocumentsWithBalances(this.reduisDocument).subscribe(
      data => {
        this.documentView = data.DocumentsList;
        this.balancesView = data.BalancesList;
        this.filtedList = data.BalancesList;
        this.sumHT = this.getSumSelectedLine();
        this.sumAllHT = this.getSumAllLine();
      });
  }

  getSumAllLine(): number {
    let sumAllLines: number = 0;
    if (this.documentView && this.documentView.length > 0) {
      const add = (a, b) => a + b;
      sumAllLines = this.documentView.map((item) => item.DocumentTtcpriceWithCurrency).reduce(add);
    }
    return sumAllLines;
  }
  setDataSourceWithSpecificDates() {
    if (this.isNotForImport) {
      this.initBLs();
    } else {
      if (this.formGroupFilter.valid) {
        this.reduisDocument = new ReduisDocument(this.itemForm.getRawValue(), this.service.data.filter(x => x.IsDeleted === false),
          this.idItem, this.LinesOnly, this.formGroupFilter.controls['StartDate'].value, this.formGroupFilter.controls['EndDate'].value);
        this.reduisDocument.BlOnly = this.blOnly;
        if (this.formGroupFilter.controls['IdUser'] && this.formGroupFilter.controls['IdUser'].value) {
          this.reduisDocument.IdUser = this.formGroupFilter.controls['IdUser'].value;
        }
        this.getData();
      } else {
        this.validationService.validateAllFormFields(this.formGroupFilter as FormGroup);
      }
    }

  }
  initBLs() {
    const startDate: Date = this.formGroupFilter.get(START_DATE).value;
    const endDate: Date = this.formGroupFilter.get(END_DATE).value;
    let startDateToSend: Date;
    let endDateToSend: Date;
    if (startDate) {
      startDateToSend = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
    }
    if (endDate) {
      endDateToSend = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
    }
    this.documentService.getProvisionalBl(this.itemForm.controls['IdTiers'].value,
      this.itemForm.controls['Id'].value, startDate, endDate, this.shearchCodeRef).subscribe(data => {
        this.filtredList = data.listObject.listData;
        this.formatSalesOptions(this.filtredList);
        this.filterData();
      });
  }
  /**
   * format sales options
   * @param listDocument 
   */
  formatSalesOptions(listDocument: Document[]) {
    if (listDocument.length > NumberConstant.ZERO) {
      this.formatFoSalesOptions = {
        style: 'currency',
        currency: listDocument[NumberConstant.ZERO].IdUsedCurrencyNavigation.Code,
        currencyDisplay: 'symbol',
        minimumFractionDigits: listDocument[NumberConstant.ZERO].IdUsedCurrencyNavigation.Precision
      };
    }
  }
  filterData() {
    this.documentView = this.filtredList.filter(x =>
    (this.isToGetByFilter(this.amountHtSearch, x.DocumentHtpriceWithCurrency) &&
      this.isToGetByFilter(this.amountTtcSearch, x.DocumentTtcpriceWithCurrency)));


  }

  isToGetByFilter(n1?: number, n2?: number): boolean {
    return ((n1 || n1 === 0) ? (n2 || n2 === 0) && (n1 === n2) : true);
  }
  closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.isNew = false;
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
  getTaxFromTaxName(dataItem): Array<any> {
    return Object.keys(dataItem.DocumentLineTaxe).map(i => dataItem.DocumentLineTaxe[i].TaxeName);
  }
  /** remove Id and Iddoumentline rom taxes*/
  sliceTaxeIdDocument(taxe) {
    if (taxe) {
      taxe.forEach(element => {
        element.IdDocumentLine = 0;
        element.Id = 0;
      });
    }
  }

  // to fusion bl
  saveLines() {
    if (this.service.DataToImport.length > 0) {
      this.documentService.fusionBl(this.setImportDocuments()).subscribe(x => {
        // this.service.DataToImport = new Array();
        // this.service.otherData = new Array();
        this.ngOnDestroy();
        this.searchItemService.destroyModal();
        this.modalService.closeAnyExistingModalDialog();
      });
    }
  }
  setImportDocuments(): ImportDocuments {
    const importDocuments = new ImportDocuments();
    importDocuments.DocumentTypeCode = this.itemForm.controls['DocumentTypeCode'].value;
    importDocuments.IdsDocuments = this.service.DataToImport;
    importDocuments.IdCurrentDocument = this.itemForm.controls['Id'].value;
    importDocuments.isForFokBl = true;
    return importDocuments;
  }
  // save imported Bl for counter sales
  public saveImportedBL() {
      if (this.itemForm.controls.Id.value && this.itemForm.controls.IdDocumentStatus.value == this.statusCode.Provisional) {
        this.documentService.removeDocument(this.itemForm.value).subscribe(() => { });
      }
      const importedBl = this.documentView.find(x => this.service.DataToImport.includes(x.Id));
      this.itemForm.controls.Id.setValue(importedBl.Id);
      this.itemForm.controls.Code.setValue(importedBl.Code);
      this.itemForm.controls.IdDocumentStatus.setValue(importedBl.IdDocumentStatus);
      this.itemForm.controls.DocumentTtcpriceWithCurrency.setValue(importedBl.DocumentTtcpriceWithCurrency);
      this.itemForm.controls.IdTiers.disable();
      this.options.data = importedBl;
      this.onCloseModal();
  }
  private onCloseModal(): void {
    this.options.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }
  // for simple import
  public importOperation() {
    this.documentService.updateDocumentAfterImport(this.setImportDocuments()).subscribe(x => {
      x.objectData.DocumentDate = new Date(x.objectData.DocumentDate);
      x.objectData.DocumentInvoicingDate = new Date(x.objectData.DocumentInvoicingDate);
      this.itemForm.patchValue(x.objectData);
    });
    this.service.DataToImport = new Array();
    this.service.otherData = new Array();
  }

  public shearch() {
    this.balancesView = this.filtedList.filter(x =>
      (!isNullOrEmptyString(this.shearchCodeDocRef) ? x.IdDocumentNavigation.Code.includes(this.shearchCodeDocRef) : true)
      && ((!isNullOrEmptyString(this.shearchDescRef) ? x.IdItemNavigation.Code.includes(this.shearchDescRef)
        || x.IdItemNavigation.Description.includes(this.shearchDescRef) : true))
    );
    if (isNullOrEmptyString(this.shearchDescRef) && isNullOrEmptyString(this.shearchCodeDocRef)) {
      this.balancesView = this.filtedList;
    }
  }
}
