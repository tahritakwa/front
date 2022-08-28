import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { CurrencyConstant } from '../../../constant/Administration/currency.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { CurrencyRate } from '../../../models/administration/currency-rate.model';
import { Currency } from '../../../models/administration/currency.model';
import { DocumentEnumerator, documentStatusCode, DocumentTypesEnumerator } from '../../../models/enumerators/document.enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { dateValueGT, dateValueLT, ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { CurrencyRateService } from '../../services/currency-rate/currency-rate.service';
import { CurrencyService } from '../../services/currency/currency.service';
@Component({
  selector: 'app-exchange-rate-grid',
  templateUrl: './exchange-rate-grid.component.html',
  styleUrls: ['./exchange-rate-grid.component.scss']
})
export class ExchangeRateGridComponent implements OnInit, OnChanges { 
        @Input() currencyRateList ;
        @Input() btnEditVisible ;
        @Input() currencyToEdit;
        @Input() isUpdateMode;
        @Input() currencyFormGroup;
        @Input() currencySaved;
        @Input() predicate;
        @Input() hasUpdateCurrencyPermission;
        @Input() fromDoc = false;
        @Input() IdCurrency;
      private oldStartDateValue: Date;
      private oldEndDateValue: Date;
      public minEndDate: Date;
      public maxStartDate: Date;
      public rowIndex ;
      private editedRowIndex: number;
      public currency: Currency;
      
      public currencyRateFormGroup: FormGroup;
      // pager settings
    pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
   
      public gridState: DataSourceRequestState = {
          skip: 0,
          take: 10,
          filter: { // Initial filter descriptor
            logic: 'and',
            filters: []
          }
        };
      public columnsConfig: ColumnSettings[] = [
          {
            field: SharedConstant.START_DATE,
            title: SharedConstant.START_DATE_UPPERCASE,
            filterable: true,
            format: CurrencyConstant.DOCUMENT_FORMAT,
            _width: NumberConstant.TWO_HUNDRED_FIFTY
          },
          {
            field: SharedConstant.END_DATE,
            title: SharedConstant.END_DATE_UPPERCASE,
            filterable: true,
            format: CurrencyConstant.DOCUMENT_FORMAT,
            _width: NumberConstant.TWO_HUNDRED_FIFTY
          },
          {
            field: CurrencyConstant.DOCUMENT_CODE,
            title: CurrencyConstant.DOCUMENT_CODE_UPPERCASE,
            filterable: true,
            _width: NumberConstant.TWO_HUNDRED_FIFTY
          },
          
          {
            field: CurrencyConstant.COEFFICIENT,
            title: CurrencyConstant.COEFFICIENT_UPPERCASE,
            filterable: true,
            _width: NumberConstant.TWO_HUNDRED_FIFTY
          },
          {
            field: CurrencyConstant.RATE,
            title: CurrencyConstant.RATE_UPPERCASE,
            filterable: true,
            _width: NumberConstant.TWO_HUNDRED_FIFTY
          }
        ];
      
        // Grid settings
        public gridSettings: GridSettings = {
          state: this.gridState,
          columnsConfig: this.columnsConfig
        };
        condition
        public config = [
          {
            field: SharedConstant.START_DATE,
            title: SharedConstant.START_DATE_UPPERCASE,
            condition: true,
            format: CurrencyConstant.DOCUMENT_FORMAT
          },
          {
            field: SharedConstant.END_DATE,
            title: SharedConstant.END_DATE_UPPERCASE,
            condition: true,
            format: CurrencyConstant.DOCUMENT_FORMAT
          },
          
          {
            field: CurrencyConstant.COEFFICIENT,
            title: CurrencyConstant.COEFFICIENT_UPPERCASE,
            condition: true
          },
          {
            field: CurrencyConstant.RATE,
            title: CurrencyConstant.RATE_UPPERCASE,
            condition: true
          },
          {
            field: CurrencyConstant.DOCUMENT_CODE,
            title: CurrencyConstant.DOCUMENT_CODE_UPPERCASE,
            condition: true
          }
        ];
  
        /**
     * Contructor
     * @param currencyService
     * @param formBuilder
     * @param validationService
     */
    constructor(public currencyService: CurrencyService, public currencyRateService: CurrencyRateService, private formBuilder: FormBuilder,
   private validationService: ValidationService,private cdRef: ChangeDetectorRef, private swalWarrings: SwalWarring) {}
 
      ngOnInit(): void {
        this.gridSettings.gridData = { data: [], total: 0 };
      }
  /**
    * Data changed listener
    * @param state
    */
      public dataStateChange(state: DataStateChangeEvent): void {
          if (this.gridSettings) {
            this.loadItems(this.currencyRateList, state);
          }
        }
        public keyHandler(e: any): void {
          if (e.keyCode === 13) {
            e.preventDefault();
          }
        }
  /**
        * Close editor
        * @param grid
        * @param rowIndex
        */
        private closeEditor(grid, rowIndex = this.editedRowIndex) {
          if (rowIndex !== undefined) {
            grid.closeRow(rowIndex);
            this.editedRowIndex = undefined;
            this.currencyRateFormGroup = undefined;
          }
          this.btnEditVisible = true;
          if (this.rowIndex !== undefined) {
            grid.closeRow(rowIndex);
            this.editedRowIndex = undefined;
            this.currencyRateFormGroup = undefined;
            this.rowIndex = undefined ;
          }
          this.maxStartDate = undefined;
          this.minEndDate = undefined;
        }
  
