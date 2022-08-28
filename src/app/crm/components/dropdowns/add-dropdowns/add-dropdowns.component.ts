import {
  AfterViewInit,
  Component, ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DropdownConstant} from '../../../../constant/crm/dropdown.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {process, State} from '@progress/kendo-data-query';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {PagerSettings, RowClassArgs} from '@progress/kendo-angular-grid';
import {Observable} from 'rxjs/Observable';
import {PipelineStep} from '../../../../models/crm/PipelineStep';
import {DropdownService} from '../../../services/dropdowns/dropdown.service';
import {DropdownConfig} from '../../../../models/crm/DropdownConfig';
import {Subscription} from 'rxjs/Subscription';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {take, tap} from 'rxjs/operators';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {StatusCrm} from '../../../../models/crm/statusCrm.model';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {uniquePropCrmJavaServices, ValidationService} from '../../../../shared/services/validation/validation.service';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {GenericCrmService} from '../../../generic-crm.service';
import {StatusOpportunityService} from '../../../services/list-status-opportunity/status-opportunity.service';
import {AddStatusComponent} from '../../status-opportunity/add-status/add-status.component';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {DropdownConfigFiltres} from '../../../../models/crm/DropdownConfigFiltres';
import {StatusConstant} from '../../../../constant/crm/status.constant';
import {EnumValues} from 'enum-values';
import {ActionTypeEnum} from '../../../../models/crm/enums/actionType.enum';
import {DropdownType} from '../../../../models/crm/enums/dropdownType.enum';

const closest = (node, predicate) => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }

  return node;
};
const tableRow = node => node.tagName.toLowerCase() === 'tr';
const NAME_REFERENCE = 'name';

@Component({
  selector: 'app-add-dropdowns',
  templateUrl: './add-dropdowns.component.html',
  styleUrls: ['./add-dropdowns.component.scss']
})
export class AddDropdownsComponent implements OnInit, AfterViewInit, OnDestroy {

