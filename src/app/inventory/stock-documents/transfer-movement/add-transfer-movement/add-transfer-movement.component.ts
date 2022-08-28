import {Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {linesToAdd, StockDocumentsService} from '../../../services/stock-documents/stock-documents.service';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {GridComponent, GridDataResult, PageChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {StockDocumentLine} from '../../../../models/inventory/stock-document-line.model';
import {digitsAfterComma,isNumeric, ValidationService} from '../../../../shared/services/validation/validation.service';
import {ItemDropdownComponent} from '../../../../shared/components/item-dropdown/item-dropdown.component';
import {StockDocument} from '../../../../models/inventory/stock-document.model';
import {ObjectToSend, ObjectToValidate} from '../../../../models/sales/object-to-save.model';
import {StockDocumentEnumerator} from '../../../../models/enumerators/stock-document.enum';
import {documentStatusCode} from '../../../../models/enumerators/document.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {InformationTypeEnum} from '../../../../shared/services/signalr/information/information.enum';
import {MessageService} from '../../../../shared/services/signalr/message/message.service';
import {Subscription} from 'rxjs/Subscription';
import {Filter, Operation, PredicateFormat, Relation} from '../../../../shared/utils/predicate';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {StockDocumentConstant} from '../../../../constant/inventory/stock-document.constant';
import {ItemWarehouse} from '../../../../models/inventory/item-warehouse.model';
import {KeyboardConst} from '../../../../constant/keyboard/keyboard.constant';
import {SearchConstant} from '../../../../constant/search-item';
import {ReducedItem} from '../../../../models/inventory/reduced-item.model';
import {DocumentLinesWithPaging} from '../../../../models/sales/document-lines-with-paging.model';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {StarkRolesService} from '../../../../stark-permissions/service/roles.service';
import {RoleConfigConstant} from '../../../../Structure/_roleConfigConstant';
import {ItemConstant} from '../../../../constant/inventory/item.constant';
import {ItemService} from '../../../services/item/item.service';
import { Item } from '../../../../models/inventory/item.model';
import { SearchItemService } from '../../../../sales/services/search-item/search-item.service';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { FileService } from '../../../../shared/services/file/file-service.service';
import { DocumentStatus } from '../../../../models/sales/document-status.model';

const MIN_DATE_FILTER = 1753;
export const createLineFormGroup = dataItem => new FormGroup({
  'Id': new FormControl(dataItem.Id),
  'IdLine': new FormControl(dataItem.IdLine),
  'CodeItem': new FormControl(dataItem.Code),
  'LabelItem': new FormControl(dataItem.LabelItem),
  'Designation': new FormControl(dataItem.Designation),
  'IdItem': new FormControl(dataItem.IdItem, Validators.required),
  'ActualQuantity': new FormControl(dataItem.ActualQuantity, [
    Validators.minLength(1),
    Validators.min(0),
    Validators.max(99999),
    Validators.maxLength(5),
    Validators.max(99999),
    Validators.pattern('[-+]?[0-9]*\.?[0-9]*'),
    Validators.required]),
  'IsDeleted': new FormControl(dataItem.IsDeleted ? dataItem.IsDeleted : false),
  'IdStockDocument': new FormControl(dataItem.IdStockDocument),
  'AvailableQuantity': new FormControl(dataItem.AvailableQuantity , {validators: [digitsAfterComma(NumberConstant.THREE)]})
});

@Component({
  selector: 'app-add-transfer-movement',
  templateUrl: './add-transfer-movement.component.html',
  styleUrls: ['./add-transfer-movement.component.scss']
})
export class AddTransferMovementComponent implements OnInit, OnDestroy {
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
  private documentCode: StockDocumentEnumerator = new StockDocumentEnumerator();
  private Code: string;
  isDisabled: boolean;
  isFromRemove = false;
  isSelectedItem = false;
  public haveValidateRole = false;
  public haveTransferRole = false;
  public haveReceiveRole = false;

  /*
  * Id Entity
  */
  private id: number;

  private idWarehouseSource: number;
  private idWarehouseDestination: number;
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
  private transfertMvtToUpdate: StockDocument;
  public predicate: PredicateFormat;
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
  public NewAvailbleQuantity: number = 0;
  public isModalOpen = false;
  public isVisibleTransferMovementCode = false;
  /**
   * permissions
   */
   public hasUpdatePermission: boolean;
   public hasAddPermission: boolean;
   public hasDeletePermission: boolean;
   public hasValidatePermission: boolean;
   public hasReceivePermission: boolean;
   public hasTransferPermission: boolean;
   public hasPrintPermission: boolean;

  constructor(private formBuilder: FormBuilder, public stockDocumentsService: StockDocumentsService,
              public validationService: ValidationService, private router: Router, private messageService: MessageService,
              private activatedRoute: ActivatedRoute, public viewRef: ViewContainerRef, private swalWarrings: SwalWarring,
              protected growlService: GrowlService, protected translateService: TranslateService, private roleService: StarkRolesService,
              private itemService: ItemService,
              private serachItemSearvice: SearchItemService, private authService: AuthService, private fileServiceService: FileService
              ) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    });
    this.keyAction = (event) => {
      const keyName = event.key;
      /*escape keyboard click */
      if (keyName === KeyboardConst.ESCAPE && !this.isModalOpen) {
        this.closeEditor();
      }

    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);
    this.serachItemSearvice.closeFetchProductsModalSubject.subscribe((provisionId) => {
      this.closeItemModalEvent(provisionId);
    });
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
      Code: [''],
      DocumentDate: [new Date(), Validators.required],
      IdWarehouseSource: [undefined, Validators.required],
      IdWarehouseDestination: [undefined, Validators.required]
    });
    if(this.isUpdateMode && !this.hasUpdatePermission){
      this.transfertMovementForm.controls["DocumentDate"].disable();
    }
  }

  /**Select warehouse Source */
  warehouseSourceFocused($event) {
    this.changeListOfWarehouse($event, StockDocumentConstant.ID_WAREHOUSE_DESTINATION,
      this.transfertMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_SOURCE].value);
  }

  /**Select warehouse Destination */
  warehouseDestinationFocused($event) {
    this.changeListOfWarehouse($event, StockDocumentConstant.ID_WAREHOUSE_SOURCE,
      this.transfertMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_DESTINATION].value);
  }

  warehouseDestinationSelected($event) {
    this.changeItemDropdown($event.parent.value[StockDocumentConstant.ID_WAREHOUSE_SOURCE]);
    this.changeData();
  }

  /**
   * Change value of list of warehouse
   * @param $event
   * @param nameOfProperty
   * @param idSpecificWarehouse
   */
  changeListOfWarehouse($event, nameOfProperty, idSpecificWarehouse) {
    if (idSpecificWarehouse !== this.transfertMovementForm.value[nameOfProperty]) {
      idSpecificWarehouse = this.transfertMovementForm.value[nameOfProperty];
      // Init list of warehouse data source
      $event.warehouseDataSource = [];
      $event.warehouseDataSource = $event.warehouseDataSource.concat($event.listOfAllWarehouseDataSource);
      // Init list of filtred warehouse data source
      $event.warehouseDataSourceFiltred = [];
      $event.warehouseDataSourceFiltred = $event.warehouseDataSourceFiltred.concat($event.listOfAllWarehouseDataSource);
      if (this.transfertMovementForm.value[nameOfProperty]) {
        // Change list of warehouse data source
        $event.warehouseDataSourceFiltred.splice($event.warehouseDataSourceFiltred.findIndex(d => d.Id === idSpecificWarehouse), 1);
        // Change list of filtred warehouse data source
        $event.warehouseDataSource.splice($event.warehouseDataSource.findIndex(d => d.Id === idSpecificWarehouse), 1);
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
    if($event){
      // if stockDocumentLine is saved from list product model
      if($event.searchItemService.openedModalOptions && $event.searchItemService.openedModalOptions.data.stockDocumentLineSaved){
        this.closeItemModalEvent($event);
      } else {

      if (this.item.IdItem !== $event.itemForm.value[StockDocumentConstant.ID_ITEM]) {
        this.isSelectedItem = true;
      }
      this.item = $event.itemForm.value;
      if ($event.itemForm && $event.itemForm.value[StockDocumentConstant.ID_ITEM] && this.isSelectedItem) {
        this.itemService.getProductById($event.itemForm.value[StockDocumentConstant.ID_ITEM]).subscribe(data=>{
          if(data.IdUnitStockNavigation && data.IdUnitStockNavigation.IsDecomposable){
            this.formGroup.controls['ActualQuantity'].setValidators([Validators.min(0),Validators.max(NumberConstant.MAX_QUANTITY),
              digitsAfterComma(data.IdUnitStockNavigation.DigitsAfterComma),Validators.required])
          }else {
            this.formGroup.controls['ActualQuantity'].setValidators([Validators.min(0),Validators.max(NumberConstant.MAX_QUANTITY),
              isNumeric(),Validators.required])
          }
        });
          this.formGroup.controls[StockDocumentConstant.ACTUAL_QUANTITY].setValue(1);

        const model = {};
        model[StockDocumentConstant.ID_ITEM] = $event.itemForm.value[StockDocumentConstant.ID_ITEM];
        model[StockDocumentConstant.ID_WAREHOUSE] = this.transfertMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_SOURCE].value;
        model[StockDocumentConstant.ID] = $event.itemForm.value[StockDocumentConstant.ID];
        model[StockDocumentConstant.DATE] = this.transfertMovementForm.controls[StockDocumentConstant.DATE_FIELD].value;
        const objectToSend: ObjectToSend = new ObjectToSend(model);
          this.showAvalableQuantite = true;
          this.stockDocumentsService.getItemQtyInWarehouse(objectToSend).subscribe(res => {
          this.NewAvailbleQuantity = res.listData;
          this.formGroup.controls['AvailableQuantity'].setValidators(digitsAfterComma(NumberConstant.THREE));
          this.formGroup.controls['AvailableQuantity'].setValue(res.listData);
        });
      }
    }
  }
  }

  /**
* Prepare object to save
*/
  prepareObjectToSave(line: StockDocumentLine[]) {
    const dateDoc = this.transfertMovementForm.controls[StockDocumentConstant.DATE_FIELD].value;
    this.transfertMovementForm.controls[StockDocumentConstant.DATE_FIELD].setValue(
      new Date(Date.UTC(dateDoc.getFullYear(), dateDoc.getMonth(), dateDoc.getDate())));
    this.stockDocument = new StockDocument(line, this.documentCode.TransferMovement,
      this.transfertMovementForm.controls[StockDocumentConstant.DATE_FIELD].value,
      false,
      this.transfertMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_SOURCE].value,
      this.transfertMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_DESTINATION].value,
      documentStatusCode[StockDocumentConstant.PROVISIONAL],
      this.transfertMvtToUpdate ? this.transfertMvtToUpdate.Id : this.transfertMovementForm.controls[StockDocumentConstant.ID].value,
      this.transfertMvtToUpdate ? this.transfertMvtToUpdate.Code : this.transfertMovementForm.controls[StockDocumentConstant.CODE].value);
    this.objectToSave = new ObjectToSend(this.stockDocument);
  }


  save() {
    const stockDocumentLines: Array<StockDocumentLine> = new Array<StockDocumentLine>();
    this.prepareObjectToSave(stockDocumentLines);
    this.stockDocumentsService.saveStockDocumentInRealTime(this.objectToSave).subscribe(res => {
      if (!this.isUpdateMode) {
        this.setDocumentCodeAndIdAfterSave(res);
        if (res && res.Id) {
          this.id = res.Id;
          this.isSavedDocument = true;
          this.isUpdateMode = true;
          this.setValueTransfertMvt(res);
        }
        this.messageService.startSendMessage(res, InformationTypeEnum.INVENTORY_TRANSFER_MVT_ADD, null, false);
      }
    });
  }


  public setDocumentCodeAndIdAfterSave(data) {
    this.isVisibleTransferMovementCode = true;
    this.transfertMovementForm.controls['Id'].setValue(data.Id);
    this.transfertMovementForm.controls['Code'].setValue(data.Code);
  }


  /*
  *cancel changes
  */
  public cancelHandler(): void {
    this.closeEditor();
    this.showAvalableQuantite = false;
    if (this.view.data.length === 0) {
      this.isDisabled = false;
    }
  }

  private closeEditor() {
    this.grid.closeRow(this.editedRowIndex);
    this.isNew = false;
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
      if (isEdited || (this.formGroup && !this.formGroup.valid) || this.isInEditingMode || this.isFromRemove
      || this.transfertMvtToUpdate.IdDocumentStatus != NumberConstant.ONE) {
      this.isFromRemove = false;
      return;
    }
    this.showButtonAddLine = false;
    this.isSelectedItem = false;
    this.formGroup = createLineFormGroup(dataItem);
    if(this.formGroup && this.formGroup.controls['ActualQuantity']){
      if(dataItem && dataItem.IdItemNavigation ){
        if(dataItem.IdItemNavigation.IdUnitStockNavigation.IsDecomposable){
        this.formGroup.controls['ActualQuantity'].setValidators([Validators.min(0),Validators.max(NumberConstant.MAX_QUANTITY),
          digitsAfterComma(dataItem.IdItemNavigation.IdUnitStockNavigation.DigitsAfterComma),Validators.required])
      }else {
        this.formGroup.controls['ActualQuantity'].setValidators([Validators.min(0),Validators.max(NumberConstant.MAX_QUANTITY),
          isNumeric(),Validators.required])
      }
    }
    }
    this.formGroup.controls['AvailableQuantity'].disable();
    this.formGroup.controls[StockDocumentConstant.ID_ITEM].disable();
    this.item = this.formGroup.getRawValue();
    this.labelItem = dataItem.LabelItem;
    this.designation = dataItem.Designation;
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.formGroup);
    this.showAvalableQuantite = true;
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
      this.showButtonAddLine = false;
      this.formGroup = createLineFormGroup({
        'Id': 0,
        'IdItem': undefined,
        'ActualQuantity': 1,
        'LabelItem': undefined,
        'Designation': undefined,
        'IsDeleted': false,
        'IdStockDocument': undefined,
        'AvailableQuantity': 0
      });
      this.formGroup.controls['AvailableQuantity'].disable();
      this.isNew = true;
      this.isSelectedItem = true;
      this.formGroup.controls[StockDocumentConstant.ID_LINE].setValue(this.stockDocumentsService.counter);
      this.grid.addRow(this.formGroup);
      this.isDisabled = true;
      if (this.transfertMovementForm.controls['Id'].value <= 0) {
        this.save();
      }
    } else {
      this.showButtonAddLine = true;
      this.validationService.validateAllFormFields(this.transfertMovementForm);
    }
  }

  /*
* remove the current documentLine from the current data source
*/
  public removeLine({dataItem}) {
    this.swalWarrings.CreateSwal(ItemConstant.ITEM_DELETE_TEXT_MESSAGE,
      ItemConstant.ITEM_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.stockDocumentsService.removeDocumentLineInRealTime(dataItem.Id).subscribe(res => {
          this.getDocLineWithPaging();
          this.closeEditor();
          this.isDisabled = true;
        });
      }
    });
  }

  /**
   * Save current documentline
   **/
  public saveCurrent(): void {
    if (this.formGroup.valid) {
      this.showAvalableQuantite = true;
      if (!this.formGroup.controls[StockDocumentConstant.ID].value || this.formGroup.controls[StockDocumentConstant.ID].value == 0) {

        const filtredItem: ReducedItem = this.itemDropDown.itemDataSource.filter(x =>
          x.Id === this.formGroup.controls[StockDocumentConstant.ID_ITEM].value)[0];
        this.labelItem = filtredItem.Code;
        this.designation = filtredItem.Description;
        this.formGroup.controls[StockDocumentConstant.LABEL_ITEM].setValue(this.labelItem);
        this.formGroup.controls[StockDocumentConstant.DESIGNATION].setValue(this.designation);
      }


      this.counter = this.formGroup.controls[StockDocumentConstant.ID_LINE].value;
      this.formGroup.controls['IdStockDocument'].setValue(this.id);
      this.stockDocumentsService.saveStockDocumentLineInRealTime(this.formGroup.getRawValue()).subscribe(res => {
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
    document.removeEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);
  }

  validateTransfertMovement(): void {
    this.swalWarrings.CreateSwal(StockDocumentConstant.TEXT_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT,
      StockDocumentConstant.TITLE_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT,
      StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT).then((result) => {
      if (result.value) {
        this.stockDocumentsService.validateTransfertMovement(this.id).subscribe(res => {
          // send message
          this.messageService.startSendMessage(res, InformationTypeEnum.INVENTORY_TRANSFER_MVT_VALIDATION, null, false);
          this.router.navigate([StockDocumentConstant.URI_VALIDATED_ENTITY].concat(this.id.toString()));
        });
      }
    });
  }

  private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter.push(new Filter(StockDocumentConstant.ID, Operation.eq, this.id));
    this.predicate.Relation.push(new Relation(StockDocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION));
  }

  /**
   *  get data to update
   * */
  private getDataToUpdate(): void {
    this.preparePredicate();
    this.transfertMvtSubscription = this.stockDocumentsService.getModelByCondition(this.predicate).subscribe(data => {
      this.setValueTransfertMvt(data);
      this.getDocLineWithPaging();
    });
  }

  private getDocLineWithPaging(ifAfterSave?: boolean) {
    const documentLinesWithPaging = new DocumentLinesWithPaging(this.id, this.pageSize,
      this.skip, null, null, false);
    this.stockDocumentsService.getStockDocumentWithStockDocumentLine(documentLinesWithPaging).subscribe(x => {
      this.closeEditor();
      this.isDisabled = this.view.data.length !== 0 || (this.isUpdateMode && !this.hasUpdatePermission)
      this.initGridData(x.data);
      this.view.total = x.total;
      if (ifAfterSave) {
        this.addLine();
      }
    });

  }

  setValueTransfertMvt(data) {
    this.isVisibleTransferMovementCode = true;
    this.transfertMvtToUpdate = data;
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
        this.transfertMvtToUpdate.DocumentDate = new Date(this.transfertMvtToUpdate.DocumentDate);
      }
      this.transfertMovementForm.patchValue(this.transfertMvtToUpdate);

    }
  }

  initGridData(StockDocLine) {

    this.stockDocumentsService.lineData = [];
    this.stockDocumentsService.ObjectToSend = [];
    this.counter = 0;
    this.stockDocumentsService.counter = 0;
    if (StockDocLine && StockDocLine.length > 0) {
      StockDocLine.forEach((x) => {
        x.LabelItem = x.IdItemNavigation && x.IdItemNavigation.Code ? x.IdItemNavigation.Code : '';
        x.Designation = x.IdItemNavigation && x.IdItemNavigation.Description ?x.IdItemNavigation.Description : '';
        this.stockDocumentsService.saveStockDocumentLines(x, true);
        this.isDisabled = true;
      });
    }
    this.view.data = this.stockDocumentsService.LinesToAdd();
    let itemList = this.view.data.map(elt => elt.IdItemNavigation);
    this.loadItemsPicture(itemList);
  }

  private loadItemsPicture(itemList: Item[]) {
    var itemsPicturesUrls = [];
    itemList.forEach((item: Item) => {
      itemsPicturesUrls.push(item.UrlPicture);
    });
    if (itemsPicturesUrls.length > NumberConstant.ZERO) {
      this.itemService.getPictures(itemsPicturesUrls, false).subscribe(itemsPictures => {
        this.fillItemsPictures(itemList, itemsPictures);
      });
    }
  }

  private fillItemsPictures(itemList, itemsPictures) {
    itemList.map((item: Item) => {
      if (item.UrlPicture) {
        let dataPicture = itemsPictures.objectData.find(value => value.FulPath === item.UrlPicture);
        if (dataPicture) {
          this.view.data.filter(elt => elt.IdItem === item.Id)[NumberConstant.ZERO].image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }

  transfertValidateStockDocument() {
    this.objectToValidate = new ObjectToValidate(this.id);
    this.stockDocumentsService.transfertValidateStockDocument(this.objectToValidate).subscribe(res => {
      // send message
      this.messageService.startSendMessage(res, InformationTypeEnum.INVENTORY_TRANSFER_MVT_TRANSFERT, null, false);
      this.isTransfertForm = false;
      this.isReceiveForm = true;
    });
  }

  receiveValidateStockDocument() {
    this.objectToValidate = new ObjectToValidate(this.id);
    this.stockDocumentsService.receiveValidateStockDocument(this.objectToValidate).subscribe(res => {
      // send message
      this.messageService.startSendMessage(res, InformationTypeEnum.INVENTORY_TRANSFER_MVT_RECEIVE, null, false);
      this.isReceiveForm = false;
    });
  }

  ngOnInit() {
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_TRANSFER_MOVEMENT);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_TRANSFER_MOVEMENT);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_TRANSFER_MOVEMENT);
    this.hasValidatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_TRANSFER_MOVEMENT);
    this.hasReceivePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.RECIEVE_TRANSFER_MOVEMENT);
    this.hasTransferPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.TRANSFER_TRANSFER_MOVEMENT);
    this.hasPrintPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_TRANSFER_MOVEMENT);
    this.view = {
      data: undefined,
      total: 0
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
    return this.transfertMovementForm.valid && (this.transfertMovementForm.controls['Id'].value > 0);
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
    if (document.getElementsByName('ActualQuantity')) {
      document.getElementsByName('ActualQuantity')[0].focus();
      let mvq = document.getElementsByName('ActualQuantity')[0] as any;
      mvq.select();
    }
  }

  public setSelectQty() {
    let mvq = document.getElementsByName('ActualQuantity')[0] as any;
    mvq.select();
  }

  public movementQtyFoucusOut() {
    document.getElementById('btnSave').setAttribute('type', 'submit');
  }

  closeItemModalEvent($event) {
    if($event){
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
    return this.transfertMovementForm.get(StockDocumentConstant.CODE_FIELD) as FormControl;
  }

  checkDeletePossibility(): boolean {
    return this.transfertMvtToUpdate.IdDocumentStatusNavigation && this.transfertMvtToUpdate.IdDocumentStatusNavigation.Id === documentStatusCode.Provisional;
  }

  /**
   * Remove handler
   */
  public removeHandler() {
    this.swalWarrings.CreateSwal(StockDocumentConstant.DELETE_STOCK_MOVEMENT_TEXT,
      StockDocumentConstant.DELETE_STOCK_MOVEMENT_MESSAGE).then((result) => {
      if (result.value) {
        this.stockDocumentsService.remove(this.transfertMvtToUpdate).subscribe(() => {
          this.router.navigateByUrl(StockDocumentConstant.URI_LIST);
        });
      }
    });
  }

  public openModalEvent($event) {
    this.isModalOpen = true;
  }

  public closeModalEvent($event) {
    this.isModalOpen = false;
  }

  public onJasperPrintClick() { 
    const params = {
      idStockMovement: this.id
    };
       let documentDate = new Date(this.transfertMovementForm.controls["DocumentDate"].value);
       const documentName = "stock_movement_" + this.transfertMovementForm.controls['Code'].value + "_" + documentDate.getDay() + "_" 
       + documentDate.getMonth() + "_" + documentDate.getFullYear();
      const dataToSend = {
        'Id': this.id,
        'reportName': 'TransferMovement',
        'documentName': documentName,
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

 public showPrintButton(){
   return this.transfertMvtToUpdate ? this.transfertMvtToUpdate.IdDocumentStatus !== documentStatusCode.Provisional : false;
 }
}
