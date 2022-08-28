import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {DataSourceRequestState, State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {OperationModel} from '../../../models/manufacturing/operation.model';
import {Gamme} from '../../../models/manufacturing/gamme.model';
import {GammeService} from '../../service/gamme.service';
import {OperationService} from '../../service/operation.service';
import {take} from 'rxjs/operators';
import {PageChangeEvent, GridComponent, CellClickEvent, PagerSettings, RowClassArgs} from '@progress/kendo-angular-grid';
import {GammeConstant} from '../../../constant/manufuctoring/gamme.constant';
import {MachineConstant} from '../../../constant/manufuctoring/machine.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SectionService} from '../../service/section.service';
import {NomenclatureService} from '../../service/nomenclature.service';
import {ItemService} from '../../../inventory/services/item/item.service';
import {PurchaseRequestConstant} from '../../../constant/purchase/purchase-request.constant';
import {Item} from '../../../models/inventory/item.model';
import {MachineService} from '../../service/machine.service';
import {Machine} from '../../../models/manufacturing/machine.model';
import {ProductNomenclatureService} from '../../service/product-nomenclature.service';
import {Operation} from '../../../../COM/Models/operations';
import {UserService} from '../../../administration/services/user/user.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {DropdownProductItemsComponent} from '../../dropdown-product-items/dropdown-product-items.component';
import {GammeOperationConstant} from '../../../constant/manufuctoring/gamme-operation.constant';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {UnitOfMesureJavaService} from '../../service/unit-of-mesure-java-service.service';
import {ItemConstant} from '../../../constant/inventory/item.constant';
import {AddMeasureUnitComponent} from '../../../inventory/components/add-measure-unit/add-measure-unit.component';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {Area} from '../../../models/manufacturing/area.model';
import {GammeOperationService} from '../../service/gamme-operation.service';
import {send} from 'process';
import {KeyboardConst} from '../../../constant/keyboard/keyboard.constant';
import {SearchConstant} from '../../../constant/search-item';
import {AddOperationComponent} from '../../operation/add-operation/add-operation.component';

@Component({
  selector: 'app-add-gamme',
  templateUrl: './add-gamme.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./add-gamme.component.scss']
})
export class AddGammeComponent implements OnInit, AfterViewInit, OnDestroy {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public emptyGammePorducts = false;
  private subscription$: Subscription;
  public isSave = false;
  public editMode = false;
  private keyAction: (event: any) => void;

  private dragAndDropSubscription$: Subscription;
  public isUpdateMode = false;
  public gamme = new Gamme();
  private editedRowIndex: number;
  public operationFormGroup: FormGroup;
  private idGammeOnUpdate: number;
  public formGroup: FormGroup;
  public rowOperationsList: Array<any> = [];
  public btnEditVisible: boolean;
  public listItems: any[] = [];
  private selectedOperationBeforeDtos: Array<OperationModel> = [];
  private listProductNomenclatureFromJava = [];
  public value: any = [];
  public sectionDescription = GammeConstant.OPERATION_SECTION_DESCRIPTION_FIELD;
  public operationBeforeDtos = GammeConstant.OPERATIONS_BEFORE_LIST_FIELD;
  public duration = GammeConstant.OPERATION_DURATION_FIELD;
  public description = GammeConstant.OPERATION_DESCRIPTION_FIELD;
  public listOperations: Array<OperationModel> = [];
  public listMachines: Machine[] = [];