          /**
   * Quick add
   * @param param0
   */
    public addHandler({ sender }) {
      this.closeEditor(sender);
      if (this.currencyFormGroup.valid || this.isUpdateMode) {
        if (!this.isUpdateMode) {
          if (!this.currencySaved) {
  
  
            this.currencyService.save(this.currencyFormGroup.value, !this.isUpdateMode).subscribe((data) => {
              this.currency = data;
            });
            this.currencySaved = true;
          }
          this.currencyRateFormGroup = new FormGroup({
            StartDate: new FormControl('', Validators.required),
            EndDate: new FormControl('', Validators.required),
            Coefficient: new FormControl('', Validators.required),
            Rate: new FormControl('', Validators.required),
            IsDeleted: new FormControl(false)
          });
        }
        else if (this.isUpdateMode) {
          if (this.currencyFormGroup.touched) {
  
            this.currencyService.save(this.currencyFormGroup.value).subscribe();
          }
          this.currencySaved = true;
          this.currency = this.currencyToEdit;
          this.currencyRateFormGroup = new FormGroup({
            StartDate: new FormControl('', Validators.required),
            EndDate: new FormControl('', Validators.required),
            Coefficient: new FormControl('', Validators.required),
            Rate: new FormControl('', Validators.required),
            IsDeleted: new FormControl(false)
  
          });
        }
  
        this.addDependentDateControls();
        sender.addRow(this.currencyRateFormGroup);
        this.btnEditVisible = false;
      } else {
        this.validationService.validateAllFormFields(this.currencyFormGroup as FormGroup);
      }
    }
  
        /**
     * Quick edit
     * @param param0
     */
    public editHandler({ sender, rowIndex, dataItem }) {
      this.closeEditor(sender);
      if (dataItem.StartDate) {
        dataItem.StartDate = new Date(dataItem.StartDate);
        this.minEndDate = dataItem.StartDate;
      } else {
        this.minEndDate = undefined;
      }
      if (dataItem.EndDate) {
        dataItem.EndDate = new Date(dataItem.EndDate);
        this.maxStartDate = dataItem.EndDate;
      } else {
        this.maxStartDate = undefined;
      }
      this.currencyRateFormGroup = new FormGroup({
        Id: new FormControl(dataItem.Id),
        StartDate: new FormControl(dataItem.StartDate, Validators.required),
        EndDate: new FormControl(dataItem.EndDate, Validators.required),
        Coefficient: new FormControl(dataItem.Coefficient, [Validators.required, Validators.min(0)]),
        Rate: new FormControl(dataItem.Rate, [Validators.required, Validators.min(0)]),
        IsDeleted: new FormControl(dataItem.IsDeleted),
        IdCurrency: new FormControl(dataItem.IdCurrency),
      });
      this.addDependentDateControls();
      this.editedRowIndex = rowIndex;
  
      sender.editRow(rowIndex, this.currencyRateFormGroup);
      this.btnEditVisible = false;
    }
  
    
    /**
     * Cancel
     * @param param0
     */
    public cancelHandler({ sender, rowIndex }) {
      this.closeEditor(sender, rowIndex);
      this.btnEditVisible = true;
    }
    /**
     * Save handler
     * @param param0
     */
    public saveHandler({ sender, rowIndex, formGroup, isNew }) {
      (formGroup as FormGroup).updateValueAndValidity();
      if ((formGroup as FormGroup).valid) {
  
        const item: CurrencyRate = formGroup.value;
  
        if (!isNew) {
          this.currencyRateService.updateCurrencyRate(item).subscribe(() => {
            this.gridSettings.gridData.data[rowIndex] = item;
            sender.closeRow(rowIndex);
            this.maxStartDate = undefined;
            this.minEndDate = undefined;
          });
  
        } else if (isNew) {
  
          item.IdCurrency = this.IdCurrency;
          this.currencyRateService.insertCurrencyRate(item).subscribe((data) => {
            if (data !== undefined) {
              item.Id = data.Id;
              this.gridSettings.gridData.data.push(item);
              this.gridSettings.gridData.total = this.gridSettings.gridData.data.length;
              sender.closeRow(rowIndex);
              this.btnEditVisible = true;
              this.maxStartDate = undefined;
              this.minEndDate = undefined;
            }
          });
  
        }
      } else {
        this.validationService.validateAllFormFields(formGroup as FormGroup);
      }
    }
  
    /**
    * Remove handler
    * @param param0
    */
    public removeHandler({ dataItem, rowIndex }) {
      this.swalWarrings.CreateSwal().then((result) => {
        if (result.value) {
          this.currencyRateService.remove(dataItem).subscribe(x => {
            this.gridSettings.gridData.data.splice(rowIndex, 1);
            this.gridSettings.gridData.total = this.gridSettings.gridData.data.length;
          });
          
        }
      });
    }
  
