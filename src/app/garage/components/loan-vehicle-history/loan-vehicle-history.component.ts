import { Component, OnInit, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GridComponent, PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, State } from '@progress/kendo-data-query';
import { EnumValues } from 'enum-values';
import { isNullOrUndefined } from 'util';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { InterventionLoanVehicleStatusEnumerator } from '../../../models/enumerators/intervention-loan-vehicle-status-.enum';
import { InterventionLoanVehicle } from '../../../models/garage/intervention-loan-vehicle.model';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { FileInfo, MediaInfo } from '../../../models/shared/objectToSend';
import { GalleryCardComponent } from '../../../shared/components/gallery-card/gallery-card.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation, SpecFilter } from '../../../shared/utils/predicate';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { InterventionLoanVehicleService } from '../../services/intervention-loan-vehicle/intervention-loan-vehicle.service';
import { InterventionService } from '../../services/intervention/intervention.service';

@Component({
  selector: 'app-loan-vehicle-history',
  templateUrl: './loan-vehicle-history.component.html',
  styleUrls: ['./loan-vehicle-history.component.scss']
})
export class LoanVehicleHistoryComponent implements OnInit {
  @Input() hasUpdatePermission: boolean;
  @ViewChild('grid') grid: GridComponent;
  idVehicle: number;
  gridFormGroup: FormGroup;
  private editedRowIndex: number;
  private editedRow: InterventionLoanVehicle;
  isEditingMode = false;
  files: Array<FileInfo> = [];
  public mediaInfos: MediaInfo[] = [];
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  dateFormat = this.translateService.instant(SharedConstant.DATE_FORMAT);
  loanVehicleStateDataSource: any[] = EnumValues.getNamesAndValues(InterventionLoanVehicleStatusEnumerator);
  public filterFieldsColumns: FiltrePredicateModel[] = [];
  public filterFieldsInputs: FiltrePredicateModel[] = [];
  predicateForAdvancedSearch: PredicateFormat;
  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    },
    sort: [
      {
        field: 'Id',
        dir: 'desc'
      }
    ],
    group: []
  };

  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.ID_TIERS_NAVIGATION_NAME,
      title: GarageConstant.CUSTOMER,
      filterable: true,
      tooltip: GarageConstant.CUSTOMER
    },
    {
      field: GarageConstant.LOAN_DATE,
      title: GarageConstant.LOAN_DATE_TITLE,
      filterable: true,
      tooltip: GarageConstant.LOAN_DATE_TITLE
    },
    {
      field: GarageConstant.EXPECTED_RETURN_DATE,
      title: GarageConstant.EXPECTED_RETURN_DATE_TITLE,
      filterable: true,
      tooltip: GarageConstant.EXPECTED_RETURN_DATE_TITLE
    },
    {
      field: GarageConstant.REAL_RETURN_DATE,
      title: GarageConstant.REAL_RETURN_DATE_TITLE,
      filterable: true,
      tooltip: GarageConstant.REAL_RETURN_DATE_TITLE
    },
    {
      field: GarageConstant.STATUS,
      title: GarageConstant.STATE_TITLE,
      filterable: true,
      tooltip: GarageConstant.STATE_TITLE
    }
  ];

  gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  predicate: PredicateFormat;
  public filterValue = '';
  public interventionLoanVehicleStatusEnum = InterventionLoanVehicleStatusEnumerator;

  constructor(private activatedRoute: ActivatedRoute, private interventionService: InterventionService, private fb: FormBuilder,
    private validationService: ValidationService, private interventionLoanVehicleService: InterventionLoanVehicleService,
    private formModalDialogService: FormModalDialogService, private viewContainerRef: ViewContainerRef,
    private translateService: TranslateService) {
    this.activatedRoute.params.subscribe(params => {
      this.idVehicle = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.predicateForAdvancedSearch = this.initialiseAllPredicates();
    this.initGridDataSource();
    this.loanVehicleStateDataSource.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translateService.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
    });
    this.initAdvancedFilterConfig();
  }

  initGridDataSource() {
    this.interventionService.getLoanVehicleHistory(this.gridSettings.state,
      this.predicateForAdvancedSearch, this.idVehicle).subscribe((data) => {
        this.gridSettings.gridData = new Object() as DataResult;
        this.gridSettings.gridData.data = data.listData;
        this.gridSettings.gridData.total = data.total;
      });
  }

  private initAdvancedFilterConfig() {
    // Static filter columns
    this.filterFieldsColumns.push(new FiltrePredicateModel(GarageConstant.CUSTOMER,
      FieldTypeConstant.customerComponent,
      GarageConstant.ID_INTERVENTION_TO_ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION_TO_ID_TIERS));

    this.filterFieldsColumns.push(new FiltrePredicateModel(GarageConstant.LOAN_DATE_TITLE,
      FieldTypeConstant.DATE_TYPE,
      GarageConstant.LOAN_DATE));

    this.filterFieldsColumns.push(new FiltrePredicateModel(GarageConstant.EXPECTED_RETURN_DATE_TITLE,
      FieldTypeConstant.DATE_TYPE,
      GarageConstant.EXPECTED_RETURN_DATE));

    // Dynamic filter columns
    this.filterFieldsInputs.push(new FiltrePredicateModel(GarageConstant.REAL_RETURN_DATE_TITLE,
      FieldTypeConstant.DATE_TYPE,
      GarageConstant.REAL_RETURN_DATE));
    this.filterFieldsInputs.push(new FiltrePredicateModel(GarageConstant.STATE_TITLE,
      FieldTypeConstant.INTERVENTION_LOAN_VEHICLE_STATUS_DROPDOWN_COMPONENT,
      GarageConstant.STATUS));
  }
  /**
  * Build the relations for predicates
  */
  initialiseAllPredicates(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(GarageConstant.ID_VEHICLE, Operation.eq, this.idVehicle));
    predicate.SpecFilter = new Array<SpecFilter>();
    predicate.SpecificRelation = new Array<string>();
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation,
      [new Relation(GarageConstant.ID_INTERVENTION_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation,
      [new Relation(GarageConstant.ID_INTERVENTION_NAVIGATION_TO_ID_RECEPTION_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation,
      [new Relation(GarageConstant.ID_INTERVENTION_NAVIGATION_TO_ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION)]);
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push.apply(predicate.OrderBy, [new OrderBy(GarageConstant.ID_UPPER_CASE, OrderByDirection.desc)]);
    return predicate;
  }
  filterFieldsInputsChange(filter) {
    this.predicateForAdvancedSearch.Filter = this.predicateForAdvancedSearch.Filter
      .filter(value => value.prop !== filter.fieldInput.columnName);
  }
  searchClick() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.gridSettings.state.take = NumberConstant.TWENTY;
    this.initGridDataSource();
  }

  advancedFilterPredicateChange(filtre) {
    this.prepareFiltreForAdvancedSearch(filtre);
  }
  resetClickEvent() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.gridSettings.state.take = NumberConstant.TWENTY;
    this.predicateForAdvancedSearch = this.initialiseAllPredicates();
    this.initGridDataSource();
  }
  /**
   * Prepare filter for advanced search
   * @private
   * @param filter
   */
  private prepareFiltreForAdvancedSearch(filter) {
    this.predicateForAdvancedSearch.Filter = this.predicateForAdvancedSearch.Filter.filter(value => value.prop !== filter.prop);
    if (filter.isDateFiltreBetween) {
      this.prepareDatesFiltresForAdvancedSearch(filter);
    } else if (filter.operation && !isNullOrUndefined(filter.value)) {
      this.predicateForAdvancedSearch.Filter.push(filter);
    }
  }
  /**
   * Prepare date filter
   * @private
   * @param filter
   */
  private prepareDatesFiltresForAdvancedSearch(filter) {
    if (isNotNullOrUndefinedAndNotEmptyValue(filter.filtres[NumberConstant.ZERO].value)) {
      this.predicateForAdvancedSearch.Filter.push(filter.filtres[NumberConstant.ZERO]);
    }
    if (isNotNullOrUndefinedAndNotEmptyValue(filter.filtres[NumberConstant.ONE].value)) {
      this.predicateForAdvancedSearch.Filter.push(filter.filtres[NumberConstant.ONE]);
    }
  }
  dataStateChange(state: State) {
    if (!this.isEditingMode) {
      this.gridSettings.state = state;
      this.initGridDataSource();
    } else {
      state = this.gridSettings.state;
    }
  }

  createFormGroup(dataItem?: any) {
    this.gridFormGroup = this.fb.group({
      RealReturnDate: [dataItem && dataItem.RealReturnDate ? new Date(dataItem.RealReturnDate) : undefined],
      Status: [dataItem ? dataItem.Status : undefined],
    });
  }

  editHandler({ sender, column, columnIndex, rowIndex, dataItem }) {
    if (!this.isEditingMode && this.hasUpdatePermission) {
      this.isEditingMode = true;
      this.editedRowIndex = rowIndex;
      this.editedRow = dataItem;
      this.createFormGroup(this.editedRow);
      this.grid.editRow(rowIndex, this.gridFormGroup);
    }
  }

  saveHandler({ dataItem, formGroup, isNew, rowIndex, sender }) {
    if ((formGroup as FormGroup).valid) {
      this.editedRow = Object.assign({}, this.editedRow, formGroup.getRawValue());
      if (this.editedRow.Status === this.interventionLoanVehicleStatusEnum.WithDamage) {
        this.mediaInfos.splice(NumberConstant.ZERO, this.mediaInfos.length);
        if (this.editedRow.VehiclePrictureInfo) {
          this.editedRow.VehiclePrictureInfo.forEach(picInfo => {
            this.mediaInfos.push(new MediaInfo(picInfo, SharedConstant.PICTURE_BASE + picInfo.FileData));
          });
        }
        const data = { mediaInfos: this.mediaInfos };
        this.formModalDialogService.openDialog(GarageConstant.IMPORT_VEHICLE_IMAGES, GalleryCardComponent,
          this.viewContainerRef, this.updateFiles.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
      } else {
        this.editedRow.VehiclePrictureInfo = [];
        this.interventionLoanVehicleService.save(this.editedRow, false).subscribe((data) => {
          this.closeEditor();
          this.initGridDataSource();
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.gridFormGroup);
    }
  }

  cancelHandler($event) {
    this.closeEditor();
  }

  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.gridFormGroup = undefined;
    this.isEditingMode = false;
  }

  public updateFiles(): void {
    this.files = [];
    this.mediaInfos.forEach(file => {
      file.fileInfo.FileData = file.fileInfo.Data !== undefined ? file.fileInfo.Data.toString() : file.fileInfo.FileData;
      file.fileInfo.Name = file.fileInfo.Name.replace(GarageConstant.REDUCED_IMAGE, '');
      this.files.push(file.fileInfo);
    });
    this.editedRow.VehiclePrictureInfo = this.files;
    this.interventionLoanVehicleService.save(this.editedRow, false).subscribe((result) => {
      this.mediaInfos.splice(NumberConstant.ZERO, this.mediaInfos.length);
      this.closeEditor();
      this.initGridDataSource();
    });
  }

  openLoanVehiclePicture(dataItem: InterventionLoanVehicle) {
    this.mediaInfos.splice(NumberConstant.ZERO, this.mediaInfos.length);
    if (dataItem.VehiclePrictureInfo) {
      dataItem.VehiclePrictureInfo.forEach(picInfo => {
        this.mediaInfos.push(new MediaInfo(picInfo, SharedConstant.PICTURE_BASE + picInfo.FileData));
      });
    }
    const data = { mediaInfos: this.mediaInfos, cannotUpdateFile: true };
    this.formModalDialogService.openDialog(GarageConstant.LIST_VEHICLE_IMAGES, GalleryCardComponent,
      this.viewContainerRef, null, data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  tiersPictureSrc(dataItem) {
    if (dataItem.TiersPictureFileInfo) {
      return SharedConstant.PICTURE_BASE + dataItem.TiersPictureFileInfo.Data;
    }
  }

}