  private operationsGamme: any = [];
  public beforeOperation: any;
  public listUnitOfMeasure = [];
  public unitOfMeasure: any;
  public listProductNomenclature: any[] = [];
  public listUsers: any[] = [];
  public selectedMachines: any[] = [];
  public selectedUsers: any = [];
  public selectedProductNomenclatures: any[] = [];
  public selectedValue: any = {};
  private nbGammeOperations = 0;
  public itemClicked: number;
  private currentPage = NumberConstant.ZERO;
  private size = NumberConstant.TEN;
  public allSelectedProductNomenclatures: any[] = [];
  @ViewChild(DropdownProductItemsComponent) itemDropDown;
  private item: Item = new Item();
  public currentArea: any;
  public idItemSelected;
  public selectedUnitOfMesure;
  public entityNameSource = GammeConstant.ENTITY_NAME;
  public gridStateGammes: DataSourceRequestState = {
    skip: 0,
    take: this.size,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public gridData: any[] = [];

  public columnsConfig: ColumnSettings[] = [
    {
      field: GammeConstant.REFERENCE_FIELD,
      title: GammeConstant.REFERENCE_TITLE,
      filterable: true,
    },
    {
      field: GammeConstant.ARTICLE_FIELD,
      title: GammeConstant.ARTICLE_TITLE,
      filterable: true
    }
  ];

  public columnsConfigOperations: ColumnSettings[] = [
    {
      field: GammeConstant.ORDER_FIELD,
      title: GammeConstant.ORDER_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: GammeConstant.OPERATION_FIELD,
      title: GammeConstant.OPERATION_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: GammeConstant.MEASUREUNIT_FIELD,
      title: GammeConstant.MEASUREUNIT_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: GammeConstant.EQUIPMENT_FIELD,
      title: GammeConstant.EQUIPMENT_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: GammeConstant.NET_TIME_EQUIPMENTS_FIELD,
      title: GammeConstant.NET_TIME_EQUIPMENTS_TITLE,
      filterable: true,
      _width: 100
    },
    {
      field: GammeConstant.PERSON_FIELD,
      title: GammeConstant.PERSON_TITLE,
      filterable: false,
      _width: 150,
    },
    {
      field: GammeConstant.NET_TIME_FIELD,
      title: GammeConstant.NET_TIME_TITLE,
      filterable: true,
      _width: 100
    },
    {
      field: GammeConstant.OPERATIONS_BEFORE_LIST_FIELD,
      title: GammeConstant.OPERATIONS_BEFORE_LIST_TITLE,
      filterable: false,
      _width: 150
    },
    {
      field: GammeConstant.NOMENCLATURE_FIELD,
      title: GammeConstant.NOMENCLATURE_TITLE,
      filterable: false,
      _width: 200
    },
  ];


  public gridSettingsGammes: GridSettings = {
    state: this.gridStateGammes,
    columnsConfig: this.columnsConfigOperations
  };
  private gammeReference: any;
  private listResponsiblesJava: any[];
  public spinner = false;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private swalWarrings: SwalWarring,
    private validationService: ValidationService,
    private translate: TranslateService,
    private operationService: OperationService,
    private productNomenclatureService: ProductNomenclatureService,
    private nomenclatureService: NomenclatureService,
    private gammeService: GammeService,
    private gammeOperationService: GammeOperationService,
    private growlService: GrowlService,
    private sectionService: SectionService,
    public viewRef: ViewContainerRef,
    private itemService: ItemService,
    private machineService: MachineService,
    private formModalDialogService: FormModalDialogService,
    private modalDialogInstanceService: ModalDialogInstanceService,
    private unitOfMesureJavaService: UnitOfMesureJavaService,
    private zone: NgZone) {
    this.activatedRoute.params.subscribe(params => {
      this.idGammeOnUpdate = +params['id'] || 0;
    });
    this.formGroup = new FormGroup({
      reference: new FormControl(''),
      IdItem: new FormControl(''),
      areaId: new FormControl('', Validators.required),
    });

  }

  public ngAfterViewInit(): void {
    this.dragAndDropSubscription$ = this.handleDragAndDrop();
  }

  public dataStateChange(state: State): void {
    this.gridStateGammes = state;
    this.zone.onStable.pipe(take(1))
      .subscribe(() => this.dragAndDropSubscription$ = this.handleDragAndDrop());
  }

  public rowCallback(context: RowClassArgs) {
    return {
      dragging: context.dataItem.dragging
    };
  }

  /**
   * drag & drop rows in GridData
   */
  private handleDragAndDrop(): Subscription {
    return null;
  }

  public async addHandler({sender}) {
    this.selectedUsers = [];
    this.selectedMachines = [];
    this.selectedOperationBeforeDtos = [];
    this.selectedProductNomenclatures = [];
    this.closeEditor(sender);
    this.createOperationLineForm(new OperationModel());
    this.nbGammeOperations++;
    sender.addRow(this.operationFormGroup);
    this.btnEditVisible = false;
  }

