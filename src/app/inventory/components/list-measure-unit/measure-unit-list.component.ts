import {Component, OnInit, ComponentRef} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {PagerSettings, DataStateChangeEvent} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {PredicateFormat, Filter, Operation} from '../../../shared/utils/predicate';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ItemConstant} from '../../../constant/inventory/item.constant';
import {MeasureUnitService} from '../../../shared/services/mesure-unit/measure-unit.service';
import {Router} from '@angular/router';
import {PeriodConstant} from '../../../constant/Administration/period.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
const MEASURE_UNIT_CODE = 'MeasureUnitCode';
const DESCRIPTION = 'Description';

@Component({
  selector: 'app-add-measure-unit',
  templateUrl: './measure-unit-list.component.html',
  styleUrls: ['./measure-unit-list.component.scss']
})
export class MeasureUnitListComponent implements OnInit {

  public actionColumnWidth = SharedConstant.COLUMN_ACTIONS_WIDTH;

  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  /**
   * Form Group-
   */
  measureUnitFormGroup: FormGroup;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  // predicate
  public predicate: PredicateFormat;
  unite:string;
  public hasAddMeasureUnitPermission: boolean;
  public hasDeleteMeasureUnitPermission: boolean;
  public hasShowMeasureUnitPermission: boolean;
  public hasUpdateMeasureUnitPermission: boolean;

  /**
   * Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: ItemConstant.CODE_MEASURE_UNIT,
      title: ItemConstant.CODE_MEASURE_UNIT_UPPERCASE,
      filterable: false,
      _width: 240
    },
    {
      field: ItemConstant.LABEL,
      title: ItemConstant.LABEL_UPPERCASE,
      filterable: false,
      _width: 200
    },
    {
      field: ItemConstant.DESCRIPTION,
      title: ItemConstant.DESCRIPTION_UPPERCASE,
      filterable: false,
      _width: 240
    },
    {
      field: ItemConstant.ISDECOMPOSABLE,
      title: ItemConstant.ISDECOMPOSABLE_UPPERCASE,
      filterable: false,
      _width: 160
    },
    {
      field: ItemConstant.DIGITSAFTERCOMMA,
      title: ItemConstant.DIGITSAFTERCOMMA_UPPERCASE,
      filterable: false,
      _width: 160
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(public measureUnitService: MeasureUnitService, private fb: FormBuilder, private validationService: ValidationService,
              private router: Router, private authService: AuthService,
              private modalService: ModalDialogInstanceService, private swalWarrings: SwalWarring) {
  }

  ngOnInit() {
    this.hasAddMeasureUnitPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_MEASUREUNIT);
    this.hasDeleteMeasureUnitPermission =
     this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_MEASUREUNIT);
     this.hasUpdateMeasureUnitPermission =
      this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_MEASUREUNIT);
    this.hasShowMeasureUnitPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_MEASUREUNIT);
    this.initGridDataSource();
  }


  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
  }

  /**
   * init grid data
   */
  initGridDataSource() {
    this.measureUnitService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(ItemConstant.MEASURE_UNIT_DELETE_TEXT_MESSAGE,
      ItemConstant.MEASURE_UNIT_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.measureUnitService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.measureUnitService.reloadServerSideData(state).subscribe(data => this.gridSettings.gridData = data);

  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(ItemConstant.EDIT_URL.concat(String(dataItem.Id)), {skipLocationChange: true});
  }
  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(MEASURE_UNIT_CODE, Operation.contains, this.unite, false, true));
    this.predicate.Filter.push(new Filter(SharedConstant.LABEL, Operation.contains, this.unite, false, true));
    this.predicate.Filter.push(new Filter(DESCRIPTION, Operation.contains, this.unite, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
}
