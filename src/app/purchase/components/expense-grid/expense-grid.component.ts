import { Component, OnInit, Input, OnDestroy, ViewChild, ViewContainerRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DocumentExpenseLine } from '../../../models/purchase/document-expense-line.model';
import { GridComponent } from '@progress/kendo-angular-grid';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ExpenseConstant } from '../../../constant/purchase/expense.contant';
import { AddExpenseComponent } from '../../expense/add-expense/add-expense.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ExpenseDropdownComponent } from '../expense-dropdown/expense-dropdown.component';
import { DocumentExpenseLineConstant } from '../../../constant/purchase/document-expense-line-constant';
import { DocumentExpenseLineService } from '../../services/document-expense-line/document-expense-line.service';
import { ExpenseLineObject } from '../../../models/purchase/expense-line-object.model';
import { TotalLineExpense } from '../../../models/purchase/total-line-expense.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { SearchConstant } from '../../../constant/search-item';
import { DocumentService } from '../../../sales/services/document/document.service';
import { CrudGridService } from '../../../sales/services/document-line/crud-grid.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { TranslationKeysConstant } from '../../../constant/shared/translation-keys.constant';
import { AddTiersComponent } from '../../../shared/components/add-tiers/add-tiers.component';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { isNullOrUndefined } from 'util';
import { InputToCalculateCoefficientOfPriceCost } from '../../../models/purchase/input-to-calculate-coefficient-of-price-cost.model';
import { isBetweenKendoDropdowns } from '../../../shared/helpers/component.helper';
import { AddExpenseItemComponent } from '../../../inventory/list-expense-items/add-expense-item/add-expense-item.component';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';