    public loadItems(currencyRateList, state?): void {
      if (state) {
        this.gridSettings.state = state;
      }
      this.gridSettings.gridData = {
        data: currencyRateList.slice(this.gridSettings.state.skip, this.gridSettings.state.skip + this.gridSettings.state.take),
        total: currencyRateList.length
      };
    }
      
  
     /**
   * add start date & end date
   * */
  private addDependentDateControls(): void {
      this.setStartDateControl();
      this.setEndDateControl();
      this.StartDate.valueChanges.subscribe(() => {
        if (this.EndDate.hasError(CurrencyConstant.DATE_VALUE_GT)) {
          this.EndDate.setErrors(null);
        }
      });
      this.EndDate.valueChanges.subscribe(() => {
        if (this.StartDate.hasError(CurrencyConstant.DATE_VALUE_LT)) {
          this.StartDate.setErrors(null);
        }
      });
    }
    /**
    * set end date control
    * */
    private setEndDateControl(): void {
      const oStartDate = new Observable<Date>(observer => observer.next(this.StartDate.value));
      this.currencyRateFormGroup.setControl(CurrencyConstant.END_DATE, this.formBuilder.control(this.EndDate.value,
        [dateValueGT(oStartDate)]));
  
    }
    /**
     * set start date control
     * */
    private setStartDateControl(): void {
      const oEndDate = new Observable<Date>(observer => observer.next(this.EndDate.value));
      this.currencyRateFormGroup.setControl(CurrencyConstant.START_DATE, this.formBuilder.control(this.StartDate.value,
        [Validators.required, dateValueLT(oEndDate)]));
  
    }
    /** form gettes */
    get EndDate() {
      return this.currencyRateFormGroup.get(CurrencyConstant.END_DATE) as FormControl;
    }
    get StartDate(): FormControl {
      return this.currencyRateFormGroup.get(CurrencyConstant.START_DATE) as FormControl;
    }
  
  
    /**
    * Change max value of Start date
    * */
    changeEndDate() {
      if (this.currencyRateFormGroup.get(CurrencyConstant.END_DATE).value !== this.oldEndDateValue) {
        this.oldEndDateValue = this.currencyRateFormGroup.get(CurrencyConstant.END_DATE).value;
        this.maxStartDate = this.currencyRateFormGroup.get(CurrencyConstant.END_DATE).value;
        this.cdRef.detectChanges();
      }
    }
  
  
    /**
      * Change min value of End date
      * */
    changeStartDate() {
      if (this.currencyRateFormGroup.get(CurrencyConstant.START_DATE).value !== this.oldStartDateValue) {
        this.oldStartDateValue = this.currencyRateFormGroup.get(CurrencyConstant.START_DATE).value;
        this.minEndDate = this.currencyRateFormGroup.get(CurrencyConstant.START_DATE).value;
        this.cdRef.detectChanges();
      }
    }
    showDocument(document) {
      let url: string
      if (document.DocumentStatus != documentStatusCode.Provisional && document.DocumentStatus != documentStatusCode.DRAFT) {
        url = '/'.concat(DocumentConstant.SHOW).concat('/').concat(document.IdDocument).concat('/').concat(document.DocumentStatus);
      } else {
        url = '/'.concat('edit').concat('/').concat(document.IdDocument).concat('/').concat(document.DocumentStatus);
      }
      if(document.DocumentType == DocumentEnumerator.PurchaseDelivery){
      window.open(DocumentConstant.PURCHASE_DELIVERY_URL.concat(url));
      }else if(document.DocumentType == DocumentEnumerator.PurchaseInvoices){
        window.open(DocumentConstant.PURCHASE_INVOICE_URL.concat(url));
      }
    }
    private preparePredicate() {

      const predicate = new PredicateFormat();
      predicate.Filter = new Array<Filter>();
      predicate.Filter.push(new Filter("IdCurrencyNavigation.Id", Operation.eq, this.predicate.Filter.find(x =>x.prop ==SharedConstant.ID ).value));
      if(this.predicate.Filter.find(x =>x.prop ==CurrencyConstant.END_DATE_CURRENCY_RATE) != null){
        predicate.Filter.push(new Filter("EndDate", Operation.eq, this.predicate.Filter.find(x =>x.prop ==CurrencyConstant.END_DATE_CURRENCY_RATE).value));
      }
      if(this.predicate.Filter.find(x =>x.prop ==CurrencyConstant.START_DATE_CURRENCY_RATE) != null){
        predicate.Filter.push(new Filter("StartDate", Operation.eq, this.predicate.Filter.find(x =>x.prop ==CurrencyConstant.START_DATE_CURRENCY_RATE).value));
      }
      predicate.Relation = new Array<Relation>();
      predicate.Relation.push(new Relation('Document'))
      this.predicate = predicate;
    }
    ngOnChanges(simpleChanges: SimpleChanges): void {
      if (simpleChanges.predicate !== undefined && this.predicate != undefined ) {
        this.preparePredicate()
      }
    }
  }