  public filtresFormGroup: FormGroup;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: DropdownConstant.ORDER_FIELD,
      title: DropdownConstant.ORDER_TITLE,
      filterable: true,
      _width: 50
    },
    {
      field: DropdownConstant.NAME_FIELD,
      title: DropdownConstant.NAME_TITLE,
      filterable: true,
      _width: 160
    },
    {
      field: DropdownConstant.LOCATION_FIELD,
      title: DropdownConstant.LOCATION_TITLE,
      filterable: true,
      _width: 50
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  pagerSettings: PagerSettings = {
    buttonCount: NumberConstant.FIVE, info: true, type: 'numeric', pageSizes: false, previousNext: true
  };

  private draggingSubscription: Subscription;

  public stepsFormGroup: FormGroup;
  public isUpdateMode = false;
  public canUpdate = true;


  public dropdownConfigFiltres: Array<DropdownConfigFiltres> = [];
  public initialStep: Array<PipelineStep> = [];
  public finalFailureStep: Array<PipelineStep> = [];
  public finalSuccessSteps: Array<PipelineStep> = [];

  public dropdownsFromList;
  public innaceptableInitialStepLength = false;
  public innaceptableFinalSuccessStepLength = false;

  public rowIsOpened = false;
  private uniqueId = 0;
  private uniqueIntermediateOrder = 0;

  public dropdownFormGroup: FormGroup;

  public dropdownFiltresGridData: any;

  public cursorStyle = 'default';

  public openedKendoGridRow: any;
  private dataItemInEditMode;
  private idDropdown: number;
  private isSaveOperation: boolean;
  public dropdownConfig: DropdownConfig = new DropdownConfig();
  public dropdownTypes = [];
  public dropdownTypesFilter = [];
  public checked = true;
  public requireLocation = false;

  constructor(private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              private validationService: ValidationService,
              private activatedRoute: ActivatedRoute,
              private translate: TranslateService,
              private swalWarring: SwalWarring,
              private crmGenericService: GenericCrmService,
              private growlService: GrowlService,
              private renderer: Renderer2,
              private zone: NgZone,
              private router: Router,
              private statusOpportunityService: StatusOpportunityService,
              private genericCrmService: GenericCrmService,
              private formBuilder: FormBuilder,
              private dropdownService: DropdownService) {
  }

  @ViewChild(NAME_REFERENCE) public nameInput: ElementRef;

  ngOnInit() {

    this.getDataFromUrl();
    this.createFormGroup();
    this.createStepsFormGroup();
    this.createRowFormGroupByStateOrStep();
    this.initDropdownDetails();
    this.initTypesDropDown();
  }

  checkIfActionType(dropdown: DropdownConfig) {
    if (dropdown.dropdownType == 'ACTION' && dropdown.name == 'Type') {
      this.requireLocation = true;
    } else {
      this.requireLocation = false;
    }
  }

  private initDropdownDetails() {
    this.initListDataSources();
    this.clearFormArray();
    if (this.idDropdown) {
      this.dropdownService.getJavaGenericService().getEntityById(this.idDropdown).subscribe((dropdown: DropdownConfig) => {
        dropdown.name = this.translate.instant(dropdown.name);
        this.dropdownFormGroup.patchValue(dropdown);
        this.dropdownsFromList = dropdown;
        this.checkIfActionType(dropdown);
        this.getDataLists();
      });
    }
  }

  initTypesDropDown() {
    const dropdownTypes = EnumValues.getNames(DropdownType);
    let dropdownTypesMapped: any;
    dropdownTypesMapped = dropdownTypes.map((dropdownType: any) => {
      return dropdownType = {enumValue: dropdownType, enumText: this.translate.instant(dropdownType)};
    });
    this.dropdownTypes = dropdownTypesMapped;
    this.dropdownTypesFilter = dropdownTypesMapped;
  }

  private getDataLists() {
    const allSteps = this.dropdownsFromList.dropdownConfigFiltres;
    if (allSteps) {
      allSteps.forEach((step: DropdownConfigFiltres) => {
        this.pushStepInAppropriateDataList(step);
        this.createRowFormGroupByStateOrStep(undefined, step);
        this.allSteps.push(this.filtresFormGroup);
        this.uniqueIntermediateOrder = this.dropdownConfigFiltres.length;
      });
    }
    this.orderList();
    this.processGridData();
    this.makeKendoRowsDragable();
  }

  ngAfterViewInit(): void {
    this.draggingSubscription = this.handleDragAndDrop();
  }

  clearFormArray() {
    while (this.allSteps.length !== 0) {
      this.allSteps.removeAt(0);
    }
    this.allSteps.reset();
  }

  private createFormGroup() {

    this.dropdownFormGroup = this.formBuilder.group({
      Id: [0],
      name: ['', {
        validators: [Validators.required],
        asyncValidators: uniquePropCrmJavaServices('name', this.dropdownService, 'INSERTED'), updateOn: 'blur'
      }],
      dropdownType: [Validators.required],
    });
  }

  getDataFromUrl() {
    this.activatedRoute.params.subscribe(params => {
      this.idDropdown = +params['id'] || 0;
      this.isUpdateMode = this.idDropdown > 0;
    });
  }


  onMouseOut() {
    this.nameInput.nativeElement.blur();
  }

  private reorderRowsByOrder() {
    const orders = [];
    const ids = [];
    this.dropdownFiltresGridData.data.forEach((step) => {
      ids.push(step.id);
      orders.push(step.order);
    });
    const newList = [];
    this.dropdownConfigFiltres.map((step, index) => {
      const st = this.dropdownConfigFiltres.find((stepFound) => stepFound.id === ids[index]);
      st.order = orders[index];
      newList.push(st);
    });
    this.dropdownConfigFiltres = newList;
    this.sorStepsByOrder();
    this.reorderAllStepsOrder();
    this.processGridData();
  }

  private sorStepsByOrder() {
    let newOrder = 1;
    this.dropdownConfigFiltres.map((step) => {
      step.order = newOrder;
      newOrder++;
    });
  }

  private orderList() {
    this.dropdownConfigFiltres.sort(function (a, b) {
      return a.order - b.order;
    });
  }


  public deleteFromIntermediateSteps(event) {
    this.swalWarring.CreateSwal(this.translate.instant(DropdownConstant.PUP_UP_DELETE_STEP_TEXT)).then((result) => {
      if (result.value) {
        this.removeElementFromFormArray(event.dataItem);
        this.inDeleteIntermStSubmission(event.dataItem);
        this.sorStepsByOrder();
        this.reorderAllStepsOrder();
        this.processGridData();
        this.uniqueIntermediateOrder--;
      }
    });
  }

  private inDeleteIntermStSubmission(element) {
    this.decrementFailureStepOrder();
    this.decrementSuccessStepOrder();
    this.decrementAllStepsOrderValueByState();
    this.dropdownConfigFiltres = this.dropdownConfigFiltres.filter((step) => step.id !== element.id);
    this.processGridData();
    this.makeKendoRowsDragable();
    this.allSteps.updateValueAndValidity();
  }

  private decrementAllStepsOrderValueByState() {
    this.allSteps.controls.forEach((control: FormGroup) => {
      control.controls['order'].setValue(control.controls['order'].value + -1);
    });
  }

  private removeElementFromFormArray(element) {
    this.allSteps.removeAt(this.allSteps.value.findIndex((step) => {
      return step.id === element.id;
    }));
  }

  public deleteFromInitialSteps(dataItem) {
    this.swalWarring.CreateSwal(this.translate.instant(DropdownConstant.PUP_UP_DELETE_STEP_TEXT)).then((result) => {
      if (result.value) {
        this.removeElementFromFormArray(dataItem);
        this.initialStep = [];
      }
    });
  }


  private processGridData() {
    this.dropdownFiltresGridData = process(this.dropdownConfigFiltres, this.gridState);
  }


  public get allSteps(): FormArray {
    return this.stepsFormGroup.controls['allSteps'] as FormArray;
  }

  private createStepsFormGroup() {
    this.stepsFormGroup = this.formBuilder.group({
      allSteps: this.formBuilder.array([]),
    });
  }

  public addStepRow({sender}, stateIndex) {
    this.rowIsOpened = true;
    this.openedKendoGridRow = sender;
    this.createRowFormGroupByStateOrStep(DropdownConstant.INTERMEDIATE_STATE);
    sender.addRow(this.filtresFormGroup);
    this.allSteps.updateValueAndValidity();
  }

  /***
   *
   * @param sender
   * @param rowIndex
   * @param dataItem
   */
  public editHandler({sender, rowIndex, dataItem}) {
    if (this.canUpdate) {
      this.canUpdate = false;
      this.removeElementFromFormArray(dataItem);
      this.dataItemInEditMode = dataItem;
      this.rowIsOpened = true;
      this.filtresFormGroup = this.formBuilder.group({
        id: [dataItem ? dataItem.id : this.uniqueId],
        order: [dataItem ? dataItem.order : this.getOrderByState(dataItem),
          [Validators.required]],
        name: [dataItem ? dataItem.name : '',
          [Validators.required, this.crmGenericService.uniqueValueInFormArray(Observable.of(this.allSteps), 'name')]],
        location: [dataItem ? dataItem.location : false, [Validators.required]]
      });
      sender.editRow(rowIndex, this.filtresFormGroup);
    }
  }


  private createRowFormGroupByStateOrStep(state?, step?: DropdownConfigFiltres) {
    this.generateTemporaryId();
    this.allSteps.updateValueAndValidity();
    this.filtresFormGroup = this.formBuilder.group({
      id: [step ? step.id : this.uniqueId],
      order: [step ? step.order : this.getOrderByState(state),
        [Validators.required]],
      name: [step ? step.name : '',
        [Validators.required, this.crmGenericService.uniqueValueInFormArray(Observable.of(this.allSteps), 'name')]],
      location: [step ? step.location : false, [Validators.required]]
    });
  }

  private getOrderByState(state): number {
    if (state) {
      return ++this.uniqueIntermediateOrder;
    }
  }


  private updateOrderInAllGrids(state) {
    if (state) {

      this.incrementFailureStepOrder();
      this.incrementSuccessStepOrder();

    }
  }

  private incrementFailureStepOrder() {
    if (this.finalFailureStep.length !== 0) {
      this.finalFailureStep[0].order++;
    }
  }

  private incrementSuccessStepOrder() {
    if (this.finalSuccessSteps.length !== 0) {
      this.finalSuccessSteps[0].order++;
    }
  }


  private decrementFailureStepOrder() {
    if (this.finalFailureStep.length !== 0) {
      this.finalFailureStep[0].order--;
    }
  }

  private decrementSuccessStepOrder() {
    if (this.finalSuccessSteps.length !== 0) {
      this.finalSuccessSteps[0].order--;
    }
  }

  private incrementAllStepsOrderValueByState(state) {
    if (state) {
      this.allSteps.controls.forEach((control: FormGroup) => {

        control.controls['order'].setValue(control.controls['order'].value + 1);

      });
    }
  }


  /**
   * for intermediate states
   */
  private reorderAllStepsOrder() {
    this.allSteps.controls.forEach((control: FormGroup) => {

      const st = this.dropdownConfigFiltres.find((step) => step.id === control.controls['id'].value);
      control.controls['order'].setValue(st.order);
      control.controls['name'].setValue(st.name);
      control.controls['location'].setValue(st.location);

    });
  }

  private generateTemporaryId() {
    if (this.isUpdateMode) {
      const ids = [];
      this.dropdownConfigFiltres.forEach((step) => ids.push(step.id));
      this.uniqueId = ids[ids.length - 1] + 1;
    } else {
      this.uniqueId++;
    }
  }

  private removeAllIds() {
    this.allSteps.controls.forEach(formGroup => {
      const fg = formGroup as FormGroup;
      fg.controls['id'].setValue(undefined);
    });
  }


  /**
   * Save the state
   * @param param
   */
  public saveStates({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      this.canUpdate = true;
      if (isNew) {
        this.allSteps.push(this.filtresFormGroup);
        const step = formGroup.value;
        this.pushStepInAppropriateDataList(step);
        this.updateOrderInAllGrids(step.state);
        this.allSteps.updateValueAndValidity();
        this.incrementAllStepsOrderValueByState(step.state);
        this.processGridData();
        this.makeKendoRowsDragable();
        this.allSteps.updateValueAndValidity();
      } else {
        const step = formGroup.value;
        this.deleteStepFromAppropriateDataList(step);
        this.pushStepInAppropriateDataList(step);
        this.allSteps.push(this.filtresFormGroup);

        this.reorderRowsByOrder();
        this.processGridData();
        this.dataItemInEditMode = null;

        this.allSteps.updateValueAndValidity();

        /**
         * here to do the update!
         */
      }
      sender.closeRow(rowIndex);
      this.closeEditor(sender, rowIndex);
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  pushStepInAppropriateDataList(step: DropdownConfigFiltres) {
    this.dropdownConfigFiltres.push(step);

  }

  deleteStepFromAppropriateDataList(step: DropdownConfigFiltres) {


    this.dropdownConfigFiltres = this.dropdownConfigFiltres.filter((st) => st.id !== step.id);


  }

  public closeEditor(grid, index) {
    this.rowIsOpened = false;
    this.dataItemInEditMode = null;
    grid.closeRow(index);
  }

  /**
   * Cancel the add or update of new City type
   * @param param0
   */
  public cancelHandler({sender, rowIndex}, arrayIndex?) {
    if (arrayIndex === 1) {
      this.uniqueIntermediateOrder--;
    }
    if (this.dataItemInEditMode) {
      this.filtresFormGroup.patchValue(this.dataItemInEditMode);
      this.allSteps.push(this.filtresFormGroup);
    }
    this.canUpdate = true;
    this.closeEditor(sender, rowIndex);
  }


  public saveOrUpdate() {
    if (this.dropdownFormGroup.valid) {
      this.isSaveOperation = true;
      this.removeAllIds();
      this.dropdownsFromList = this.dropdownFormGroup.value;
      this.dropdownsFromList.dropdownConfigFiltres = this.allSteps.value;
      this.dropdownConfig.dropdownConfigFiltres = this.allSteps.value;
      this.dropdownConfig.name = this.dropdownFormGroup.value.name;
      this.dropdownConfig.dropdownType = this.dropdownFormGroup.value.dropdownType;
      this.reorderStepsByOrder();
      if (!this.isUpdateMode) {
        this.save();
      } else {
        this.update();
      }
    } else if (!this.dropdownFormGroup.valid) {
      this.validationService.validateAllFormFields(this.filtresFormGroup);
      this.validationService.validateAllFormFields(this.dropdownFormGroup);
    }
  }

  private reorderStepsByOrder() {
    this.dropdownsFromList.dropdownConfigFiltres.sort(function (a, b) {
      return a.order - b.order;
    });
  }

  private update() {
    this.dropdownsFromList.id = this.idDropdown;
    this.dropdownService.getJavaGenericService().updateEntity(this.dropdownsFromList, this.dropdownsFromList.id).subscribe((data) => {

      this.growlService.successNotification(this.translate.instant(SharedCrmConstant.SUCCESS_OPERATION));
      this.initListDataSources();
      this.dropdownsFromList = null;
      this.isUpdateMode = false;
      this.clearFormArray();
      this.backToList();

    });
  }

  public save() {
    this.dropdownService.getJavaGenericService().saveEntity(this.dropdownConfig).subscribe((data) => {
      if (data.errorCode === DropdownConstant.DROPDOWN_UNICITY_ERROR_CODE) {
        this.filtresFormGroup.controls['name'].markAsTouched();
      } else {
        this.growlService.successNotification(this.translate.instant(SharedCrmConstant.SUCCESS_OPERATION));
        this.backToList();
      }
    });
  }

  private initListDataSources() {
    this.initialStep = [];
    this.dropdownConfigFiltres = [];
    this.finalSuccessSteps = [];
    this.finalFailureStep = [];
    this.processGridData();
  }

  public getCursorStyle() {
    return this.cursorStyle;
  }

  public cancel() {
    this.dropdownService.sendDataToDropdownList({event: DropdownConstant.CANCEL});
  }

  public ngOnDestroy(): void {
    this.draggingSubscription.unsubscribe();
  }


  private makeKendoRowsDragable() {
    this.processGridData();
    this.draggingSubscription.unsubscribe();
    this.zone.onStable.pipe(take(1))
      .subscribe(() => this.draggingSubscription = this.handleDragAndDrop());
  }

  public rowCallback(context: RowClassArgs) {
    return {
      dragging: context.dataItem.dragging
    };
  }

  private handleDragAndDrop(): Subscription {
    const sub = new Subscription(() => {
    });
    let draggedItemIndex;

    const tableRows = Array.from(document.querySelectorAll('.k-grid tr'));
    tableRows.forEach(item => {
      this.renderer.setAttribute(item, 'draggable', 'true');
      const dragStart = fromEvent<DragEvent>(item, 'dragstart');
      const dragOver = fromEvent(item, 'dragover');
      const dragEnd = fromEvent(item, 'dragend');

      sub.add(dragStart.pipe(
        tap(({dataTransfer}) => {
          try {
            const dragImgEl = document.createElement('span');
            dragImgEl.setAttribute('style', 'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;');
            document.body.appendChild(dragImgEl);
            dataTransfer.setDragImage(dragImgEl, 0, 0);
          } catch (err) {
            // IE doesn't support setDragImage
          }
        })
      ).subscribe(({target}) => {
        const row: HTMLTableRowElement = <HTMLTableRowElement>target;
        draggedItemIndex = row.rowIndex;
        const dataItem = this.dropdownFiltresGridData.data[draggedItemIndex];
        dataItem.dragging = true;
      }));

      sub.add(dragOver.subscribe((e: any) => {
        e.preventDefault();
        const dataItem = this.dropdownFiltresGridData.data.splice(draggedItemIndex, 1)[0];
        const dropIndex = closest(e.target, tableRow).rowIndex;
        const dropItem = this.dropdownFiltresGridData.data[dropIndex];

        draggedItemIndex = dropIndex;
        this.zone.run(() =>
          this.dropdownFiltresGridData.data.splice(dropIndex, 0, dataItem)
        );
      }));

      sub.add(dragEnd.subscribe((e: any) => {
        e.preventDefault();
        const dataItem = this.dropdownFiltresGridData.data[draggedItemIndex];
        dataItem.dragging = false;
        this.reorderRowsByOrder();
      }));
    });

    return sub;
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericCrmService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupTouched.bind(this));
  }

  isFormGroupTouched(): boolean {
    if (this.isSaveOperation) {
      return false;
    } else {
      return this.filtresFormGroup.touched || this.stepsFormGroup.touched;
    }
  }

  backToList() {
    this.router.navigateByUrl(DropdownConstant.LIST_URL);
  }


  public getStatusName(dataItem): string {
    if (dataItem) {
      return dataItem.name;
    }
  }

  public getStatusOrder(dataItem): number {
    if (dataItem) {
      return dataItem.order;
    }
  }

  public getLocation(dataItem): boolean {
    if (dataItem) {
      return dataItem.location;
    }
  }
}
