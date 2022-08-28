import {Component, OnInit, ComponentRef} from '@angular/core';
import {PagerSettings, DataStateChangeEvent} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {PredicateFormat, Filter, Operation, Relation} from '../../shared/utils/predicate';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {IModalDialogOptions, IModalDialog} from 'ngx-modal-dialog';
import {ColumnSettings} from '../../shared/utils/column-settings.interface';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {GridSettings} from '../../shared/utils/grid-settings.interface';
import {SwalWarring} from '../../shared/components/swal/swal-popup';
import {ValidationService, unique} from '../../shared/services/validation/validation.service';
import {ModelOfItemService} from '../services/model-of-item/model-of-item.service';
import {ModelOfItem} from '../../models/inventory/model-of-item.model';
import {BrandService} from '../services/brand/brand.service';
import {Router} from '@angular/router';
import {ItemConstant} from '../../constant/inventory/item.constant';
import {FileInfo} from '../../models/shared/objectToSend';
import { NumberConstant } from '../../constant/utility/number.constant';
import { MediaConstant } from '../../constant/utility/Media.constant';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';
const API_GET_DATA_WITH_SPEC_FILTRE = 'getDataWithSpecificFilter';
const ID_VEHICULE_BRAND_NAVIGATION_LABEL = 'IdVehicleBrandNavigation.Label';

