import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  linesToAdd,
  StockDocumentsService,
} from "../../services/stock-documents/stock-documents.service";
import {
  GridComponent,
  GridDataResult,
  PageChangeEvent,
  PagerSettings,
} from "@progress/kendo-angular-grid";
import {
  ObjectToSend,
  ObjectToValidate,
} from "../../../models/sales/object-to-save.model";
import { StockDocument } from "../../../models/inventory/stock-document.model";
import { ItemDropdownComponent } from "../../../shared/components/item-dropdown/item-dropdown.component";
import { StockDocumentEnumerator } from "../../../models/enumerators/stock-document.enum";
import { Subscription } from "rxjs/Subscription";
import {
  Filter,
  Operation,
  OrderBy,
  OrderByDirection,
  PredicateFormat,
  Relation,
} from "../../../shared/utils/predicate";
import { ItemWarehouse } from "../../../models/inventory/item-warehouse.model";
import { SharedConstant } from "../../../constant/shared/shared.constant";
import { ValidationService } from "../../../shared/services/validation/validation.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "../../../shared/services/signalr/message/message.service";
import { SwalWarring } from "../../../shared/components/swal/swal-popup";
import { GrowlService } from "../../../../COM/Growl/growl.service";
import { TranslateService } from "@ngx-translate/core";
import { StarkRolesService } from "../../../stark-permissions/service/roles.service";
import { KeyboardConst } from "../../../constant/keyboard/keyboard.constant";
import { SearchConstant } from "../../../constant/search-item";
import { StockDocumentConstant } from "../../../constant/inventory/stock-document.constant";
import { StockDocumentLine } from "../../../models/inventory/stock-document-line.model";
import { documentStatusCode } from "../../../models/enumerators/document.enum";
import { InformationTypeEnum } from "../../../shared/services/signalr/information/information.enum";
import { NumberConstant } from "../../../constant/utility/number.constant";
import { ReducedItem } from "../../../models/inventory/reduced-item.model";
import { DocumentLinesWithPaging } from "../../../models/sales/document-lines-with-paging.model";
import { RoleConfigConstant } from "../../../Structure/_roleConfigConstant";
import { createLineFormGroup } from "../../stock-documents/transfer-movement/add-transfer-movement/add-transfer-movement.component";
import { WarehouseConstant } from "../../../constant/inventory/warehouse.constant";
import { ShelfDropdownComponent } from "../../../shared/components/shelf-dropdown/shelf-dropdown.component";
import { SearchItemService } from "../../../sales/services/search-item/search-item.service";
import { AuthService } from "../../../login/Authentification/services/auth.service";
import { PermissionConstant } from "../../../Structure/permission-constant";
const MIN_DATE_FILTER = 1753;
@Component({
  selector: "app-add-shelf-and-storage",
  templateUrl: "./add-shelf-and-storage.component.html",
  styleUrls: ["./add-shelf-and-storage.component.scss"],
})
export class AddShelfAndStorageComponent implements OnInit {
  isSavedDocument: boolean;
  transfertMovementForm: FormGroup;
  /** tiersAssociatedToItems will be changed if its a purchase document and the supplier has been selected */
  warehouseAssociatedToItems: number;
  formGroup: FormGroup;
  public counter = linesToAdd.length;
  private isNew: boolean;
  private editedRowIndex: number;
  public view: GridDataResult;
  labelItem: string;
  designation: string;
  private objectToSave: ObjectToSend;
  private stockDocument: StockDocument;
  @ViewChild(GridComponent) private grid: GridComponent;
  @ViewChild(ItemDropdownComponent) private itemDropDown: ItemDropdownComponent;
  @ViewChild("shelfSourceDropdown")
  private shelfSourceDropdownComponent: ShelfDropdownComponent;
  @ViewChild("shelfDestinationDropdown")
  private shelfDestinationDropdownComponent: ShelfDropdownComponent;
  private documentCode: StockDocumentEnumerator = new StockDocumentEnumerator();
  private Code: string;
  isDisabled: boolean;
  isFromRemove = false;
  isSelectedItem = false;
  public haveValidateRole = false;
  public haveTransferRole = false;
  public haveReceiveRole = false;
  public selectedStorage;
  public shelfDestinationLabel: string;

  /*
   * Id Entity
   */
  private id: number;

  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  /*
   * id Subscription
   */
  private idSubscription: Subscription;
  private transfertMvtSubscription: Subscription;
  /*
   * active to update
   */
  public transfertMvtToUpdate: StockDocument;
  public predicate: PredicateFormat;

