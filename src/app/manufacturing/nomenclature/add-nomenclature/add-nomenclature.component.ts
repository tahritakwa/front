import {Component, OnDestroy, OnInit, ViewChild, ViewRef} from '@angular/core';
import {NomenclaturesConstant} from '../../../constant/manufuctoring/nomenclature.constant';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EnumValues} from 'enum-values';
import {ActivatedRoute, Router} from '@angular/router';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {NomenclatureService} from '../../service/nomenclature.service';
import {ItemService} from '../../../inventory/services/item/item.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {Nomenclature} from '../../../models/manufacturing/nomenclature.model';
import {ProductLine} from '../../../models/manufacturing/productLine.model';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {NomenclatureType} from '../../../models/enumerators/nomenclature-type.enum';
import {ProductNomenclatureService} from '../../service/product-nomenclature.service';
import {ProductNomenclatureConstant} from '../../../constant/manufuctoring/productNomenclature.constant';
import {Item} from '../../../models/inventory/item.model';
import {Subscription} from 'rxjs/Subscription';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {flatMap} from 'rxjs/operators';
import {PurchaseRequestService} from '../../../purchase/services/purchase-request/purchase-request.service';
import {Observable} from 'rxjs/Observable';
import {ItemQuantity} from '../../../models/manufacturing/item-quantity';
import {CellClickEvent, DataStateChangeEvent, GridComponent, PageChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {CompanyService} from '../../../administration/services/company/company.service';
import {ItemDropdownComponent} from '../../../shared/components/item-dropdown/item-dropdown.component';
import {FabricationArrangementConstant} from '../../../constant/manufuctoring/fabricationArrangement.constant';
import {FabricationArrangementService} from '../../service/fabrication-arrangement.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {FiltersItemDropdown} from '../../../models/shared/filters-item-dropdown.model';
import {Operation as Op} from '../../../../COM/Models/operations';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {preparePredicateFilterToGetCostPrice} from '../../manufactoring-shared/prepare-predicate-cost-price';
import {DropdownProductItemsComponent} from '../../dropdown-product-items/dropdown-product-items.component';
import {send} from 'process';
import {KeyboardConst} from '../../../constant/keyboard/keyboard.constant';
import {SearchConstant} from '../../../constant/search-item';

@Component({
  selector: 'app-add-nomenclature',
  templateUrl: './add-nomenclature.component.html',
  styleUrls: ['./add-nomenclature.component.scss']
})
export class AddNomenclatureComponent implements OnInit, OnDestroy {
  @ViewChild(DropdownProductItemsComponent) itemDropDown;
  private subscription$: Subscription;
  public isUpdateMode = false;
  public nomenclature = new Nomenclature();
  private item = new Item();
  private editedRowIndex: number;
  public productLineFormGroup: FormGroup;
  public SelectedItem;
  public idNomenclatureOnUpdate: number;
  public formGroup: FormGroup;
  public hideSearch = true;
  public isSave = false;
  public rowProductsList: Array<{
    id?: number, productId: string, quantity: any, tauxChute: any, quantityChute: any, quantityNet: any,
    nomenclature: any, description: string, unite?: string, unitHtpurchasePrice?: any, HtTotalAmount?: any
  }> = [];
  public btnEditVisible: boolean;
  public getTypesFromEnum = NomenclatureType;
  public typesList: any = [];
  public viewRef: ViewRef;
  private quantity: number;
  public data: any[] = [];
  public productOnUpdate: any;
  public editMode = false;
  private keyAction: (event: any) => void;
  public montantTotal = 0;
  public currency: any;
  public itemClicked: number;
  public countTotalInsert = 0;
  private currentPage = NumberConstant.ZERO;
  private size = NumberConstant.TEN;
  public usedInProgressFabricationArrangnement = false;
  public product: any;
  public filtersItemDropdown = new FiltersItemDropdown();
  public nomenclatureReference = '';
  // pager settings

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public isPF;
  public isPSF;
  public selectedValue: NomenclatureType = this.typesList[NumberConstant.ONE];
  public gridStateNomenclatures: DataSourceRequestState = {
    skip: 0,
    take: this.size,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: NomenclaturesConstant.PRODUCT_ID_FILIED,
      title: NomenclaturesConstant.PRODUCT_ID_TITLE,
      filterable: true,
    },
    {
      field: NomenclaturesConstant.REFERENCE_FILIED,
      title: NomenclaturesConstant.REFERENCE_TITLE,
      filterable: true
    },
    {
      field: NomenclaturesConstant.TYPE_NOMENCLATURE_FILIED,
      title: NomenclaturesConstant.TYPE_NOMENCLATURE_TITLE,
      filterable: false,
    }
  ];

  public columnsConfigProducts: ColumnSettings[] = [
    {
      field: NomenclaturesConstant.PRODUCT_NAME_FILIED,
      title: NomenclaturesConstant.PRODUCT_ARTICLE_NAME_TITLE,
      filterable: false,
    },

    {
      field: NomenclaturesConstant.PRODUCT_NAME_QUANTITE_FILIED,
      title: NomenclaturesConstant.PRODUCT_NAME_QUANTITE_TITLE,
      filterable: false,
    },
    {
      field: NomenclaturesConstant.PRODUCT_NAME_UNITE_FILIED,
      title: NomenclaturesConstant.PRODUCT_NAME_UNITE_TITLE,
      filterable: false,
    },
    {
      field: NomenclaturesConstant.UNIT_HT_PURCHASE_PRICE_FILIED,
      title: NomenclaturesConstant.UNIT_HT_PURCHASE_PRICE_TITLE,
      filterable: false,
    },
    {
      field: NomenclaturesConstant.TAUX_CHUTE_FILIED,
      title: NomenclaturesConstant.TAUX_CHUTE_TITLE,
      filterable: false,
    },
    {
      field: NomenclaturesConstant.QUANTITY_CHUTE_FILIED,
      title: NomenclaturesConstant.QUANTITY_CHUTE_TITLE,
      filterable: false,
    },
    {
      field: NomenclaturesConstant.QUANTITY_NET_FILIED,
      title: NomenclaturesConstant.QUANTITY_NET_TITLE,
      filterable: false,
    }
  ];
  public gridSettingsNomenclatures: GridSettings = {
    state: this.gridStateNomenclatures,
    columnsConfig: this.columnsConfigProducts
  };
  public allChildrenByProductParent: Observable<any>;
  public loadComponentNomenclatureTreeView: boolean;
  public currentCurrency: string;
  public unitHtPriceWithCurrency: string;
  public oldIdNomenclatureOnUpdate: number;
  public isFromProduct = false;
  public showFilter = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private swalWarrings: SwalWarring,
    private validationService: ValidationService,
    private translate: TranslateService,
    private itemService: ItemService,
    private productNomenclatureService: ProductNomenclatureService,
    private nomenclatureService: NomenclatureService,
    private companyService: CompanyService,
    private purchaseRequestService: PurchaseRequestService,
    private growlService: GrowlService,
    private fabricationArrangementService: FabricationArrangementService) {
    this.activatedRoute.params.subscribe(params => {
      this.idNomenclatureOnUpdate = +params['id'] || 0;
    });
    this.activatedRoute.queryParams.subscribe(queryParms => {
      this.oldIdNomenclatureOnUpdate = +queryParms['old'] || 0;
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.getTypesList();
    this.initFormGroup();
  }

  public initFormGroup() {
    this.formGroup = new FormGroup({
      IdItem: new FormControl('', Validators.required),
      reference: new FormControl('', Validators.required),
      typeNomenclature: new FormControl('', Validators.required)
    });
    //this.disableFormInputs();
  }

  disableFormInputs() {
    if (this.idNomenclatureOnUpdate > 0) {
      this.checkNomenclatureInProgressFarbricationArrangement().then(data => {
        if (data) {
          this.usedInProgressFabricationArrangnement = true;
          this.formGroup.controls['IdItem'].disable();
          this.formGroup.controls['reference'].disable();
          this.formGroup.controls['typeNomenclature'].disable();
        }
      });
    }
  }

  async checkNomenclatureInProgressFarbricationArrangement(): Promise<any> {
    let result: any;
    await this.nomenclatureService.getJavaGenericService()
      .getEntityList(NomenclaturesConstant.CHECK_NOMENCLATURE_IN_PROGRESS_FARBRICATION_ARRANGEMENT + `?id=${this.idNomenclatureOnUpdate}`)
      .toPromise().then(data => {
        result = data;
      });
    return new Promise(resolve => resolve(result));
  }

  public addHandler({sender}) {
    this.closeEditor(sender);
    this.createProductLineForm(new ProductLine());
    sender.addRow(this.productLineFormGroup);
    this.btnEditVisible = false;
  }

  handleEditHandler() {
    this.editMode = true;
  }

  handledEditHandler() {
    this.editMode = false;
  }

  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    this.editedRowIndex = rowIndex;
    this.productLineFormGroup = new FormGroup({
      IdItem: new FormControl(dataItem.productId, Validators.required),
      quantity: new FormControl(dataItem.quantity, Validators.required),
      unite: new FormControl(dataItem.unite),
      tauxChute: new FormControl(dataItem.tauxChute , [Validators.min(NumberConstant.ZERO), Validators.max(NumberConstant.ONE_HUNDRED)]),
      quantityChute: new FormControl(dataItem.quantityChute),
      quantityNet: new FormControl(dataItem.quantityNet),
      unitHtpurchasePrice: new FormControl(dataItem.unitHtpurchasePrice)
    });
    sender.editRow(rowIndex, this.productLineFormGroup);
    this.btnEditVisible = true;
    this.productOnUpdate = dataItem;
  }

  handleKeyAction(sender: GridComponent) {
    this.keyAction = (event) => {
      let rowIndex: number;
      let formGroup: FormGroup;
      if (event.code === KeyboardConst.NUMPAD_MULTIPLY) {
        rowIndex = this.editedRowIndex;
        formGroup = this.productLineFormGroup;
        this.saveHandler({sender, rowIndex, formGroup,isNew: true});
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
  }

  public  async saveHandler({sender, rowIndex, formGroup, isNew}) {
    this.montantTotal = 0;
    let checkProdut = false;
    if (this.productLineFormGroup.valid) {
      await this.checkSubProductExistanceInChildProduct(formGroup).then(data => {
        checkProdut = data;
      });
    }
    if (this.productLineFormGroup.valid && this.checkPositiveQuantity(formGroup.value.quantity) && checkProdut) {
      this.purchaseRequestService.getItemDetails(formGroup.value.IdItem)
        .subscribe(res => {
          if (isNew) {
            /*check product selected is different than the parent product and the product selected is not a exist product in the dataGrid*/
            this.checkNewRowDuplication(formGroup, res, sender, rowIndex);
          } else {
            /* checl if product selected is different than the parent product and the product selected is not a exist product in the dataGrid
           * check the case of an update if the product is the same
           * */
            this.checkUpdateRowDuplication(formGroup, rowIndex, res);
          }
          sender.closeRow(rowIndex);
        });
    } else {
      this.validationService.validateAllFormFields(this.productLineFormGroup);
    }
  }

  /*check if the sub product exist in a noemclature with the product to insert */
  async checkSubProductExistanceInChildProduct(formGroup): Promise<any> {
    let result: any;
    if (this.nomenclature.productId === undefined) {
      this.nomenclature.productId = formGroup.value.IdItem;
    }
    await this.nomenclatureService.getJavaGenericService()
      .getEntityList(NomenclaturesConstant.CHECK_CHILD_PRODUCT_EXIST_IN_SUB_PRODUCT +
        `?idProductChild=${formGroup.value.IdItem}&idProductNomenclature=${this.nomenclature.productId}`).toPromise().then(data => {
        result = data;
      });
    return new Promise(resolve => resolve(result));
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.productLineFormGroup = undefined;
  }

  /*
  * retrieve list of ennumartions of nomenclature
   */
  getTypesList() {
    this.typesList = EnumValues.getNamesAndValues(this.getTypesFromEnum);
  }

  /*
   * prepare productLineForm for nomenclature
    */
  private createProductLineForm(productLine?: ProductLine): void {
    this.productLineFormGroup = new FormGroup({
      IdItem: new FormControl(productLine.productId, Validators.required),
      quantity: new FormControl(productLine.quantity, Validators.required),
      unite: new FormControl(productLine.unite),
      tauxChute: new FormControl(productLine.tauxChute, [Validators.min(NumberConstant.ZERO), Validators.max(NumberConstant.ONE_HUNDRED)]),
      quantityChute: new FormControl(productLine.quantityChute, [Validators.min(NumberConstant.ZERO)]),
      quantityNet: new FormControl(),
      unitHtpurchasePrice: new FormControl(productLine.unitHtpurchasePrice)
    });
  }

  /*
   *remove product from nomenclature  in database
    */
  public removeProductHandler(event: any) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.montantTotal = 0;
        const index: number = this.rowProductsList.indexOf(event.dataItem);
        if (this.isUpdateMode) {
          this.subscription$ = forkJoin(this.productNomenclatureService.getJavaGenericService()
              .deleteEntity(event.dataItem.id, ProductNomenclatureConstant.PRODUCTNOMENCLATURE_URL),
            this.productNomenclatureService.getJavaGenericService()
              .getEntityById(this.idNomenclatureOnUpdate, ProductNomenclatureConstant.TOTAL_ITEMS))
            .subscribe((data) => {
              this.growlService.successNotification(this.translate.instant(NomenclaturesConstant.SUCCESS_OPERATION));
              this.gridSettingsNomenclatures.gridData.total = data[NumberConstant.ONE];
            }, () => {
              this.growlService.ErrorNotification(this.translate.instant(NomenclaturesConstant.FAILURE_OPERATION));
            });
        }
        if (index !== -1) {
          this.rowProductsList.splice(index, 1);
          this.montantTotal = 0;
          this.rowProductsList.forEach(product => {
            this.montantTotal += product.HtTotalAmount;
          });
        }
      }
    });
  }

  /*
  * check product parent not equals subproduct for saveClick
  */
  public saveNomenclatureClick() {
    if (this.findInRowProductList(this.formGroup)) {
      this.prepareSaveNomenclatureClick();
    } else {
      this.growlService.ErrorNotification(NomenclaturesConstant.DUPLICATED_PARENT_PRODUCT);
    }
  }

  /*
  *check if productLine is not empty
   */
  public checkProductLineNotEmpty(): boolean {
    if (this.rowProductsList.length > 0) {
      return true;
    } else {
      this.growlService.ErrorNotification(NomenclaturesConstant.TABS_COMPOSANTS_EMPTY);
      return false;
    }
  }

  /*
  * save new nomenclature and productNomenclature in database
  */
  public prepareSaveNomenclatureClick() {
    if (this.formGroup.valid && this.checkProductLineNotEmpty()) {
      this.subscription$ = this.nomenclatureService.getJavaGenericService()
        .saveEntity(
          {
            productId: this.formGroup.value.IdItem,
            reference: String(this.formGroup.value.reference).trim(),
            typeNomenclature: this.formGroup.value.typeNomenclature
          }, '')
        .subscribe(data => {
          this.rowProductsList.forEach(productNomenclature => {
            productNomenclature.nomenclature = {id: data.id};
            this.productNomenclatureService.getJavaGenericService().saveEntity(productNomenclature,
              ProductNomenclatureConstant.PRODUCTNOMENCLATURE_URL).subscribe();
          });
          this.growlService.successNotification(this.translate.instant(NomenclaturesConstant.SUCCESS_OPERATION));
          this.router.navigateByUrl(NomenclaturesConstant.URI_NOMENCLATURES);
        });
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  /*
   * edit nomenclature composants informations and possibilty to add a new product to nomenclature
    */
  public prepareEditSaveComposants(rowIndex: any) {
    let productNomenclature;
    if (this.checkProductLineNotEmpty()) {
      if (rowIndex === -1) {
        productNomenclature = this.rowProductsList.find(item => this.rowProductsList.indexOf(item) === this.rowProductsList.length - 1);
      } else {
        productNomenclature = this.rowProductsList.find(item => this.rowProductsList.indexOf(item) === rowIndex);
      }
      productNomenclature.nomenclature = {id: this.idNomenclatureOnUpdate};
      this.subscription$ = forkJoin(this.productNomenclatureService.getJavaGenericService()
          .saveEntity(productNomenclature, ProductNomenclatureConstant.PRODUCTNOMENCLATURE_URL)
        , this.productNomenclatureService.getJavaGenericService().getEntityById(this.idNomenclatureOnUpdate,
          ProductNomenclatureConstant.TOTAL_ITEMS))
        .subscribe(data => {
          productNomenclature.id = data[NumberConstant.ZERO].id;
          this.gridSettingsNomenclatures.gridData.total = data[NumberConstant.ONE];
        }, error => {
          this.growlService.ErrorNotification(this.translate.instant(NomenclaturesConstant.FAILURE_OPERATION));

        });
      this.growlService.successNotification(this.translate.instant(NomenclaturesConstant.SUCCESS_OPERATION));
    } else {
      this.validationService.validateAllFormFields(this.productLineFormGroup);
    }
  }

  /*
    * edit nomenclature informations
     */
  public prepareEditNomenclature() {
    if (this.formGroup.valid && this.checkProductLineNotEmpty()) {
      if (this.formGroup.value.IdItem === this.product.Description) {
        this.subscription$ = this.nomenclatureService.getJavaGenericService().updateEntity(
          {
            productId: this.nomenclature.productId,
            reference: String(this.formGroup.value.reference).trim(),
            typeNomenclature: this.formGroup.value.typeNomenclature
          }, this.idNomenclatureOnUpdate, NomenclaturesConstant.NOMENCLATURES_URL,
        )
          .subscribe(() => {
            this.growlService.successNotification(this.translate.instant(NomenclaturesConstant.SUCCESS_OPERATION));
            this.router.navigateByUrl(NomenclaturesConstant.URI_NOMENCLATURES);
          });
      } else {
        this.subscription$ = this.nomenclatureService.getJavaGenericService().updateEntity(
          {
            productId: this.formGroup.value.IdItem,
            reference: String(this.formGroup.value.reference).trim(),
            typeNomenclature: this.formGroup.value.typeNomenclature
          }, this.idNomenclatureOnUpdate, NomenclaturesConstant.NOMENCLATURES_URL,
        )
          .subscribe(() => {
            this.growlService.successNotification(this.translate.instant(NomenclaturesConstant.SUCCESS_OPERATION));
            this.router.navigateByUrl(NomenclaturesConstant.URI_NOMENCLATURES);
          });
      }
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  /*
   * check product parent != subproduct for editClick
    */
  public editNomenclatureClick() {
    if (this.findInRowProductList(this.formGroup)) {
      this.prepareEditNomenclature();
    } else {
      this.growlService.ErrorNotification(NomenclaturesConstant.DUPLICATED_PARENT_PRODUCT);
    }
  }

  /* Item drpodown from LineProduct form change value*/
  itemSelectProductLineForm($event) {
    if ($event.itemFiltredDataSource && $event.formGroup && $event.formGroup.value[NomenclaturesConstant.ID_ITEM]) {
      const itemValue: any[] = ($event.itemFiltredDataSource.filter(c => c.Id === $event.formGroup.value[NomenclaturesConstant.ID_ITEM]));
      if (itemValue && itemValue.length > 0) {
        this.item = itemValue[0];
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  initGridData(page?: number) {
    if (page) {
      this.currentPage = page;
    }
    this.montantTotal = 0;
    this.isUpdateMode = true;
    forkJoin(
      this.nomenclatureService.getJavaGenericService()
        .getEntityById(this.idNomenclatureOnUpdate, NomenclaturesConstant.NOMENCLATURES_URL),
      this.productNomenclatureService.getJavaGenericService()
        .getEntityById(this.idNomenclatureOnUpdate, ProductNomenclatureConstant.GET_PRODUCT_BY_NOMENCLATURE),
      this.nomenclatureService.getJavaGenericService()
        .getEntityById(this.idNomenclatureOnUpdate, NomenclaturesConstant.NOMENCLATURES_URL).pipe(
        flatMap((res1) => this.nomenclatureService.getJavaGenericService().getEntityById(res1.productId,
          NomenclaturesConstant.GET_CHILDREN_BY_PRODUCT_ID)
        ), flatMap((res2) => this.itemService.getAmountPerItem(res2))),
      this.productNomenclatureService.getJavaGenericService().getEntityList(ProductNomenclatureConstant.PAGEABLE
        + `?idNomenclature=${this.idNomenclatureOnUpdate}&page=${this.currentPage}&size=${this.size}`).pipe
      (flatMap((res1) => this.itemService.getAmountPerItem(res1))),
      this.productNomenclatureService.getJavaGenericService()
        .getEntityById(this.idNomenclatureOnUpdate, ProductNomenclatureConstant.TOTAL_ITEMS))
      .subscribe(result => {
        this.nomenclature = result[NumberConstant.ZERO];
        this.itemService.getProductById(this.nomenclature.productId).subscribe
        ((product) => {
          this.product = product;
          this.formGroup.patchValue({
            IdItem: product.Id,
            reference: this.nomenclature.reference,
            typeNomenclature: this.nomenclature.typeNomenclature
          });
          this.itemDropDown.ngOnInit();
          this.allChildrenByProductParent = new Observable(observer => {
            observer.next(
              result[NumberConstant.TWO]
            );
          });
          let ids = [];
          result[NumberConstant.THREE].forEach(nomenclature => {
            ids.push(nomenclature.IdItem);
          });
          this.itemService.getItemDetails(ids).subscribe(data => {
            result[NumberConstant.THREE].forEach(nomenclature => {
                  nomenclature.unitHtpurchasePrice =  data.filter( item => item.Id === nomenclature.IdItem)[0].CostPrice == null ?
                    NumberConstant.ZERO :  data.filter( item => item.Id === nomenclature.IdItem)[0].CostPrice;
                  nomenclature.CurrencySymbole = this.currentCurrency;
                  nomenclature.HtTotalAmount =  data.filter( item => item.Id === nomenclature.IdItem)[0].CostPrice * nomenclature.Quantity;
                  this.montantTotal += Number(nomenclature.HtTotalAmount);
                  const o = result[1].find(e => e.productId === nomenclature.IdItem && e.quantity === nomenclature.Quantity !== undefined);
                  nomenclature.id = o.id;
                  nomenclature.productId = nomenclature.IdItem;
                  nomenclature.description = nomenclature[NomenclaturesConstant.PRODUCT_Description];
                  nomenclature.quantity = nomenclature[NomenclaturesConstant.ITEM_QUANTITY];
                  nomenclature.unite = nomenclature[NomenclaturesConstant.MESURE_UNIT];
                  nomenclature.tauxChute = o[NomenclaturesConstant.TAUX_CHUTE];
                  nomenclature.quantityChute = o[NomenclaturesConstant.QUANTITY_CHUTE];
                  nomenclature.quantityNet = Number(nomenclature.quantity - nomenclature.quantityChute);
                  nomenclature.unitHtpurchasePrice =
                    `${nomenclature[NomenclaturesConstant.UNIT_HT_PURCHASE_PRICE_FILIED]}
                   ${nomenclature[NomenclaturesConstant.CURRENCY_SYMBOLE]}`;
            });
          });
          this.rowProductsList = result[NumberConstant.THREE];
          this.gridSettingsNomenclatures.gridData = {data: this.rowProductsList, total: result[NumberConstant.FOUR]};
        });
      });
  }

  /* Select event for one row to update some component -->redirect to nomenclature interface for update/add component*/
  nodeParentToUpdateComponent($event: any, id?: number) {
    this.oldIdNomenclatureOnUpdate = this.idNomenclatureOnUpdate;
    this.idNomenclatureOnUpdate = (id !== undefined) ? id : $event.node.data.nomenclatureId;
    this.router.navigate([NomenclaturesConstant.URI_ADVANCED_EDIT.concat(String(this.idNomenclatureOnUpdate))], {
      queryParams: {old: this.oldIdNomenclatureOnUpdate},
      skipLocationChange: true
    });


  }

  /*Check if item exist in the row product list*/
  public findInRowProductList(form: any) {
    return (this.rowProductsList.find(item => item.productId === form.value.IdItem) === undefined);
  }

  /*Check if Item selected is different than the Parent item*/
  checkItemNotEqualsSubItem(formGroup: any) {
    if (this.isUpdateMode && (this.formGroup.value.IdItem === this.product.Description)) {
      return (formGroup.value.IdItem !== this.nomenclature.productId);
    } else {
      return (formGroup.value.IdItem !== this.formGroup.value.IdItem);
    }
  }

  /*check unit mesure precsion value for each item to save or update lineProduct*/
  public async checkUnitPrecsion(formGroup): Promise<any> {
    let y: number;
    const itemQt = new ItemQuantity(formGroup.value.IdItem, formGroup.value.quantity);
    const tabItems: ItemQuantity[] = [];
    tabItems.push(itemQt);
    const quantity = await new Promise<number>(resolve =>
      this.itemService.getAmountPerItem(tabItems).subscribe(data => {
        /*Mesure Unit Precsion still not availbe from unit
        * force mesureUnitPrecsion with number 2 to test*/
        data[NumberConstant.ZERO][NomenclaturesConstant.MESURE_UNIT_PRESCION] = NumberConstant.TWO;
        y = Number(formGroup.value.quantity);
        resolve(y);
      }));
    return new Promise(function (resolve) {
      resolve(quantity);
    });

  }

  public checkPositiveQuantity(quantite: string): boolean {
    if (parseInt(quantite) >= 0) {
      return true;
    } else {
      this.growlService.ErrorNotification(NomenclaturesConstant.CHECK_QUANTITY_POSITIVE);
      return false;
    }
  }

  public checkNotEquivalentArticle(quantite: string): boolean {
    if (parseInt(quantite) > 0) {
      return true;
    } else {
      this.growlService.ErrorNotification(NomenclaturesConstant.CHECK_QUANTITY_POSITIVE);
      return false;
    }
  }

  onUpdateTauxChuteOrQuantityChute(value) {
    if (value.target.name === 'quantity') {
      this.productLineFormGroup.patchValue({
        quantityNet: this.productLineFormGroup.value['quantity'],
        tauxChute: NumberConstant.ZERO,
        quantityChute: NumberConstant.ZERO
      });
    }
    let valueToBeMultipliedAndDevided;
    this.productLineFormGroup.value['quantityNet'] === null ?
      valueToBeMultipliedAndDevided = this.productLineFormGroup.value['quantity'] :
      valueToBeMultipliedAndDevided = this.productLineFormGroup.value['quantityNet'] ;
    if (value.target.name === 'quantityChute') {
        this.productLineFormGroup.patchValue({
          tauxChute: (Number((value.target.value * NumberConstant.ONE_HUNDRED) / valueToBeMultipliedAndDevided)).toFixed(NumberConstant.FOUR)
        });
      } else if (value.target.name === 'tauxChute') {
        this.productLineFormGroup.patchValue({
          quantityChute: Number((valueToBeMultipliedAndDevided * value.target.value) / NumberConstant.ONE_HUNDRED)
        });
      }
  }

  /*Insert a new row in the row product list*/
  async pushNewRow(formGroup, res, sender, rowIndex) {
    let unitHTpurchasePrice = 0;
    let CurrencySymbole = '';
    await this.checkUnitPrecsion(formGroup).then(data => {
      formGroup.value.quantity = data;
    });
    this.itemService.getModelByCondition(preparePredicateFilterToGetCostPrice(formGroup.value.IdItem)).subscribe(data => {
      unitHTpurchasePrice = data.CostPrice == null ?
        NumberConstant.ZERO : data.CostPrice;
      CurrencySymbole = this.currentCurrency;
      this.productLineFormGroup.value['quantityNet'] = NumberConstant.ZERO ;
      this.rowProductsList.push({
        productId: formGroup.value.IdItem,
        nomenclature: this.idNomenclatureOnUpdate,
        quantity: (Number(formGroup.value.quantity) + Number(formGroup.value.quantityChute)),
        description: res[NomenclaturesConstant.PRODUTCT_Designation],
        unite: res[NomenclaturesConstant.PRODUCT_IdMeasureUnitNavigation][NomenclaturesConstant.PRODUCT_Description],
        tauxChute: formGroup.value.tauxChute,
        quantityChute: formGroup.value.quantityChute,
        quantityNet: formGroup.value.quantity,
        unitHtpurchasePrice: `${unitHTpurchasePrice} ${CurrencySymbole}`,
        HtTotalAmount: data.CostPrice = null ?
          NumberConstant.ZERO : Number(data.CostPrice * formGroup.value.Quantity)
      });
      this.montantTotal = 0;
      this.rowProductsList.forEach(product => {
        if (product.HtTotalAmount) {
          this.montantTotal += Number(product.HtTotalAmount) ;
        }
      });
      this.countTotalInsert++;
      this.gridSettingsNomenclatures.gridData = {data: this.rowProductsList, total: this.countTotalInsert};
      if (this.isUpdateMode) {
        this.prepareEditSaveComposants(rowIndex);
      }
    });
  }

  /*Check if the new row inserted exist in the row product list & check if the new item inserted if different than the parent item */
  checkNewRowDuplication(formGroup: any, res: any, sender: any, rowIndex: any) {
    if (this.findInRowProductList(formGroup) && this.checkItemNotEqualsSubItem(formGroup)) {
      this.pushNewRow(formGroup, res, sender, rowIndex);
    } else {
      this.growlService.ErrorNotification(this.translate.instant(NomenclaturesConstant.DUPLICATED_PRODUCT));
    }
  }

  /*Check if the item is the same in the case of an update row*/
  checkIfProductIsTheSameInUpdateRow(formGroup) {
    return (formGroup.value.IdItem === this.productOnUpdate.productId);
  }

  checkIfArticleIsTheSomeInChildArticle(formGroup: FormGroup): Boolean {
    return (formGroup.value == this.formGroup.value);
  }

  /*Fill the the row product list by the updated row in case of update row*/
  async setRowByIndexRow(rowIndex, formGroup, res) {
    if (rowIndex >= this.size) {
      rowIndex = rowIndex - this.size;
    }
    let unitHtpurchasePrice = 0;
    await this.checkUnitPrecsion(formGroup).then(data => {
      formGroup.value.quantity = data;
    });
    this.itemService.getModelByCondition(preparePredicateFilterToGetCostPrice(formGroup.value.IdItem)).subscribe(item => {
      let HtTotalMontant: any = 0;
      unitHtpurchasePrice = item.CostPrice == null ?
        NumberConstant.ZERO : item.CostPrice;
      if (unitHtpurchasePrice) {
        HtTotalMontant = unitHtpurchasePrice * formGroup.value.quantity;
      }
      this.rowProductsList.find(productNomenclature => this.rowProductsList.indexOf(productNomenclature) === rowIndex).unitHtpurchasePrice = `${unitHtpurchasePrice} ${this.currentCurrency}`;
      this.rowProductsList.find(productNomenclature => this.rowProductsList.indexOf(productNomenclature) === rowIndex).productId = formGroup.value.IdItem;
      this.rowProductsList.find(productNomenclature => this.rowProductsList.indexOf(productNomenclature) === rowIndex).quantity = Number(formGroup.value.quantityNet) + Number(formGroup.value.quantityChute);
      this.rowProductsList.find(productNomenclature => this.rowProductsList.indexOf(productNomenclature) === rowIndex).description =
        res[NomenclaturesConstant.PRODUTCT_Designation];
      this.rowProductsList.find(productNomenclature => this.rowProductsList.indexOf(productNomenclature) === rowIndex).unite = formGroup.value.unite;
      this.rowProductsList.find(productNomenclature => this.rowProductsList.indexOf(productNomenclature) === rowIndex).tauxChute = formGroup.value.tauxChute;
      this.rowProductsList.find(productNomenclature => this.rowProductsList.indexOf(productNomenclature) === rowIndex).quantityChute = formGroup.value.quantityChute;
      this.rowProductsList.find(productNomenclature => this.rowProductsList.indexOf(productNomenclature) === rowIndex).quantityNet =  formGroup.value.quantityNet,
        this.rowProductsList.find(productNomenclature => this.rowProductsList.indexOf(productNomenclature) === rowIndex).HtTotalAmount = Number(HtTotalMontant);
      this.montantTotal = 0;
      this.rowProductsList.forEach(product => {
        this.montantTotal += Number(product.HtTotalAmount);
      });
      if (this.isUpdateMode) {
        this.prepareEditSaveComposants(rowIndex);
      }
    });
  }

  /*Check in case of an update if row not duplicated*/
  checkUpdateRowDuplication(formGroup: any, rowIndex: any, res: any) {
    if (this.checkIfProductIsTheSameInUpdateRow(formGroup) || this.findInRowProductList(formGroup) && this.checkItemNotEqualsSubItem(formGroup)) {
      this.setRowByIndexRow(rowIndex, formGroup, res);
    } else {
      this.growlService.ErrorNotification(this.translate.instant(NomenclaturesConstant.DUPLICATED_PRODUCT));
    }
  }

  /*
     get cost nomenclature for current productLine nomenclature
    */
  public getNomenclaturePrice(service: any, idProduit: any, nomenclature?: any, formGroup?: any, rowIndex?: any, quantity?: any) {
    let unitHtpurchasePrice = NumberConstant.ZERO;
    let qteWithoutMultiplication;
    this.nomenclatureService.getJavaGenericService().getEntityById(idProduit,
      NomenclaturesConstant.GET_CHILDREN_BY_PRODUCT_ID).subscribe(res => {
      res.forEach(async itemPerQuantity => {
        service = await this.getServiceByProduct(service, itemPerQuantity);
        service.subscribe(items => {
          unitHtpurchasePrice = this.getCostPriceByProductWithNomenclature(nomenclature, qteWithoutMultiplication, itemPerQuantity, items, unitHtpurchasePrice);
          unitHtpurchasePrice = this.getCostProductInCaseNewLineProduct(formGroup, unitHtpurchasePrice, items, itemPerQuantity);
          unitHtpurchasePrice = this.getCostProductInCaseUpdateLineProduct(rowIndex, quantity, unitHtpurchasePrice, items, itemPerQuantity);
          return true;
        });
      });
    });
  }

  /*get cost of product  in case of update a line of product in the grid */
  getCostProductInCaseUpdateLineProduct(rowIndex: any, quantity: any, unitHtpurchasePrice: number, items, itemPerQuantity) {
    if (rowIndex != null && quantity != null) {
      unitHtpurchasePrice += Number(items[NomenclaturesConstant.UNIT_HT_PURCHASE_PRICE_FILIED_API_DOTNET]) * Number(itemPerQuantity.quantity) * Number(quantity);
      this.unitHtPriceWithCurrency = `${unitHtpurchasePrice} ${this.currentCurrency}`;

      this.rowProductsList.find(item => this.rowProductsList.indexOf(item) === rowIndex).unitHtpurchasePrice = this.unitHtPriceWithCurrency;
    }
    return unitHtpurchasePrice;
  }

  /*get cost of product  in case of insert a new line of product in the grid */
  getCostProductInCaseNewLineProduct(formGroup: any, unitHtpurchasePrice: number, items, itemPerQuantity) {
    if (formGroup != null) {
      unitHtpurchasePrice += Number(items[NomenclaturesConstant.UNIT_HT_PURCHASE_PRICE_FILIED_API_DOTNET])
        * Number(itemPerQuantity.quantity) * Number(formGroup.value.quantity);
      this.unitHtPriceWithCurrency = `${unitHtpurchasePrice} ${this.currentCurrency}`;

      this.rowProductsList.find(item => this.rowProductsList.indexOf(item) === this.rowProductsList.length - 1).unitHtpurchasePrice = this.unitHtPriceWithCurrency;
    }
    return unitHtpurchasePrice;
  }

  /*get cost of product  for each product with nomenclature */
  getCostPriceByProductWithNomenclature(nomenclature: any, qteWithoutMultiplication, itemPerQuantity, items, unitHtpurchasePrice: number) {
    if (nomenclature != null) {
      qteWithoutMultiplication = Number(itemPerQuantity.quantity) * Number(nomenclature.Quantity);
      const o = items.find(e => e.IdItem === itemPerQuantity.idItem && e.Quantity === qteWithoutMultiplication !== undefined);
      unitHtpurchasePrice += Number(o[NomenclaturesConstant.AMOUNT_WITH_CURRENCY]) * Number(itemPerQuantity.quantity) * Number(nomenclature.quantity);
      nomenclature.unitHtpurchasePrice = `${unitHtpurchasePrice}${nomenclature[NomenclaturesConstant.CURRENCY_SYMBOLE]}`;
    }
    return unitHtpurchasePrice;
  }

  /*get service by product
  * case product from allChildren items  -->  loading grid
  * case product for a add/edit line in grid :itemService */
  async getServiceByProduct(service: any, itemPerQuantity) {
    service = (service === NomenclaturesConstant.ITEM_SERVICE) ? await
      new Promise(resolve => resolve(this.itemService.getById(itemPerQuantity.idItem))) : service;
    return service;
  }

  /*cost of nomenclature by productId*/
  public costNomenclature() {
    if (this.isUpdateMode) {
      this.montantTotal = 0;
      this.nomenclatureService.getJavaGenericService()
        .getEntityById(this.idNomenclatureOnUpdate, NomenclaturesConstant.NOMENCLATURES_URL).pipe(
        flatMap((res1) => this.nomenclatureService.getJavaGenericService().getEntityById(res1.productId,
          NomenclaturesConstant.GET_CHILDREN_BY_PRODUCT_ID)
        ), flatMap((res2) => this.itemService.getAmountPerItem(res2)))
        .subscribe(TotalItems => {
          TotalItems.forEach(items => {
            this.montantTotal += items.TotalAmountWithCurrency;
            this.currency = items[NomenclaturesConstant.CURRENCY_SYMBOLE];
          });
          this.montantTotal += this.currency;
        });
    }
  }

  /*navigation from product clicked from the grid to nomenclature view */
  navigationFromProductToNomenclatureView() {
    this.nomenclatureService.getJavaGenericService()
      .getEntityById(this.itemClicked, NomenclaturesConstant.CHECK_PRODUCT_NOMENCLATURE_EXIST)
      .subscribe(idNomenclature => {
        this.nodeParentToUpdateComponent('', idNomenclature);
      });
  }

  /*get dataItem clicked  from cell row*/
  getCurrentDataItem($event: CellClickEvent) {
    this.itemClicked = $event.dataItem.IdItem;
  }
  public lineClickHandler({sender, rowIndex, dataItem}) {
    if (!this.isSave) {
      this.editHandler({sender, rowIndex, dataItem});
    } else {
      this.isSave = false;
    }
  }
  /**
   * load data when the page change with pagination
   * @param event
   */  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / event.take;
    this.size = event.take;
    this.initGridData(this.currentPage);
  }

  /**
   * when the page change , the active page change
   * @param state
   */
  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettingsNomenclatures.state = state;
  }

  loadNomenclaturesDetails() {
    this.loadComponentNomenclatureTreeView = true;
  }

  public getCurrentCompanyCurrency() {
    this.companyService.getCurrentCompany().subscribe(data => {
      this.currentCurrency = data.IdCurrencyNavigation.Code;
    });
  }

  /*navigate to old nomenclature */
  backtoOldNomenclatureClick() {
    this.nodeParentToUpdateComponent('', this.oldIdNomenclatureOnUpdate);
  }

  /*
   * fetch product information form api dotnet and link every  product information with productNomenclature api Java
   */
  ngOnInit() {
    if (this.idNomenclatureOnUpdate > 0) {
      this.initGridData();
    } else {
      this.getLastReference();
    }
    this.getCurrentCompanyCurrency();
  }

  enableForm() {
    this.formGroup.controls['IdItem'].enable();
    this.formGroup.controls['reference'].enable();
    this.formGroup.controls['typeNomenclature'].enable();
    this.usedInProgressFabricationArrangnement = false;
  }

  getLastReference() {
    this.nomenclatureService.callService(Op.GET, 'get-last-reference').subscribe(result => {
      this.nomenclatureReference = result.NOMENCLATURE_REFERENCE;
      this.formGroup = new FormGroup({
        'IdItem': new FormControl(this.nomenclature.productId, Validators.required),
        'reference': new FormControl(this.nomenclatureReference, Validators.required),
        'typeNomenclature': new FormControl(this.nomenclature.typeNomenclature, Validators.required),
        productLines: new FormControl(this.rowProductsList)
      });
    });
  }

  goToFabbricationArrangement() {
    this.fabricationArrangementService.getJavaGenericService()
      .getEntityList(FabricationArrangementConstant.FABRICATION_ARRANGEMENT_BY_PRODUCT_ID_AND_STATUS +
        `?id=${this.nomenclature.productId}`).subscribe(res => {
      this.router.navigateByUrl(FabricationArrangementConstant.URI_ADVANCED_EDIT.concat(res.id));
    });
  }

  itemNomenclatureSelect(event) {
    if ( event && event.itemComponent && event.itemComponent.dataItem) {
      this.itemClicked = event.itemComponent.dataItem.Id;
      this.nomenclature.id = event.itemComponent.dataItem.Id;
    }

  }

  checkPositive(e, input) {
    const keyValue = +e.key;
    const numberOnlyPattern = '[0-9]+';
    const newValue = input.value + (isNaN(keyValue) ? '' : keyValue.toString());
    const match = newValue.match(numberOnlyPattern);
    if (!match) {
      e.preventDefault();
    }
  }

  public valueChange(value: any): void {
    value === NomenclatureType.PF ? this.isPF = true : this.isPF = false;
    value === NomenclatureType.PSF ? this.isPSF = true : this.isPSF = false;
  }

}
