import {Component, ComponentRef, OnInit} from '@angular/core';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {NatureService} from '../../../shared/services/nature/nature.service';
import {DataStateChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {Filter, Operation, PredicateFormat} from '../../../shared/utils/predicate';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {unique, ValidationService} from '../../../shared/services/validation/validation.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {Nature} from '../../../models/administration/nature.model';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {NatureCodeEnum} from '../../../models/enumerators/nature-code.enum';
import { MediaConstant } from '../../../constant/utility/Media.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const NATURE_EDIT_URL = 'main/settings/administration/nature/edit/';
const NATURE_ADD_URL = 'main/administration/nature/add';
const API_GET_DATA_WITH_SPEC_FILTRE = 'getDataWithSpecificFilter';
@Component({
  selector: 'app-list-nature',
  templateUrl: './list-nature.component.html',
  styleUrls: ['./list-nature.component.scss']
})

export class ListNatureComponent implements OnInit {
  isAdvancedAdd = false;
  // Edited Row index
  private editedRowIndex: number;
  // Grid quick add
  public productTypeFormGroup: FormGroup;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicateList: PredicateFormat[];
  public predicate: PredicateFormat;
  /**
   * button Advanced Edit visibility
   */
  private btnEditVisible: boolean;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public hasAddNaturePermission: boolean;
  public hasUpdateNaturePermission: boolean;
  public hasDeleteNaturePermission: boolean;
  public hasShowNaturePermission: boolean;
  nature: string;

  /* Grid state
  */
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  public editCode = false;

  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: 'Code',
      title: 'CODE',
      filterable: true,
      _width: 240
    },
    {
      field: 'Label',
      title: 'DESIGNATION',
      filterable: true,
      _width: 240
    },
    {
      field: 'IsStockManaged',
      title: 'MANAGE_IN_STOCK',
      filterable: true,
      _width: 240
    }
  ];

// Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(public natureService: NatureService, private router: Router, private translate: TranslateService,
    private authService: AuthService,
              private validationService: ValidationService, private swalWarrings: SwalWarring, private fb: FormBuilder) {
    this.btnEditVisible = true;
  }

  ngOnInit() {
    this.hasAddNaturePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_NATURE);
    this.hasDeleteNaturePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_NATURE);
    this.hasShowNaturePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_NATURE);
    this.hasUpdateNaturePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_NATURE);
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
    this.predicateList = [this.predicate];
    this.natureService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicateList, API_GET_DATA_WITH_SPEC_FILTRE)
      .subscribe(data => {
        this.prepareList(data);
        this.gridSettings.gridData.data.forEach(nature => {
          this.disableDelete(nature);
        });
      });
  }
  prepareList(result) {
    // get first picture
    if (result) {
      const data = result.data;
      this.loadNaturePicture(data);
      data.forEach(product => {
        product.image = MediaConstant.PLACEHOLDER_PICTURE;
      });
    }
    this.gridSettings.gridData = result;
  }

  private loadNaturePicture(natureList: Nature[]) {
    var naturePicturesUrls = [];
    natureList.forEach((nature: Nature) => {
      naturePicturesUrls.push(nature.UrlPicture);
    });
    if (naturePicturesUrls.length > NumberConstant.ZERO) {
      this.natureService.getPictures(naturePicturesUrls, false).subscribe(naturePictures => {
        this.fillNaturePictures(natureList, naturePictures);
      });
    }
  }
  private fillNaturePictures(natureList, naturePictures) {
    natureList.map((nature: Nature) => {
      if (nature.UrlPicture) {
        let dataPicture = naturePictures.objectData.find(value => value.FulPath === nature.UrlPicture);
        if (dataPicture) {
          nature.image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
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
      this.productTypeFormGroup = undefined;
    }
    this.btnEditVisible = true;
  }

  /**
   * Quick add
   * @param param0
   */
  public addHandler({sender}) {
    this.closeEditor(sender);
    this.editCode = true;
    this.productTypeFormGroup = new FormGroup({
      Code: new FormControl('', {
        validators: Validators.required, asyncValidators: unique('Code', this.natureService, String(0)),
        updateOn: 'blur'
      }),
      Label: new FormControl('', Validators.required),
      IsStockManaged: new FormControl(false),
    });
    sender.addRow(this.productTypeFormGroup);
    this.btnEditVisible = false;

  }

  /**
   * Quick edit
   * @param param0
   */
  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    this.editCode = false;
    this.productTypeFormGroup = this.fb.group({
      Id: [dataItem.Id, Validators.required],
      Code: new FormControl(dataItem.Code, {
        validators: Validators.required, asyncValidators: unique('Code', this.natureService, String(0)),
        updateOn: 'blur'
      }),
      Label: [dataItem.Label, Validators.required],
      IsStockManaged: [dataItem.IsStockManaged],
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.productTypeFormGroup);
    this.btnEditVisible = false;
  }

  /**
   * Save handler
   * @param param0
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {

      const item: Nature = (formGroup as FormGroup).getRawValue();
      this.natureService.save(item, isNew, this.predicate).subscribe(() => this.initGridDataSource());

      sender.closeRow(rowIndex);
      this.btnEditVisible = true;
      this.editCode = false;

    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(SharedConstant.SWAL_TEXT_NATURE, SharedConstant.SWAL_TITLE_NATURE, SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.natureService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }


  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(NATURE_EDIT_URL + dataItem.Id, {queryParams: dataItem, skipLocationChange: true});

  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
  }

  public receiveData(event: any) {
    this.initGridDataSource();
  }

  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(SharedConstant.CODE, Operation.contains, this.nature, false, true));
    this.predicate.Filter.push(new Filter(SharedConstant.LABEL, Operation.contains, this.nature, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

//make delete button enable just fro new nature
  disableDelete(nature) {
    if (nature.Code === NatureCodeEnum.Produit || nature.Code === NatureCodeEnum.Service ||
      nature.Code === NatureCodeEnum.Expense || nature.Code === NatureCodeEnum.Ristourne || nature.Code === NatureCodeEnum.AdvancePayment) {
      nature.disableDelete = true;
    } else {
      nature.disableDelete = false;
    }
  }
}