  handleKeyAction(sender: GridComponent) {
    this.keyAction = (event) => {
      let rowIndex: number;
      let formGroup: FormGroup;
      if (event.code === KeyboardConst.NUMPAD_MULTIPLY) {
        rowIndex = this.editedRowIndex;
        formGroup = this.operationFormGroup;
        this.saveHandler({sender, rowIndex, formGroup, isNew: true});
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);
  }

  public lineClickHandler({sender, rowIndex, dataItem}) {
    if (!this.isSave) {
      this.editHandler({sender, rowIndex, dataItem});
    } else {
      this.isSave = false;
    }
  }

  handleEditHandler() {
    this.editMode = true;
  }

  handledEditHandler() {
    this.editMode = false;
  }

  getCurrentDataItem($event: CellClickEvent) {
    this.itemClicked = $event.dataItem.IdItem;
  }

  public async editHandler({sender, rowIndex, dataItem}) {
    this.selectedUsers = [];
    this.selectedMachines = [];
    this.selectedOperationBeforeDtos = [];
    this.selectedProductNomenclatures = [];
    this.closeEditor(sender);
    this.closeEditor(sender, -1);
    this.editedRowIndex = rowIndex;
    this.operationFormGroup = new FormGroup({
      id: new FormControl(this.operationsGamme[rowIndex].id ? this.operationsGamme[rowIndex].id : null),
      operation: new FormControl(this.operationsGamme[rowIndex].operation),
      equipment: new FormControl(this.operationsGamme[rowIndex].machines
        ? this.operationsGamme[rowIndex].machines :
        this.operationsGamme[rowIndex].equipment),
      equipmentTimeNet: new FormControl(this.operationsGamme[rowIndex].machineTimeNet ?
        this.operationsGamme[rowIndex].machineTimeNet :
        this.operationsGamme[rowIndex].equipmentTimeNet),
      operationBeforeDtos: new FormControl(this.operationsGamme[rowIndex].operationBefore ?
        this.operationsGamme[rowIndex].operationBefore :
        this.operationsGamme[rowIndex].operationBeforeDtos),
      unitOfMeasure: new FormControl(
        this.operationsGamme[rowIndex].unitOfMeasure ? this.operationsGamme[rowIndex].unitOfMeasure.code ? this.operationsGamme[rowIndex].unitOfMeasure.code : this.operationsGamme[rowIndex].unitOfMeasure
          : ''),
      productNomenclatures: new FormControl(this.operationsGamme[rowIndex].productNomenclatures),
      responsibleId: new FormControl(this.operationsGamme[rowIndex].responsibles ?
        this.operationsGamme[rowIndex].responsibles :
        this.operationsGamme[rowIndex].responsibleId),
      personTimeNet: new FormControl(this.operationsGamme[rowIndex].personTimeNet),
      costMachines: new FormControl(this.operationsGamme[rowIndex].costMachines),
      costPersons: new FormControl(this.operationsGamme[rowIndex].costPersons),
      order: new FormControl(this.operationsGamme[rowIndex].order),
      disabledEquipmentTimeNetColumn: new FormControl(this.operationsGamme[rowIndex].disabledEquipmentTimeNetColumn),
      disabledPersonTimeNetColumn: new FormControl(this.operationsGamme[rowIndex].disabledPersonTimeNetColumn),
    });
    if (!this.operationsGamme[rowIndex].machines) {
      this.operationsGamme[rowIndex].machines = this.operationsGamme[rowIndex].equipment;
    }
    if (!this.operationsGamme[rowIndex].responsibles) {
      this.operationsGamme[rowIndex].responsibles = this.operationsGamme[rowIndex].responsibleId;
    }
    this.selectedMachines = this.operationsGamme[rowIndex].machines;
    if (this.operationsGamme[rowIndex].productNomenclatures) {
      this.operationsGamme[rowIndex].productNomenclatures.forEach(pn => {
        if (pn.productId || pn.Id) {
          this.itemService.getProductById(pn.productId ? pn.productId : pn.Id).subscribe(article => {
            article.id = pn.Id;
            this.selectedProductNomenclatures.push(article);
          });
        }
      });
    }
    this.userService.getAllUserWithoutState().subscribe(result => {
      this.listUsers = result.data;
      this.listUsers.forEach(user => {
        if (this.operationsGamme[rowIndex].responsibles) {
          if (this.operationsGamme[rowIndex].responsibles
            .find(selected => (selected.idResponsable ? selected.idResponsable : selected.Id) === user.Id)) {
            this.selectedUsers.push(user);
          }
        }
      });
      if (this.selectedUsers.length >= NumberConstant.ONE) {
        this.operationFormGroup.patchValue({
          responsibleId: new FormArray(this.selectedUsers),
        });
      }
    });

    this.listOperations.push(this.operationsGamme[rowIndex].operation);
    this.eliminateSelectedItemInPredecesseurColumn(dataItem.operation);
    if (dataItem.gamme) {
      this.getProductNomenclatureList(dataItem.gamme.articleId);
    }
    sender.editRow(rowIndex, this.operationFormGroup);
    this.btnEditVisible = true;
  }


  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
    this.dataStateChange(this.gridStateGammes);
  }

