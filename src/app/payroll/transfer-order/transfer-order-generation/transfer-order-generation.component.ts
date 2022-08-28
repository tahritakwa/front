import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { CompanyService } from '../../../administration/services/company/company.service';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { TransferOrderConstant } from '../../../constant/payroll/transfer-order.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { TransferOrderStatus } from '../../../models/enumerators/transfero-order-status.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { TransferOrderDetails } from '../../../models/payroll/transfer-order-details.model';
import { TransferOrder } from '../../../models/payroll/transfer-order.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { FileService } from '../../../shared/services/file/file-service.service';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TransferOrderService } from '../../services/transfer-order/transfer-order.service';

@Component({
  selector: 'app-transfer-order-generation',
  templateUrl: './transfer-order-generation.component.html',
  styleUrls: ['./transfer-order-generation.component.scss']
})
export class TransferOrderGenerationComponent implements OnInit {

  /**
   * Transfer order form group
   */
  public transferOrderFormGroup: FormGroup;
  /**
   * array of the employees selected in the grid
   */
  public AllEmployeesIds: number[] = [];
  /**
   * All employee list
   */
  public AllEmployeesList: Employee[] = [];
  /**
   *  Employee id selected
   */
  public employeesIdsSelected: number[] = [];
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
   * Pipe for date
   */
  datePipe = new DatePipe('en-US');
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
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
      field: EmployeeConstant.REGISTRATION_NUMBER,
      title: EmployeeConstant.REGISTRATION_NUMBER_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: EmployeeConstant.FIRST_NAME,
      title: EmployeeConstant.FIRST_NAME_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: EmployeeConstant.LAST_NAME,
      title: EmployeeConstant.LAST_NAME_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
  ];
  /**
   * Grid Setting (Grid state + Grid columns config)
   */
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  /**
   * Id transfer order, get by the router path
   */
  private idTransferOrder: number;
  private subscriptions: Subscription[] = [];

  /**
   * permissions
   */
  public hasUpdatePermission: boolean;
  public hasGeneratePermission: boolean;
  public hasRegeneratePermission: boolean;
  public hasCloseTransferOrderPermission: boolean;
  public hasPrintPermission: boolean;
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
              private translate: TranslateService, private fileServiceService: FileService,
              private dataTransferShowSpinnerService: DataTransferShowSpinnerService,
              private router: Router,
              private swalWarrings: SwalWarring, private authService: AuthService) {
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
    this.hasGeneratePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.GENERATE_TRANSFER_ORDER);
    this.hasRegeneratePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.REGENERATE_TRANSFER_ORDER);
    this.hasCloseTransferOrderPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CLOSE_TRANSFER_ORDER);
    this.hasPrintPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.PRINT_TRANSFERORDER);
    this.transferOrder = new TransferOrder();
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idTransferOrder = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    }));
    // Create transfer order section form
    this.createTransferOrderForm();
    if (this.idTransferOrder) {
      this.subscriptions.push(this.transferOrderService.getById(this.idTransferOrder).subscribe(data => {
        this.transferOrder = data;
        // Create transfer order form with associate transfer order
        this.transferOrder.Month = new Date(this.transferOrder.Month);
        // Patch transfer order value
        this.transferOrderFormGroup.patchValue(this.transferOrder);
        // Disable tranferOrder FormGroup
        if (this.transferOrder) {
          this.transferOrderFormGroup.disable();
        }
        // Load current transfer order in the form and add list of employee which are not associate with one transfer order
        this.loadEmployeesForEditFromServer();
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
    // Get number of employee selected
    const length = this.employeesIdsSelected.length;
    if (length === NumberConstant.ZERO) {
      // If this number is equal to zero, uncheck the header checkbox
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
      this.showErrorMessage = true;
    } else if (length > NumberConstant.ZERO && length < this.AllEmployeesIds.length) {
      // Else if this number is higher then zero and lower tha AllEmployee list length make the header checkbox indeterminate
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
      this.showErrorMessage = false;
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
      this.employeesIdsSelected = Object.assign([], this.AllEmployeesIds);
      // Check the header checkbox
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      // Empty list of employee id selected
      this.employeesIdsSelected = [];
      // UnCheck the header checkbox
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    }
  }

  /**
   * this method aims to recover all employees of the employees selected in the previous step of the wizard
   */
  public loadAllEmployeesFromServer() {
    this.AllEmployeesIds = [];
    // Get all employee not associate with one transfer order
    this.subscriptions.push(this.transferOrderService.getEmplpoyeesWithoutTransferOrder(this.idTransferOrder).subscribe(data => {
      data.forEach((employee: { Id: number; }) => {
        // Set AllEmployeesIds with all employee id return by the service
        this.AllEmployeesIds.push(employee.Id);
      });
      // Set grid with data
      this.gridSettings.gridData = data;
      // All employees take data
      this.AllEmployeesList = data;
      this.dataStateChange(this.gridSettings.state);
      this.checkSelectedState();
    }));
  }

  /**
   * Check header selection state
   */
  checkSelectedState() {
    // check if sate= checked if update mode
    if (this.AllEmployeesIds.length > NumberConstant.ZERO && this.employeesIdsSelected.length === this.AllEmployeesIds.length) {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      if (this.employeesIdsSelected.length > NumberConstant.ZERO) {
        this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
      } else {
        this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
      }
    }
  }

  /**
   * Load current transfer order details employee and add the employee which are not associate with any transfer order of this session
   */
  public loadEmployeesForEditFromServer() {
    this.AllEmployeesIds = [];
    const employeesList: any = [];
    this.subscriptions.push(this.transferOrderService.getEmplpoyeesWithoutTransferOrder(this.idTransferOrder).subscribe(data => {
      data.forEach((details: TransferOrderDetails) => {
        employeesList.push(details.IdEmployeeNavigation);
        if (details.Id > NumberConstant.ZERO) {
          this.employeesIdsSelected.push(details.IdEmployee);
        }
        this.AllEmployeesIds.push(details.IdEmployee);
      });
      this.gridSettings.gridData = employeesList;
      this.AllEmployeesList = employeesList;
      this.dataStateChange(this.gridSettings.state);
      this.checkSelectedState();
    }));
  }

  /**
   * transform array to observables
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    const listEmployees = Object.assign([], this.AllEmployeesList);
    this.gridSettings.gridData = process(listEmployees, state);
    if (state.filter.filters.length !== NumberConstant.ZERO) {
      this.AllEmployeesIds = this.gridSettings.gridData.data.map(x => x.Id);
    }
  }

  /**
   * For print the current transfer order in modal
   * @param id
   */
  public onPrintClick(transferOrder: TransferOrder): void {
    const params = {
      idTransferOrder: transferOrder.Id
    };
    const documentName = this.translate.instant(TransferOrderConstant.TRANSFERORDER_UPPERCASE)
      .concat(SharedConstant.UNDERSCORE).concat(transferOrder.Title)
      .concat(SharedConstant.UNDERSCORE)
      .concat(this.translate.instant(this.datePipe.transform(new Date(transferOrder.Month), 'MMMM').toUpperCase()))
      .concat(SharedConstant.UNDERSCORE).concat(this.datePipe.transform(new Date(transferOrder.Month), 'yyyy'));
    const dataToSend = {
      'Id': transferOrder.Id,
      'reportName': TransferOrderConstant.TRANSFERORDER_REPORT_NAME,
      'documentName': documentName,
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'reportType': 'pdf',
      'reportparameters': params
    };
    this.subscriptions.push(this.transferOrderService.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      }));
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

  /**
   * Generation or regenration of the current transfer order
   */
  public generate() {
    // If transfer order is valid
    if (this.employeesIdsSelected.length > NumberConstant.ZERO && this.showTransferUniqueErrorMessage === false) {
      const transfer = Object.assign({}, this.transferOrder, this.transferOrderFormGroup.value);
      transfer.CreationDate = new Date();
      transfer.IdEmployeeSelected = this.employeesIdsSelected;
      transfer.TransferOrderDetails = [];
      this.subscriptions.push(this.transferOrderService.generate(transfer).subscribe(data => {
        this.subscriptions.push(this.transferOrderService.getById(this.idTransferOrder).subscribe(result => {
          this.transferOrder = result;
          this.AllEmployeesList = [];
          this.employeesIdsSelected = [];
          this.loadEmployeesForEditFromServer();
        }));
      }));
    } else {
      this.showErrorMessage = true;
    }
  }

  /**
   * close the transfer order
   */
  public closeTransferOrderClick(): void {
    this.swalWarrings.CreateSwal(TransferOrderConstant.CLOSE_TRANSFER_ORDER_MESSAGE, SharedConstant.WARNING_TITLE,
      SharedConstant.OKAY, SharedConstant.CANCEL).then((result) => {
      if (result.value) {
        this.subscriptions.push(this.transferOrderService.closeTransferOrder(this.transferOrder.Id).subscribe(() => {
          this.router.navigate([TransferOrderConstant.TRANSFER_ORDER_LIST_URL]);
        }));
      }
    });
  }

  public onPreviousClik(): void {
    this.router.navigateByUrl(TransferOrderConstant.TRANSFER_ORDER_EDIT.concat(this.idTransferOrder.toString()),
      {skipLocationChange: true});
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
      Title: ['', Validators.required],
      Month: ['', Validators.required],
      IdBankAccount: ['', Validators.required],
      State: []
    });
  }

}
