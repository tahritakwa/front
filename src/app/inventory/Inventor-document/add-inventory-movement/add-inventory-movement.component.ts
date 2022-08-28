import {Component, OnInit, ViewChild, OnDestroy, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {PredicateFormat, Relation, Filter, Operator, Operation} from '../../../shared/utils/predicate';
import {process} from '@progress/kendo-data-query';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {StockDocumentsService, linesToAdd} from '../../services/stock-documents/stock-documents.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {StockDocumentLine} from '../../../models/inventory/stock-document-line.model';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {StockDocument} from '../../../models/inventory/stock-document.model';
import {ObjectToSend, ObjectToValidate} from '../../../models/sales/object-to-save.model';
import {StockDocumentEnumerator} from '../../../models/enumerators/stock-document.enum';
import {documentStatusCode, DocumentEnumerator} from '../../../models/enumerators/document.enum';
import {Router, ActivatedRoute} from '@angular/router';
import {InformationTypeEnum} from '../../../shared/services/signalr/information/information.enum';
import {MessageService} from '../../../shared/services/signalr/message/message.service';
import {Subscription} from 'rxjs/Subscription';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {StockDocumentConstant} from '../../../constant/inventory/stock-document.constant';
import {isNullOrUndefined} from 'util';
import {InventoryDocument} from '../../../models/inventory/inventory-document.model';
import {InventoryDocumentLine} from '../../../models/inventory/inventory-document-line.model';
import {ReportingInModalComponent} from '../../../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {WarehouseItemService} from '../../services/warehouse-item/warehouse-item.service';
import {InventoryDetailsListComponent} from '../../components/inventory-details-list/inventory-details-list.component';
import {FileService} from '../../../shared/services/file/file-service.service';
import {RoleConfigConstant} from '../../../Structure/_roleConfigConstant';
import {StarkPermissionsService, StarkRolesService} from '../../../stark-permissions/stark-permissions.module';
import {UserDropdownComponent} from '../../../shared/components/user-dropdown/user-dropdown.component';
import {StyleConstant} from '../../../constant/utility/style.constant';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { User } from '../../../models/administration/user.model';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { WarehouseConstant } from '../../../constant/inventory/warehouse.constant';


const INVENTORY_URL_LIST = 'main/inventory/inventoryDocuments';

@Component({
  selector: 'app-add-inventory-movement',
  templateUrl: './add-inventory-movement.component.html',
  styleUrls: ['./add-inventory-movement.component.scss']
})

export class AddInventoryMovementComponent implements OnInit, OnDestroy {
  public UserId: string;
  public selectedIdWarehouse = NumberConstant.ZERO;
  public isDisabledShelfDropdown = true;
  @ViewChild('detailsList') detailsList: InventoryDetailsListComponent;
  @ViewChild("FirstuserComponent") public FirstuserComponent: UserDropdownComponent;
  @ViewChild("SeconduserComponent") public SeconduserComponent: UserDropdownComponent;
  warehouseAssociatedToItems: number;
  private objectToSave: ObjectToSend;
  private documentCode: StockDocumentEnumerator = new StockDocumentEnumerator();
  PlannifiedDate: Date;
  public predicate: PredicateFormat;
  public Searchpredicate: PredicateFormat;
  public isCollapsed;
  public distinctCategories;
  inventoryPlanningFilter = false;
  centralQuantityFilter = false;
  forSearch = true;

  public swalNotif: SwalWarring;

  public showTab = false;
  filterArray: Array<Filter>;
  operator: Operator;


  public isUserInListRole;
  public selectedRow;
  public selectedUser;

  /*
  * Id Entity
  */
  private id: number;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  public isValidated = false;
  public isGeneratedInventory: boolean;
  public isInEditingMode: boolean;
  public isPlannedInventory: boolean;
  public isAlreadyPlannedInventory: boolean;
  public isAdminUser: boolean;
  public systemDate: Date = new Date();
  /*
 * id Subscription
 */
  private idSubscription: Subscription;
  qteDispo: number;

  objectToValidate: ObjectToValidate;
  CodeItem: any;
  searchPerWarehouse = true;
  isSimpleType = true;
  searchPerSupplier = false;
  public shelfDataSource: any[];
  public shelfDataSourceFiltered: any[];
  currentDate = new Date();
  footerDisabled: boolean;
  public isForInventory = true;
  public UserData: User[];

  printReportType = [
    {printType: 'WITHOUT_QUANTITY', TemplateCode: this.translate.instant('WITHOUT_QTY')},
    {printType: 'WITH_QUANTITY', TemplateCode: this.translate.instant('WITH_QTY')},
  ];
  public validDocumentRole = false;

  jasperPrintReportType = [
    {printType: 'JASPER_WITHOUT_QTY', TemplateCode: this.translate.instant('JASPER_WITHOUT_QTY')},
    {printType: 'JASPER_WITH_QTY', TemplateCode: this.translate.instant('JASPER_WITH_QTY'),},
  ];
  jasperAllTypes = [
    {printType: 'JASPER_WITHOUT_QTY', TemplateCode: this.translate.instant('JASPER_WITHOUT_QTY')},
    {printType: 'JASPER_WITH_QTY', TemplateCode: this.translate.instant('JASPER_WITH_QTY')},
    {printType: 'JASPER_GAIN_LOSS', TemplateCode: this.translate.instant('PRINT_GAIN_LOSS')}
  ];
  isdoubleInput: boolean;
  public firstUserName: string;
  public secondUserName: string;

  public isDetailsContentVisible = true;
  public fieldsetBorderShowed = StyleConstant.BORDER_SOLID;
  public fieldsetBorderHidden = StyleConstant.BORDER_NONE;
  public fieldsetBorderStyle: string;
  /**
   * permissions
   */
   public hasValidatePermission: boolean;
   public hasUpdatePermission: boolean;
   public hasUnvalidatePermission: boolean;
   public hasPrintPermission: boolean;

  constructor(private formBuilder: FormBuilder, public stockDocumentsService: StockDocumentsService,
              public validationService: ValidationService, private router: Router, private messageService: MessageService,
              private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef,
              private activatedRoute: ActivatedRoute, private swalWarrings: SwalWarring,
              public translate: TranslateService, private modalService: ModalDialogInstanceService,
              private warehouseItemService: WarehouseItemService, public permissionsService: StarkPermissionsService,
              private rolesService: StarkRolesService, private fileServiceService: FileService, private authService: AuthService,
              private localStorageService : LocalStorageService) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || NumberConstant.ZERO;
    });

    this.isAdminUser = false;
    this.isUpdateMode = false;
    this.fieldsetBorderStyle = this.fieldsetBorderShowed;
  }


  ngOnInit() {
    this.hasValidatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_INVENTORY_MOVEMENT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_INVENTORY_MOVEMENT);
    this.hasUnvalidatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UNVALIDATE_INVENTORY_MOVEMENT);
    this.hasPrintPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_INVENTORY_MOVEMENT);
    this.forSearch = true;
    this.UserId = this.localStorageService.getUserId();
    this.stockDocumentsService.inventoryGridSettings.state.skip = 0;
    this.createAddForm();
    this.isUpdateMode = this.id > NumberConstant.ZERO;

    if (this.isUpdateMode) {

      this.isAlreadyPlannedInventory = true;
      this.stockDocumentsService.inventoryMovementForm.controls.IdWarehouseSource.disable();
      this.stockDocumentsService.inventoryMovementForm.controls.Shelf.disable();
      this.stockDocumentsService.inventoryMovementForm.controls.IdTiers.disable();
      this.stockDocumentsService.inventoryMovementForm.controls.DocumentDate.disable();
      this.stockDocumentsService.inventoryMovementForm.controls.IsDefaultValue.disable();
      this.stockDocumentsService.inventoryMovementForm.controls.IsOnlyAvailableQuantity.disable();
      this.getDataToUpdate();
    } else {
      this.stockDocumentsService.inventoryMovementForm.controls.IdWarehouseSource.setValidators(Validators.required);
      this.stockDocumentsService.inventoryMovementForm.controls.IdTiers.clearValidators();
      this.stockDocumentsService.inventoryMovementForm.controls.Shelf.disable();
    }
  }

  /**
   *  get data to update
   * */
  private getDataToUpdate(): void {
    this.preparePredicate();
    this.stockDocumentsService.GetStockDoucment(this.predicate)
      .subscribe(data => {
        // Handle the data
        if (!isNullOrUndefined(data)) {
          this.firstUserName = data.IdInputUser1Navigation.FullName;
          if (data.IdInputUser2) {
            this.secondUserName = data.IdInputUser2Navigation.FullName;
          }
          this.stockDocumentsService.stockDocument = data;
          this.stockDocumentsService.currentStockDate = `${this.translate.instant(StockDocumentConstant.ID_ITEM_NAVIGATION_ACTUALQUANTITY_TITLE)}`
            + this.stockDocumentsService.stockDocument.DocumentDate;
          const document = new InventoryDocument(this.stockDocumentsService.stockDocument.Id,
            this.stockDocumentsService.inventoryGridSettings.state.skip, this.stockDocumentsService.inventoryGridSettings.state.take);
          this.stockDocumentsService.GetStockDocumentLineList(document)
            .subscribe(result => {
              this.prepareList(result);
            });

          this.stockDocumentsService.stockDocument.DocumentDate = new Date(this.stockDocumentsService.stockDocument.DocumentDate);
          this.stockDocumentsService.inventoryMovementForm.patchValue(this.stockDocumentsService.stockDocument);
          this.initShelfAndStorageData();
          if (!isNullOrUndefined(this.stockDocumentsService.inventoryMovementForm.controls.IdTiers.value)) {
            this.searchPerWarehouse = false;
            this.searchPerSupplier = true;
          }
          this.isValidated = this.stockDocumentsService.stockDocument.IdDocumentStatus === documentStatusCode.Valid;
          this.setValueIsdoubleInput();
        }
      });

  }


  callAddInventoryService() {
    if (!this.isUpdateMode) {
      this.generateNewInventoryDocument();
    }
  }

  private generateNewInventoryDocument(): void {
    const api = StockDocumentConstant.INSERT_STOCK_DOCUMENT;
    this.stockDocumentsService.stockDocument = new StockDocument(null, this.documentCode.Inventory,
      this.stockDocumentsService.inventoryMovementForm.controls[StockDocumentConstant.DATE_FIELD].value,
      this.inventoryPlanningFilter,
      this.stockDocumentsService.inventoryMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_SOURCE].value,
      null, documentStatusCode[StockDocumentConstant.PROVISIONAL], null, null,
      this.stockDocumentsService.inventoryMovementForm.controls.Shelf.value,
      this.stockDocumentsService.inventoryMovementForm.controls.IdTiers.value, null,
      this.stockDocumentsService.inventoryMovementForm.controls.IdInputUser1.value,
      this.stockDocumentsService.inventoryMovementForm.controls.IdInputUser2.value,
      this.stockDocumentsService.inventoryMovementForm.controls.IsDefaultValue.value,
      this.stockDocumentsService.inventoryMovementForm.controls.IsOnlyAvailableQuantity.value,
      this.selectedUser != undefined? true : false);

    this.objectToSave = new ObjectToSend(this.stockDocumentsService.stockDocument);

    this.stockDocumentsService.GenerateNewStockDocument(api, this.objectToSave.Model)
      .subscribe((data: StockDocument) => {
        //Handle the data
        if (!isNullOrUndefined(data)) {
          this.firstUserName = data.IdInputUser1Navigation.FullName;
          if(data.IdInputUser2){
           this.secondUserName = data.IdInputUser2Navigation.FullName;
         }
          this.stockDocumentsService.stockDocument = data;
          this.stockDocumentsService.inventoryMovementForm.controls[StockDocumentConstant.CODE_FIELD].setValue(this.stockDocumentsService.stockDocument.Code);
          this.stockDocumentsService.inventoryGridSettings.state.skip = 0;
          this.stockDocumentsService.inventoryMovementForm.controls.IdWarehouseSource.disable();
          this.stockDocumentsService.inventoryMovementForm.controls.Shelf.disable();
          this.stockDocumentsService.inventoryMovementForm.controls.IdTiers.disable();
          this.stockDocumentsService.inventoryMovementForm.controls.IsDefaultValue.disable();
          this.stockDocumentsService.inventoryMovementForm.controls.IsOnlyAvailableQuantity.disable();
          const document = new InventoryDocument(this.stockDocumentsService.stockDocument.Id, this.stockDocumentsService.inventoryGridSettings.state.skip,
            this.stockDocumentsService.inventoryGridSettings.state.take);
          this.stockDocumentsService.GetStockDocumentLineList(document).subscribe(result => {
            this.prepareList(result);
          });
        } else {
          this.swalWarrings.CreateSwal(StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_EXISTING_INVENTORY_MOVEMENT,
            'WARNING', 'OK', '', true, true);
        }
      });
  }

  private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (this.isUpdateMode) {
      this.predicate.Filter.push(new Filter(StockDocumentConstant.ID, Operation.eq, this.id));
    }
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(StockDocumentConstant.STOCK_DOCUMENT_LINE), new Relation('IdInputUser1Navigation'),
      new Relation('IdInputUser2Navigation')]);
  }

  get disableGeneratedInventory() {
    return (Number(this.stockDocumentsService.inventoryMovementForm.controls.IdWarehouseSource.value)
      || Number(this.stockDocumentsService.inventoryMovementForm.controls.IdTiers.value))
      && (Number(this.stockDocumentsService.inventoryMovementForm.controls.IdInputUser1.value && this.isSimpleType)
        || (Number(this.stockDocumentsService.inventoryMovementForm.controls.IdInputUser1.value
          && Number(this.stockDocumentsService.inventoryMovementForm.controls.IdInputUser2.value) && !this.isSimpleType)));
  }

  setValueIsdoubleInput() {
    if (((this.isUpdateMode && this.stockDocumentsService.inventoryMovementForm.controls.IdInputUser2.value !== null)
      || (!this.isSimpleType) && !this.isUpdateMode)) {
      this.isdoubleInput = true;
    } else {
      this.isdoubleInput = false;
    }
  }

  prepareList(result, isFromSearch?: boolean) {
    const state = this.stockDocumentsService.gridState;
    state.skip = 0;
    state.take = this.stockDocumentsService.inventoryGridSettings.state.take;
    const Process = !isNullOrUndefined(result.data) ? process(result.data, state) : process(result.listData, state);
    if (!isNullOrUndefined(result)) {

      /* Regroup returned data */
      if (Process.data.length > 0 && Process.data[NumberConstant.ZERO].ActualQuantity === NumberConstant.MINUS_ONE) {
        this.stockDocumentsService.inventoryGridSettings.columnsConfig[NumberConstant.THREE].hidden = true;
      }

      this.stockDocumentsService.inventoryGridSettings.gridData = {data: result.listData, total: result.total};
      this.stockDocumentsService.inventoryView = result.listData;
      this.stockDocumentsService.stockDocument.StockDocumentLine = result.listData;
      this.stockDocumentsService.stockDocument.StockDocumentLine.forEach((x) => {
        x.Description = x.IdItemNavigation.Description;
        x.Code = x.IdItemNavigation.Code;
      });
    }

    if ((!isNullOrUndefined(this.stockDocumentsService.inventoryGridSettings.gridData)
      && !isNullOrUndefined(this.stockDocumentsService.inventoryGridSettings.gridData.total)
      && this.stockDocumentsService.inventoryGridSettings.gridData.total > 0) || isFromSearch) {
      this.isGeneratedInventory = true;
      this.isUpdateMode = true;
      this.isPlannedInventory = true;
    } else {
      this.isPlannedInventory = false;
      this.isGeneratedInventory = false;
      this.isUpdateMode = true;
      if (this.stockDocumentsService.stockDocument.IsPlannedInventory) {
        this.PlannifiedDate = this.stockDocumentsService.stockDocument.DocumentDate;
        const swalttext = this.translate.instant(StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_PLANNED_INVENTORY,
          {PlannifiedDate: this.stockDocumentsService.stockDocument.DocumentDate.toLocaleDateString()});
        this.swalWarrings.CreateSwal(swalttext, 'INFO', 'OK', '', true, true);
      } else {
        this.swalWarrings.CreateSwal(StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_NOTEXISTING_INVENTORY_MOVEMENT_ITEMS,
          'INFO', 'OK', '', true, true);
      }
    }
    this.isAlreadyPlannedInventory = this.stockDocumentsService.stockDocument.IsPlannedInventory == true || this.stockDocumentsService.stockDocument.StockDocumentLine.length > 0;
  }

  prepareSearchList(result) {
    const state = this.stockDocumentsService.gridState;
    state.skip = 0;
    const Process = !isNullOrUndefined(result.data) ? process(result.data, state) : process(result.listData, state);

    if (!isNullOrUndefined(result)) {

      /* Regroup returned data */

      this.stockDocumentsService.inventoryGridSettings.gridData = {data: result.listData, total: result.total};
      this.stockDocumentsService.inventoryView = result.data;
      this.stockDocumentsService.stockDocument.StockDocumentLine = result.data;
    }
  }

  public onPrintClick($event): void {
    //print report
  }

  public onJasperPrintClick($event): void {
    if ($event && $event.printType === 'JASPER_GAIN_LOSS') {
      this.onPrintJasperLossGainClick();
    } else {
    // print jasper report
    let withQty:number = -1;
    if ($event && $event.TemplateCode) {
      withQty = $event.TemplateCode === this.translate.instant('JASPER_WITH_QTY') ? 1 : -1;
    }

    const params = {
      'idStockDocument': this.stockDocumentsService.stockDocument.Id,
      'withQty': withQty
    };

    const dataToSend = {
      'Id': this.stockDocumentsService.stockDocument.Id,
      'reportName': StockDocumentConstant.INVENTORY_SLIP_REPORT_NAME,
      'documentName': this.translate.instant(StockDocumentConstant.INVENTORY_UPPERCASE),
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'PrintType': -1,
      'reportparameters': params
    };
    this.downloadJasperReport(dataToSend);
   }
  }

  /**
   * Jasper report print version
   */
  public onPrintJasperLossGainClick(): void {
    let withSecondEcart = -1;
    if (this.stockDocumentsService.inventoryMovementForm.controls['IdInputUser2'].value && !this.isValidated) {
      withSecondEcart = 1;
    }
    const params = {
      report_documentId: this.stockDocumentsService.stockDocument.Id,
      withSecondEcart: withSecondEcart
    };
    const dataToSend = {
      'Id': this.stockDocumentsService.stockDocument.Id,
      'reportName': 'inventory_loss_gain',
      'documentName': this.translate.instant(StockDocumentConstant.REPORT_GAINLOSS_UPPERCASE),
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'reportType': 'pdf',
      'reportparameters': params
    };
    this.stockDocumentsService.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
  }


  /**
   * create add form
   * */
  private createAddForm(): void {
    this.stockDocumentsService.inventoryMovementForm = this.formBuilder.group({
      Id: [0],
      Code: [{value: 'INVENTORY/' + this.currentDate.getFullYear(), disabled: true}],
      DocumentDate: [{value: new Date(), disabled: this.isUpdateMode}, Validators.required],
      IdWarehouseSource: [{value: undefined, disabled: this.isUpdateMode}],
      IdTiers: [{value: undefined, disabled: this.isUpdateMode}],
      Shelf: [{value: undefined, disabled: this.isUpdateMode}],
      IsDefaultValue: [{value: false, disabled: this.isUpdateMode}],
      IsOnlyAvailableQuantity: [{value: false, disabled: this.isUpdateMode}],
      IdInputUser1: [{value: undefined, disabled: this.isUpdateMode}, Validators.required],
      IdInputUser2: [{value: undefined, disabled: this.isUpdateMode}],
    });
  }


  ngOnDestroy() {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    this.stockDocumentsService.OnDestroy();
  }

  generateInventory() {
    if (this.stockDocumentsService.inventoryMovementForm.valid) {
      this.callAddInventoryService();
    } else {
      this.validationService.validateAllFormFields(this.stockDocumentsService.inventoryMovementForm);
    }
  }

  validateInventoryMovement() {
    this.swalWarrings.CreateSwal(StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_VALIDATE_INVENTORY_MOVEMENT,
      StockDocumentConstant.TITLE_SWAL_WARRING_VALIDATE_INVENTORY_MOVEMENT).then((result) => {
        if (result.value) {
          if(this.detailsList.IdUserInput2){
          this.detailsList.loadGridDataSource();
          }
          this.stockDocumentsService.validateInventoryDocument(this.stockDocumentsService.stockDocument.Id).subscribe(res => {
            // send message
            this.messageService.startSendMessage(res, InformationTypeEnum.INVENTORY_INVENTORY_MVT_VALIDATION, null, false);
            this.router.navigate([StockDocumentConstant.URI_INVENTORY]);
          });
        }
      });
  }

  unvalidateInventoryMovement() {
    this.swalWarrings.CreateSwal(StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_UNVALIDATE_INVENTORY_MOVEMENT,
      StockDocumentConstant.TITLE_SWAL_WARRING_UNVALIDATE_INVENTORY_MOVEMENT).then((result) => {
      if (result.value) {
        this.stockDocumentsService.unvalidateInventoryDocument(this.stockDocumentsService.stockDocument.Id).subscribe(res => {
          // send message
          this.messageService.startSendMessage(res, InformationTypeEnum.INVENTORY_INVENTORY_MVT_VALIDATION, null, false);
          this.router.navigate([StockDocumentConstant.URI_INVENTORY]);
        });
      }
    });
  }

  /**
   * Prepare object to save
   */
  prepareObjectToValidate(line: StockDocumentLine[]) {
    this.stockDocumentsService.stockDocument = new StockDocument(line, this.documentCode.Inventory,
      this.stockDocumentsService.inventoryMovementForm.controls[StockDocumentConstant.DATE_FIELD].value,
      this.inventoryPlanningFilter,
      this.stockDocumentsService.stockDocument.IdWarehouseSource,
      this.stockDocumentsService.stockDocument.IdWarehouseSource,
      documentStatusCode[StockDocumentConstant.PROVISIONAL],
      this.stockDocumentsService.stockDocument ? this.stockDocumentsService.stockDocument.Id : null,
      this.stockDocumentsService.stockDocument ? this.stockDocumentsService.stockDocument.Code : null);
    this.objectToSave = new ObjectToSend(this.stockDocumentsService.stockDocument);
  }

  /**
   * Prepare object to save
   */
  prepareObjectToPlannedSave() {
    this.stockDocumentsService.stockDocument = new StockDocument(null, this.documentCode.Inventory,
      this.stockDocumentsService.inventoryMovementForm.controls[StockDocumentConstant.DATE_FIELD].value,
      this.inventoryPlanningFilter,
      this.stockDocumentsService.inventoryMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_SOURCE].value,
      this.stockDocumentsService.inventoryMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_SOURCE].value,
      documentStatusCode[StockDocumentConstant.PROVISIONAL],
      this.stockDocumentsService.stockDocument ? this.stockDocumentsService.stockDocument.Id : null,
      this.stockDocumentsService.stockDocument ? this.stockDocumentsService.stockDocument.Code : null);
    this.objectToSave = new ObjectToSend(this.stockDocumentsService.stockDocument);
  }

  planNextInventory() {
    this.inventoryPlanningFilter = !this.inventoryPlanningFilter;
    this.isGeneratedInventory = !this.isGeneratedInventory;

  }

  savePlannedInventoryMovement() {
    this.swalWarrings.CreateSwal(StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_VALIDATE_INVENTORY_MOVEMENT,
      StockDocumentConstant.TITLE_SWAL_WARRING_PLANNED_INVENTORY_MOVEMENT).then((result) => {
      if (result.value) {

        this.prepareObjectToPlannedSave();
        this.stockDocumentsService.savePlannedInventoryMovement(this.objectToSave).subscribe(res => {
          // send message
          this.messageService.startSendMessage(res, InformationTypeEnum.INVENTORY_INVENTORY_MVT_SAVE_PLANNED, null, false);
          this.router.navigate([StockDocumentConstant.URI_INVENTORY]);
        });
      }
    });
  }

  callSearchInventoryService(searchType?: Boolean) {
    let document = new InventoryDocumentLine(this.stockDocumentsService.stockDocument.Id, 0,
      this.stockDocumentsService.inventoryGridSettings.state.take, '', '', '', '');
    if (searchType) {
      document = new InventoryDocumentLine(this.stockDocumentsService.stockDocument.Id, 0,
        this.stockDocumentsService.inventoryGridSettings.state.take,
        '',
        ''
        , this.Searchpredicate.Filter.find(x => x.prop === 'BarCode1D').getValue()
        , this.Searchpredicate.Filter.find(x => x.prop === 'BarCode2D').getValue());
    } else {
      document = new InventoryDocumentLine(this.stockDocumentsService.stockDocument.Id, 0,
        this.stockDocumentsService.inventoryGridSettings.state.take
        , this.Searchpredicate.Filter.find(x => x.prop === 'Code').getValue()
        , this.Searchpredicate.Filter.find(x => x.prop === 'Description').getValue(), '', '');
    }

    this.stockDocumentsService.getItemByBarCodeOrReference(document)
      .subscribe(result => {
        this.prepareSearchList(result);
      });

  }

  /**
   *
   * init data source
   * */
  searchGridDataSource(filter?: Array<Filter>, operator?: Operator, searchType?: Boolean) {
    if (filter || operator) {
      this.filterArray = filter;
      this.operator = operator;
    }
    this.Searchpredicate = new PredicateFormat();
    this.Searchpredicate.Filter = filter;
    this.operator = operator;
    this.callSearchInventoryService(searchType);
  }

  public filter(filter?: Array<Filter>, operator?: Operator, searchType?: Boolean) {
    this.searchGridDataSource(filter, operator, searchType);
  }

  PrintInventoryMovementReport() {
    if (this.isGeneratedInventory && this.isPlannedInventory) {
      const dataToSend = {
        'id': this.stockDocumentsService.stockDocument.Id,
        'reportName': StockDocumentConstant.INVENTORY_SUMMARY_REPORT_NAME
      };
      this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
        SharedConstant.MODAL_DIALOG_SIZE_L);
    } else {
      this.messageService.startSendMessage(null, InformationTypeEnum.INVENTORY_INVENTORY_MVT_PRINT_REPORT, null, false);
    }
  }

  PrintInventoryMovementSlip() {

    if (this.isGeneratedInventory && this.isPlannedInventory) {
      const dataToSend = {
        'id': this.stockDocumentsService.stockDocument.Id,
        'reportName': StockDocumentConstant.INVENTORY_SLIP_SUMMARY_REPORT_NAME
      };
      this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
        SharedConstant.MODAL_DIALOG_SIZE_L);
    } else {
      this.messageService.startSendMessage(null, InformationTypeEnum.INVENTORY_INVENTORY_MVT_PRINT_SLIP, null, false);
    }
  }


  PrintInventoryMovementJasperReport() {
    if (this.isGeneratedInventory && this.isPlannedInventory) {

      const params = {
        'Id': this.stockDocumentsService.stockDocument.Id,
      };

      const dataToSend = {
        'Id': this.stockDocumentsService.stockDocument.Id,
        'reportName': StockDocumentConstant.INVENTORY_SUMMARY_REPORT_NAME,
        'documentName': StockDocumentConstant.INVENTORY_SUMMARY_REPORT_NAME,
        'reportFormatName': 'pdf',
        'printCopies': 1,
        'PrintType': -1,
        'reportparameters': params
      };
      this.downloadJasperReport(dataToSend);
    } else {
      this.messageService.startSendMessage(null, InformationTypeEnum.INVENTORY_INVENTORY_MVT_PRINT_REPORT, null, false);
    }
  }

  PrintInventoryMovementSlipJasper() {

    if (this.isGeneratedInventory && this.isPlannedInventory) {

      const params = {
        'Id': this.stockDocumentsService.stockDocument.Id,
      };

      const dataToSend = {
        'Id': this.stockDocumentsService.stockDocument.Id,
        'reportName': StockDocumentConstant.INVENTORY_SLIP_SUMMARY_REPORT_NAME,
        'documentName': StockDocumentConstant.INVENTORY_SLIP_SUMMARY_REPORT_NAME,
        'reportFormatName': 'pdf',
        'printCopies': 1,
        'PrintType': -1,
        'reportparameters': params
      };
      this.downloadJasperReport(dataToSend);

    } else {
      this.messageService.startSendMessage(null, InformationTypeEnum.INVENTORY_INVENTORY_MVT_PRINT_SLIP, null, false);
    }
  }

  /// Download Invoice Jasper
  public downloadJasperReport(dataItem): void {
    this.stockDocumentsService.downloadJasperReport(dataItem).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
  }

  /** show quantity details*/
  quantityDetails($event) {
    this.selectedRow = $event;
  }

  showSearchWarehouse() {
    this.searchPerWarehouse = true;
    this.searchPerSupplier = false;
    this.stockDocumentsService.inventoryMovementForm.controls.IdWarehouseSource.setValidators(Validators.required);
    //this.stockDocumentsService.inventoryMovementForm.controls.Shelf.setValidators(Validators.required);
    this.stockDocumentsService.inventoryMovementForm.controls.IdTiers.clearValidators();
    this.stockDocumentsService.inventoryMovementForm.controls.IdTiers.setValue(undefined);
  }

  showSimpleInput() {
    this.isdoubleInput = false;
    this.isSimpleType = true;
    this.stockDocumentsService.inventoryMovementForm.controls.IdInputUser2.clearValidators();
    this.stockDocumentsService.inventoryMovementForm.controls.IdInputUser2.setValue(undefined);
  }

  showDoubleInput() {
    this.isdoubleInput = true;
    this.isSimpleType = false;
    this.stockDocumentsService.inventoryMovementForm.controls.IdInputUser2.setValidators(Validators.required);
  }

  showSearchSupplier() {
    this.searchPerSupplier = true;
    this.searchPerWarehouse = false;
    this.stockDocumentsService.inventoryMovementForm.controls.IdWarehouseSource.clearValidators();
    this.stockDocumentsService.inventoryMovementForm.controls.IdWarehouseSource.setValue(undefined);
    this.stockDocumentsService.inventoryMovementForm.controls.Shelf.clearValidators();
    this.stockDocumentsService.inventoryMovementForm.controls.Shelf.setValue(undefined);
    this.stockDocumentsService.inventoryMovementForm.controls.IdTiers.setValidators(Validators.required);
  }

  warehouseSelect($event) {
    if (this.stockDocumentsService.inventoryMovementForm.controls.IdWarehouseSource.value > 0) {
      this.initShelfAndStorageData();
      this.enableShelfDropdown($event);
      this.isDisabledShelfDropdown = true;
      this.stockDocumentsService.inventoryMovementForm.controls.Shelf.enable();
      this.stockDocumentsService.inventoryMovementForm.controls.Shelf.reset();
    } else {
      this.stockDocumentsService.inventoryMovementForm.controls.Shelf.disable();
      this.stockDocumentsService.inventoryMovementForm.controls.Shelf.reset();
    }
  }

  public initShelfAndStorageData() {
    this.warehouseItemService.getShelf(this.stockDocumentsService.inventoryMovementForm.controls.IdWarehouseSource.value).subscribe(x => {
      this.shelfDataSource = x;

      this.shelfDataSourceFiltered = [];
      Object.assign(this.shelfDataSourceFiltered, x);
    });
  }

  handleFilterShlef(value) {
    this.shelfDataSourceFiltered = this.shelfDataSource.filter((s) => s.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  disableFooter(event: boolean) {
    this.footerDisabled = event;
  }


  public backToList() {
    if (!this.footerDisabled) {
      this.router.navigateByUrl(INVENTORY_URL_LIST);
    }
  }

  public showDetailsContent() {
    this.isDetailsContentVisible = true;
    this.fieldsetBorderStyle = this.fieldsetBorderShowed;
  }

  public hideDetailsContent() {
    this.isDetailsContentVisible = false;
    this.fieldsetBorderStyle = this.fieldsetBorderHidden;
  }

  public getCode() {
    if (this.stockDocumentsService.inventoryMovementForm
      && this.stockDocumentsService.inventoryMovementForm.controls[StockDocumentConstant.CODE_FIELD]) {
      return this.stockDocumentsService.inventoryMovementForm.controls[StockDocumentConstant.CODE_FIELD].value;
    }
  }
  SelectFirstUser($event) {
    if ($event != undefined) {

      this.selectedUser = $event;
      if(this.SeconduserComponent){
        this.SeconduserComponent.UserData = this.SeconduserComponent.UserFiltredData.filter(
          (x) => x.Id != $event
        );
        this.SeconduserComponent.UserFiltredData = this.SeconduserComponent.UserData;
      }

    } else {
      if(this.SeconduserComponent){
      this.SeconduserComponent.UserData = this.SeconduserComponent.UserFiltredData;
      this.SeconduserComponent.UserFiltredData = this.SeconduserComponent.UserFiltredData.filter(
        (x) =>
          x.Id !=
          this.SeconduserComponent.selectedIdUser
      );
      }
      this.selectedUser = undefined;
    }
  }
  SelectSecondUser($event) {
      if ($event != undefined) {
        this.FirstuserComponent.UserFiltredData  = this.FirstuserComponent.UserFiltredData.filter(
          (x) => x.Id != $event
        );
      } else {
        this.FirstuserComponent.UserData = this.FirstuserComponent.UserFiltredData;
        this.SeconduserComponent.UserFiltredData = this.SeconduserComponent.UserFiltredData.filter(
          (x) =>
            x.Id != this.FirstuserComponent.selectedIdUser
        );
      }
  }
  private enableShelfDropdown(event) {
    if (event) {
      this.isDisabledShelfDropdown = false;
      this.selectedIdWarehouse = this.IdWarehouseSource.value;
    }
  }
  get IdWarehouseSource(): FormControl {
    return this.stockDocumentsService.inventoryMovementForm.get(
      WarehouseConstant.ID_WAREHOUSE_SOURCE
    ) as FormControl;
  }

}
