import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {process, State} from '@progress/kendo-data-query';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {PipelineConstant} from '../../../../constant/crm/pipeline.constant';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {PagerSettings, RowClassArgs} from '@progress/kendo-angular-grid';
import {StatusCrm} from '../../../../models/crm/statusCrm.model';
import {PopupAddStatusOpportunityComponent} from '../../opportunity/add-status-opportunity/popup-add-status-opportunity.component';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {StatusOpportunityService} from '../../../services/list-status-opportunity/status-opportunity.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {PipelineStep} from '../../../../models/crm/PipelineStep';
import {PipelineState} from '../../../../models/crm/enums/PipelineState';
import {EnumValues} from 'enum-values';
import {PipelineService} from '../../../services/pipeline/pipeline.service';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {Pipeline} from '../../../../models/crm/Pipeline';
import {Observable} from 'rxjs/Observable';
import {PipelineListComponent} from '../pipeline-list/pipeline-list.component';
import {Subscription} from 'rxjs/Subscription';
import {pairwise, take, tap} from 'rxjs/operators';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {GenericCrmService} from '../../../generic-crm.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AddStatusComponent} from '../../status-opportunity/add-status/add-status.component';

const tableRow = node => node.tagName.toLowerCase() === 'tr';

const closest = (node, predicate) => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }

  return node;
};

