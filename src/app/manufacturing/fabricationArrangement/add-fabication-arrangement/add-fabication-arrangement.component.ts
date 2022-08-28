import {Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation, ViewRef} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DataStateChangeEvent, PageChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {dateValueGT, dateValueLT, ValidationService} from '../../../shared/services/validation/validation.service';
import {TranslateService} from '@ngx-translate/core';
import {ItemService} from '../../../inventory/services/item/item.service';
import {TiersService} from '../../../purchase/services/tiers/tiers.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {FabricationArrangementService} from '../../service/fabrication-arrangement.service';
import {FabricationArrangementConstant} from '../../../constant/manufuctoring/fabricationArrangement.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {PurchaseRequestConstant} from '../../../constant/purchase/purchase-request.constant';
import {Item} from '../../../models/inventory/item.model';
import {FabricationArrangement} from '../../../models/manufacturing/fabricationArrangement.model';
import {DatePipe} from '@angular/common';
import {PurchaseRequestService} from '../../../purchase/services/purchase-request/purchase-request.service';
import {NomenclaturesConstant} from '../../../constant/manufuctoring/nomenclature.constant';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {DetailOfService} from '../../service/detail-of.service';
import {OfProductLine} from '../../../models/manufacturing/ofProductLine.model';
import {DetailOfConstant} from '../../../constant/manufuctoring/detailOf.constant';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {ModalFabricationArrangement} from '../modal-fabrication-arragement/modal-fabrication-arrangement.component';
import {NomenclatureService} from '../../service/nomenclature.service';
import {OfMPDisponibility} from '../../../models/manufacturing/ofMPDisponibility.model';
import {ArticleChildren} from '../../../models/manufacturing/articleChildren.model';
import {ProductNomenclatureService} from '../../service/product-nomenclature.service';
import {ProductNomenclatureConstant} from '../../../constant/manufuctoring/productNomenclature.constant';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import {GammeService} from '../../service/gamme.service';
import {GammeConstant} from '../../../constant/manufuctoring/gamme.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {Observable} from 'rxjs/Observable';
import {DropdownProductItemsComponent} from '../../dropdown-product-items/dropdown-product-items.component';
import {Operation} from '../../../../COM/Models/operations';
import {AuthService} from '../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../Structure/permission-constant';

