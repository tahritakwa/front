import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { SessionConstant } from '../../../constant/payroll/session.constant';
import { TransferOrderConstant } from '../../../constant/payroll/transfer-order.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PayrollSessionState } from '../../../models/enumerators/session-state.enum';
import { TransferOrderStatus } from '../../../models/enumerators/transfero-order-status.enum';
import { Session } from '../../../models/payroll/session.model';
import { TransferOrderSession } from '../../../models/payroll/transfer-order-session.model';
import { TransferOrder } from '../../../models/payroll/transfer-order.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SessionService } from '../../services/session/session.service';
import { TransferOrderService } from '../../services/transfer-order/transfer-order.service';

@Component({
  selector: 'app-add-transfer-order',
  templateUrl: './add-transfer-order.component.html',
  styleUrls: ['./add-transfer-order.component.scss']
})
export class AddTransferOrderComponent implements OnInit, OnDestroy {
  /**
   * Transfer order form group
   */
  public transferOrderFormGroup: FormGroup;
  /**
   * array of the employees selected in the grid
   */
  public AllSessionsIds: number[] = [];
  /**
   * All employee list
   */
  public AllSessionsList: Session[] = [];
  /**
   *  Employee id selected
   */
  public sessionIdsSelected: number[] = [];
  /**
   * state of selection
   */
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  /**
   * Current transferorder
   */
  transferOrder: TransferOrder;
  transferOrderPerMonth = new TransferOrder();
  /**
   * If view is Modal mode or Not
   */
  public isModal = false;
  /**
   * Show tranfer unique message or not
   */
  public showTransferUniqueErrorMessage = false;
  /**
   * Show grid error message if any element is selecte in grid
   */
  public showErrorMessage = false;
  /**
   * If the form is in update mode or not
   */
  public isUpdateMode = false;
  /**
   * Pipe for date
   */
  datePipe = new DatePipe('en-US');
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public payrollSessionState = PayrollSessionState;
  public transferOrderStatus = TransferOrderStatus;
  /**
   * Grid state
   */
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  /**
   * Grid columns Config
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: SharedConstant.CODE,
      title: SharedConstant.CODE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: SessionConstant.TITLE,
      title: SessionConstant.TITLE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: SessionConstant.MONTH,
      title: SessionConstant.MONTH_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: SharedConstant.STATE,
      title: SharedConstant.STATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  /**
   * Grid Setting (Grid state + Grid columns config)
   */
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  State: number;
  /**
   * permissions
   */
  public hasUpdatePermission: boolean;
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;
  /**
   * Id transfer order, get by the router path
   */
  private idTransferOrder: number;
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   * @param fb
   * @param transferOrderService
   * @param formModalDialogService
   * @param activatedRoute
   * @param dataTransferShowSpinnerService
   * @param viewRef
   * @param validationService
   */
  constructor(private fb: FormBuilder, private transferOrderService: TransferOrderService,
              private activatedRoute: ActivatedRoute,
              private translate: TranslateService, private growlService: GrowlService,
              private dataTransferShowSpinnerService: DataTransferShowSpinnerService,
              private validationService: ValidationService, private router: Router,
              private sessionService: SessionService, private authService: AuthService) {
  }

  /**
   * Label getter
   */
  get Title(): FormControl {
    return this.transferOrderFormGroup.get(TransferOrderConstant.TITLE) as FormControl;
  }

  /**
   * MOnth getter
   */
  get Month(): FormControl {
    return this.transferOrderFormGroup.get(TransferOrderConstant.MONTH) as FormControl;
  }

  /**
   * Code getter
   */
  get Code(): FormControl {
    return this.transferOrderFormGroup.get(TransferOrderConstant.TRANSFERORDER_CODE) as FormControl;
  }

  /**
   * Bank account Id getter
   */
  get IdBankAccount(): FormControl {
    return this.transferOrderFormGroup.get(TransferOrderConstant.IDBANCKACCOUNT) as FormControl;
  }