  private idCurrentWarehouseSource: number;

  isShowForm: boolean;
  isTransfertForm: boolean;
  isReceiveForm: boolean;
  objectToValidate: ObjectToValidate;
  item = new ItemWarehouse();
  keyAction;
  showButtonAddLine = true;
  public showAvalableQuantite = false;
  public pageSize = 50;
  public skip = 0;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public NewAvailbleQuantity = 0;
  public isVisibleTransferMovementCode = false;
  public isDisabledShelfDropdown = true;
  public selectedIdWarehouse = NumberConstant.ZERO;
  public isAccociationSelected = false;
  private isNewLine = true;
  /**
   * permissions
   */
   public hasUpdatePermission: boolean;
   public hasDeletePermission: boolean;
   public hasAddPermission: boolean;
   public hasValidatePermission: boolean;
   public hasTransferPermission: boolean;
   public hasReceivePermission: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public stockDocumentsService: StockDocumentsService,
    public validationService: ValidationService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    public viewRef: ViewContainerRef,
    private swalWarrings: SwalWarring,
    protected growlService: GrowlService,
    protected translateService: TranslateService,
    private roleService: StarkRolesService,
    private authService: AuthService,
    private searchItemService: SearchItemService
  ) {
    this.idSubscription = this.activatedRoute.params.subscribe((params) => {
      this.id = +params["id"] || 0;
    });
    this.keyAction = (event) => {
      const keyName = event.key;
      /*escape keyboard click */
      if (keyName === KeyboardConst.ESCAPE) {
        this.closeEditor();
        if (this.searchItemService.openedModalOptions) {
          this.closeItemModalEvent(this);
        }
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);
    //this.serachItemSearvice.closeFetchProductsModalSubject.subscribe((provisionId) => {
    //  this.closeItemModalEvent(provisionId);
    //});
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    this.getDocLineWithPaging();
  }

  /*
   * verify if the grid is in editing mode
   */
  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }

  /**
   * create add form
   * */
  private createAddForm(): void {
    this.transfertMovementForm = this.formBuilder.group({
      Id: [0],
      Code: [""],
      DocumentDate: [new Date(), Validators.required],
      TransfertType: [
        StockDocumentConstant.TRANSFERT_DOCUMENT,
        Validators.required,
      ],
      IdWarehouseSource: [undefined, Validators.required],
      IdStorageSource: [undefined, Validators.required],
      IdStorageDestination: [undefined, Validators.required],
    });
    if(this.isUpdateMode && !this.hasUpdatePermission){
      this.transfertMovementForm.controls["DocumentDate"].disable();
    }
  }

  /**Select warehouse Source */
  warehouseSourceFocused($event) {
    this.changeListOfWarehouse(
      $event,
      StockDocumentConstant.ID_WAREHOUSE_DESTINATION,
      this.IdWarehouseSource.value
    );
  }

  /**Select warehouse Destination */
  warehouseDestinationFocused($event) {
    this.changeListOfWarehouse(
      $event,
      StockDocumentConstant.ID_WAREHOUSE_SOURCE,
      this.transfertMovementForm.controls[
        StockDocumentConstant.ID_WAREHOUSE_DESTINATION
      ].value
    );
  }

  warehouseDestinationSelected($event) {
    if($event){
    this.resetShelfDropDownValues();
    this.changeItemDropdown(
      $event.parent.value[StockDocumentConstant.ID_WAREHOUSE_SOURCE]
    );
    if ($event.combobox.dataItem) {
      this.enableShelfDropdown($event);
    } else {
      this.isDisabledShelfDropdown = true;
    }
  }
  }

  private resetShelfDropDownValues() {
    if (this.shelfSourceDropdownComponent) {
      this.shelfSourceDropdownComponent.listShelfsAndStorages = [];
      this.shelfSourceDropdownComponent.shelfComboBoxComponent.reset();
    }
    this.shelfDestinationDropdownComponent.listShelfsAndStorages = [];
    this.shelfDestinationDropdownComponent.shelfComboBoxComponent.reset();
  }

  /**
   * Change value of list of warehouse
   * @param $event
   * @param nameOfProperty
   * @param idSpecificWarehouse
   */
  changeListOfWarehouse($event, nameOfProperty, idSpecificWarehouse) {
    if (
      idSpecificWarehouse !== this.transfertMovementForm.value[nameOfProperty]
    ) {
      idSpecificWarehouse = this.transfertMovementForm.value[nameOfProperty];
      // Init list of warehouse data source
      $event.warehouseDataSource = [];
      $event.warehouseDataSource = $event.warehouseDataSource.concat(
        $event.listOfAllWarehouseDataSource
      );
      // Init list of filtred warehouse data source
      $event.warehouseFiltredDataSource = [];
      $event.warehouseFiltredDataSource = $event.warehouseFiltredDataSource.concat(
        $event.listOfAllWarehouseDataSource
      );
      if (this.transfertMovementForm.value[nameOfProperty]) {
        // Change list of warehouse data source
        $event.warehouseFiltredDataSource.splice(
          $event.warehouseFiltredDataSource.findIndex(
            (d) => d.Id === idSpecificWarehouse
          ),
          1
        );
        // Change list of filtred warehouse data source
        $event.warehouseDataSource.splice(
          $event.warehouseDataSource.findIndex(
            (d) => d.Id === idSpecificWarehouse
          ),
          1
        );
      } else {
        this.resetDataSource($event);
      }
    } else {
      this.resetDataSource($event);
    }
  }

  private resetDataSource($event) {
    $event.warehouseDataSource = $event.listOfAllWarehouseDataSource;
    $event.warehouseFiltredDataSource = $event.listOfAllWarehouseDataSource;
  }

  /**Select item */
  itemSelect($event) {
    if ($event) {
      // if stockDocumentLine is saved from list product model
      if (
        $event.searchItemService.openedModalOptions &&
        $event.searchItemService.openedModalOptions.data.stockDocumentLineSaved
      ) {
        this.closeItemModalEvent($event);
      } else {
        if (
          this.item.IdItem !==
          $event.itemForm.value[StockDocumentConstant.ID_ITEM]
        ) {
          this.isSelectedItem = true;
        }
        this.item = $event.itemForm.value;
        if (
          $event.itemForm &&
          $event.itemForm.value[StockDocumentConstant.ID_ITEM] &&
          this.isSelectedItem
        ) {
          this.formGroup.controls[
            StockDocumentConstant.ACTUAL_QUANTITY
          ].setValue(1);

          const model = {};
          model[StockDocumentConstant.ID_ITEM] =
            $event.itemForm.value[StockDocumentConstant.ID_ITEM];
          model[
            StockDocumentConstant.ID_WAREHOUSE
          ] = this.IdWarehouseSource.value;
          model[StockDocumentConstant.ID] =
            $event.itemForm.value[StockDocumentConstant.ID];
          model[
            StockDocumentConstant.DATE
          ] = this.transfertMovementForm.controls[
            StockDocumentConstant.DATE_FIELD
          ].value;
          const objectToSend: ObjectToSend = new ObjectToSend(model);
          this.showAvalableQuantite = true;
          this.stockDocumentsService
            .getItemQtyInWarehouse(objectToSend)
            .subscribe((res) => {
              this.NewAvailbleQuantity = res.listData;
              this.formGroup.controls["AvailableQuantity"].setValue(
                res.listData
              );
            });
        }
        else {
          this.showAvalableQuantite = this.isNewLine ? false : true;
        }
      }
    }
  }

  /**
   * Prepare object to save
   */
  prepareObjectToSave(line: StockDocumentLine[]) {
    const dateDoc = this.transfertMovementForm.controls[
      StockDocumentConstant.DATE_FIELD
    ].value;
    this.transfertMovementForm.controls[
      StockDocumentConstant.DATE_FIELD
    ].setValue(
      new Date(
        Date.UTC(dateDoc.getFullYear(), dateDoc.getMonth(), dateDoc.getDate())
      )
    );
    this.stockDocument = new StockDocument(
      line,
      this.documentCode.TransferShelfStorage,
      this.transfertMovementForm.controls[
        StockDocumentConstant.DATE_FIELD
      ].value,
      false,
      this.IdWarehouseSource.value,
      null,
      documentStatusCode[StockDocumentConstant.PROVISIONAL],
      this.transfertMvtToUpdate
        ? this.transfertMvtToUpdate.Id
        : this.transfertMovementForm.controls[StockDocumentConstant.ID].value,
      this.transfertMvtToUpdate
        ? this.transfertMvtToUpdate.Code
        : this.transfertMovementForm.controls[StockDocumentConstant.CODE].value
    );
    this.stockDocument.IdStorageSource = this.IdStorageSource.value;
    this.stockDocument.IdStorageDestination = this.IdStorageDestination.value;
    this.stockDocument.TransferType = this.transfertMvtToUpdate && this.transfertMvtToUpdate.TransferType ? this.transfertMvtToUpdate.TransferType.trim() :
     this.TransfertType.value;
    this.objectToSave = new ObjectToSend(this.stockDocument);
  }

  save() {
    const stockDocumentLines: Array<StockDocumentLine> = new Array<StockDocumentLine>();
    this.prepareObjectToSave(stockDocumentLines);
    this.stockDocumentsService
      .saveStockDocumentInRealTime(this.objectToSave)
      .subscribe((res) => {
        if (!this.isUpdateMode) {
          this.setDocumentCodeAndIdAfterSave(res);
          if (res && res.Id) {
            this.id = res.Id;
            this.isSavedDocument = true;
            this.isUpdateMode = true;
            this.isDisabledShelfDropdown = true;
            this.transfertMvtToUpdate = res;
            this.setValueTransfertMvt();
          }
          this.messageService.startSendMessage(
            res,
            InformationTypeEnum.INVENTORY_TRANSFER_MVT_ADD,
            null,
            false
          );
        }
      });
  }

  public setDocumentCodeAndIdAfterSave(data) {
    this.isVisibleTransferMovementCode = true;
    this.transfertMovementForm.controls["Id"].setValue(data.Id);
    this.transfertMovementForm.controls["Code"].setValue(data.Code);
  }

  /*
   *cancel changes
   */
  public cancelHandler(): void {
    this.closeEditor();
    this.showAvalableQuantite = false;
  }

  private closeEditor() {
    if (this.view.data.length === 0) {
      this.isDisabled = false;
      if(this.IdWarehouseSource.value){
        this.isDisabledShelfDropdown = false;
      }else{
        this.isDisabledShelfDropdown = true;
      }
    }
    this.grid.closeRow(this.editedRowIndex);
    this.isNew = false;
    this.isNewLine = true;
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.showButtonAddLine = true;
    if (this.itemDropDown) {
      this.itemDropDown.activeKeyPress = false;
    }
  }

  /*
   * on click documentline cell
   */
  public lineClickHandler({ isEdited, dataItem, rowIndex }): void {
    if((this.isUpdateMode && this.hasUpdatePermission) || this.hasAddPermission){
      if (
        isEdited ||
        (this.formGroup && !this.formGroup.valid) ||
        this.isInEditingMode ||
        this.isFromRemove ||
        this.transfertMvtToUpdate.IdDocumentStatus != NumberConstant.ONE
      ) {
        this.isFromRemove = false;
        return;
      }
      this.showButtonAddLine = false;
      this.isSelectedItem = false;
      this.formGroup = createLineFormGroup(dataItem);
      this.formGroup.controls["AvailableQuantity"].disable();
      this.formGroup.controls[StockDocumentConstant.ID_ITEM].disable();
      this.item = this.formGroup.getRawValue();
      this.labelItem = dataItem.LabelItem;
      this.designation = dataItem.Designation;
      if (dataItem.Id > 0) {
        this.showAvalableQuantite = true;
      }
      this.isNewLine = false;
      this.editedRowIndex = rowIndex;
      this.grid.editRow(rowIndex, this.formGroup);
    }
  }

  /*
   * Add DocumentLine
   */
  public addLine(): void {
    if (this.itemDropDown) {
      this.itemDropDown.activeKeyPress = true;
    }
    if (this.transfertMovementForm.valid) {
      this.changeData();
      this.showButtonAddLine = false;
      this.formGroup = createLineFormGroup({
        Id: 0,
        IdItem: undefined,
        ActualQuantity: 1,
        LabelItem: undefined,
        Designation: undefined,
        IsDeleted: false,
        IdStockDocument: undefined,
        AvailableQuantity: 0,
      });
      this.formGroup.controls["AvailableQuantity"].disable();
      this.isNew = true;
      this.isSelectedItem = true;
      this.formGroup.controls[StockDocumentConstant.ID_LINE].setValue(
        this.stockDocumentsService.counter
      );
      this.grid.addRow(this.formGroup);
      this.isDisabled = true;
      this.isDisabledShelfDropdown = true ;
      if (this.transfertMovementForm.controls["Id"].value <= 0) {
        this.save();
      }
      if (this.itemDropDown) {
        this.itemDropDown.getItemRelatedToWarehouse(
          this.IdWarehouseSource.value
        );
      }
    } else {
      this.showButtonAddLine = true;
      this.validationService.validateAllFormFields(this.transfertMovementForm);
    }
  }

  /*
   * remove the current documentLine from the current data source
   */
  public removeLine({ isEdited, dataItem, rowIndex }) {
    this.isFromRemove= true;
    this.closeEditor();
    this.stockDocumentsService
      .removeDocumentLineInRealTime(dataItem.Id)
      .subscribe((res) => {
        this.getDocLineWithPaging();
        this.isDisabled = true;
      });
  }

  /**
   * Save current documentline
   **/
  public saveCurrent(): void {
    if (this.formGroup.valid) {
      this.showAvalableQuantite = true;
      const filtredItem: ReducedItem = this.itemDropDown.itemDataSource.filter(
        (x) =>
          x.Id === this.formGroup.controls[StockDocumentConstant.ID_ITEM].value
      )[0];
      this.labelItem = filtredItem.Code;
      this.designation = filtredItem.Description;
      this.formGroup.controls[StockDocumentConstant.LABEL_ITEM].setValue(
        this.labelItem
      );
      this.formGroup.controls[StockDocumentConstant.DESIGNATION].setValue(
        this.designation
      );

      this.counter = this.formGroup.controls[
        StockDocumentConstant.ID_LINE
      ].value;
      this.formGroup.controls["IdStockDocument"].setValue(this.id);
      this.stockDocumentsService
        .saveStockDocumentLineInRealTime(this.formGroup.getRawValue())
        .subscribe((res) => {
          this.getDocLineWithPaging(true);
          this.showAvalableQuantite = false;
        });
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
      this.showAvalableQuantite = true;
    }
  }

  ngOnDestroy() {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.transfertMvtSubscription) {
      this.transfertMvtSubscription.unsubscribe();
    }
    this.stockDocumentsService.OnDestroy();
    this.view.data = this.stockDocumentsService.LinesToAdd();
    document.removeEventListener(
      SearchConstant.KEY_DOWN,
      this.keyAction,
      false
    );
  }

  validateTransfertMovement(): void {
    this.swalWarrings
      .CreateSwal(
        StockDocumentConstant.TEXT_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT,
        StockDocumentConstant.TITLE_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT,
        StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT
      )
      .then((result) => {
        if (result.value) {
          this.stockDocumentsService
            .validateStorageTransfertMovement(this.id)
            .subscribe((res) => {
              // send message
              this.messageService.startSendMessage(
                res,
                InformationTypeEnum.INVENTORY_TRANSFER_MVT_VALIDATION,
                null,
                false
              );
              this.router.navigate(
                [
                  StockDocumentConstant.URI_VALIDATED_SHELF_AND_STORAGE_ENTITY,
                ].concat(this.id.toString())
              );
            });
        }
      });
  }

  private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter.push(
      new Filter(StockDocumentConstant.ID, Operation.eq, this.id)
    );
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    // Add filter idDocument
    this.predicate.Filter.push(
      new Filter(StockDocumentConstant.ID, Operation.eq, this.id)
    );
    // Add relation idDocumentStatus
    this.predicate.Relation.push(
      new Relation(StockDocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION)
    );
    // Add relation IdWarehouseSourceNavigation
    this.predicate.Relation.push(
      new Relation(StockDocumentConstant.ID_WAREHOUSE_SOURCE_NAVIGATION)
    );
    // Add relation IdShelfSourceNavigation
    this.predicate.Relation.push(
      new Relation(StockDocumentConstant.ID_STORAGE_SOURCE_NAVIGATION)
    );
    // Add relation IdShelfDestinationNavigation
    this.predicate.Relation.push(
      new Relation(StockDocumentConstant.ID_STORAGE_DESTINATION_NAVIGATION)
    );
    this.predicate.OrderBy = new Array<OrderBy>();
    // Add order by DocumentDate
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [
      new OrderBy(StockDocumentConstant.ID, OrderByDirection.desc),
    ]);
  }

  /**
   *  get data to update
   * */
  private getDataToUpdate() {
    this.preparePredicate();
    this.transfertMvtSubscription = this.stockDocumentsService
      .getModelByCondition(this.predicate)
      .subscribe(async (data) => {
        this.transfertMvtToUpdate = data;
        this.isAccociationSelected = data.TransferType.trim() == 'ASSOCIATION' ? true : false;
        if (!this.isAccociationSelected) {
          this.selectedStorage = data.IdStorageSource;
        }
        await this.loadShelfStorageDropdownValues();
        this.setValueTransfertMvt();
        this.getDocLineWithPaging();
      });
  }

  private getDocLineWithPaging(ifAfterSave?: boolean) {
    const documentLinesWithPaging = new DocumentLinesWithPaging(
      this.id,
      this.pageSize,
      this.skip,
      null,
      null,
      false
    );
    this.stockDocumentsService
      .getStockDocumentWithStockDocumentLine(documentLinesWithPaging)
      .subscribe((x) => {
        this.closeEditor();
        this.isDisabled = x.total !== 0;
        if(!this.isDisabled && this.IdWarehouseSource.value){
          this.isDisabledShelfDropdown = false ;
        }else {
          this.isDisabledShelfDropdown = true ;
        }
        this.initGridData(x.data);
        this.view.total = x.total;
        if (ifAfterSave) {
          this.addLine();
        }
      });
  }

  setValueTransfertMvt() {
    this.isVisibleTransferMovementCode = true;
    this.changeItemDropdown(this.transfertMvtToUpdate.IdWarehouseSource);
    if (this.transfertMvtToUpdate) {
      if (this.transfertMvtToUpdate.IdDocumentStatus !== NumberConstant.ONE) {
        this.isShowForm = true;
      }
      if (this.transfertMvtToUpdate.IdDocumentStatus === NumberConstant.TWO) {
        this.isTransfertForm = true;
      }
      if (this.transfertMvtToUpdate.IdDocumentStatus === NumberConstant.NINE) {
        this.isReceiveForm = true;
      }
      if (this.transfertMvtToUpdate.DocumentDate) {
        this.transfertMvtToUpdate.DocumentDate = new Date(
          this.transfertMvtToUpdate.DocumentDate
        );
      }
      if (this.isAccociationSelected) {
        this.IdStorageSource.clearValidators();
        this.IdStorageSource.setErrors(null);
      }
      this.transfertMovementForm.patchValue(this.transfertMvtToUpdate);
    }
  }

  private async loadShelfStorageDropdownValues() {

    this.shelfSourceDropdownComponent.idWarehouse = this.transfertMvtToUpdate.IdWarehouseSource;
    await this.shelfSourceDropdownComponent.initShelfAndStorageDropdown();
    this.shelfDestinationDropdownComponent.idWarehouse = this.transfertMvtToUpdate.IdWarehouseSource;
    await this.shelfDestinationDropdownComponent.initShelfAndStorageDropdown();
    this.isDisabledShelfDropdown = this.isUpdateMode ? true : false;
    if (this.transfertMvtToUpdate.IdStorageSource != null && this.shelfSourceDropdownComponent) {
      this.shelfSourceDropdownComponent.listShelfsAndStorages = this.shelfSourceDropdownComponent.listShelfsAndStoragesFiltred.filter(
        (x) => x.IdStorage != this.transfertMvtToUpdate.IdStorageDestination
      );
      this.shelfDestinationDropdownComponent.listShelfsAndStorages = this.shelfDestinationDropdownComponent.listShelfsAndStoragesFiltred.filter(
        (x) => x.IdStorage != this.transfertMvtToUpdate.IdStorageSource
      );
    }
    if (this.transfertMvtToUpdate && this.transfertMvtToUpdate.IdStorageDestination &&
      this.shelfDestinationDropdownComponent && this.shelfDestinationDropdownComponent.listShelfsAndStoragesFiltred) {
      this.shelfDestinationLabel = this.shelfDestinationDropdownComponent.listShelfsAndStoragesFiltred.filter(
        (x) => x.IdStorage == this.transfertMvtToUpdate.IdStorageDestination)[0].Label;
    }
  }

  initGridData(StockDocLine) {
    this.stockDocumentsService.lineData = [];
    this.stockDocumentsService.ObjectToSend = [];
    this.counter = 0;
    this.stockDocumentsService.counter = 0;
    if (StockDocLine && StockDocLine.length > 0) {
      StockDocLine.forEach((x) => {
        x.LabelItem = x.IdItemNavigation.Code;
        x.Designation = x.IdItemNavigation.Description;
        this.stockDocumentsService.saveStockDocumentLines(x, true);
        this.isDisabled = true;
      });
    }
    this.view.data = this.stockDocumentsService.LinesToAdd();
  }

  transfertValidateStockDocument() {
    this.objectToValidate = new ObjectToValidate(this.id);
    this.stockDocumentsService
      .transfertValidateStockDocument(this.objectToValidate)
      .subscribe((res) => {
        // send message
        this.messageService.startSendMessage(
          res,
          InformationTypeEnum.INVENTORY_TRANSFER_MVT_TRANSFERT,
          null,
          false
        );
        this.isTransfertForm = false;
        this.isReceiveForm = true;
      });
  }

  receiveValidateStockDocument() {
    this.objectToValidate = new ObjectToValidate(this.id);
    this.stockDocumentsService
      .receiveValidateStockDocument(this.objectToValidate)
      .subscribe((res) => {
        // send message
        this.messageService.startSendMessage(
          res,
          InformationTypeEnum.INVENTORY_TRANSFER_MVT_RECEIVE,
          null,
          false
        );
        this.isReceiveForm = false;
      });
  }

  ngOnInit() {
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SHELFS_AND_STORAGES);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_SHELFS_AND_STORAGES);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SHELFS_AND_STORAGES);
    this.hasValidatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_SHELFS_AND_STORAGES);
    this.hasTransferPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.TRANSFER_SHELFS_AND_STORAGES);
    this.hasReceivePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.RECEIVE_SHELFS_AND_STORAGES);
    this.view = {
      data: undefined,
      total: 0,
    };
    this.view.data = this.stockDocumentsService.LinesToAdd();
    this.isUpdateMode = this.id > 0;
    this.createAddForm();
    if (this.isUpdateMode) {
      this.isSavedDocument = true;
      this.getDataToUpdate();
    }
  }

  /**
   *  Informe itemDropDown about warehouse changement
   */
  changeItemDropdown(idWarehouse) {
    if (idWarehouse) {
      this.warehouseAssociatedToItems = idWarehouse;
    } else {
      this.warehouseAssociatedToItems = null;
    }
    if (this.itemDropDown) {
      this.itemDropDown.getItemRelatedToWarehouse(idWarehouse);
    }
  }

  public updateDocumentCondition(): boolean {
    return (
      this.transfertMovementForm.valid &&
      this.transfertMovementForm.controls["Id"].value > 0
    );
  }

  changeData() {
    let isValidDates = true;
    if (this.transfertMovementForm && this.transfertMovementForm.controls[StockDocumentConstant.DATE_FIELD] &&
      this.transfertMovementForm.controls[StockDocumentConstant.DATE_FIELD].value) {
      const dateDoc = this.transfertMovementForm.controls[StockDocumentConstant.DATE_FIELD].value;
      if (dateDoc.getFullYear() < MIN_DATE_FILTER) {
        isValidDates = false;
        this.growlService.warningNotification(this.translateService.instant('DOCUMENT_ACCOUNT_DATE_INVALID'));
      }
    }
    if (this.updateDocumentCondition() && isValidDates) {
      this.save();
    }
  }

  movementItemFoucusOut() {
    this.saveCurrent();
  }

  public setSelectQty() {
    let mvq = document.getElementsByName("ActualQuantity")[0] as any;
    mvq.select();
  }

  public movementQtyFoucusOut() {
    document.getElementById("btnSave").setAttribute("type", "submit");
  }

  closeItemModalEvent($event) {
    if ($event) {
      $event.searchItemService.openedModalOptions = undefined;
    }
    this.getDocLineWithPaging();
    this.cancelHandler();
  }

  getItemPicture(dataItem) {
    if (dataItem.PictureFileInfo) {
      return SharedConstant.PICTURE_BASE + dataItem.PictureFileInfo.Data;
    }
  }

  get CodeMovmentTransfet() {
    return this.transfertMovementForm.get(
      StockDocumentConstant.CODE_FIELD
    ) as FormControl;
  }

  checkDeletePossibility(): boolean {
    return (
      this.transfertMvtToUpdate.IdDocumentStatusNavigation &&
      this.transfertMvtToUpdate.IdDocumentStatusNavigation.Id == 1
    );
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler() {
    this.swalWarrings
      .CreateSwal(
        StockDocumentConstant.STOCK_MVMNT_DELETE_TEXT_MESSAGE,
        StockDocumentConstant.STOCK_MVMNT_DELETE_TITLE_MESSAGE
      )
      .then((result) => {
        if (result.value) {
          this.stockDocumentsService
            .remove(this.transfertMvtToUpdate)
            .subscribe(() => {
              this.router.navigateByUrl(
                StockDocumentConstant.URL_LIST_SHELF_AND_STORAGE
              );
            });
        }
      });
  }

  /**
   *  0 : type is association
   *  1 : type is transfert
   * @param typeTransfer
   */
  changeTransfertType(typeTransfer) {
    if (typeTransfer === NumberConstant.ZERO) {
      this.isAccociationSelected = true;
      this.TransfertType.setValue(StockDocumentConstant.ASSOCIATION_DOCUMENT);
      this.IdStorageSource.clearValidators();
      this.IdStorageSource.setErrors(null);
      this.selectedStorage = undefined;
    } else {
      this.isAccociationSelected = false;
      this.TransfertType.setValue(StockDocumentConstant.TRANSFERT_DOCUMENT);
      this.IdStorageSource.setValidators(Validators.required);
    }
    this.shelfDestinationDropdownComponent.listShelfsAndStorages = this.shelfDestinationDropdownComponent.listShelfsAndStoragesFiltred;
    if (this.shelfSourceDropdownComponent) {
      this.shelfSourceDropdownComponent.listShelfsAndStorages = this.shelfSourceDropdownComponent.listShelfsAndStoragesFiltred.filter(
        (x) =>
          x.IdStorage !=
          this.shelfDestinationDropdownComponent.selectedIdStorage
      );
    }
    this.IdStorageDestination.setValue(null);
    this.transfertMovementForm.updateValueAndValidity();
  }

  get IdWarehouseSource(): FormControl {
    return this.transfertMovementForm.get(
      WarehouseConstant.ID_WAREHOUSE_SOURCE
    ) as FormControl;
  }

  get TypeDocument(): FormControl {
    return this.transfertMovementForm.get(
      StockDocumentConstant.TYPE_DOCUMENT
    ) as FormControl;
  }

  get IdStorageSource(): FormControl {
    return this.transfertMovementForm.get(
      StockDocumentConstant.ID_STORAGE_SOURCE_FIELD
    ) as FormControl;
  }

  get IdStorageDestination(): FormControl {
    return this.transfertMovementForm.get(
      StockDocumentConstant.ID_STORAGE_DESTINATION_FIELD
    ) as FormControl;
  }

  get TransfertType(): FormControl {
    return this.transfertMovementForm.get(
      StockDocumentConstant.TRANSFERT_TYPE
    ) as FormControl;
  }

  private enableShelfDropdown(event) {
    if (event) {
      this.isDisabledShelfDropdown = false;
      this.selectedIdWarehouse = this.IdWarehouseSource.value;
    }
  }

  SelectShelfSource($event) {
    if ($event != undefined) {
      this.shelfDestinationDropdownComponent.listShelfsAndStorages = this.shelfDestinationDropdownComponent.listShelfsAndStoragesFiltred.filter(
        (x) => x.IdStorage != $event
      );
      this.selectedStorage = $event;
    } else {
      this.shelfDestinationDropdownComponent.listShelfsAndStorages = this.shelfDestinationDropdownComponent.listShelfsAndStoragesFiltred;
      this.shelfSourceDropdownComponent.listShelfsAndStorages = this.shelfSourceDropdownComponent.listShelfsAndStoragesFiltred.filter(
        (x) =>
          x.IdStorage !=
          this.shelfDestinationDropdownComponent.selectedIdStorage
      );
      this.selectedStorage = undefined;
    }
  }

  SelectShelfDestination($event) {
    if (this.IdStorageDestination != $event) {
      this.shelfDestinationLabel = '-';
      if ($event && this.shelfDestinationDropdownComponent && this.shelfDestinationDropdownComponent.listShelfsAndStoragesFiltred) {
        this.shelfDestinationLabel = this.shelfDestinationDropdownComponent.listShelfsAndStoragesFiltred.filter(
          (x) => x.IdStorage == $event)[0].Label;
      }
      }

    if (!this.isAccociationSelected) {

      if ($event != undefined) {
        this.shelfSourceDropdownComponent.listShelfsAndStorages = this.shelfSourceDropdownComponent.listShelfsAndStoragesFiltred.filter(
          (x) => x.IdStorage != $event
        );
      } else {
        this.shelfSourceDropdownComponent.listShelfsAndStorages = this.shelfSourceDropdownComponent.listShelfsAndStoragesFiltred;
        this.shelfDestinationDropdownComponent.listShelfsAndStorages = this.shelfDestinationDropdownComponent.listShelfsAndStoragesFiltred.filter(
          (x) =>
            x.IdStorage != this.shelfSourceDropdownComponent.selectedIdStorage
        );
      }
    }
    if(this.isAccociationSelected && this.transfertMovementForm.controls["Id"].value > 0) {
      this.save();
    }
  }
}