@Component({
  selector: 'app-list-model',
  templateUrl: './list-model.component.html',
  styleUrls: ['./list-model.component.scss']
})
export class ListModelComponent implements OnInit {
  public columnActionsWidth = SharedConstant.COLUMN_ACTIONS_WIDTH;
  public actionColumnTitle = SharedConstant.COLUMN_ACTIONS_TITLE;

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicateList: PredicateFormat[];
  public predicate: PredicateFormat;
  public modelFormGroup: FormGroup;
  private editedRowIndex: number;
  public modelsList: Array<ModelOfItem>;
  public hasAddModelPermission: boolean;
  public hasUpdateModelPermission: boolean;
  public hasDeleteModelPermission: boolean;
  public hasShowModelPermission: boolean;
  public itemId: number;
  modelFilter: string;
  private models;
  private dataT: {
    'Id': 0,
    'Code': '',
    'Label': '',
    'Brand': '',
    'UrlPicture': '',
    //PictureFileInfo: FileInfo
  };
  dialogOptions: Partial<IModalDialogOptions<any>>;
  private btnEditVisible: boolean;
  public columnsConfig: ColumnSettings[] = [
    {
      field: ItemConstant.CODE_COLUMN,
      title: ItemConstant.CODE_TITLE,
      filterable: false,
      _width: 280
    },
    {
      field: ItemConstant.DESIGNATION_COLUMN,
      title: ItemConstant.DESIGNATION_TITLE,
      filterable: false,
      _width: 240
    },
    {
      field: ItemConstant.BRAND_FIELD,
      title: ItemConstant.BRAND_TITLE,
      filterable: false,
      _width: 240
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

  constructor(public modelOfItemService: ModelOfItemService, private brandService: BrandService,
              private fb: FormBuilder, private validationService: ValidationService, private router: Router,
              private authService: AuthService,
              private swalWarrings: SwalWarring) {
    this.btnEditVisible = true;
  }

  ngOnInit() {
    this.hasAddModelPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_MODELOFITEM);
    this.hasDeleteModelPermission =
     this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_MODELOFITEM);
    this.hasShowModelPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_MODELOFITEM);
    this.hasUpdateModelPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_MODELOFITEM);
    this.preparePredicate();
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
    this.models = {
      data: [],
      total: 0
    };
    this.predicateList = [this.predicate];
    this.modelOfItemService.reloadServerSideDataWithListPredicate(this.gridSettings.state,
      this.predicateList, API_GET_DATA_WITH_SPEC_FILTRE)
      .subscribe((modelsList) => {
        this.prepareList(modelsList);
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
      this.modelFormGroup = undefined;
    }
    this.btnEditVisible = true;
  }

  /**
   * Quick edit
   * @param param0
   */
  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    this.modelFormGroup = this.fb.group({
      Id: [dataItem.Id, Validators.required],
      Code: [dataItem.Code, Validators.required, unique('Code', this.modelOfItemService, String(dataItem.Id))],
      Label: [dataItem.Label, Validators.required],
      Brand: [dataItem.Brand, Validators.required],
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.modelFormGroup);
    this.btnEditVisible = false;
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
   * Quick add
   * @param param0
   */
  public addHandler({sender}) {
    this.closeEditor(sender);
    this.modelFormGroup = new FormGroup({
      Code: new FormControl('', Validators.required, unique('Code', this.modelOfItemService, '0')),
      Label: new FormControl('', Validators.required),
      Brand: new FormControl({value: '', disabled: true}, Validators.required),
    });
    sender.addRow(this.modelFormGroup);
    this.btnEditVisible = false;
  }

  /**
   * Save handler
   * @param param0
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      const item: ModelOfItem = formGroup.value;
      if (!isNew) {
        this.modelOfItemService.save(item).subscribe(() => {
          this.modelsList[rowIndex] = item;
          this.gridSettings.gridData.data = this.modelsList.filter(x => x.IsDeleted === false);
          sender.closeRow(rowIndex);
        });
      } else if (isNew) {
        item.IdVehicleBrand = null;
        this.modelOfItemService.save(item, isNew, this.predicate).subscribe((data) => {
          if (data !== undefined) {
            this.itemId = data.Id;
            item.Id = this.itemId;
            this.modelsList.push(item);
            this.gridSettings.gridData.data = this.modelsList.filter(x => x.IsDeleted === false);
            this.gridSettings.gridData.total = this.gridSettings.gridData.data.length;
            sender.closeRow(rowIndex);
            this.btnEditVisible = true;
          }
        });
      }
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
   * Remove handler
   * @param dataItem
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(ItemConstant.MODEL_DELETE_TEXT_MESSAGE, ItemConstant.MODEL_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.modelOfItemService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(ItemConstant.MODEL_ADVANCED_EDIT.concat(dataItem.Id));
  }

  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(SharedConstant.CODE, Operation.contains, this.modelFilter, false, true));
    this.predicate.Filter.push(new Filter(SharedConstant.LABEL, Operation.contains, this.modelFilter, false, true));
    this.predicate.Filter.push(new Filter(ID_VEHICULE_BRAND_NAVIGATION_LABEL, Operation.contains, this.modelFilter, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push(new Relation(ItemConstant.VEHICULE_BRAND_NAVIGATION));
    this.initGridDataSource();
  }
  public preparePredicate(){
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push(new Relation(ItemConstant.VEHICULE_BRAND_NAVIGATION));
  }
  prepareList(result) {
    // get first picture
    if (result) {
      const data = result.data;
      this.loadModelPicture(data);
      data.forEach(model => {
        model.image = MediaConstant.PLACEHOLDER_PICTURE;
      });
    }
    this.gridSettings.gridData = result;
  }

  private loadModelPicture(modelList: ModelOfItem[]) {
    var modelPicturesUrls = [];
    modelList.forEach((model: ModelOfItem) => {
      modelPicturesUrls.push(model.UrlPicture);
    });
    if (modelPicturesUrls.length > NumberConstant.ZERO) {
      this.modelOfItemService.getPictures(modelPicturesUrls, false).subscribe(modelPictures => {
        this.fillModelPictures(modelList, modelPictures);
      });
    }
  }
  private fillModelPictures(modelList, modelPictures) {
    modelList.map((model: ModelOfItem) => {
      if (model.UrlPicture) {
        let dataPicture = modelPictures.objectData.find(value => value.FulPath === model.UrlPicture);
        if (dataPicture) {
          model.image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }

}