export const createLineFormGroup = dataItem => new FormGroup({
  'Id': new FormControl(dataItem.Id),
  'IdDocument': new FormControl(dataItem.IdDocument),
  'IdExpense': new FormControl(dataItem.IdExpense, Validators.required),
  'CodeExpense': new FormControl(dataItem.CodeExpense, Validators.required),
  'Designation': new FormControl(dataItem.Designation),
  'IdTiers': new FormControl(dataItem.IdTiers, Validators.required),
  'TiersName': new FormControl({ value: dataItem.TiersName }),
  'IdCurrency': new FormControl({ value: dataItem.IdCurrency, disabled: true }, Validators.required),
  'CodeCurrency': new FormControl({ value: dataItem.CodeCurrency }),
  'HtAmountLineWithCurrency': new FormControl(dataItem.HtAmountLineWithCurrency,
    [Validators.required, Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'), Validators.min(0)]),
  'HtAmountLineWithCurrencyPercentage': new FormControl(dataItem.HtAmountLineWithCurrencyPercentage,
    [Validators.required, Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'), Validators.min(0)]),
  'IdTaxe': new FormControl({ value: dataItem.IdTaxe, disabled: true }),
  'CodeTaxe': new FormControl(dataItem.TaxeValue, Validators.required),
  'TtcAmountLineWithCurrency': new FormControl({ value: dataItem.TtcAmountLineWithCurrency, disabled: true }),
  'IsDeleted': new FormControl(dataItem.IsDeleted),
  'TaxeAmoun': new FormControl(dataItem.TaxeAmoun, Validators.min(0)),
  'TaxeAmount': new FormControl(dataItem.TaxeAmount)
});
@Component({
  selector: 'app-expense-grid',
  templateUrl: './expense-grid.component.html',
  styleUrls: ['./expense-grid.component.scss']
})
export class ExpenseGridComponent implements OnInit, OnDestroy {
  @ViewChild(ExpenseDropdownComponent) ExpenseDropdownComponent;
  @ViewChild(SupplierDropdownComponent) SupplierDropdownComponent;
  @ViewChild(GridComponent) private grid: GridComponent;
  /**event emit to calculate cost price*/
  // @Output() CalculateCostPrice = new EventEmitter<boolean>();
  private editedRowIndex: number;
  public view: DocumentExpenseLine[];
  /** Line Attributs */
  public isNew = false;
  public isEditingMode = false;
  /** Amount Attributs */
  public selectedExpense;
  public supplierRelatedToExpense;
  public selectedVAT;
  public HtAmountLineWithCurrency;
  public HtAmountLineWithCurrencyPercentage;
  /*Calculate total line exponse*/
  public totalExposeLines: TotalLineExpense;
  public totalTtcExpense = 0;
  public purchasePrecisionOfCompanyCurrency: number;
  @Input() documentformGroup: FormGroup;
  @Input() formatOptions;
  @Input() supplierName;
  @Input() hideBtn: boolean;
  formGroup: FormGroup;
  formValues: FormGroup;
  formatOptionsExpense: any;
  companyCurrencySymbole: string;
  isDisabeldInput: true;
  keyAction;
  isFromRemove = false;
  percentageInputDisabled = true;
  amountInputDisabled = false;
  public gridObject;
  public showImportLines: boolean;
  public docClickSubscription: any;
  isFocused: boolean;
  disabledTaxeAmount = true;
  @Input() isDisabled;

  constructor(private documentexpenseGridLineService: CrudGridService, private validationService: ValidationService,
    private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService,
    private documentExpenseLineService: DocumentExpenseLineService,
    public companyService: CompanyService, public documentService: DocumentService, private localStorageService: LocalStorageService) {
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
      this.saveLine();
    }
  }
  saveLine() {
    this.prepareRowObject(this.editedRowIndex + 1);
    this.saveCurrent();
  }

  prepareRowObject(rowToSelect) {
    if (this.view.length > rowToSelect) {
      this.gridObject = { isEdited: false, rowIndex: rowToSelect };
    }
  }
  callNexTLine(dataGrid, event) {

    if (this.editedRowIndex >= 0 && dataGrid.length - 1 && !isBetweenKendoDropdowns(event)) {

      if (event.key === KeyboardConst.ARROW_DOWN &&
        this.editedRowIndex < dataGrid.length - 1) {

        // get next index

        this.moveToNexLine(this.editedRowIndex + 1);
      } else if (event.key === KeyboardConst.ARROW_UP && this.editedRowIndex > 0) {

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
  ngOnInit() {
    this.view = this.documentexpenseGridLineService.linesToDisplay('expenseData');
    this.documentService.documentHasExpense = this.view.length > 0;
    this.companyCurrencySymbole = this.localStorageService.getCurrencySymbol();
    this.purchasePrecisionOfCompanyCurrency = this.localStorageService.getCurrencyPrecision();
    this.formatOptionsExpense = {
      style: 'currency',
      currency: this.localStorageService.getCurrencyCode(),
      currencyDisplay: 'symbol',
      minimumFractionDigits: this.localStorageService.getCurrencyPrecision()
    };
  }

  /**
   * Destroy ressources
   */
  ngOnDestroy(): void {
    this.documentexpenseGridLineService.expenseData = [];
    document.removeEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);
    this.documentService.documentHasExpense = false;
  }

  /*
  * verify if the grid is in editing mode
  */
  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }





  calculateTotalExpenseLine() {
    this.view = this.documentexpenseGridLineService.linesToDisplay('expenseData');
    this.totalExposeLines = new TotalLineExpense();
    this.totalExposeLines.ExposeLines = new Array<DocumentExpenseLine>();
    this.totalExposeLines.ExposeLines = this.view;
    this.totalExposeLines.DocumentDate = this.documentformGroup.controls[DocumentConstant.DOCUMENT_DATE].value;
    if (this.totalExposeLines.ExposeLines.length === 0) {
      this.totalTtcExpense = 0;
    } else {
      this.documentExpenseLineService.calculateTotalExpense(this.totalExposeLines).subscribe(x => {
        this.totalTtcExpense = x;
      });
    }
    this.documentService.documentHasExpense = this.view.length > 0;
  }

  removeLine({ isEdited, dataItem, rowIndex, sender }) {
    dataItem.IsDeleted = true;
    this.documentexpenseGridLineService.saveData(dataItem, false, 'expenseData');
    this.documentexpenseGridLineService.expenseData = this.documentexpenseGridLineService.
      expenseData.filter(x => x.IsDeleted === false);
    this.view = this.documentexpenseGridLineService.linesToDisplay('expenseData');
    this.documentService.saveUpdateExpenseLine(dataItem).subscribe(x => {
      this.calculateTotalExpenseLine();
      this.closeEditor();
      this.isFromRemove = true;
    });
  }

  addLine() {
    this.documentformGroup.enable();
    if (this.documentformGroup.valid && !this.isEditingMode) {
      this.isEditingMode = true;
      this.selectedExpense = undefined;
      this.HtAmountLineWithCurrency = '';
      this.HtAmountLineWithCurrencyPercentage = '';
      this.selectedVAT = undefined;
      this.supplierRelatedToExpense = undefined;
      let documentId = 0;
      if (this.documentformGroup.controls['Id']) {
        documentId = this.documentformGroup.controls['Id'].value;
      }
      this.formGroup = createLineFormGroup({
        'Id': 0,
        'IdExpense': 0,
        'IdDocument': documentId,
        'CodeExpense': '',
        'IdTiers': undefined,
        'TiersName': '',
        'IdCurrency': '',
        'CodeCurrency': '',
        'Designation': '',
        'HtAmountLineWithCurrency': 0,
        'HtAmountLineWithCurrencyPercentage': 0,
        'IdTaxe': undefined,
        'CodeTaxe': '',
        'TtcAmountLineWithCurrency': 0,
        'IsDeleted': false,
        'TaxeAmoun': 0,
        'TaxeAmount': 0
      });
      this.isNew = true;
      this.grid.addRow(this.formGroup);
    } else {
      this.validationService.validateAllFormFields(this.documentformGroup);
    }
  }

  /**
   * change supplier value and currency value when expense is selected
   * @param $event
   */
  expenseSelected($event) {
    this.selectedExpense = $event.form.value[DocumentExpenseLineConstant.ID_EXPENSE];
    if ($event.ExpensesFiltredDataSource && $event.form && $event.form.value[DocumentExpenseLineConstant.ID_EXPENSE]) {
      const expenseValue = ($event.ExpensesFiltredDataSource
        .filter(c => c.Id === $event.form.value[DocumentExpenseLineConstant.ID_EXPENSE]));
      if (expenseValue && expenseValue.length > 0) {
        const expenseLine: ExpenseLineObject = new ExpenseLineObject();
        Object.assign(expenseLine, this.formGroup.value);
        this.disabledTaxeAmount = expenseValue[0].IdTaxeNavigation.IsCalculable;
        if (this.disabledTaxeAmount) {
          this.formGroup.controls['TaxeAmount'].disable();
        } else {
          this.formGroup.controls['TaxeAmount'].enable();
        }
        expenseLine.IdExpense = expenseValue[0].Id;
        expenseLine.CodeExpense = expenseValue[0].Code;
        expenseLine.Designation = expenseValue[0].Description;
        expenseLine.IdTaxe = expenseValue[0].IdTaxe;
        expenseLine.CodeTaxe = expenseValue[0].IdTaxeNavigation.CodeTaxe;

        if (expenseValue[0].ItemTiers && expenseValue[0].ItemTiers.length == 1) {
          expenseLine.IdTiers = expenseValue[0].ListTiers[0].Id;
          expenseLine.TiersName = expenseValue[0].ListTiers[0] ? expenseValue[0].ListTiers[0].Name : undefined;
          expenseLine.IdCurrency = expenseValue[0].ListTiers[0] ? expenseValue[0].ListTiers[0].IdCurrency : undefined;
          expenseLine.CodeCurrency = expenseValue[0].ListTiers[0].IdCurrencyNavigation ? expenseValue[0].ListTiers[0].IdCurrencyNavigation.Code : undefined;
        } else {
          expenseLine.IdTiers = undefined;
          expenseLine.TiersName = undefined;
          expenseLine.IdCurrency = undefined;
          expenseLine.CodeCurrency = undefined;
        }
        this.selectedVAT = expenseLine.IdTaxe;
        this.formGroup.patchValue(expenseLine);
      }
    } else {
      const expenseLine: ExpenseLineObject = new ExpenseLineObject();
      Object.assign(expenseLine, this.formGroup.value);
      expenseLine.IdExpense = undefined;
      expenseLine.CodeExpense = '';
      expenseLine.IdTiers = undefined;
      expenseLine.TiersName = '';
      expenseLine.IdCurrency = undefined;
      expenseLine.CodeCurrency = '';
      expenseLine.Designation = '';
      expenseLine.IdTaxe = undefined;
      expenseLine.CodeTaxe = '';
      this.selectedVAT = expenseLine.IdTaxe;
      this.formGroup.patchValue(expenseLine);
    }
  }

  /*
   * cancel changes
   */
  public cancelHandler(): void {
    this.percentageInputDisabled = true;
    this.amountInputDisabled = false;
    this.closeEditor();
  }

  /**
   * Add a new expense
   */
  public addExpenseEvent() {
    const modalTitle = ExpenseConstant.ADD_EXPENSE;
    this.formModalDialogService.openDialog(modalTitle, AddExpenseItemComponent, this.viewRef, this.initExpenseDataSource.bind(this),
      null, null, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  public addSupplierEvent(value) {
    this.supplierName = value.Name;
    const modalTitle = TranslationKeysConstant.ADD_SUPPIER;
    this.formModalDialogService.openDialog(modalTitle, AddTiersComponent,
      this.viewRef, this.closeSupplierModal.bind(this), value, null, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  closeSupplierModal() {
    this.SupplierDropdownComponent.closeModal();
  }

  /**
   * Init source in the expense dropdown
   */
  public initExpenseDataSource() {
    this.ExpenseDropdownComponent.initDataSource();
  }

  /*
   * close grid edit cell
   */
  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.isNew = false;
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.isEditingMode = false;
  }

  receiveTaxe($event) {
    if ($event.selectedValue) {
      this.selectedVAT = $event.selectedValue;
      if ($event.taxesFiltredDataSource && $event.form && $event.form.value[DocumentExpenseLineConstant.ID_TAXE]) {
        const taxeValue = ($event.taxesFiltredDataSource
          .filter(c => c.Id === $event.form.value[DocumentExpenseLineConstant.ID_TAXE]));
        if (taxeValue && taxeValue.length > 0) {
          this.formGroup.controls[DocumentExpenseLineConstant.CODE_TAXE].setValue(taxeValue[0].CodeTaxe);
        }
      }
    } else {
      this.selectedVAT = 0;
    }
    this.setTTCAmount();
  }

  /**
   * Set TTC Amount
   * @param dataItem
   */
  setTTCAmount(isFromSaveEvent = false) {
    if (this.formGroup !== null && this.formGroup !== undefined) {
      this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY].setValue(this.HtAmountLineWithCurrency);
      this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY_PERCENTAGE].
        setValue(this.HtAmountLineWithCurrencyPercentage);
      const documentExpenseLine = new DocumentExpenseLine();
      documentExpenseLine.IdExpense = this.selectedExpense;
      documentExpenseLine.IdTaxe = this.selectedVAT ? this.selectedVAT : 0;
      documentExpenseLine.HtAmountLineWithCurrency = this.HtAmountLineWithCurrency;
      documentExpenseLine.HtAmountLineWithCurrencyPercentage = this.HtAmountLineWithCurrencyPercentage;
      this.documentExpenseLineService.getDocumentExpenseLineTTCAmount(documentExpenseLine).subscribe(res => {
        this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY].setValue(res.HtAmountLineWithCurrency);
        this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY_PERCENTAGE].
          setValue(res.HtAmountLineWithCurrencyPercentage);
        this.formGroup.controls[DocumentExpenseLineConstant.TTC_AMOUNT_LINE_WITH_CURRENCY].setValue(res.TtcAmountLineWithCurrency);
        if (isFromSaveEvent) {
          this.saveCurrent();
        }
      });
    }
  }
  calculateAmountAndSave() {
    if (this.amountInputDisabled) {
      this.changePercentageData(true);
    } else if (this.percentageInputDisabled) {
      this.changeAmountData(true);
    } else {
      this.saveAferCalculating();

    }
  }

  saveAferCalculating() {
    if (this.formGroup.controls['TaxeAmoun'].value === undefined || this.formGroup.controls['TaxeAmoun'].value === '') {
      this.formGroup.controls['TaxeAmoun'].setValue(0);
    }
    if (this.formGroup.controls['IdCurrency'].value === undefined && this.formGroup.controls['IdTiers'].value
      && this.SupplierDropdownComponent) {
      const supplierValue = (this.SupplierDropdownComponent.supplierFiltredDataSource.
        filter(c => c.Id === this.SupplierDropdownComponent.itemForm.value[ExpenseConstant.ID_TIERS]));
      if (supplierValue && supplierValue.length > 0) {
        this.formGroup.controls[ExpenseConstant.ID_CURRENCY].setValue(supplierValue[0].IdCurrency);
      }
    }
    this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY].setValue(this.HtAmountLineWithCurrency);
    this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY_PERCENTAGE].
      setValue(this.HtAmountLineWithCurrencyPercentage);
    if (this.formGroup.valid) {
      this.view = this.documentexpenseGridLineService.linesToDisplay('expenseData');
      const expenseLine: ExpenseLineObject = new ExpenseLineObject();
      Object.assign(expenseLine, this.formGroup.getRawValue());
      expenseLine.IdTiers = this.formGroup.controls[DocumentExpenseLineConstant.ID_TIERS].value;
      expenseLine.TiersName = this.formGroup.controls[DocumentExpenseLineConstant.TIERS_NAME].value;
      expenseLine.IdCurrency = this.formGroup.controls[DocumentExpenseLineConstant.ID_CURRENCY].value;
      expenseLine.CodeCurrency = this.formGroup.controls[DocumentExpenseLineConstant.CODE_CURRENCY].value;
      expenseLine.CodeTaxe = this.formGroup.controls[DocumentExpenseLineConstant.CODE_TAXE].value;
      expenseLine.IdTaxe = this.formGroup.controls[DocumentExpenseLineConstant.ID_TAXE].value;
      expenseLine.IdExpense = this.selectedExpense;
      expenseLine.TaxeAmoun = this.formGroup.controls['TaxeAmoun'].value;
      expenseLine.TtcAmountLineWithCurrency = this.formGroup.
        controls[DocumentExpenseLineConstant.TTC_AMOUNT_LINE_WITH_CURRENCY].value;
      this.documentService.saveUpdateExpenseLine(expenseLine).subscribe(x => {
        this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY].
          setValue(x.objectData.HtAmountLineWithCurrency);
        this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY_PERCENTAGE].
          setValue(x.objectData.HtAmountLineWithCurrencyPercentage);
        this.formGroup.controls[DocumentExpenseLineConstant.TTC_AMOUNT_LINE_WITH_CURRENCY].
          setValue(x.objectData.TtcAmountLineWithCurrency);
        const expenseLine: ExpenseLineObject = new ExpenseLineObject(x.objectData);
        Object.assign(x.objectData, expenseLine);
        this.formGroup.patchValue(x.objectData);
        const formValues = this.formGroup;
        this.documentexpenseGridLineService.saveData(x.objectData, this.isNew, 'expenseData');
        this.closeEditor();
        this.calculateTotalExpenseLine();
        if (!this.isNew) {
          this.formGroup = formValues;
          this.saveChangesAndOpenNexLine();
        }
      });

    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  saveCurrent(): void {

    this.calculateAmountAndSave();

  }

  private saveChangesAndOpenNexLine() {
    Object.assign(this.documentexpenseGridLineService.expenseData.find(({ Id }) => Id === this.formGroup.controls['Id'].value),
      this.formGroup.getRawValue());
    this.closeEditor();
    if (this.gridObject) {
      this.documentLineClickHandler(this.gridObject);
    }
  }
  public documentLineClickHandler({ isEdited, rowIndex }): void {
    this.isNew = false;
    if (isEdited || (this.formGroup && !this.formGroup.valid) || this.isInEditingMode) {
      return;
    }

    let dataItem: any;
    if (this.view) {
      dataItem = this.view[rowIndex];
    }
    this.lineClickHandler({ isEdited, dataItem, rowIndex });
    this.formGroup.controls[DocumentExpenseLineConstant.CODE_EXPENSE].disable();
    this.formGroup.controls[DocumentExpenseLineConstant.ID_CURRENCY].disable();
    this.formGroup.controls[DocumentExpenseLineConstant.CODE_CURRENCY].disable();
    this.formGroup.controls[DocumentExpenseLineConstant.CODE_TAXE].disable();
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.formGroup);
    this.gridObject = undefined;
  }
  lineClickHandler({ isEdited, dataItem, rowIndex }): void {
    if (isEdited || (this.formGroup && !this.formGroup.valid) || this.isInEditingMode ||
      this.documentformGroup.controls['IdDocumentStatus'].value !== 1 || this.isFromRemove) {
      this.isFromRemove = false;
      return;
    }
    this.isEditingMode = true;
    this.formGroup = createLineFormGroup(dataItem);
    this.formGroup.controls[DocumentExpenseLineConstant.CODE_CURRENCY].setValue(dataItem.CodeCurrency);

    this.formGroup.controls[DocumentExpenseLineConstant.CODE_TAXE].setValue(dataItem.CodeTaxe);
    this.formGroup.controls[DocumentExpenseLineConstant.TIERS_NAME].setValue(dataItem.TiersName);
    this.selectedExpense = dataItem.IdExpense;
    this.selectedVAT = dataItem.IdTaxe;
    this.supplierRelatedToExpense = dataItem.IdTiers;
    this.HtAmountLineWithCurrency = dataItem.HtAmountLineWithCurrency;
    this.HtAmountLineWithCurrencyPercentage = dataItem.HtAmountLineWithCurrencyPercentage;
    this.formGroup.controls['IdExpense'].disable();
    if (dataItem.IdTaxeNavigation && this.formGroup) {
      if (dataItem.IdTaxeNavigation.IsCalculable) {
        this.formGroup.controls['TaxeAmount'].disable();
      } else {
        this.formGroup.controls['TaxeAmount'].enable();
      }
    }
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.formGroup);
  }
  selectSupplier($event) {
    let selectedCurrencyId;
    if ($event.supplierFiltredDataSource && $event.itemForm && $event.itemForm.value[ExpenseConstant.ID_TIERS]) {
      const supplierValue = ($event.supplierFiltredDataSource.
        filter(c => c.Id === $event.itemForm.value[ExpenseConstant.ID_TIERS]));
      if (supplierValue && supplierValue.length > 0) {
        selectedCurrencyId = supplierValue[0].IdCurrency;
        this.formGroup.controls[ExpenseConstant.ID_CURRENCY].setValue(selectedCurrencyId);
      }
    }

  }

  changePercentageData(isWithSave?: boolean) {

    this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY_PERCENTAGE].enable();
    this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY_PERCENTAGE].
      setValue(this.HtAmountLineWithCurrencyPercentage);
    if (!this.HtAmountLineWithCurrency || isNaN(this.HtAmountLineWithCurrency)) {
      this.HtAmountLineWithCurrency = 0;
      this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY].setValue(0);
    }
    this.formGroup.updateValueAndValidity();
    if (this.formGroup.valid) {
      const percentageValue = this.prepareCostPriceData();
      if (!isNullOrUndefined(percentageValue)) {
        this.documentExpenseLineService.changeAmountData(percentageValue).subscribe(x => {
          this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY].patchValue(x.objectData);
          this.HtAmountLineWithCurrency = x.objectData;
          if (isWithSave) {
            this.saveAferCalculating();
          }
        });
      }

    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }

  }

  changeAmountData(isWithSave?: boolean) {

    this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY].enable();
    this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY].setValue(this.HtAmountLineWithCurrency);
    if (!this.HtAmountLineWithCurrencyPercentage || isNaN(this.HtAmountLineWithCurrencyPercentage)) {
      this.HtAmountLineWithCurrencyPercentage = 0;
      this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY_PERCENTAGE].setValue(0);
    }
    this.formGroup.updateValueAndValidity();
    if (this.formGroup.valid) {
      const amountValue = this.prepareCostPriceData();
      if (!isNullOrUndefined(amountValue)) {
        this.documentExpenseLineService.changePercentageData(amountValue).subscribe(x => {
          this.formGroup.controls[DocumentExpenseLineConstant.HT_AMOUNT_LINE_WITH_CURRENCY_PERCENTAGE].patchValue(x.objectData);
          this.HtAmountLineWithCurrencyPercentage = x.objectData;
          if (isWithSave) {
            this.saveAferCalculating();
          }
        }
        );
      }

    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }

  }

  disablePercentageData(event): void {
    this.percentageInputDisabled = true;
    this.amountInputDisabled = false;
  }

  disableAmountData(event): void {
    this.amountInputDisabled = true;
    this.percentageInputDisabled = false;
  }

  prepareCostPriceData() {
    const dataValue = new InputToCalculateCoefficientOfPriceCost
      (this.documentformGroup.controls['IdCurrency'].value,
        this.documentformGroup.controls[DocumentConstant.DOCUMENT_TTC_PRICE_WITH_CURRENCY].value,
        this.documentformGroup.controls[DocumentConstant.DOCUMENT_HT_PRICE_WITH_CURRENCY].value,
        this.totalTtcExpense,
        this.documentformGroup.controls[DocumentConstant.DOCUMENT_DATE].value,
        this.documentformGroup.controls['Id'].value,
        null, // this.costGrid.margin ,
        this.HtAmountLineWithCurrency,
        this.HtAmountLineWithCurrencyPercentage);
    return dataValue;
  }

  savePercentageColumn(event) {
    if (event.charCode === 13) {
      this.changePercentageData();
    }
  }

  saveAmountColumn(event) {
    if (event.charCode === 13) {
      this.changeAmountData();
    }
  }
  showTaxeAmount(dataItem): boolean {
    if (dataItem.IdTaxeNavigation) {
      return !dataItem.IdTaxeNavigation.IsCalculable;
    }
  }

}