  /**
   * Init view
   */
  ngOnInit() {
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_TRANSFERORDER);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TRANSFERORDER);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_TRANSFER_ORDER);
    this.transferOrder = new TransferOrder();
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idTransferOrder = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    }));
    // Update mode
    this.isUpdateMode = this.idTransferOrder > NumberConstant.ZERO ;
    // Create transfer order section form
    this.createTransferOrderForm();
    if (this.idTransferOrder) {
      
      this.subscriptions.push(this.transferOrderService.getById(this.idTransferOrder).subscribe(data => {
        this.transferOrder = data;
        // Create transfer order form with associate transfer order
        this.transferOrder.Month = new Date(this.transferOrder.Month);
        // Patch transfer order value
        this.transferOrderFormGroup.patchValue(this.transferOrder);
        // Prepare date
        this.prepareDate();
        // Disable tranferOrder FormGroup
        if (this.transferOrder) {
          this.State = this.transferOrder.State;
          if (this.transferOrder.State == this.transferOrderStatus.Closed) {
            this.transferOrderFormGroup.disable();
          }
        }
        this.loadAllEmployeesFromServer();
      }));
    } else {
      // Load all employee not associate with one transfer order
      this.loadAllEmployeesFromServer();
    }
  }

  /**
   * this method is called every time the status of one checkbox of the grid rows is changed
   */
  public onSelectedKeysChange(event: any) {
    this.gridSettings.gridData.data.forEach(element => {
      this.sessionIdsSelected.forEach(item => {
        if (element.Id === item) {
          if (element.State !== PayrollSessionState.Closed) {
            this.sessionIdsSelected.splice(this.sessionIdsSelected.indexOf(item), NumberConstant.ONE);
            this.growlService.warningNotification(this.translate.instant(SessionConstant.SESSION_NOT_CLOSED));
          }
        }
      });
    });
    // Get number of employee selected
    const selectionLength = this.sessionIdsSelected.length;
    selectionLength === NumberConstant.ZERO ? this.showErrorMessage = true : this.showErrorMessage = false;
    if (selectionLength === NumberConstant.ZERO) {
      // If this number is equal to zero, uncheck the header checkbox
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (selectionLength > NumberConstant.ZERO && selectionLength < this.AllSessionsIds.length) {
      // Else if this number is higher then zero and lower tha AllEmployee list length make the header checkbox indeterminate
      this.showErrorMessage = false;
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      // Else check the header checkbox
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
      this.showErrorMessage = false;
    }
  }

  /**
   * this method is called once the checkbox in the header of the is clicked
   */
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    // If the header checkbox state is checked
    if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
      // Set List of employee id selected with all employee id
      this.sessionIdsSelected = Object.assign([], this.AllSessionsIds);
      // Check the header checkbox
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      // Empty list of employee id selected
      this.sessionIdsSelected = [];
      // UnCheck the header checkbox
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    }
  }

  /**
   * this method aims to recover all employees of the employees selected in the previous step of the wizard
   */
  public loadAllEmployeesFromServer() {
    this.AllSessionsIds = [];
    this.subscriptions.push(this.sessionService.sessionsWithEmployeesWithTransferPaymentType(this.Month.value).subscribe(data => {
      this.AllSessionsIds = data.map(x => x.Id);
      // Set grid with data
      this.gridSettings.gridData = data;
      // All employees take data
      this.AllSessionsList = data;
      const transferMonth = new Date(this.transferOrder.Month);
      transferMonth.setHours(NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO);
      const selectMonth = new Date(this.Month.value);
      selectMonth.setHours(NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO);
      if (transferMonth.getTime() === selectMonth.getTime()) {
        this.sessionIdsSelected = this.transferOrder.TransferOrderSession.map(x => x.IdSession);
      }
      this.dataStateChange(this.gridSettings.state);
      this.checkSelectedState();
    }));
  }

  /**
   * Check header selection state
   */
  checkSelectedState() {
    // check if sate= checked if update mode
    if (this.AllSessionsIds.length > NumberConstant.ZERO && this.sessionIdsSelected.length === this.AllSessionsIds.length) {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      if (this.sessionIdsSelected.length > NumberConstant.ZERO) {
        this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
      } else {
        this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
      }
    }
  }

  /**
   * transform array to observables
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    const listEmployees = Object.assign([], this.AllSessionsList);
    this.gridSettings.gridData = process(listEmployees, state);
  }

  /**
   * When user click reinitialise date of transfer order
   */
  public onClickInitialiseDate() {
    if (this.Month != null) {
      this.sessionIdsSelected = [];
      this.prepareDate();
      this.loadAllEmployeesFromServer();
    }
  }

  /**
   * This method calculate startDate and endDate base on the month value
   */
  prepareDate() {
    let date: Date;
    if (this.Month.value) {
      date = new Date(this.Month.value);
    } else {
      date = new Date();
      this.Month.setValue(date);
    }
  }

  /**
   * Validate transfer order number unicity
   */
  public validateTransferOrderNumber() {
    this.dataTransferShowSpinnerService.setShowSpinnerValue(true);
    this.transferOrderPerMonth.Month = this.transferOrderFormGroup.value.Month;
    this.transferOrderPerMonth.Code = this.transferOrderFormGroup.value.Code;
    this.transferOrderPerMonth.Id = this.transferOrder.Id;
    this.transferOrderService.GetUnicityPerMonth(this.transferOrderPerMonth).toPromise().then(res => {
      this.showTransferUniqueErrorMessage = res ? true : false;
    });
  }

  save(): void {
    if (this.State == this.transferOrderStatus.Closed) {
      this.router.navigateByUrl(TransferOrderConstant.TRANSFER_ORDER_GENERATION.concat(this.transferOrder.Id.toString()),
        {skipLocationChange: true});
    } else {
      if (this.transferOrderFormGroup.valid && this.AllSessionsList.length > NumberConstant.ZERO
        && this.showErrorMessage === false && this.sessionIdsSelected.length > NumberConstant.ZERO) {
        const data = Object.assign({}, this.transferOrder, this.transferOrderFormGroup.value);
        data.TransferOrderSession = new Array<TransferOrderSession>();
        this.AllSessionsList.forEach(element => {
          if (this.sessionIdsSelected.find(x => x == element.Id)) {
            if (this.transferOrder.TransferOrderSession && this.transferOrder.TransferOrderSession.find(x => x.IdSession == element.Id)) {
              data.TransferOrderSession.push(this.transferOrder.TransferOrderSession.filter(x => x.IdSession === element.Id)[NumberConstant.ZERO]);
            } else {
              data.TransferOrderSession.push({Id: NumberConstant.ZERO, IdSession: element.Id, IdTransferOrder: this.idTransferOrder});
            }
          } else {
            if (this.transferOrder.TransferOrderSession && this.transferOrder.TransferOrderSession.find(x => x.IdSession == element.Id)) {
              const deletedSession = this.transferOrder.TransferOrderSession.filter(x => x.IdSession === element.Id)[NumberConstant.ZERO];
              deletedSession.IsDeleted = true;
              data.TransferOrderSession.push(deletedSession);
            }
          }
        });
        this.subscriptions.push(this.transferOrderService.save(data, !this.isUpdateMode).subscribe(result => {
          if(this.hasShowPermission){
            this.router.navigateByUrl(TransferOrderConstant.TRANSFER_ORDER_GENERATION.concat(result.Id.toString()),
            {skipLocationChange: true});
          }
          else {
            this.router.navigateByUrl(TransferOrderConstant.TRANSFER_ORDER_LIST_URL);
          }
        }));
      } else {
        this.validationService.validateAllFormFields(this.transferOrderFormGroup);
        if (this.AllSessionsList.length > NumberConstant.ZERO && this.sessionIdsSelected.length > NumberConstant.ZERO) {
          this.showErrorMessage = false;
        } else {
          this.showErrorMessage = true;
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * Create the transfer order form
   * @param transferOrder
   */
  private createTransferOrderForm(): void {
    this.transferOrderFormGroup = this.fb.group({
      Id: [NumberConstant.ZERO],
      Code: [''],
      Title: [{value: '', disabled: this.isUpdateMode && !this.hasUpdatePermission}, Validators.required],
      Month: [{value: '', disabled: this.isUpdateMode && !this.hasUpdatePermission}, Validators.required],
      IdBankAccount: [{value: '', disabled: this.isUpdateMode && !this.hasUpdatePermission}, Validators.required],
      State: [this.transferOrderStatus.InProgress]
    });
    // Prepare date
    this.prepareDate();
  }
}
