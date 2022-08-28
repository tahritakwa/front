import { Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { Subscription } from 'rxjs/Subscription';
import { Item } from '../../../models/inventory/item.model';
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { Comment } from '../../../models/shared/comment.model';
import { ObjectToSave } from '../../../models/sales/object-to-save.model';
import { ObjectToSave as ObjectToSaveInShow } from '../../../models/shared/objectToSend';
import { DocumentService } from '../../../sales/services/document/document.service';
import { digitsAfterComma, isNumeric, strictSup, ValidationService } from '../../../shared/services/validation/validation.service';
import { Document } from '../../../models/sales/document.model';
import { PurchaseRequestService } from '../../services/purchase-request/purchase-request.service';
import { PurchaseRequestListGridComponent } from '../../components/purchase-request-list-grid/purchase-request-list-grid.component';
import { ItemDropdownComponent } from '../../../shared/components/item-dropdown/item-dropdown.component';
import { PurchaseRequestConstant } from '../../../constant/purchase/purchase-request.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { MessageService } from '../../../shared/services/signalr/message/message.service';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { CommentService } from '../../../shared/services/signalr/comment/comment.service';
import { CreatedData } from '../../../models/shared/created-data.model';
import { DepotDropdownComponent } from '../../../shared/components/depot-dropdown/depot-dropdown.component';
import { WarehouseService } from '../../../inventory/services/warehouse/warehouse.service';
import { WarehouseItemService } from '../../../inventory/services/warehouse-item/warehouse-item.service';
import { Warehouse } from '../../../models/inventory/warehouse.model';
import { EnumValues } from 'enum-values';
import { PurchaseRequestPriority } from '../../../models/enumerators/purchaseRequestPriority.enum';
import { TranslateService } from '@ngx-translate/core';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import NumberFormatOptions = Intl.NumberFormatOptions;
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-purchase-request-add',
  templateUrl: './purchase-request-add.component.html',
  styleUrls: ['./purchase-request-add.component.scss']
})
export class PurchaseRequestAddComponent implements OnInit, OnDestroy {
  @ViewChild(ItemDropdownComponent) itemDropDown;
  /*
 * is updateMode
 */
  public isUpdateMode: boolean;

  public purchaseRequestAddFormGroup: FormGroup;

  public documentLines: DocumentLine[] = [];
  public ListToValidatePermission = false;
  /*
 * Id Entity
 */
  private id: number;

  private idDocumentLine: number;

  private item: Item = new Item();

  public documentLine: DocumentLine;
  @Input() DocumentDate: Date;

  private creationDate: Date;
  /*
* active to update
*/
  private purchaseRequestToUpdate: Document;

  /*
 * id Subscription
 */
  private idSubscription: Subscription;
  idCommentToEdit = NumberConstant.ZERO;
  toEditComent: Comment;
  private purchaseRequestSubscription: Subscription;

  public document: Document;
  public documentDetails: Document;
  private objectToSend: ObjectToSave;
  public Code: string;

  @ViewChild(ItemDropdownComponent) childItem;

  @ViewChild(PurchaseRequestListGridComponent) gridMyPurchaseRequest;

  public commentsData: Comment[];
  public priorityDataSource = [];
  private warehouseInstance: DepotDropdownComponent;

