import {AfterViewInit, ChangeDetectorRef, Component, ComponentRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import {
  dateValueGT,
  dateValueLT,
  isEqualLength,
  strictSup,
  ValidationService
} from '../../../shared/services/validation/validation.service';
import {Currency} from '../../../models/administration/currency.model';
import {CurrencyService} from '../../services/currency/currency.service';
import {CurrencyConstant} from '../../../constant/Administration/currency.constant';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {DataStateChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {Filter, Operation, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {CurrencyRate} from '../../../models/administration/currency-rate.model';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {CurrencyRateService} from '../../services/currency-rate/currency-rate.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ExchangeRateGridComponent} from '../exchange-rate-grid/exchange-rate-grid.component';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';
import { StyleConstant } from '../../../constant/utility/style.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const ACTIVE_LIST_URL = '/main/settings/administration/currency';

@Component({
  selector: 'app-add-currency',
  templateUrl: './add-currency.component.html',
  styleUrls: ['./add-currency.component.scss']
})
export class AddCurrencyComponent implements OnInit, OnDestroy, AfterViewInit {
  /*
   * Form Group
   */
  currencyFormGroup: FormGroup;
  private oldStartDateValue: Date;
  private oldEndDateValue: Date;
  public minEndDate: Date;
  public maxStartDate: Date;
  public currencySaved = false;
  public currency: Currency;
  public itemId: number;
  public currencyRateList;
  public selectedYear;
  public rowIndex;
  public startDate;
  public endDate;
  public listForGrid1;
  public listForGrid2;
  /**
   * Details Border
   */
  public isDetailsContentVisible = true;
  public fieldsetBorderShowed = StyleConstant.BORDER_SOLID;
  public fieldsetBorderHidden = StyleConstant.BORDER_NONE;
  public fieldsetBorderStyle: string;

  /*
   * Id Entity
   */
  public  id: number;
  currencyToEdit: Currency;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  private currencySubscription: Subscription;
  public hasUpdateCurrencyPermission: boolean;
  public hasAddCurrencyPermission: Boolean;

  /*
   * currency to update
   */
  private currencyToUpdate: Currency;
  public isModal = false;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public exchangeRate;
  /*
  * form controle
  */
  @Input() control: FormControl;
  @ViewChild('exchangeRateGrid1') public exchangeRateGrid1 : ExchangeRateGridComponent;
  @ViewChild('exchangeRateGrid2') public exchangeRateGrid2 : ExchangeRateGridComponent;

  public isThereOpenedRow: boolean;
  /*
   * id Subscription
   */
  private idSubscription: Subscription;
  // Format Date
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);

  /**
   * Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: SharedConstant.DEFAULT_ITEMS_NUMBER,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: SharedConstant.START_DATE,
      title: SharedConstant.START_DATE_UPPERCASE,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: SharedConstant.END_DATE,
      title: SharedConstant.END_DATE_UPPERCASE,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: CurrencyConstant.COEFFICIENT,
      title: CurrencyConstant.COEFFICIENT_UPPERCASE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: CurrencyConstant.RATE,
      title: CurrencyConstant.RATE_UPPERCASE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  private editedRowIndex: number;
  // Grid quick add
  public currencyRateFormGroup: FormGroup;
  public currencyRate: Array<CurrencyRate>;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  /**
   * button Advanced Edit visibility
   */
  public btnEditVisible: boolean;

  /**
   * Contructor
   * @param currencyService
   * @param currencyRateService
   * @param formBuilder
   * @param activatedRoute
   * @param router
   * @param validationService
   * @param modalService
   * @param growlService
   * @param translate
   * @param cdRef
   * @param swalWarrings
   */
  constructor(public currencyService: CurrencyService, private currencyRateService: CurrencyRateService, private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute, private router: Router, private validationService: ValidationService,
              private modalService: ModalDialogInstanceService,
              private authService: AuthService,
              private growlService: GrowlService, private translate: TranslateService,
              private cdRef: ChangeDetectorRef, private swalWarrings: SwalWarring,private styleConfigService: StyleConfigService) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    });
    this.currencyService.getById(this.id).subscribe(data => {
      this.currencyToEdit = data;
    });
    this.btnEditVisible = true;
    this.selectedYear = new Date();
    this.fieldsetBorderStyle = this.fieldsetBorderShowed;
  }
  ngAfterViewInit(): void {
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }
public onChangeEndDate(value: Date){
  if(value){
  this.endDate = value;
  }else{
    this.endDate = undefined;
  }
  this.getDataToUpdate();
}
public onChangeStartDate(value: Date){
  if(value){
  this.startDate = value;
  }else{
    this.startDate = undefined;
  }
  this.getDataToUpdate();
}

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
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
    this.isThereOpenedRow = false;
  }

  /**
   * Quick add
   * @param param0
   */
  public addHandler({sender}) {
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
        this.rowIndex = -1;
      } else if (this.isUpdateMode) {
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
        this.rowIndex = -1;
      }

      this.addDependentDateControls();
      sender.addRow(this.currencyRateFormGroup);
      this.isThereOpenedRow = true;
      this.btnEditVisible = false;
    } else {
      this.validationService.validateAllFormFields(this.currencyFormGroup as FormGroup);
    }
  }

  /**
   * Quick edit
   * @param param0
   */
  public editHandler({sender, rowIndex, dataItem}) {
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
    this.isThereOpenedRow = true;
    sender.editRow(rowIndex, this.currencyRateFormGroup);
    this.btnEditVisible = false;
  }

  /**
   * Cancel
   * @param param0
   */
  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
  }

  /**
   * Save handler
   * @param param0
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    (formGroup as FormGroup).updateValueAndValidity();
    if ((formGroup as FormGroup).valid) {

      const item: CurrencyRate = formGroup.value;

      if (!isNew) {
        this.currencyRateService.updateCurrencyRate(item).subscribe(() => {
          this.gridSettings.gridData.data[rowIndex] = item;
          sender.closeRow(rowIndex);
        });

      } else if (isNew) {

        item.IdCurrency = this.currency.Id;
        this.currencyRateService.insertCurrencyRate(item).subscribe((data) => {
          if (data !== undefined) {
            item.Id = data.Id;
            this.gridSettings.gridData.data.push(item);
            this.gridSettings.gridData.total = this.gridSettings.gridData.data.length;
            sender.closeRow(rowIndex);
            this.btnEditVisible = true;
          }
        });
        this.isThereOpenedRow = false;
      }
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler({dataItem, rowIndex}) {
    this.swalWarrings.CreateSwal(CurrencyConstant.EXCHANGE_RATE_DELETE_TEXT_MESSAGE, CurrencyConstant.EXCHANGE_RATE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.currencyRateService.remove(dataItem).subscribe(x => {
          this.gridSettings.gridData.data.splice(rowIndex, 1);
        });
        this.gridSettings.gridData.total = this.gridSettings.gridData.data.length;
      }
    });
  }

  /**
   * on init
   * */
  ngOnInit() {
    this.hasUpdateCurrencyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_CURRENCY);
    this.hasAddCurrencyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_CURRENCY);
    this.isUpdateMode = this.id > 0 && !this.isModal;
    this.createAddForm();
    this.currencyRate = [];
    this.gridSettings.gridData = {data: [], total: 0};
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  /**
   * create add form
   * */
  private createAddForm(): void {
    this.currencyFormGroup = this.formBuilder.group({
      Id: [NumberConstant.ZERO],
      Code: new FormControl({value: '', disabled: this.isUpdateMode}, [Validators.required, isEqualLength(NumberConstant.THREE)]),
      Description: new FormControl({value: '', disabled: this.isUpdateMode}),
      Symbole: new FormControl({value: '', disabled: this.isUpdateMode}, Validators.required),
      CurrencyInLetter: new FormControl({value: '', disabled: this.isUpdateMode}, Validators.required),
      FloatInLetter: new FormControl({value: '', disabled: this.isUpdateMode}, [Validators.required, Validators.pattern('^[A-Za-zñÑáâéèêçôîíóúÁÉÍÓÚ]+$')]),
      Precision: new FormControl({value: undefined, disabled: this.isUpdateMode}, [Validators.required, Validators.pattern('^[0-9]+$'), strictSup(NumberConstant.ZERO)]),
    });

  }

  private preparePredicate() {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(SharedConstant.ID, Operation.eq, this.id));
    if(this.endDate){
      predicate.Filter.push(new Filter(CurrencyConstant.END_DATE_CURRENCY_RATE, Operation.eq, this.endDate));
    }
    if(this.startDate){
      predicate.Filter.push(new Filter(CurrencyConstant.START_DATE_CURRENCY_RATE, Operation.eq, this.startDate));
    }
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(CurrencyConstant.CURRENCY_RATE)]);
    predicate.pageSize = this.exchangeRateGrid1.gridSettings.state.take;
    predicate.page = (this.exchangeRateGrid1.gridSettings.state.skip / this.exchangeRateGrid1.gridSettings.state.take);
    this.predicate = predicate;
    return predicate;
  }

  public valueChange(value: any): void {
    this.selectedYear = value;
    this.getDataToUpdate();
  }

  /**
   *  get data to update
   * */
  private getDataToUpdate(): void {
    this.currencyRateList = [];
    this.listForGrid1 = [] ;
    this.listForGrid2 = [] ;
    this.currencySubscription = this.currencyService.getModelByCondition(this.preparePredicate()).subscribe(data => {
      this.currencyToUpdate = data;
      this.currencyRateList = this.currencyToUpdate.CurrencyRate;
      if (this.currencyToUpdate) {
        this.currencyFormGroup.patchValue(this.currencyToUpdate);
        this.currencyFormGroup.disable();
      }
      this.listForGrid1 = data.CurrencyRate;
      this.listForGrid2=  data.CurrencyRateDocument;
      this.exchangeRateGrid1.loadItems(this.listForGrid1);
      this.exchangeRateGrid2.loadItems(this.listForGrid2);
    });
  }

  private loadItems(currencyRateList, state?): void {
    if (state) {
      this.gridSettings.state = state;
    }
    this.gridSettings.gridData = {
      data: currencyRateList.slice(this.gridSettings.state.skip, this.gridSettings.state.skip + this.gridSettings.state.take),
      total: currencyRateList.length
    };
  }

  /**
   * on destroy
   * */
  ngOnDestroy(): void {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.currencySubscription) {
      this.currencySubscription.unsubscribe();
    }
  }

  /**
   * on click save
   * */
  public onAddCurrencyClick(): void {

    if (this.currencyFormGroup.valid) {
      const unicityData = {
        'property': SharedConstant.CODE,
        'value': this.currencyFormGroup.controls['Code'].value,
        'valueBeforUpdate': this.id
      };
      if (!this.currencySaved && !this.isUpdateMode) {

        this.currencyService.save(this.currencyFormGroup.value, !this.isUpdateMode, undefined, undefined, unicityData).subscribe((data) => {
          this.backToPrevious();
        });
        this.currencySaved = true;

      } else if (!this.currencySaved && this.isUpdateMode) {
        if (this.currencyFormGroup.touched) {

          this.currencyService.save(this.currencyFormGroup.value, undefined, undefined, undefined, unicityData).subscribe(() => {
            this.backToPrevious();
          });
        }
      }
    } else {

      this.validationService.validateAllFormFields(this.currencyFormGroup);
    }
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

  backToPrevious() {
    if (!this.isModal) {
      this.router.navigate([ACTIVE_LIST_URL]);
    } else {
      this.dialogOptions.onClose();
      this.dialogOptions.closeDialogSubject.next();
    }
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupChanged.bind(this));
  }

  private isFormGroupChanged(): boolean {
    return this.currencyFormGroup.touched || this.isThereOpenedRow;
  }
  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
  public showDetailsContent() {
    this.isDetailsContentVisible = true;
    this.fieldsetBorderStyle = this.fieldsetBorderShowed;
  }

  public hideDetailsContent() {
    this.isDetailsContentVisible = false;
    this.fieldsetBorderStyle = this.fieldsetBorderHidden;
  }
}