  /**
   * load data when the page change with pagination
   * @param event
   */  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / event.take;
    this.size = event.take;
    this.operationsGamme = [];
    this.gamme = new Gamme();
    this.initGridData();
  }


  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if (this.operationFormGroup.valid) {
      this.subscription$ = this.sectionService.getJavaGenericService()
        .getEntityById(formGroup.value.sectionId, MachineConstant.MACHINE_URL)
        .map(data => data.description)
        .subscribe(data => {
          this.selectedProductNomenclatures = [];
          if (isNew) {
            this.saveNewHandler(formGroup, data);
          } else {
            this.saveEditedHandler(rowIndex, formGroup, data);
          }

        });
      sender.closeRow(rowIndex);
    } else {
      this.validationService.validateAllFormFields(this.operationFormGroup);
    }

  }

  private saveNewHandler(formGroup, data) {
    const operation: OperationModel = formGroup.value;
    const operationGamme: any = {};
    operationGamme.operation = this.operationFormGroup.value.operation;
    operationGamme.NET_TIME_EQUIPMENTS = this.operationFormGroup.value.equipmentTimeNet;
    operationGamme.equipment = '';
    operationGamme.productNomenclature = '';
    operationGamme.person = '';
    operationGamme.unitOfMeasure = this.selectedUnitOfMesure ? this.selectedUnitOfMesure.code : '';
    operationGamme.order = this.operationFormGroup.value.order;
    operationGamme.operationBeforeDtos = this.operationFormGroup.value.operationBeforeDtos.description;
    operationGamme.personTimeNet = this.operationFormGroup.value.personTimeNet;
    this.operationFormGroup.value.equipment.forEach(eq => {
      operationGamme.equipment += eq.description + ',';
    });
    this.operationFormGroup.value.productNomenclatures.forEach(pn => {
      operationGamme.productNomenclature += pn.Code + ',';
    });
    this.operationFormGroup.value.responsibleId.forEach(person => {
      operationGamme.person += person.FullName + ',';
    });
    this.gridData.push(operationGamme);
    this.gridSettingsGammes.gridData = {data: this.gridData, total: this.gridData.length};
    this.operationsGamme.push(this.operationFormGroup.value);
    this.addNewOperationToRowOperationList(operation);

  }


  addNewOperationToRowOperationList(operation: OperationModel) {
    this.rowOperationsList.push(operation);
    this.dataStateChange(this.gridStateGammes);
  }

  getUnitOfMesureCode(value) {
    this.selectedUnitOfMesure = value;
    return value.code;
  }

  private saveEditedHandler(rowIndex, formGroup, data) {
    const operationGamme: any = this.operationsGamme[rowIndex];
    operationGamme.id = this.operationFormGroup.value.id;
    operationGamme.operation = this.operationFormGroup.value.operation;
    operationGamme.NET_TIME_EQUIPMENTS = this.operationFormGroup.value.equipmentTimeNet;
    operationGamme.equipment = '';
    operationGamme.productNomenclature = '';
    operationGamme.person = '';
    operationGamme.unitOfMeasure = this.selectedUnitOfMesure ? this.selectedUnitOfMesure.code :
      this.operationFormGroup.value.unitOfMeasure ? this.getUnitOfMesureCode(
        this.listUnitOfMeasure.filter(r => r.code === this.operationFormGroup.value.unitOfMeasure)[0]) : '';
    operationGamme.order = this.operationFormGroup.value.order;
    operationGamme.personTimeNet = this.operationFormGroup.value.personTimeNet;
    if (this.operationFormGroup.value.operationBeforeDtos) {
      operationGamme.operationBeforeDtos = this.operationFormGroup.value.operationBeforeDtos.description;
    } else {
      operationGamme.operationBeforeDtos = null;
    }
    if (this.operationFormGroup.value.equipment) {
      this.operationFormGroup.value.equipment.forEach(eq => {
        operationGamme.equipment += eq.description + ',';
      });
    }
    if (this.operationFormGroup.value.productNomenclatures) {
      this.operationFormGroup.value.productNomenclatures.forEach(pn => {
        operationGamme.productNomenclature += pn.Code + ',';
      });
    }
    if (this.operationFormGroup.value.responsibleId) {
      this.operationFormGroup.value.responsibleId.forEach(person => {
        operationGamme.person += person.FullName + ',';
      });
    }
    const updatedGammeOperation = this.operationFormGroup.value;
    updatedGammeOperation.gamme = operationGamme.gamme;
    updatedGammeOperation.id = operationGamme.id;
    this.gridData.splice(rowIndex, 1, operationGamme);
    this.gridSettingsGammes.gridData = {data: this.gridData, total: this.gridData.length};
    this.operationsGamme.splice(rowIndex, 1, this.operationFormGroup.value);
    this.addNewOperationToRowOperationList(operationGamme);
    this.dataStateChange(this.gridStateGammes);
  }

  private closeEditor(grid: { closeRow: (arg0: number) => void; }, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
    }
  }

  private createOperationLineForm(operationModel?: OperationModel): void {

    this.userService.getAllUserWithoutState().subscribe(result => {

      this.listUsers = result.data;
    });
    this.getOperationsListAndBeforeTodoList();
    this.beforeOperation = null;
    this.operationFormGroup = new FormGroup({
      id: new FormControl(),
      operation: new FormControl(operationModel.operation, Validators.required),
      equipment: new FormControl(operationModel.equipment),
      equipmentTimeNet: new FormControl(operationModel.equipmentTimeNet),
      operationBeforeDtos: this.nbGammeOperations > 0 ? new FormControl(operationModel.operationBeforeDtos, Validators.required) :
        new FormControl(operationModel.operationBeforeDtos),
      unitOfMeasure: new FormControl(operationModel.unitOfMeasure, Validators.required),
      productNomenclatures: new FormControl(''),
      responsibleId: new FormControl(''),
      personTimeNet: new FormControl(operationModel.personTimeNet),
      costMachines: new FormControl(''),
      costPersons: new FormControl(''),
      order: new FormControl('', Validators.required),
      disabledEquipmentTimeNetColumn: new FormControl(true),
      disabledPersonTimeNetColumn: new FormControl(true),
    });
    this.setOrderNumberBeforAddingNewLineOperationOrUpdatedOrDeleted();
  }

  setOrderNumberBeforAddingNewLineOperationOrUpdatedOrDeleted(previousOrder?) {
    if (this.operationsGamme.length === NumberConstant.ZERO) {
      this.operationFormGroup.patchValue({
        'order': NumberConstant.ONE,
      });
    } else if (previousOrder) {
      const calculateOrder = parseInt(previousOrder) + NumberConstant.ONE;
      this.operationFormGroup.patchValue({
        'order': calculateOrder,
      });
    }
  }

  changeCurrentPredecessor(event) {
    const findOp = this.operationsGamme.find(op => op.operation.id === event.id);
    this.setOrderNumberBeforAddingNewLineOperationOrUpdatedOrDeleted(findOp.order);
  }

  public removeOperationHandler(event: any) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        if (this.isUpdateMode) {
          this.subscription$ = this.gammeOperationService.getJavaGenericService()
            .deleteEntity(event.dataItem.id, GammeOperationConstant.DELETE_GAMME_OPERATION_URL)
            .subscribe(() => {
              const index: number = this.gridSettingsGammes.gridData.data.indexOf(event.dataItem);
              if (index !== -1) {
                this.operationsGamme.content.splice(index, 1);
                this.gridSettingsGammes.gridData.data.splice(index, 1);
              }
              this.dataStateChange(this.gridStateGammes);
              this.growlService.successNotification(this.translate.instant(GammeConstant.SUCCESS_OPERATION));
            }, () => {
              this.growlService.ErrorNotification(this.translate.instant(GammeConstant.FAILURE_OPERATION));
            });
        } else {
          const index: number = this.rowOperationsList.indexOf(event.dataItem);
          if (index !== -1) {
            this.operationsGamme.splice(index, 1);
            this.gridSettingsGammes.gridData.data.splice(index, 1);
          }
          this.dataStateChange(this.gridStateGammes);
        }
      }
    });
  }

  initializeProductNomenclatureAndResponsiblesIdsFromJava() {
    forkJoin(
      this.gammeService.getAllResponsibles(),
      this.productNomenclatureService.getJavaGenericService().getEntityList()
    ).subscribe(result => {
      this.listResponsiblesJava = result[NumberConstant.ZERO];
      this.listProductNomenclatureFromJava = result[NumberConstant.ONE];
    });
  }

  public saveOrEditGammeClick() {
    this.getAllSelectedProductNomenclature();
    if (this.formGroup.valid && this.isOperationsGammesNotEmpty()) {
      this.gammeService.callService(Operation.POST, '', this.mapToGammeDto()).subscribe(() => {
        this.growlService.successNotification(this.translate.instant(GammeConstant.SUCCESS_OPERATION));
        this.router.navigateByUrl(GammeConstant.URL_GAMME_LIST);
      });
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
      this.validationService.validateAllFormFields(this.operationFormGroup);
    }
  }

  mapToGammeDto() {
    const gammeToBeUpdatedOrAdded: Gamme = new Gamme();
    const gammeOperations: any = [];
    if (this.idGammeOnUpdate > 0) {
      gammeToBeUpdatedOrAdded.reference = this.gamme.reference;
      gammeToBeUpdatedOrAdded.costPrice = this.gamme.costPrice;
      gammeToBeUpdatedOrAdded.costPriceCalculatedDate = this.gamme.costPriceCalculatedDate;
      gammeToBeUpdatedOrAdded.id = this.idGammeOnUpdate;
    } else {
      gammeToBeUpdatedOrAdded.reference = this.gammeReference;
    }
    const area: Area = new Area();
    area.id = 1;
    gammeToBeUpdatedOrAdded.area = area;
    gammeToBeUpdatedOrAdded.articleId = this.formGroup.value.IdItem;
    gammeToBeUpdatedOrAdded.area = this.formGroup.value.areaId;
    this.operationsGamme.forEach(gammeOp => {
      gammeOperations.push(this.mapToGammeOperationDto(gammeOp));
    });
    gammeToBeUpdatedOrAdded.gammeOperations = gammeOperations;
    return gammeToBeUpdatedOrAdded;
  }

  mapToProductNomenclaturesDto(productNoemnclature) {
    const selectedProductNomenclaturesDto = [];
    if (this.idGammeOnUpdate > 0) {
      const findEquivalent = this.listProductNomenclatureFromJava
        .filter((NomenclatureJava) => productNoemnclature
          .find(product => NomenclatureJava.productId === (product.productId || product.Id)));
      if (findEquivalent.length > 0) {
        findEquivalent.forEach(diff => {
          selectedProductNomenclaturesDto.push(diff);
        });
      }
    }
    return selectedProductNomenclaturesDto;
  }

  mapToGammeOperationDto(gammeOp) {
    const gammeOperationDto: any = {};
    gammeOperationDto.id = gammeOp.id;
    gammeOperationDto.machineTimeNet = gammeOp.equipmentTimeNet ? gammeOp.equipmentTimeNet :
      gammeOp.machineTimeNet;
    gammeOperationDto.operation = gammeOp.operation;
    gammeOperationDto.personTimeNet = gammeOp.personTimeNet;
    gammeOperationDto.productNomenclatures = this.idGammeOnUpdate > 0 ?
      this.mapToProductNomenclaturesDto(gammeOp.productNomenclatures) : gammeOp.productNomenclatures;
    gammeOperationDto.machines = gammeOp.equipment ? gammeOp.equipment : gammeOp.machines;
    gammeOperationDto.unitOfMeasure = this.listUnitOfMeasure.filter(unit => gammeOp.unitOfMeasure === unit.code)[0];
    if ((gammeOp.operationBeforeDtos && gammeOp.operationBeforeDtos.length !== NumberConstant.ZERO) || gammeOp.operationBefore) {
      gammeOperationDto.operationBefore = gammeOp.operationBeforeDtos ? gammeOp.operationBeforeDtos : gammeOp.operationBefore;
    } else {
      gammeOperationDto.operationBefore = null;
    }
    gammeOperationDto.order = gammeOp.order;
    gammeOperationDto.responsibles = gammeOp.responsibleId ? this.mapResponsiblesDto(gammeOp.responsibleId) : gammeOp.responsibles;
    gammeOperationDto.costMachines = gammeOp.costMachines;
    // costPersons c'est la moyenne des costPerson il va etre calculer !
    gammeOperationDto.costPersons = gammeOp.costPersons;
    return gammeOperationDto;
  }

  mapResponsiblesDto(responsibles) {
    const responsiblesDto: any = [];
    this.listResponsiblesJava.forEach(model => {
      responsibles.forEach(dto => {
        if (model.email === dto.Email) {
          responsiblesDto.push(model);
        }
      });
    });
    const findDifference = responsibles
      .filter((responsable) => !this.listResponsiblesJava.find(responsableJava => responsable.Email === responsableJava.email));
    if (findDifference.length > 0) {
      findDifference.forEach(newResponsible => {
        responsiblesDto.push({idResponsable: newResponsible.Id, email: newResponsible.Email, costPerson: NumberConstant.ONE});
      });
    }
    return responsiblesDto;
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
    if (this.dragAndDropSubscription$) {
      this.dragAndDropSubscription$.unsubscribe();
    }
  }

  initGridData() {
    this.spinner = true;
    this.isUpdateMode = true;
    this.subscription$ = this.gammeService.getJavaGenericService()
      .getEntityById(this.idGammeOnUpdate)
      .subscribe(data => {
        this.gamme = JSON.parse(JSON.stringify(data));
        this.operationsGamme = this.operationsGamme.concat(data.gammeOperations);
        this.userService.getAllUserWithoutState().subscribe(result => {
          this.listUsers = result.data;
          this.gamme.gammeOperations.forEach(go => {
            if (go.hasOwnProperty('machines')) {
              go.equipment = '';
              go.machines.forEach(eq => {
                go.equipment += eq.description + ',';
              });
              delete go.machines;
            }

            if (go.hasOwnProperty('unitOfMeasure')) {
              go.unitOfMeasure = go.unitOfMeasure ? go.unitOfMeasure.code : '';
            }

            if (go.hasOwnProperty('machineTimeNet')) {
              go.NET_TIME_EQUIPMENTS = go.machineTimeNet;
              delete go.machineTimeNet;
            }
            if (go.hasOwnProperty('responsibles')) {
              go.person = '';
              this.listUsers.forEach(user => {
                if (go.responsibles.find(selected => selected.idResponsable === user.Id)) {
                  go.person += user.FullName + ',';
                }
              });
              delete go.responsibles;
            }
            if (go.hasOwnProperty('operationBefore')) {
              if (go.operationBefore) {
                go.operationBeforeDtos = go.operationBefore.description;
              } else {
                go.operationBeforeDtos = go.operationBefore;
              }
              delete go.operationBefore;
            }
            if (go.hasOwnProperty('productNomenclatures')) {
              this.caseProductNomenclatures(go);
            }
            this.listOperations = this.listOperations.concat(go.operation);
          });
        });
        const affectedOperations: any[] = [];
        this.operationsGamme.forEach(og => {
          affectedOperations.push(og.operation);
        });
        affectedOperations.filter((affected) => {
          this.listOperations = this.listOperations.filter((op) => {
            return op.id !== affected.id;
          });
        });
        this.idItemSelected = this.gamme.articleId;
        this.listItems = Array.from(new Set(this.listItems.concat(affectedOperations)));
        this.gridData = this.gridData.concat(this.gamme.gammeOperations);
        this.gridSettingsGammes.gridData = {data: this.gridData, total: this.gridData.length};
        this.formGroup.patchValue({
          reference: this.gamme.reference,
          IdItem: this.gamme.articleId,
          areaId: this.gamme.area,
          operationLines: this.gamme.gammeOperations
        });
        this.spinner = false;
        this.itemDropDown.ngOnInit();
        this.createOperationLineForm(new OperationModel());
      });
  }

  private caseProductNomenclatures(go) {
    const idsItems = [];
    let listItems = [];
    go.productNomenclature = '';
    go.productNomenclatures.forEach(pn => {
      idsItems.push(pn.productId);
    });
    this.itemService.getItemListDetailByIds(idsItems).subscribe(items => {
      listItems = items;
      go.productNomenclatures.forEach(pn => {
        const item = listItems.find(article => article.Id === pn.productId);
        this.allSelectedProductNomenclatures.push(item);
        go.productNomenclature += item.Description + ',';
      });
      delete go.productNomenclatures;
    });
  }

  initUnitOfMesureDropDown() {

    this.unitOfMesureJavaService.callService(Operation.GET, '').subscribe((result) => {
      this.listUnitOfMeasure = [];
      this.listUnitOfMeasure = result;
    });
  }


  ngOnInit() {
    this.initUnitOfMesureDropDown();
    this.userService.getAllUserWithoutState().subscribe(result => {
      this.listUsers = result.data;
    });
    this.getMachinesList();
    this.initializeProductNomenclatureAndResponsiblesIdsFromJava();
    if (this.idGammeOnUpdate > 0) {
      this.initGridData();
    } else {
      this.getLastCode();
      this.itemDropDown.ngOnInit();
      const gamme = new Gamme();
      this.formGroup = new FormGroup({
        'reference': new FormControl(gamme.reference),
        'IdItem': new FormControl(gamme.articleId),
        'areaId': new FormControl(gamme.area),
        operationLines: new FormControl(this.rowOperationsList)
      });
    }
  }


  onSelectOperation($event: any[]) {
    this.selectedOperationBeforeDtos = $event;
  }

  async itemSelect($event) {
    if ($event && $event.itemFiltredDataSource && $event.itemForm && $event.itemForm.value[PurchaseRequestConstant.ID_ITEM]) {
      const itemValue: any[] = ($event.itemFiltredDataSource.filter(c => c.Id === $event.itemForm.value[PurchaseRequestConstant.ID_ITEM]));
      if (itemValue && itemValue.length > 0) {
        this.item = itemValue[0];
        this.formGroup.patchValue({
          IdItem: this.item.Id
        });
        this.getProductNomenclatureList(this.item.Id);
      }
    }
  }


  onEquipmentsChanged() {
    if (this.operationFormGroup.value.equipment.length) {
      this.operationFormGroup.get('equipmentTimeNet').setValidators([Validators.required]);
      const sumCosts = this.operationFormGroup.value.equipment.reduce((total, currentValue) => {
        return total + currentValue.costPerHour;
      }, 0);
      this.operationFormGroup.patchValue({
        disabledEquipmentTimeNetColumn: false,
        costMachines: (sumCosts / this.operationFormGroup.value.equipment.length).toFixed(4)
      });
    } else {
      this.operationFormGroup.get('equipmentTimeNet').clearValidators();
      this.operationFormGroup.patchValue({
        disabledEquipmentTimeNetColumn: true,
        costMachines: '0'
      });
    }
    this.operationFormGroup.controls['equipmentTimeNet'].updateValueAndValidity();
  }

  onUnitOfMeasureChanged(event) {
    this.listUnitOfMeasure.forEach(unit => {
      if (unit.id === event) {
        this.selectedUnitOfMesure = unit;
      }
    });
    this.unitOfMeasure = event;
    this.operationFormGroup.patchValue({
      unitOfMeasure: event,
    });
  }

  onPersonsChanged(event) {
    if (event.length >= NumberConstant.ONE) {
      this.operationFormGroup.get('personTimeNet').setValidators([Validators.required]);
      let timeNet = 0;
      event.forEach((emp, index) => {
        // This call will be changed to commercial call !
        timeNet += NumberConstant.ONE;
        if (index === event.length - 1) {
          timeNet = timeNet / event.length / 365 / 24;
        }
        this.operationFormGroup.patchValue({
          disabledPersonTimeNetColumn: false,
          costPersons: timeNet.toFixed(4),
        });
      });
    } else {
      this.operationFormGroup.patchValue({
        disabledPersonTimeNetColumn: true
      });
      this.operationFormGroup.get('personTimeNet').clearValidators();
    }
    this.operationFormGroup.controls['personTimeNet'].updateValueAndValidity();
  }

  getProductNomenclatureList(articleId) {
    this.nomenclatureService.getJavaGenericService().getEntityList().subscribe(result => {
      if (result && result.length > 0) {
        this.listProductNomenclature = [];
        if (!this.checkIfSelectedGammeContainsNomenclatureProducts(result, articleId)) {
          this.emptyGammePorducts = true;
          this.growlService.ErrorNotification(this.translate.instant(GammeConstant.FAIL_GAMME_GET_NOMENCLATURE));
        } else {
          this.emptyGammePorducts = false;
        }
        result.forEach(nomenenclature => {
          if (nomenenclature.productId === articleId) {
            this.productNomenclatureService.getJavaGenericService().getEntityList().subscribe(res => {
              res.forEach(productNomenclature => {
                if (nomenenclature.id === productNomenclature.nomenclatureId.id) {
                  this.itemService.getProductById(productNomenclature.productId).subscribe(article => {
                    article.id = productNomenclature.id;
                    if (this.listProductNomenclature.indexOf(article) === -1) {
                      this.listProductNomenclature.push(article);
                    }
                  });
                }
              });
            });
          }
        });
      }
    });
  }

  checkIfSelectedGammeContainsNomenclatureProducts(nomenclatures, articleId): boolean {
    return (nomenclatures.findIndex(nomnclature => nomnclature.productId === articleId) > -1);
  }

  getOperationsListAndBeforeTodoList(source?) {
    if (this.listOperations.length === 0 || source === SharedConstant.GAMME) {
      this.operationService.getJavaGenericService().getEntityList().subscribe(result => {
        if (result && result.length > 0) {
          this.listOperations = result;
        }
      });
    } else {
      if (this.operationsGamme.length) {
        const affectedOperations: any[] = [];
        this.operationsGamme.forEach(og => {
          affectedOperations.push(og.operation);
        });
        affectedOperations.filter((affected) => {
          this.listOperations = this.listOperations.filter((op) => {
            return op.id !== affected.id;
          });
        });
        this.listItems = Array.from(new Set(this.listItems.concat(affectedOperations)));
      }
    }
  }

  eliminateSelectedItemInPredecesseurColumn(operation) {
    const operationIndex = this.listItems.findIndex(op => op.id === operation.id);
    if (operationIndex > 0) {
      this.listItems.splice(operationIndex, 1);
    } else if (operationIndex === NumberConstant.ZERO) {
      this.listItems = [];
    }
  }

  private getLastCode() {
    this.gammeService.callService(Operation.GET, 'get-last-code').subscribe((result) => {
      this.gammeReference = result.GAMME_REFERENCE;
      this.formGroup.controls['reference'].patchValue(this.gammeReference);
      this.formGroup.controls['reference'].disable();
    });
  }

  public onProductNomenclaturesChanged(event) {
    this.selectedProductNomenclatures = event;
    if (this.idGammeOnUpdate > 0) {
      this.allSelectedProductNomenclatures = this.allSelectedProductNomenclatures.concat(event);
    }
  }

  removeTag(e) {
    if (this.idGammeOnUpdate > 0) {
      if (this.allSelectedProductNomenclatures
        .indexOf(this.allSelectedProductNomenclatures.find(product => product.Id === e.dataItem.Id)) !== -1) {
        this.allSelectedProductNomenclatures
          .splice(this.allSelectedProductNomenclatures
            .indexOf(this.allSelectedProductNomenclatures.find(product => product.Id === e.dataItem.Id)), 1);
      }
    }
  }

  getMachinesList() {
    this.machineService.getJavaGenericService().getEntityList().subscribe(result => {
      this.listMachines = result;
    });
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

  getAllSelectedProductNomenclature() {
    this.allSelectedProductNomenclatures = [];
    this.operationsGamme.forEach(go => {
      this.allSelectedProductNomenclatures = this.allSelectedProductNomenclatures.concat(go.productNomenclatures);
    });
  }

  selectedAreaId($event) {

    if ($event.areaFiltredList && $event.form && $event.form.value[MachineConstant.AREA_ID]) {
      this.currentArea = ($event.areaFiltredList.filter(c => c.id === $event.form.value[MachineConstant.AREA_ID])[0]);
      this.formGroup.controls['areaId'].setValue(this.currentArea);
    }
  }


  addNew(component): void {
    let modalTitle = '';
    if (component === 'unitOfMeasure') {
      modalTitle = ItemConstant.CREATE_STOCKUNIT;
      this.formModalDialogService.openDialog(modalTitle, AddMeasureUnitComponent, this.viewRef,
        this.close.bind(this), {source: SharedConstant.GAMME}, true, SharedConstant.MODAL_DIALOG_SIZE_L);
    } else if (component === 'operation') {
      modalTitle = ItemConstant.CREATE_OPERATION;
      this.formModalDialogService.openDialog(modalTitle, AddOperationComponent, this.viewRef,
        this.close.bind(this), {source: SharedConstant.GAMME}, true, SharedConstant.MODAL_DIALOG_SIZE_L);
    }

  }

  get IdUnitStock(): FormGroup {
    return this.formGroup.get('unitOfMeasure') as FormGroup;
  }

  public close(data) {
    if (data) {
      if (data.source === SharedConstant.GAMME) {
        this.getOperationsListAndBeforeTodoList(SharedConstant.GAMME);
        this.operationFormGroup.patchValue({
          operation: data
        });
      } else {
        this.initUnitOfMesureDropDown();
        this.selectedUnitOfMesure = data;
        this.operationFormGroup.patchValue({
          unitOfMeasure: data.code,
        });
      }
    }
    this.modalDialogInstanceService.closeAnyExistingModalDialog();
  }

  splitItAndReturnArray(pattern) {
    if (pattern) {
      const splitText = pattern.split(',');
      return splitText.map((text, index) => {
        return splitText[index] !== splitText[splitText.length - NumberConstant.ONE] ? text + ',' : text;
      });
    }
  }

  private isOperationsGammesNotEmpty() {
    const listOperations = this.isUpdateMode ? this.operationsGamme.content ?
      this.operationsGamme.content.length : this.operationsGamme.length : this.operationsGamme.length;
    if (listOperations === NumberConstant.ZERO) {
      this.growlService.ErrorNotification(this.translate.instant(GammeConstant.GAMME_OPERATION_DELETE_OPERATION));
      return false;
    } else {
      return true;
    }
  }
}