  private idTiers: number;
  public errorItem = false;
  public formatOption: NumberFormatOptions;
  public haveUpdatePermission = false;
  public haveAddPermission = false;
  public isForShow = false;
  public isValidateMode = false;
  public validatePurchaseRequestPermission = false;
  public refusePurchaseRequestPermission = false;
  private objectToSendInShow: ObjectToSaveInShow;
  public isProvisional = false;
  constructor(private fb: FormBuilder, private purchaseRequestService: PurchaseRequestService,
    private activatedRoute: ActivatedRoute, private router: Router, private translateService: TranslateService,
    private messageService: MessageService, private commentService: CommentService, private swalWarrings: SwalWarring,
    private itemPricesService: DocumentService, private validationService: ValidationService,
    public viewRef: ViewContainerRef, private warehouseService: WarehouseService, private translate: TranslateService,
    private warehouseItemService: WarehouseItemService, private growlService: GrowlService, public authService: AuthService,
    private localStorageService: LocalStorageService) {
    this.isForShow = this.activatedRoute && this.activatedRoute.snapshot ? this.activatedRoute.snapshot.data.action == "show" : false;
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    });

    this.warehouseInstance = new DepotDropdownComponent(this.warehouseService, this.warehouseItemService);
    this.warehouseInstance.initDataSource();

  }

  private preparePriorityDropdown() {
    const priorityEnumValues = EnumValues.getNamesAndValues(PurchaseRequestPriority);
    priorityEnumValues.forEach(priority => {
      const element = priority;
      element.name = this.translateService.instant(element.name.toUpperCase());
      this.priorityDataSource.push(element);
    });
  }  

  /* Item drpodown change value*/
  onSelect($event) {
    if ($event && $event.itemFiltredDataSource && $event.itemForm && $event.itemForm.value[PurchaseRequestConstant.ID_ITEM]) {
      const itemValue: any[] = ($event.itemFiltredDataSource.filter(c => c.Id === $event.itemForm.value[PurchaseRequestConstant.ID_ITEM]));
      if (itemValue && itemValue.length > 0) {
        this.item = itemValue[0];
        this.getItemPrices();
      }
    }
  }

  /**
   *Get Item details
   */
  private getItemPrices() {
    if (this.item.Id && this.purchaseRequestAddFormGroup.dirty) {
      // Recuperate details of item
      this.purchaseRequestService.getItemDetails(this.item.Id).subscribe(data => {
        this.documentLine = data;
        this.formatOption = data.IdSupplier ? data.IdSupplier.FormatOption : null;
        if (!data.IdMeasureUnit) {
          this.growlService.ErrorNotification(this.translate.instant(PurchaseRequestConstant.ITEM_WITHOUT_MEASURE_UNIT));
          this.errorItem = true;
        }
        if (data.IdMeasureUnitNavigation && data.IdMeasureUnitNavigation.IsDecomposable) {
          this.purchaseRequestAddFormGroup.controls['MovementQty'].setValidators([Validators.required, Validators.max(NumberConstant.MAX_QUANTITY),
          digitsAfterComma(data.IdMeasureUnitNavigation.DigitsAfterComma), strictSup(0)]);
        } else {
          this.purchaseRequestAddFormGroup.controls['MovementQty'].setValidators([Validators.required, Validators.max(NumberConstant.MAX_QUANTITY),
          isNumeric(), strictSup(0)]);
        }
        // Patch value
        this.patchValueOfAddFormGroup();
      });
    }
  }

  /**
   * Patch value of purchaseRequestAddFormGroup from Item details
   * */
  private patchValueOfAddFormGroup() {
    const idMesureNavigation = this.documentLine.IdMeasureUnitNavigation;
    this.purchaseRequestAddFormGroup.patchValue({
      IdItem: this.documentLine.IdItem,
      MovementQty: this.documentLine.MovementQty,
      Requirement: this.documentLine.Requirement,
      IdMeasureUnit: this.documentLine.IdMeasureUnit,
      LabelMeasureUnit: idMesureNavigation ? idMesureNavigation.Label : '',
      HtAmountWithCurrency: this.documentLine.HtAmountWithCurrency,
      DocumentHtpriceWithCurrency: this.calculateHtUnitAmountWithCurrency(this.documentLine.MovementQty,
        this.documentLine.HtAmountWithCurrency),
      HtUnitAmountWithCurrency: this.documentLine.HtAmountWithCurrency,
      HtTotalLineWithCurrency: this.calculateHtUnitAmountWithCurrency(this.documentLine.MovementQty,
        this.documentLine.HtAmountWithCurrency)
    });
  }

  /**
   * Detect change value of quantity
   */
  updateQty() {
    // Recalcul total [DocumentHtpriceWithCurrency]
    this.purchaseRequestAddFormGroup.patchValue({
      DocumentHtpriceWithCurrency: this.calculateHtUnitAmountWithCurrency(this.purchaseRequestAddFormGroup.get(
        PurchaseRequestConstant.MOUVEMENT_QTY).value,
        this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.HT_AMOUNT_WITH_CURRECY).value),

      HtTotalLineWithCurrency: this.calculateHtUnitAmountWithCurrency(this.purchaseRequestAddFormGroup.get(
        PurchaseRequestConstant.MOUVEMENT_QTY).value,
        this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.HT_AMOUNT_WITH_CURRECY).value)
    });
  }

  /**
   * Calculate Total
   * @param qty
   * @param htAmountWithCurrency
   */
  calculateHtUnitAmountWithCurrency(qty: number, htAmountWithCurrency: number): number {
    let sum = 0;
    if (qty > 0 && htAmountWithCurrency > 0) {
      sum = qty * htAmountWithCurrency;
    }
    return sum;
  }

  /**
   * Prepare list of documentLines from value of purchaseRequestAddFormGroup
   */
  prepareListOfDocumentLines() {
    this.documentLines = [];
    let purchaseRequestDocumentLine: DocumentLine;

    if (this.item && this.item.IdNatureNavigation && this.item.IdNatureNavigation.IsStockManaged) {
      const centralWarehouse: Warehouse = this.warehouseInstance.getCentralWarehouse();
      purchaseRequestDocumentLine = new DocumentLine(
        this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.ID_ITEM).value, null, null, centralWarehouse);
    } else {
      purchaseRequestDocumentLine = new DocumentLine(
        this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.ID_ITEM).value);
      purchaseRequestDocumentLine.IdWarehouse = null;
    }
    purchaseRequestDocumentLine.IdItem = this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.ID_ITEM).value;
    purchaseRequestDocumentLine.IdMeasureUnit = this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.ID_MEASURE_UNIT).value;
    purchaseRequestDocumentLine.LabelMeasureUnit = this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.LABEL_MEASURE_UNIT).value;
    purchaseRequestDocumentLine.MovementQty = this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.MOUVEMENT_QTY).value;
    purchaseRequestDocumentLine.HtAmountWithCurrency = this.purchaseRequestAddFormGroup.get(
      PurchaseRequestConstant.HT_AMOUNT_WITH_CURRECY).value;
    purchaseRequestDocumentLine.HtUnitAmountWithCurrency = this.purchaseRequestAddFormGroup.get(
      PurchaseRequestConstant.HT_UNIT_AMOUNT_WITH_CURRECY).value;
    purchaseRequestDocumentLine.Requirement = this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.REQUIREMENT).value;
    purchaseRequestDocumentLine.IdDocument = this.id;
    purchaseRequestDocumentLine.Id = this.idDocumentLine;
    purchaseRequestDocumentLine.IdDocumentLineStatus = documentStatusCode[DocumentConstant.PROVESOIRE];
    purchaseRequestDocumentLine.HtTotalLineWithCurrency = this.purchaseRequestAddFormGroup.get('HtTotalLineWithCurrency').value;
    this.documentLines.push(purchaseRequestDocumentLine);
  }

  /**
   * Prepare Document entity
   */
  prepareDocument() {
    this.documentDetails = new Document();
    this.documentDetails.Id = this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.ID).value;
    this.documentDetails.DocumentDate = this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.DOCUMENT_DATE).value;
    this.documentDetails.CreationDate = this.creationDate;
    this.documentDetails.AskedByRequest = this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.ASKED_BY_REQUEST).value;
    this.documentDetails.TransactionUserId = this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.TRANSACTION_USER_ID).value;
    this.documentDetails.DocumentHtpriceWithCurrency = this.purchaseRequestAddFormGroup.get(
      'DocumentHtpriceWithCurrency').value;
    this.documentDetails.DocumentTypeCode = DocumentEnumerator.PurchaseRequest;

    this.documentDetails.Code = this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.CODE).value;
    this.documentDetails.IdDocumentStatus = documentStatusCode[DocumentConstant.PROVESOIRE];
    this.documentDetails.IdTiers = this.item != null ? this.item.IdTiers : null;
    this.documentDetails.IdCurrency = (this.item != null && this.item.IdTiersNavigation) ? this.item.IdTiersNavigation.IdCurrency : this.documentLine.IdSupplier != null ?
      this.documentLine.IdSupplier.IdCurrency : this.documentLine.IdTiersNavigation.IdCurrency;
    this.documentDetails.IdTiers = this.documentLine.IdSupplier != null ? this.documentLine.IdSupplier.Id : this.documentLine.IdTiersNavigation.Id;
    this.documentDetails.DocumentTtcpriceWithCurrency = this.purchaseRequestAddFormGroup.get(
      'HtTotalLineWithCurrency').value;
    this.documentDetails.Priority = this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.PRIORITY).value;
  }

  /**
   * Prepare object to save
   */
  prepareObjectToSave() {
    this.prepareListOfDocumentLines();
    this.prepareDocument();
    this.document = new Document(this.documentLines, this.documentDetails, null);
    this.objectToSend = new ObjectToSave(this.document);
  }
  prepareObjectToSaveInshow(isValidateAction: boolean) {
    this.objectToSendInShow = new ObjectToSaveInShow();
    this.objectToSendInShow.Model = new Object();
    this.objectToSendInShow.Model['IdDocument'] = this.id.toString();
    if (isValidateAction) {
      this.objectToSendInShow.Model['Status'] = documentStatusCode.Valid.toString();
    } else {
      this.objectToSendInShow.Model['Status'] = documentStatusCode.Refused.toString();
    }
  }
  /**
   * Add purchase request
   */
  public onAddPurchaseRequestClick(): void {
    if (this.purchaseRequestAddFormGroup.valid) {
      this.prepareObjectToSave();
      if (this.isUpdateMode) {
        this.itemPricesService.editDocument(this.objectToSend).subscribe();
      } else {
        this.itemPricesService.saveCurrentDocument(this.objectToSend.Model).subscribe(res => {
          this.Code = res.Code;
          // send message
          this.messageService.startSendMessage(res, InformationTypeEnum.PURCHASE_PURCHASE_REQUEST_ADD, null, false, true);
          this.router.navigate(['/main/purchase/purchaserequest'], { skipLocationChange: true });
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.purchaseRequestAddFormGroup);
    }
  }

  /**
   * Reset purchaseRequestAddFormGroup
   */
  private cleanFields(): void {
    this.Code = '';
    this.purchaseRequestAddFormGroup.reset();
  }

  /*
   * Prepare Add form component
   */
  private createAddForm(): void {
    // Get current user data
    const user = this.localStorageService.getUser();
    // Get the FirstName and LastName of current user
    const askedByRequest = user.FirstName.concat(' ').concat(user.LastName);
    // Prepare the formGroup [purchaseRequestAddFormGroup]
    this.purchaseRequestAddFormGroup = this.fb.group({
      Id: [0],
      Code: [''],
      AskedByRequest: [askedByRequest],
      DocumentDate: [new Date()],
      TransactionUserId: [user.IdUser],
      DocumentLine: [undefined],
      IdItem: [undefined, Validators.required],
      IdMeasureUnit: [undefined],
      LabelMeasureUnit: [''],
      MovementQty: [1, [Validators.required, strictSup(0)]],
      HtAmountWithCurrency: [0],
      HtUnitAmountWithCurrency: [0],
      DocumentHtpriceWithCurrency: [0],
      Requirement: [''],
      Message: [''],
      HtTotalLineWithCurrency: [0],
      Priority: ['']
    });
    if (this.isForShow) {
      this.purchaseRequestAddFormGroup.controls["IdItem"].disable();
      this.purchaseRequestAddFormGroup.controls["MovementQty"].disable();
      this.purchaseRequestAddFormGroup.controls["Requirement"].disable();
    }
  }

  /**
   * Get data to Update
   */
  private getDataToUpdate() {
    this.purchaseRequestSubscription = this.purchaseRequestService.getDocumentWithDocumentLine(this.id).subscribe(data => {
      this.purchaseRequestToUpdate = data;
      this.formatOption = data.IdTiersNavigation ? data.IdTiersNavigation.FormatOption : null;
      if (this.purchaseRequestToUpdate) {
        if (this.purchaseRequestToUpdate.IdDocumentStatus === documentStatusCode['Provisional'] && this.isForShow) {
          this.isValidateMode = true;
        }
        if (this.purchaseRequestToUpdate.IdDocumentStatus === documentStatusCode['Provisional']) {
          this.isProvisional = true;
        }
        this.commentsData = this.purchaseRequestToUpdate.Comments;
        this.commentsData.forEach((x) => {
          this.getSrcPictureEmployee(x);
        });
        if (!this.haveUpdatePermission) {
          this.purchaseRequestAddFormGroup.disable();
        }
        if (data.DocumentLine[0].IdMeasureUnitNavigation.IsDecomposable) {
          this.purchaseRequestAddFormGroup.controls['MovementQty'].setValidators([Validators.required, Validators.max(NumberConstant.MAX_QUANTITY),
          digitsAfterComma(data.DocumentLine[0].IdMeasureUnitNavigation.DigitsAfterComma), strictSup(0)]);
        } else {
          this.purchaseRequestAddFormGroup.controls['MovementQty'].setValidators([Validators.required, Validators.max(NumberConstant.MAX_QUANTITY),
          isNumeric(), strictSup(0)]);
        }
        this.creationDate = this.purchaseRequestToUpdate.CreationDate;
        this.Code = this.purchaseRequestToUpdate.Code;
        this.purchaseRequestAddFormGroup.patchValue(this.purchaseRequestToUpdate);
        if (this.purchaseRequestToUpdate.DocumentLine && this.purchaseRequestToUpdate.DocumentLine.length > 0) {
          this.documentLine = this.purchaseRequestToUpdate.DocumentLine[0];
          this.documentLine.IdTiersNavigation = data.IdTiersNavigation;
          this.idDocumentLine = this.documentLine.Id;
          this.patchValueOfAddFormGroup();
          this.itemDropDown.ngOnInit();
          if (this.purchaseRequestAddFormGroup.value[PurchaseRequestConstant.ID_ITEM] != null) {
            if (this.childItem && this.childItem.listOfAllItemDataSource && this.childItem.listOfAllItemDataSource.length > 0) {
              const listOfItem = this.childItem.listOfAllItemDataSource.filter(c =>
                c.Id === this.purchaseRequestAddFormGroup.value[PurchaseRequestConstant.ID_ITEM]);
              this.item = (listOfItem && listOfItem.length > 0) ? listOfItem[0] : undefined;
            }
          }
        }
      }
    });
  }

  /**
   * Add comment
   * */
  private addComment(): void {
    if (this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.MESSAGE).value) {
      // Prepare comment entity
      const commentEntity: Comment = new Comment();
      commentEntity.Id = NumberConstant.ZERO;
      if (this.toEditComent) {
        Object.assign(commentEntity, this.toEditComent);
      }
      commentEntity.Message = this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.MESSAGE).value;
      commentEntity.CreationDate = new Date();
      commentEntity.IdEntityCreated = this.id;
      commentEntity.IdCreator = this.localStorageService.getUserId();
      commentEntity.EmailCreator = this.localStorageService.getUser().Email
      commentEntity.EntityName = 'Document';
      this.commentService.save(commentEntity, this.idCommentToEdit === NumberConstant.ZERO).subscribe(res => {
        if (res) {
          const createdData: CreatedData = new CreatedData(this.purchaseRequestToUpdate.Id, this.purchaseRequestToUpdate.Code);
          this.commentService.startSendComment(commentEntity, this.purchaseRequestToUpdate.TransactionUserId, createdData,
            InformationTypeEnum.ADD_COMMENT_PURCHASE_REQUEST_SHOW, InformationTypeEnum.ADD_COMMENT_PURCHASE_REQUEST_UPDATE);
        }
        if (this.idCommentToEdit) {
          const index = this.commentsData.findIndex(x => x.Id === this.idCommentToEdit);
          this.commentsData[index] = commentEntity;
          this.idCommentToEdit = NumberConstant.ZERO;
          this.toEditComent = null;
        } else {
          this.commentsData.push(res);
          res = this.getSrcPictureEmployee(res);
          this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.MESSAGE).reset();
        }
      });

    } else {
      this.purchaseRequestAddFormGroup.get(PurchaseRequestConstant.MESSAGE).markAsPending();
    }
  }

  /**
   * Get src of picture employee
   * */
  private getSrcPictureEmployee(comment: Comment): Comment {
    if (comment.Employee && comment.Employee.PictureFileInfo && comment.Employee.PictureFileInfo.Data) {
      comment.SrcPictureEmployee = 'data:image/png;base64,'.concat(comment.Employee.PictureFileInfo.Data);
    } else {
      comment.SrcPictureEmployee = '../../../../assets/image/user-new-icon.png';
    }
    return comment;
  }

  /**
   * on destroy
   * */
  ngOnDestroy(): void {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.purchaseRequestSubscription) {
      this.purchaseRequestSubscription.unsubscribe();
    }
    this.commentService.destroyCommentHubConnection();
  }


  /**
   * subscribe on notication list
   * */
  private subscribeOnCommentList(): void {
    this.purchaseRequestSubscription = this.commentService.listCommentSubject
      .subscribe((data: Comment) => {
        this.getSrcPictureEmployee(data);
        this.commentsData.push(data);
      });
  }

  ngOnInit() {
    this.ListToValidatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_PURCHASE_REQUEST);
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_PURCHASE_REQUEST);
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_PURCHASE_REQUEST);
    this.validatePurchaseRequestPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_PURCHASE_REQUEST);
    this.refusePurchaseRequestPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.REFUSE_PURCHASE_REQUEST);
    // Prepare Add form component
    this.createAddForm();
    this.preparePriorityDropdown();
    this.isUpdateMode = this.id > 0;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
      this.commentService.initCommentHubConnection();
      this.subscribeOnCommentList();
    }
  }
  /**
   * delete comment
   * @param idComment
   */

  deleteComment(idComment: number) {
    this.swalWarrings.CreateSwal(PurchaseRequestConstant.COMMENT_DELETE_TEXT_MESSAGE,
      PurchaseRequestConstant.COMMENT_DELETE_TITLE_MESSAGE).then((result) => {
        if (result.value) {
          const element = this.commentsData.find(x => x.Id === idComment);
          if (element) {
            this.commentService.remove(element).subscribe(() => {
              const index = this.commentsData.findIndex(x => x.Id === idComment);
              this.commentsData.splice(index, NumberConstant.ONE);
            });
          }
        }
      });
  }
  /**
   * edit comment
   * @param idComment
   */
  editcomment(idComment: number) {
    const element = this.commentsData.find(x => x.Id === idComment);
    if (element) {
      this.purchaseRequestAddFormGroup.controls['Message'].setValue(element.Message);
      this.idCommentToEdit = element.Id;
      this.toEditComent = element;
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.UNAUTHRIZED_ERROR_MSG));
    }
  }
  onValidateOrRefusePurchaseRequestClick(isValidateAction: boolean): void {
    if (this.purchaseRequestAddFormGroup) {
      this.prepareObjectToSaveInshow(isValidateAction);
      this.purchaseRequestService.validateOrRejectDocument(this.objectToSendInShow).subscribe(res => {
        this.router.navigate(['/main/purchase/purchaserequest/']);
        let msgInformationType: InformationTypeEnum = InformationTypeEnum.PURCHASE_PURCHASE_REQUEST_VALIDATION;
        // send message
        if (!isValidateAction) {
          msgInformationType = InformationTypeEnum.PURCHASE_PURCHASE_REQUEST_REFUSE;
        }
        this.messageService.startSendMessage(res, msgInformationType, null, false, true);
      });
    }
  }

}