const UNAUTHRIZED_ERROR_MSG = 'UNAUTHRIZED_ERROR_MSG';
@Component({
  selector: 'app-add-fabication-arrangement',
  templateUrl: './add-fabication-arrangement.component.html',
  styleUrls: ['./add-fabication-arrangement.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddFabicationArrangementComponent implements OnInit {
  @ViewChild(DropdownProductItemsComponent) itemDropDown;
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  private subscription$: Subscription;
  public isUpdateMode = false;
  private idOfOnUpdate: number;
  public isValidItem = true;
  public customerType = TiersConstants.CUSTOMER_TYPE;
  public CHOOSE_CUSTOMER_PLACEHOLDER = SharedConstant.CHOOSE_CUSTOMER_PLACEHOLDER;
  public selectedSupplier: any;
  public formGroup: FormGroup;
  public ofLineFormGroup: FormGroup;
  private editedRowIndex: number;
  private btnEditVisible = false;
  public viewRef: ViewRef;
  public ofProductLineList: OfProductLine[] = [];
  public ofProductLineIdToDeleteList: number[] = [];
  public item: Item = new Item();
  public isEditable = true;
  public isSave = false;
  public editMode = false;
  public isValidateButtonVisible = false;
  public isTotallyLoaded = false;
  public minQuantitySeized = NumberConstant.ONE;
  public mpOfsDispo: OfMPDisponibility[] = [];
  private currentOf = new FabricationArrangement();
  // pager settings
  private currentPage = NumberConstant.ZERO;
  private size = NumberConstant.TEN;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public MANUFACTURINGPermissions = PermissionConstant.MANUFATORINGPermissions;
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: FabricationArrangementConstant.FABRICATION_LINE_ITEM_FIELD,
      title: FabricationArrangementConstant.FABRICATION_LINE_ITEM_TITLE,
      filterable: true,
    },
    {
      field: FabricationArrangementConstant.FABRICATION_LINE_QUANTITY_SEIZED_FIELD,
      title: FabricationArrangementConstant.FABRICATION_LINE_QUANTITY_SEIZED_TITLE,
      filterable: false,
    },
    {
      field: FabricationArrangementConstant.FABRICATION_LINE_QUANTITY_TO_MANUFACTURE_FIELD,
      title: FabricationArrangementConstant.FABRICATION_LINE_QUANTITY_TO_MANUFACTURE_TITLE,
      filterable: false,
    },
    {
      field: FabricationArrangementConstant.FABRICATION_LINE_UNITE_PRODUCT_FIELD,
      title: FabricationArrangementConstant.FABRICATION_LINE_UNITE_PRODUCT_TITLE,
      filterable: false,
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private modalService: ModalDialogInstanceService,
    private productNomenclatureService: ProductNomenclatureService,
    private nomenclatureService: NomenclatureService,
    private gammeService: GammeService,
    private viewContainerRef: ViewContainerRef,
    private formModalDialogService: FormModalDialogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private swalWarrings: SwalWarring,
    private validationService: ValidationService,
    private translate: TranslateService,
    private itemService: ItemService,
    private formBuilder: FormBuilder,
    private tiersService: TiersService,
    private growlService: GrowlService,
    private datePipe: DatePipe,
    private fabricationArrangementService: FabricationArrangementService,
    private purchaseRequestService: PurchaseRequestService,
    private detailOfService: DetailOfService) {
    this.currentOf.ofProductLines = [];
    this.activatedRoute.params.subscribe(params => {
      this.idOfOnUpdate = +params['id'] || NumberConstant.ZERO;
      this.isUpdateMode = this.idOfOnUpdate > NumberConstant.ZERO;
    });
  }

  public addHandler({sender}) {
    this.isValidItem = false;
    this.closeEditor(sender);
    this.initOfLineFormGroup(new OfProductLine());
    sender.addRow(this.ofLineFormGroup);
  }

  handleEditHandler() {
    this.editMode = true;
  }

  handledEditHandler() {
    this.editMode = false;
  }

  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender, -1);
    this.editedRowIndex = rowIndex;
    this.initOfLineFormGroup(dataItem);
    sender.editRow(rowIndex, this.ofLineFormGroup);
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
  }

  get id(): FormControl {
    return this.formGroup.get('id') as FormControl;
  }
  get reference(): FormControl {
    return this.formGroup.get('reference') as FormControl;
  }
  get idTiers(): FormControl {
    return this.formGroup.get('IdTiers') as FormControl;
  }

  get dateCreation(): FormControl {
    return this.formGroup.get('dateCreation') as FormControl;
  }

  get dateDelivery(): FormControl {
    return this.formGroup.get('dateDelivery') as FormControl;
  }

  get idItem(): FormControl {
    return this.ofLineFormGroup.get('IdItem') as FormControl;
  }

  get description(): FormControl {
    return this.ofLineFormGroup.get('description') as FormControl;
  }

  get idOfDetail(): FormControl {
    return this.ofLineFormGroup.get('of') as FormControl;
  }

  get quantitySeized(): FormControl {
    return this.ofLineFormGroup.get('quantitySeized') as FormControl;
  }

  get quantityToManufacture(): FormControl {
    return this.ofLineFormGroup.get('quantityToManufacture') as FormControl;
  }

  get unite(): FormControl {
    return this.ofLineFormGroup.get('unite') as FormControl;
  }

  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if (this.ofLineFormGroup.valid && this.isValidItem) {
      if (isNew) {
        this.addNewRow(formGroup);
      } else {
        this.setRowByIndex(formGroup, rowIndex);
      }
      sender.closeRow(rowIndex);
      this.loadOfLineList();
      this.gridSettings.gridData = {data: this.ofProductLineList, total: this.ofProductLineList.length};
    }
    this.validationService.validateAllFormFields(this.ofLineFormGroup);
  }

  private addNewRow(formGroup) {
    this.currentOf.ofProductLines.push({
      id: formGroup.value.id,
      idItem: formGroup.value.IdItem,
      description: this.item.Description,
      of: formGroup.value.of,
      quantitySeized: formGroup.value.quantitySeized,
      quantityToManufacture: formGroup.value.quantitySeized,
      unite: formGroup.value.unite,
      status: FabricationArrangementConstant.OF_IN_PROGRESS
    });
    this.setItemUnite(formGroup.value.IdItem, this.currentOf.ofProductLines.length - 1);
  }

  private setRowByIndex(formGroup, rowIndex) {
    if (!this.isProductExist(formGroup, rowIndex, true)) {
      this.currentOf.ofProductLines[rowIndex].idItem = this.idItem.value;
      this.currentOf.ofProductLines[rowIndex].description = this.item.Description;
      this.currentOf.ofProductLines[rowIndex].of = this.idOfDetail.value;
      this.currentOf.ofProductLines[rowIndex].quantitySeized = this.quantitySeized.value;
      this.currentOf.ofProductLines[rowIndex].quantityToManufacture = this.quantitySeized.value;
      this.setItemUnite(this.idItem.value, rowIndex);
    } else {
      this.growlService.warningNotification(this.translate.instant(FabricationArrangementConstant.IETM_ALREADY_EXIST));
    }
  }

  private closeEditor(grid: { closeRow: (arg0: number) => void; }, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.ofLineFormGroup = undefined;
    }
  }

  initGridData() {
    forkJoin(
      this.fabricationArrangementService.getJavaGenericService().getEntityById(this.idOfOnUpdate),
      this.detailOfService.getJavaGenericService().getEntityList(FabricationArrangementConstant.GET_DETAIL_OF_LIST_BY_OF_ID
        , this.idOfOnUpdate),
    ).subscribe(data => {
      this.currentOf = data[NumberConstant.ZERO] as FabricationArrangement;
      this.currentOf.ofProductLines = data[NumberConstant.ONE];
      this.patchOfFormGroup(data[NumberConstant.ZERO] as FabricationArrangement);
      this.mapOfProductLineList();
      this.loadOfLineList();
      this.checkOfStatus(data[0] as FabricationArrangement);
      this.gridSettings.gridData = {data: this.ofProductLineList, total: this.ofProductLineList.length};
    });
  }

  private goToOfList() {
    this.router.navigateByUrl(FabricationArrangementConstant.URI_FABRICATIONS);
  }

  public removeProductHandler(event: any) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        if (event.dataItem.id) {
          this.ofProductLineIdToDeleteList.push(event.dataItem.id);
        }
        this.currentOf.ofProductLines = this.currentOf.ofProductLines.filter(item => item.idItem !== event.dataItem.idItem);
        this.loadOfLineList();
      }
    });
  }

  /**
   * load data when the page change with pagination
   * @param event
   */  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / this.gridState.take;
    this.loadOfLineList();
  }

  private loadOfLineList() {
    this.ofProductLineList = [];
    let start = this.currentPage * this.gridState.take;
    let end = start + this.gridState.take;
    for (let i = start; i < end; i++) {
      if (this.currentOf.ofProductLines[i]) {
        this.ofProductLineList.push(this.currentOf.ofProductLines[i]);
      }
    }
    this.gridSettings.gridData = {data: this.ofProductLineList, total: this.currentOf.ofProductLines.length};
  }

  /**
   * when the page change , the active page change
   * @param state
   */
  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
  }

  /*
   * fetch product information form api dotnet and link every  product information with productNomenclature api Java
   */

  ngOnInit() {
    this.initOfFormGroup();
    if (this.idOfOnUpdate > NumberConstant.ZERO) {
      this.initGridData();
    } else {
      this.getLastReference();
    }
  }

  onProduitSelect($event: any) {
    if ($event && $event.itemFiltredDataSource && $event.itemForm && $event.itemForm.value[PurchaseRequestConstant.ID_ITEM]) {
      const itemValue: any[] = ($event.itemFiltredDataSource.filter(c => c.Id === $event.itemForm.value[PurchaseRequestConstant.ID_ITEM]));
      if (itemValue && itemValue.length > NumberConstant.ZERO) {
        this.item = itemValue[NumberConstant.ZERO];
        this.checkIfItemHasGamme(this.item.Id);
      }
    }
  }

  public isProductExist(form: FormGroup, rowIndex?: number, isLineModeUpdate?: boolean) {
    if (isLineModeUpdate && this.currentOf.ofProductLines[rowIndex].idItem === this.idItem.value) {
      return false;
    } else {
      return this.currentOf.ofProductLines.find(item => item.idItem === this.idItem.value) !== undefined;
    }
  }

  private setItemUnite(idItem, index) {
    this.purchaseRequestService.getItemDetails(idItem).subscribe(data => {
      this.currentOf.ofProductLines[index].unite = data[NomenclaturesConstant.PRODUCT_IdMeasureUnitNavigation][NomenclaturesConstant.PRODUCT_Description];
    });
  }

  private mapOfProductLineList() {
    const idsItems = [];
    this.currentOf.ofProductLines.forEach((ofProductLine: OfProductLine) => {
      idsItems.push(ofProductLine.idItem);
    });
    this.itemService.getItemListDetailByIds(idsItems).subscribe(items => {
      this.currentOf.ofProductLines.map((ofProductLine: OfProductLine) => {
        ofProductLine.description = this.getItemById(items, ofProductLine).Description;
        ofProductLine.unite = this.getItemById(items, ofProductLine).IdUnitSalesNavigation.Label;
        return ofProductLine;
      });
    }, () => {
    }, () => {
      this.prepareDataForModalBeforeOfValidation();
    });
  }

  private getItemById(items, ofProductLine: OfProductLine) {
    return items.find(item => item.Id === ofProductLine.idItem);
  }

  public initOfFormGroup() {
    this.formGroup = new FormGroup({
      id: new FormControl({value: '', disabled: true}),
      reference: new FormControl({value: '', disabled: true}),
      dateCreation: new FormControl('', Validators.required),
      IdTiers: new FormControl('', Validators.required),
      dateDelivery: new FormControl('', Validators.required),
      ofProductLines: new FormControl(this.ofProductLineList)
    });
    this.addDatesDependenceControls();
  }

  public onOfBtnSaveClick() {
    if (this.formGroup.valid && this.isValidItem && this.ofProductLineList.length > NumberConstant.ZERO && !this.checkOfHasProductLine()) {
      const ofToSave = this.formGroup.getRawValue() as FabricationArrangement;
      ofToSave.idTiers = this.idTiers.value;
      ofToSave.dateCreation = this.datePipe.transform(ofToSave.dateCreation, SharedConstant.YYYY_MM_DD_HH_MM_SS);
      ofToSave.dateDelivery = this.datePipe.transform(ofToSave.dateDelivery, SharedConstant.PIPE_FORMAT_DATE_DD_MM_YYYY);
      ofToSave.ofProductLines = this.ofProductLineList;
      this.subscription$ = this.fabricationArrangementService.getJavaGenericService()
        .saveEntity(ofToSave)
        .subscribe(data => {
          this.ofProductLineList.forEach(detailOf => {
            detailOf.of = {id: data.id};
          });
          this.detailOfService.getJavaGenericService().saveEntity(this.currentOf.ofProductLines,
            DetailOfConstant.DETAIL_OF_URL).subscribe(() => {
            this.deleteDetailOfLine();
            this.growlService.successNotification(this.translate.instant(FabricationArrangementConstant.SUCCESS_OPERATION));
            if (!this.isUpdateMode) {
              this.prepareDataForModalBeforeOfValidation();
              this.idOfOnUpdate = data.id;
            } else {
              this.goToOfList();
            }
          });
        });
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  onOfValidation() {
    if (this.isTotallyLoaded) {
      this.swalWarrings.CreateSwal(this.translate.instant(FabricationArrangementConstant.DO_YOU_WANT_TO_VALIDATE_OF),
        `${this.translate.instant(SharedConstant.ARE_YOU_SURE)}`,
        SharedConstant.YES, SharedConstant.NO).then((result) => {
        result.value ? this.openModalOrSaveOF() : this.goToOfList();
      });
    }
  }

  prepareDataForModalBeforeOfValidation() {
    this.ofProductLineList.forEach(parentProducts => {
      const mpOfDispo: OfMPDisponibility = new OfMPDisponibility();
      mpOfDispo.articleChildren = [];
      mpOfDispo.article = parentProducts.description;
      this.nomenclatureService.getJavaGenericService()
        .getEntityById(parentProducts.idItem, NomenclaturesConstant.GET_NOMENCLATURE_BY_PRODUCT_ID).flatMap((result) => {
        return this.productNomenclatureService.getJavaGenericService()
          .getEntityById(result.id, ProductNomenclatureConstant.GET_PRODUCT_BY_NOMENCLATURE);
      })
        .subscribe(allChildren => {
          let lastElementInAllChildren = NumberConstant.ZERO;
          allChildren.forEach(child => {
            const articleChildren: ArticleChildren = new ArticleChildren;
            forkJoin(
              this.itemService.getProductById(child.productId),
              this.itemService.getItemWarhouseOfSelectedItem(child.productId)
            ).subscribe(products => {
              articleChildren.components = products[NumberConstant.ZERO].Description;
              // tslint:disable-next-line:max-line-length
              articleChildren.remaining_quantity = this.calculateRemainingQuantity(child, this.calculateAllAvailableQuantityAllWarehouses(products[NumberConstant.ONE]), parentProducts.quantityToManufacture);
              mpOfDispo.articleChildren.push(articleChildren);
            }, () => {
            }, () => {
              ++lastElementInAllChildren;
              if (allChildren.length === lastElementInAllChildren) {
                this.isTotallyLoaded = true;
                if (!this.isUpdateMode && !this.isValidateButtonVisible) {
                  this.onOfValidation();
                }
              }
            });
          });
        });
      this.mpOfsDispo.push(mpOfDispo);
    });
  }

  openModalOrSaveOF() {
      if (this.authService.hasAuthorities([this.MANUFACTURINGPermissions.MANUFACTURING_VALIDATE_OF_PERMISSION])) {
        !this.prepareModalToBeOpendOrNot() ? this.openModal() : this.validerOf() ;
      } else {
          this.growlService.ErrorNotification(this.translate.instant(UNAUTHRIZED_ERROR_MSG));
          this.goToOfList();
      }
  }

  public openModal() {
    const dataToSend = this.mpOfsDispo
      .map(mpOfDispo => {
        mpOfDispo.articleChildren = mpOfDispo.articleChildren
          .filter(child => child.remaining_quantity < NumberConstant.ZERO);
        return mpOfDispo;
      });
    const idToBeSent = this.idOfOnUpdate;
    const modalTitle = FabricationArrangementConstant.DISPONIBLITY_MP;
    this.formModalDialogService.openDialog(modalTitle, ModalFabricationArrangement, this.viewContainerRef, this.isUpdateMode ? this.closeModal.bind(this) : this.goToOfList.bind(this),
      [dataToSend, idToBeSent], true, SharedConstant.MODAL_DIALOG_SIZE_L, true);
  }

  calculateAllAvailableQuantityAllWarehouses(allAvailableQuantityByWarehouses: any []): number {
    let calculateQuantity = 0;
    allAvailableQuantityByWarehouses.forEach(availableQuantity => calculateQuantity += availableQuantity.AvailableQuantity);
    return calculateQuantity;
  }


  validerOf() {
    this.subscription$ = this.fabricationArrangementService.getJavaGenericService()
      .getData(FabricationArrangementConstant.VALIDATE_OF_URL + '?id=' + this.idOfOnUpdate)
      .subscribe(() => {
        this.formGroup.disable();
        this.isEditable = false;
        this.isValidateButtonVisible = false;
        this.growlService.successNotification(this.translate.instant(FabricationArrangementConstant.SUCCESS_OPERATION));
      });
  }

  public closeModal() {
    this.modalService.closeAnyExistingModalDialog();
    this.isUpdateMode = true;
    this.isEditable = true;
    this.isValidateButtonVisible = true;
  }

  calculateRemainingQuantity(childProduct, quantityAvailableByProduct, productParentQuatity): number {
    return quantityAvailableByProduct === NumberConstant.ZERO ? NumberConstant.ZERO :
      quantityAvailableByProduct - (childProduct.quantity * productParentQuatity);
  }

  prepareModalToBeOpendOrNot(): boolean {
    return !(this.mpOfsDispo.findIndex(parentProducts =>
      parentProducts.articleChildren
        .findIndex(child => child.remaining_quantity < NumberConstant.ZERO) > NumberConstant.MINUS_ONE) > NumberConstant.MINUS_ONE);
  }

  private checkIfItemHasGamme(idItem: number) {
    this.isValidItem = false;
    this.gammeService.getJavaGenericService()
      .getEntityById(idItem, GammeConstant.GET_GAMME_BY_ITEM_URL)
      .subscribe(() => {
        this.isValidItem = true;
      });
  }

  private initOfLineFormGroup(ofLine?: OfProductLine): void {
    const positiveNumberPattern = '[0-9]+';
    this.ofLineFormGroup = new FormGroup({
      id: new FormControl(ofLine.id),
      of: new FormControl(ofLine.of),
      IdItem: new FormControl(ofLine.idItem, Validators.required),
      quantitySeized: new FormControl(ofLine.quantitySeized, [Validators.required, Validators.min(this.minQuantitySeized),
        Validators.pattern(positiveNumberPattern)]),
      quantityToManufacture: new FormControl({value: ofLine.quantityToManufacture, disabled: true}),
      unite: new FormControl({value: ofLine.unite, disabled: true}),
    });
  }

  private patchOfFormGroup(of: FabricationArrangement) {
    this.formGroup.patchValue({
      id: of.id,
      reference : of.reference,
      dateCreation: new Date(of.dateCreation),
      dateDelivery: new Date(this.datePipe.transform(of.dateDelivery, SharedConstant.YYYY_MM_DD_HH_MM_SS)),
      IdTiers: of.idTiers,
      ofProductLines: []
    });
  }

  private deleteDetailOfLine() {
    if (this.ofProductLineIdToDeleteList.length > NumberConstant.ZERO) {
      this.detailOfService.getJavaGenericService()
        .deleteList(FabricationArrangementConstant.DELETE_DETAIL_OF_BY_LIST_IDS + '?ids=' + this.ofProductLineIdToDeleteList)
        .subscribe();
    }
  }

  private checkOfStatus(of: FabricationArrangement) {
    if (of.status === FabricationArrangementConstant.STATUS_CREATED ||
      of.status === FabricationArrangementConstant.STATUS_LAUNCHED ||
      of.status === FabricationArrangementConstant.STATUS_PARTIALLY_LAUNCHED) {
      this.formGroup.disable();
      this.isEditable = false;
      this.isValidateButtonVisible = false;
    } else {
      this.isEditable = true;
      this.isValidateButtonVisible = true;
    }
  }

  private addDatesDependenceControls(): void {
    this.dateCreation.setValidators([Validators.required,
      dateValueLT(new Observable(o => o.next(this.dateDelivery.value)))]);
    this.dateDelivery.setValidators([Validators.required,
      dateValueGT(new Observable(o => o.next(this.dateCreation.value)))
    ]);
  }

  private checkOfHasProductLine() {
    if (this.ofProductLineList.length === NumberConstant.ZERO) {
      this.growlService.InfoNotification(this.translate.instant(FabricationArrangementConstant.OF_DETAIL_LINE_EMPTY));
      return true;
    } else {
      return false;
    }
  }

  onUpdateAnyField() {
    if (this.idOfOnUpdate) {
      this.isValidateButtonVisible = false;
    }
  }

  getLastReference() {
    this.fabricationArrangementService
      .callService(Operation.GET, FabricationArrangementConstant.FABRICATION_LAST_REFERENCE).subscribe(result => {
      this.formGroup.patchValue({
        reference: result.OF_REFERENCE
      });
    });
  }

  isPositiveQuantitySeized(e: KeyboardEvent) {
    if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 8)) {
      return false;
    }
  }
}