@Component({
  selector: 'app-setting-category-and-dropdowns',
  templateUrl: './setting-category-and-dropdowns.component.html',
  styleUrls: ['./setting-category-and-dropdowns.component.scss']
})
export class SettingCategoryAndDropdownsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(PipelineListComponent) pipelineListComponent: PipelineListComponent;


  allStatusList: StatusCrm[] = [];
  public statusFormGroup: FormGroup;
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
      field: PipelineConstant.ORDER_FIELD,
      title: PipelineConstant.ORDER_TITLE,
      filterable: true,
      _width: 160
    },
    {
      field: PipelineConstant.STEP_FIELD,
      title: PipelineConstant.STEP_TITLE,
      filterable: true,
      _width: 160
    },
    {
      field: PipelineConstant.COLOR_FIELD,
      title: PipelineConstant.COLOR_TITLE,
      filterable: true,
      _width: 160
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


  public intermediateSteps: Array<PipelineStep> = [];
  public initialStep: Array<PipelineStep> = [];
  public finalFailureStep: Array<PipelineStep> = [];
  public finalSuccessSteps: Array<PipelineStep> = [];

  public pipeLineFromList;
  public innaceptableInitialStepLength = false;
  public innaceptableFinalSuccessStepLength = false;

  public rowIsOpened = false;
  private uniqueId = 0;
  private uniqueIntermediateOrder = 1;

  public pipelineFormGroup: FormGroup;

  public intermediateStepsGridData: any;

  public cursorStyle = 'default';

  public openedKendoGridRow: any;
  private dataItemInEditMode;
  private idPipeline: number;
  private isSaveOperation: boolean;
  public isUsedByCategory = false;

  constructor(private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              private pipelineService: PipelineService,
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
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getDataFromUrl();
    this.createFormGroup();
    this.createStepsFormGroup();
    this.createRowFormGroupByStateOrStep();
    this.getAllStatus();
    this.initPipelineDetails();
    this.checkIfUsedByCategory();
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
    this.pipelineFormGroup = this.formBuilder.group({
      Id: [0],
      name: ['', [Validators.required]]
    });
  }

  getDataFromUrl() {
    this.activatedRoute.params.subscribe(params => {
      this.idPipeline = +params['id'] || 0;
      this.isUpdateMode = this.idPipeline > 0;
    });
  }

  checkIfUsedByCategory() {
    this.pipelineService.usedByCategory(this.idPipeline).subscribe((data) => {
        this.isUsedByCategory = data;
      }
    );

  }

  // public getPipelineFromList(event) {
  //   this.isDetailsMode = false;
  //   this.isUpdateMode = false;
  //   if (event.operation === PipelineConstant.UPDATE_OPERATIONS && event.data) {
  //     this.cursorStyle = 'move';
  //     this.isUpdateMode = true;
  //     this.initPipelineDetails(event);
  //   } else if (event.operation === PipelineConstant.CLOSE_ROW_OPERATIONS) {
  //     this.pipeLineFromList = null;
  //     this.cursorStyle = 'default';
  //     this.initListDataSources();
  //     this.clearFormArray();
  //   } else if (event.operation === PipelineConstant.START_ADD_OPERATIONS) {
  //     this.cursorStyle = 'move';
  //     this.uniqueIntermediateOrder = 1;
  //     this.pipeLineFromList = null;
  //     this.initListDataSources();
  //     this.clearFormArray();
  //     this.makeKendoRowsDragable();
  //   } else if (event.operation === PipelineConstant.DETAILS_OPERATIONS) {
  //     this.closeAllOpenRows();
  //     this.cursorStyle = 'default';
  //     this.isDetailsMode = true;
  //     this.initPipelineDetails(event);
  //   }
  // }

  private reorderRowsByOrder() {
    const orders = [];
    const ids = [];
    this.intermediateStepsGridData.data.forEach((step) => {
      ids.push(step.id);
      orders.push(step.order);
    });
    const newList = [];
    this.intermediateSteps.map((step, index) => {
      const st = this.intermediateSteps.find((stepFound) => stepFound.id === ids[index]);
      st.order = orders[index];
      newList.push(st);
    });
    this.intermediateSteps = newList;
    this.sorStepsByOrder();
    this.reorderAllStepsOrder();
    this.processGridData();
  }

  private sorStepsByOrder() {
    let newOrder = 2;
    this.intermediateSteps.map((step) => {
      step.order = newOrder;
      newOrder++;
    });
  }

  private orderList() {
    this.intermediateSteps.sort(function (a, b) {
      return a.order - b.order;
    });
  }

  private initPipelineDetails() {
    this.initListDataSources();
    this.clearFormArray();
    if (this.idPipeline) {
      this.pipelineService.getJavaGenericService().getEntityById(this.idPipeline).subscribe((pipeline: Pipeline) => {
        this.pipelineFormGroup.patchValue(pipeline);
        this.pipeLineFromList = pipeline;
        this.getDataLists();
      });
    }
  }

  private getDataLists() {
    const allSteps = this.pipeLineFromList.pipelineSteps;
    if (allSteps && allSteps.length > NumberConstant.ONE) {
      allSteps.forEach((step: PipelineStep) => {
        this.pushStepInAppropriateDataList(step);
        this.createRowFormGroupByStateOrStep(undefined, step);
        this.allSteps.push(this.statusFormGroup);
        this.uniqueIntermediateOrder = this.intermediateSteps.length + 1;
      });
    }
    this.orderList();
    this.processGridData();
    if (!this.isUsedByCategory) {
      this.makeKendoRowsDragable();
    }
  }

  public deleteFromIntermediateSteps(event) {
    this.swalWarring.CreateSwal(this.translate.instant(PipelineConstant.PUP_UP_DELETE_STEP_TEXT)).then((result) => {
      if (result.value) {
        this.removeElementFromFormArray(event.dataItem);
        this.inDeleteIntermStSubmission(event.dataItem);
        this.uniqueIntermediateOrder--;
      }
    });
  }

  private inDeleteIntermStSubmission(element) {
    this.decrementFailureStepOrder();
    this.decrementSuccessStepOrder();
    this.decrementAllStepsOrderValueByState();
    this.intermediateSteps = this.intermediateSteps.filter((step) => step.id !== element.id);
    this.processGridData();
  }

  private removeElementFromFormArray(element) {
    this.allSteps.removeAt(this.allSteps.value.findIndex((step) => {
      return step.id === element.id;
    }));
  }

  public deleteFromInitialSteps(dataItem) {
    this.swalWarring.CreateSwal(this.translate.instant(PipelineConstant.PUP_UP_DELETE_STEP_TEXT)).then((result) => {
      if (result.value) {
        this.removeElementFromFormArray(dataItem);
        this.initialStep = [];
      }
    });
  }

  public deleteFromFailureSteps(event) {
    this.swalWarring.CreateSwal(this.translate.instant(PipelineConstant.PUP_UP_DELETE_STEP_TEXT)).then((result) => {
      if (result.value) {
        this.removeElementFromFormArray(event.dataItem);
        this.finalFailureStep = [];
        if (this.finalSuccessSteps.length > 0) {
          this.decrementSuccessStepOrder();
          this.decrementSuccessStepOrderValueInFormArray();
        }
      }
    });
  }

  public deleteFromSuccessSteps(event) {
    this.swalWarring.CreateSwal(this.translate.instant(PipelineConstant.PUP_UP_DELETE_STEP_TEXT)).then((result) => {
      if (result.value) {
        this.removeElementFromFormArray(event.dataItem);
        this.finalSuccessSteps = [];
        if (this.finalSuccessSteps.length > 0) {
          this.decrementFailureStepOrder();
          this.decrementFailureStepOrderValueInFormArray();
        }
      }
    });
  }

  private processGridData() {
    this.intermediateStepsGridData = process(this.intermediateSteps, this.gridState);
  }

  addNew() {
    this.formModalDialogService.openDialog('', AddStatusComponent,
      this.viewRef, this.updateStatusList.bind(this)
      , undefined, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  private updateStatusList(data) {
    this.getAllStatus();
  //  this.statusFormGroup.controls[PipelineConstant.COLOR_TITLE].setValue(data.title);
    if ( data) {
      this.statusFormGroup.controls['relatedStatus'].setValue(data);
      this.statusFormGroup.controls[PipelineConstant.COLOR_FIELD].setValue(data.color);
    }
  }
  private getAllStatus() {
    this.allStatusList = [];
    this.statusOpportunityService.getJavaGenericService().getEntityList(CrmConstant.STATUTS)
      .subscribe(data => {
          this.allStatusList = data;
        }
      );
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
    switch (stateIndex) {
      case PipelineState.INITIAL_STATE :
        this.innaceptableInitialStepLength = false;
        this.createRowFormGroupByStateOrStep(EnumValues.getNameFromValue(PipelineState, PipelineState.INITIAL_STATE));
        break;
      case PipelineState.INTERMEDIATE_STATE :
        this.createRowFormGroupByStateOrStep(EnumValues.getNameFromValue(PipelineState, PipelineState.INTERMEDIATE_STATE));
        break;
      case PipelineState.SUCCESS_FINAL_STATE :
        this.innaceptableFinalSuccessStepLength = false;
        this.createRowFormGroupByStateOrStep(EnumValues.getNameFromValue(PipelineState, PipelineState.SUCCESS_FINAL_STATE));
        break;
      case PipelineState.FAILURE_FINAL_STATE :
        this.createRowFormGroupByStateOrStep(EnumValues.getNameFromValue(PipelineState, PipelineState.FAILURE_FINAL_STATE));
        break;
    }
    sender.addRow(this.statusFormGroup);
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
      this.statusFormGroup = this.formBuilder.group({
        id: [dataItem ? dataItem.id : this.uniqueId],
        order: [dataItem ? dataItem.order : this.getOrderByState(dataItem),
          [Validators.required]],
        relatedStatus: [dataItem ? dataItem.relatedStatus : undefined, [Validators.required,
          this.crmGenericService.uniqueValueInFormArray(Observable.of(this.allSteps), 'relatedStatus')]],
        color: [dataItem ? dataItem.relatedStatus.color : undefined, Validators.required],
        state: [dataItem ? dataItem.state : 'state']
      });
      sender.editRow(rowIndex, this.statusFormGroup);
    }
  }

  private validateForms() {
    this.innaceptableInitialStepLength = false;
    this.innaceptableFinalSuccessStepLength = false;
    let isValid = true;
    if (this.initialStep.length < 1) {
      this.innaceptableInitialStepLength = true;
      isValid = false;
    }
    if (this.finalSuccessSteps.length < 1) {
      this.innaceptableFinalSuccessStepLength = true;
      isValid = false;
    }
    return isValid && this.pipelineFormGroup.valid;
  }

  private createRowFormGroupByStateOrStep(state?, step?: PipelineStep) {
    this.generateTemporaryId();
    this.allSteps.updateValueAndValidity();
    this.statusFormGroup = this.formBuilder.group({
      id: [step ? step.id : this.uniqueId],
      order: [step ? step.order : this.getOrderByState(state),
        [Validators.required]],
      relatedStatus: [step ? step.relatedStatus : undefined, [Validators.required,
        this.crmGenericService.uniqueValueInFormArray(Observable.of(this.allSteps), 'relatedStatus')]],
      color: [step ? step.relatedStatus.color : undefined, Validators.required],
      state: [step ? step.state : state]
    });
  }

  private getOrderByState(state): number {
    switch (state) {
      case EnumValues.getNameFromValue(PipelineState, PipelineState.INITIAL_STATE) :
        return NumberConstant.ONE;
      case EnumValues.getNameFromValue(PipelineState, PipelineState.INTERMEDIATE_STATE) :
        return ++this.uniqueIntermediateOrder;
      case EnumValues.getNameFromValue(PipelineState, PipelineState.SUCCESS_FINAL_STATE) :
        return this.finalFailureStep.length !==
        NumberConstant.ZERO ? this.intermediateSteps.length + NumberConstant.THREE : this.intermediateSteps.length + NumberConstant.TWO;
      case EnumValues.getNameFromValue(PipelineState, PipelineState.FAILURE_FINAL_STATE) :
        return this.intermediateSteps.length + NumberConstant.TWO;
    }
  }


  private updateOrderInAllGrids(state) {
    switch (state) {
      case EnumValues.getNameFromValue(PipelineState, PipelineState.INITIAL_STATE) :
        break;
      case EnumValues.getNameFromValue(PipelineState, PipelineState.INTERMEDIATE_STATE) :
        this.incrementFailureStepOrder();
        this.incrementSuccessStepOrder();
        break;
      case EnumValues.getNameFromValue(PipelineState, PipelineState.FAILURE_FINAL_STATE) :
        this.incrementSuccessStepOrder();
        break;
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
    if ((state === EnumValues.getNameFromValue(PipelineState, PipelineState.INTERMEDIATE_STATE))) {
      this.allSteps.controls.forEach((control: FormGroup) => {
        if (control.controls['state'].value === EnumValues.getNameFromValue(PipelineState, PipelineState.FAILURE_FINAL_STATE)
          || control.controls['state'].value === EnumValues.getNameFromValue(PipelineState, PipelineState.SUCCESS_FINAL_STATE)) {
          control.controls['order'].setValue(control.controls['order'].value + 1);
        }
      });
    } else if ((state === EnumValues.getNameFromValue(PipelineState, PipelineState.FAILURE_FINAL_STATE))) {
      this.allSteps.controls.forEach((control: FormGroup) => {
        if (control.controls['state'].value === EnumValues.getNameFromValue(PipelineState, PipelineState.SUCCESS_FINAL_STATE)) {
          control.controls['order'].setValue(control.controls['order'].value + 1);
        }
      });
    }
  }

  /**
   * for final success & failure states
   */
  private decrementAllStepsOrderValueByState() {
    this.allSteps.controls.forEach((control: FormGroup) => {
      if (control.controls['state'].value === EnumValues.getNameFromValue(PipelineState,
        PipelineState.FAILURE_FINAL_STATE)
        || control.controls['state'].value === EnumValues.getNameFromValue(PipelineState,
          PipelineState.SUCCESS_FINAL_STATE)) {
        control.controls['order'].setValue(control.controls['order'].value + -1);
      }
    });
  }

  /**
   * for final success & failure states
   */
  private decrementSuccessStepOrderValueInFormArray() {
    this.allSteps.controls.forEach((control: FormGroup) => {
      if (control.controls['state'].value === EnumValues.getNameFromValue(PipelineState,
        PipelineState.SUCCESS_FINAL_STATE)) {
        control.controls['order'].setValue(control.controls['order'].value + -1);
      }
    });
  }

  /**
   * for final success & failure states
   */
  private decrementFailureStepOrderValueInFormArray() {
    this.allSteps.controls.forEach((control: FormGroup) => {
      if (control.controls['state'].value === EnumValues.getNameFromValue(PipelineState,
        PipelineState.FAILURE_FINAL_STATE)
      ) {
        control.controls['order'].setValue(control.controls['order'].value + -1);
      }
    });
  }

  /**
   * for intermediate states
   */
  private reorderAllStepsOrder() {
    this.allSteps.controls.forEach((control: FormGroup) => {
      if (control.controls['state'].value === EnumValues.getNameFromValue(PipelineState, PipelineState.INTERMEDIATE_STATE)) {
        const st = this.intermediateSteps.find((step) => step.id === control.controls['id'].value);
        control.controls['order'].setValue(st.order);
      }
    });
  }

  private generateTemporaryId() {
    if (this.isUpdateMode) {
      const ids = [];
      this.intermediateSteps.forEach((step) => ids.push(step.id));
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

  public getStatusName(dataItem): string {
    if (dataItem) {
      return dataItem.relatedStatus.title;
    }
  }

  /**
   * Save the state
   * @param param
   */
  public saveStates({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      this.canUpdate = true;
      if (isNew) {
        this.allSteps.push(this.statusFormGroup);
        const step = formGroup.value;
        this.pushStepInAppropriateDataList(step);
        this.updateOrderInAllGrids(step.state);
        this.allSteps.updateValueAndValidity();
        this.incrementAllStepsOrderValueByState(step.state);
        this.processGridData();
        this.makeKendoRowsDragable();
        this.allSteps.updateValueAndValidity();
        if (step.state === EnumValues.getNameFromValue(PipelineState, PipelineState.INITIAL_STATE)) {
          this.innaceptableInitialStepLength = false;
        }
        if (step.state === EnumValues.getNameFromValue(PipelineState, PipelineState.SUCCESS_FINAL_STATE)) {
          this.innaceptableFinalSuccessStepLength = false;
        }
      } else {
        const step = formGroup.value;
        this.deleteStepFromAppropriateDataList(step);
        this.pushStepInAppropriateDataList(step);
        this.allSteps.push(this.statusFormGroup);
        if (step.state === EnumValues.getNameFromValue(PipelineState,
          PipelineState.INTERMEDIATE_STATE)) {
          this.reorderRowsByOrder();
          this.processGridData();
          this.dataItemInEditMode = null;
        }
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

  pushStepInAppropriateDataList(step: PipelineStep) {
    switch (step.state) {
      case EnumValues.getNameFromValue(PipelineState, PipelineState.INITIAL_STATE) :
        this.initialStep.push(step);
        break;
      case EnumValues.getNameFromValue(PipelineState, PipelineState.INTERMEDIATE_STATE) :
        this.intermediateSteps.push(step);
        break;
      case EnumValues.getNameFromValue(PipelineState, PipelineState.SUCCESS_FINAL_STATE) :
        this.finalSuccessSteps.push(step);
        break;
      case EnumValues.getNameFromValue(PipelineState, PipelineState.FAILURE_FINAL_STATE) :
        this.finalFailureStep.push(step);
        break;
    }
  }

  deleteStepFromAppropriateDataList(step: PipelineStep) {
    switch (step.state) {
      case EnumValues.getNameFromValue(PipelineState, PipelineState.INITIAL_STATE) :
        this.initialStep = [];
        break;
      case EnumValues.getNameFromValue(PipelineState, PipelineState.INTERMEDIATE_STATE) :
        this.intermediateSteps = this.intermediateSteps.filter((st) => st.id !== step.id);
        break;
      case EnumValues.getNameFromValue(PipelineState, PipelineState.SUCCESS_FINAL_STATE) :
        this.finalSuccessSteps = [];
        break;
      case EnumValues.getNameFromValue(PipelineState, PipelineState.FAILURE_FINAL_STATE) :
        this.finalFailureStep = [];
        break;
    }
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
      this.statusFormGroup.patchValue(this.dataItemInEditMode);
      this.allSteps.push(this.statusFormGroup);
    }
    this.canUpdate = true;
    this.closeEditor(sender, rowIndex);
  }

  public changeSelectedStatus(event) {
    if (event) {
      this.statusFormGroup.controls[PipelineConstant.COLOR_FIELD].setValue(event.color);
    }
  }

  public getColor(dataItem?) {
    if (dataItem) {
      return dataItem.relatedStatus.color;
    } else if (this.statusFormGroup.controls[PipelineConstant.COLOR_FIELD].value) {
      return this.statusFormGroup.controls[PipelineConstant.COLOR_FIELD].value;
    }
  }

  public saveOrUpdate() {
    if (this.validateForms()) {
      this.isSaveOperation = true;
      this.removeAllIds();
      this.pipeLineFromList = this.pipelineFormGroup.value;
      this.pipeLineFromList.pipelineSteps = this.allSteps.value;
      this.reorderStepsByOrder();
      if (!this.isUpdateMode) {
        this.save();
      } else {
        this.update();
      }
    } else if (!this.pipelineFormGroup.valid) {
      this.validationService.validateAllFormFields(this.statusFormGroup);
      this.validationService.validateAllFormFields(this.pipelineFormGroup);
    }
  }

  private reorderStepsByOrder() {
    this.pipeLineFromList.pipelineSteps.sort(function (a, b) {
      return a.order - b.order;
    });
  }

  private update() {
    this.pipelineService.getJavaGenericService().updateEntity(this.pipeLineFromList, this.idPipeline).subscribe((data) => {
      if (data.errorCode === PipelineConstant.PIPELINE_UNICITY_ERROR_CODE) {
        this.pipelineService.sendDataToPipelineList(({event: PipelineConstant.PIPELINE_NAME_IS_ALREADY_USED}));
      } else {
        this.growlService.successNotification(this.translate.instant(SharedCrmConstant.SUCCESS_OPERATION));
        this.pipelineService.sendDataToPipelineList({event: PipelineConstant.REFRESH_LIST});
        this.initListDataSources();
        this.pipeLineFromList = null;
        this.isUpdateMode = false;
        this.clearFormArray();
        this.backToList();
      }
    });
  }

  public save() {
    this.pipelineService.getJavaGenericService().saveEntity(this.pipeLineFromList).subscribe((data) => {
      if (data.errorCode === PipelineConstant.PIPELINE_UNICITY_ERROR_CODE) {
        this.statusFormGroup.controls['name'].markAsTouched();
      } else {
        this.growlService.successNotification(this.translate.instant(SharedCrmConstant.SUCCESS_OPERATION));
        this.backToList();
      }
    });
  }

  private initListDataSources() {
    this.initialStep = [];
    this.intermediateSteps = [];
    this.finalSuccessSteps = [];
    this.finalFailureStep = [];
    this.processGridData();
  }

  public getCursorStyle() {
    return this.cursorStyle;
  }

  public cancel() {
    this.pipelineService.sendDataToPipelineList({event: PipelineConstant.CANCEL});
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
        const dataItem = this.intermediateStepsGridData.data[draggedItemIndex];
        dataItem.dragging = true;
      }));

      sub.add(dragOver.subscribe((e: any) => {
        e.preventDefault();
        const dataItem = this.intermediateStepsGridData.data.splice(draggedItemIndex, 1)[0];
        const dropIndex = closest(e.target, tableRow).rowIndex;
        const dropItem = this.intermediateStepsGridData.data[dropIndex];

        draggedItemIndex = dropIndex;
        this.zone.run(() =>
          this.intermediateStepsGridData.data.splice(dropIndex, 0, dataItem)
        );
      }));

      sub.add(dragEnd.subscribe((e: any) => {
        e.preventDefault();
        const dataItem = this.intermediateStepsGridData.data[draggedItemIndex];
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
      return this.statusFormGroup.touched || this.stepsFormGroup.touched;
    }
  }

  backToList() {
    this.router.navigateByUrl(PipelineConstant.LIST_URL);
  }
}
