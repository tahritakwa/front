import {Component, OnInit, ComponentRef} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {SubModel} from '../../models/inventory/sub-model.model';
import {unique, ValidationService} from '../../shared/services/validation/validation.service';
import {DataStateChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {SwalWarring} from '../../shared/components/swal/swal-popup';
import {GridSettings} from '../../shared/utils/grid-settings.interface';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../shared/utils/column-settings.interface';
import {PredicateFormat, Filter, Operation} from '../../shared/utils/predicate';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {SubModelService} from '../services/sub-model/sub-model.service';
import {ModelOfItemService} from '../services/model-of-item/model-of-item.service';
import {ItemConstant} from '../../constant/inventory/item.constant';
import {Router} from '@angular/router';
import {FileInfo} from '../../models/shared/objectToSend';
import { NumberConstant } from '../../constant/utility/number.constant';
import { MediaConstant } from '../../constant/utility/Media.constant';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';
const ID_MODEL_NAVIGATION_LABEL = 'IdModelNavigation.Label';

const API_GET_DATA_WITH_SPEC_FILTRE = 'getDataWithSpecificFilter';

@Component({
  selector: 'app-list-sub-models',
  templateUrl: './list-sub-models.component.html',
  styleUrls: ['./list-sub-models.component.scss']
})
export class ListSubModelsComponent implements OnInit {
  public columnActionsWidth = SharedConstant.COLUMN_ACTIONS_WIDTH;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicateList: PredicateFormat[];
  public predicate: PredicateFormat;
  public subModelFormGroup: FormGroup;
  private editedRowIndex: number;
  submodelFilter: string;
  public hasAddSubModelPermission: boolean;
  public hasUpdateSubModelPermission: boolean;
  public hasDeleteSubModelPermission: boolean;
  public hasShowSubModelPermission: boolean;
  private dataT: {
    'Id': 0,
    'Code': '',
    'Label': '',
    'Model': '',
    'PictureFileInfo' : FileInfo
  };
  private models;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  private btnEditVisible: boolean;
  public columnsConfig: ColumnSettings[] = [
    {
      field: ItemConstant.CODE_COLUMN,
      title: ItemConstant.CODE_TITLE,
      filterable: false,
      _width: 240
    },
    {
      field: ItemConstant.DESIGNATION_COLUMN,
      title: ItemConstant.DESIGNATION_TITLE,
      filterable: false,
      _width: 240
    },
    {
      field: ItemConstant.MODEL_COLUMN,
      title: ItemConstant.MODEL_TITLE,
      filterable: false,
      _width: 280
    }
  ];
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
public api  = 'getSubModelList';
  constructor(public subModelService: SubModelService, private modelOfItemService: ModelOfItemService, private fb: FormBuilder,
              private authService: AuthService,
              private validationService: ValidationService, private swalWarrings: SwalWarring, private router: Router) {
    this.btnEditVisible = true;
  }

  ngOnInit() {
    this.hasAddSubModelPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_SUBMODEL);
    this.hasDeleteSubModelPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_SUBMODEL);
    this.hasShowSubModelPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_SUBMODEL);
    this.hasUpdateSubModelPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_SUBMODEL);
    this.initGridDataSource();
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
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.models = [];
    this.predicateList = [this.predicate];
    this.subModelService.getSubModelList(this.gridSettings.state, this.predicate)
    .subscribe(subModelsList => {
      this.prepareList(subModelsList);
      });
  }

  /**
   * Close editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.subModelFormGroup = undefined;
    }
    this.btnEditVisible = true;
  }

  /**
   * Cancel
   * @param param0
   */
  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
  }

  /**
   * Save handler
   * @param param0
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      const item: SubModel = formGroup.value;
      this.subModelService.save(item, isNew, this.predicate).subscribe(() => this.initGridDataSource());
      sender.closeRow(rowIndex);
      this.btnEditVisible = true;
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subModelService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(ItemConstant.SUB_MODEL_ADVANCED_EDIT.concat(dataItem.Id));
  }


  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(SharedConstant.CODE, Operation.contains, this.submodelFilter, false, true));
    this.predicate.Filter.push(new Filter(SharedConstant.LABEL, Operation.contains, this.submodelFilter, false, true));
    this.predicate.Filter.push(new Filter(ID_MODEL_NAVIGATION_LABEL, Operation.contains, this.submodelFilter, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
  prepareList(result) {
    // get first picture
    if (result) {
      const data = result.data || result.listData;
      this.loadModelPicture(data);
      data.forEach(model => {
        model.image = MediaConstant.PLACEHOLDER_PICTURE;
      });
    }
    this.gridSettings.gridData = result;
    this.gridSettings.gridData.data = result.listData;
    this.gridSettings.gridData.total = result.total;
  }

  private loadModelPicture(modelList: SubModel[]) {
    var modelPicturesUrls = [];
    modelList.forEach((model: SubModel) => {
      modelPicturesUrls.push(model.UrlPicture);
    });
    if (modelPicturesUrls.length > NumberConstant.ZERO) {
      this.subModelService.getPictures(modelPicturesUrls, false).subscribe(modelPictures => {
        this.fillModelPictures(modelList, modelPictures);
      });
    }
  }
  private fillModelPictures(modelList, modelPictures) {
    modelList.map((model: SubModel) => {
      if (model.UrlPicture) {
        let dataPicture = modelPictures.objectData.find(value => value.FulPath === model.UrlPicture);
        if (dataPicture) {
          model.image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }
}
