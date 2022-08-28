import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {State} from '@progress/kendo-data-query';
import {Filter, Operation, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {unique, ValidationService} from '../../../shared/services/validation/validation.service';
import {City} from '../../../models/administration/city.model';
import {CityService} from '../../services/city/city.service';
import {LanguageService} from '../../../shared/services/language/language.service';
import {Languages} from '../../../constant/shared/services.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {DataStateChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {Router} from '@angular/router';
import {CityConstant} from '../../../constant/Administration/city.constant';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

const COUNTRY_NAVIGATION = 'IdCountryNavigation';
const CITY_EDIT_URL = 'main/settings/administration/city/edit/';
@Component({
  selector: 'app-list-city',
  templateUrl: './list-city.component.html',
  styleUrls: ['./list-city.component.scss']
})
export class ListCityComponent implements OnInit {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  public formGroup: FormGroup;
  public isUpdateMode: boolean;
  public textName = this.languageService.selectedLang === Languages.FR.value ? 'IdCountryNavigation.NameFr' : 'IdCountryNavigation.NameEn';
  public hasAddCityPermission: boolean;
  public hasShowCityPermission: boolean;
  public hasDeleteCityPermission: boolean;
  public hasUpdateCityPermission: boolean;

  private editedRowIndex: number;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: 'Id',
      title: 'Id',
      filterable: false,

    },
    {
      field: 'Code',
      title: 'CODE',
      filterable: false,
      _width: 200
    },
    {
      field: 'Label',
      title: 'DESIGNATION',
      filterable: false,
      _width: 300
    },
    {
      field: this.textName,
      title: 'COUNTRY',
      filterable: false,
      _width: 200
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  city: string;
  constructor(public cityService: CityService, private swalWarrings: SwalWarring, private validationService: ValidationService,
    private authService: AuthService,
    private languageService: LanguageService, private router: Router) {
    this.preparePrediacte();
  }

  ngOnInit() {
    this.hasShowCityPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_CITY);
    this.hasAddCityPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_CITY);
    this.hasDeleteCityPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_CITY);
    this.hasUpdateCityPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_CITY);
    this.initGridDataSource();
  }
  initGridDataSource() {
    this.cityService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      }
      );
  }

  receiveCountryStatus($event) {
    if ($event !== undefined) {
      this.formGroup.value.IdCountry = $event;
    }
  }

  /**
   * Ann new row in grid for add new City type
   * @param param0
   */
  public addHandler({ sender }) {
    this.isUpdateMode = false;
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Code: new FormControl('', { validators: Validators.required, asyncValidators: unique('Code', this.cityService, String(0)),
        updateOn: 'blur'}),
      Label: new FormControl('', Validators.required),
      IdCountry: new FormControl(undefined, Validators.required)
    });
    sender.addRow(this.formGroup);
  }
  /**
   * Cancel the add or update of new City type
   * @param param0
   */
  public cancelHandler({ sender, rowIndex }) {
    this.receiveCountryStatus(1);
    this.closeEditor(sender, rowIndex);
  }
  /**
   * Remove an item of City type
   * @param param
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(CityConstant.CITY_DELETE_TEXT_MESSAGE, CityConstant.CITY_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.cityService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }
  /**
   * Close the editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
  /**
   * Save the new City type
   * @param param
   */
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    if ((formGroup as FormGroup).valid) {
      const city: City = formGroup.value;
      this.cityService.save(city, isNew, this.predicate).subscribe(() => {
        this.initGridDataSource();
      });
      sender.closeRow(rowIndex);
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }
  /**
   * Edit the column on which the user clicked
   * @param param
   */
  public editHandler({ sender, rowIndex, dataItem }) {
    this.isUpdateMode = true;
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Id: new FormControl(dataItem.Id),
      Code: new FormControl(dataItem.Code, { validators: Validators.required, asyncValidators: unique('Code', this.cityService, String(0)),
      updateOn: 'blur'}),
      Label: new FormControl(dataItem.Label, Validators.required),
      IdCountry: new FormControl(dataItem.IdCountry, Validators.required)
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
    this.receiveCountryStatus(dataItem.IdCountry);
  }

  preparePrediacte(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(COUNTRY_NAVIGATION)]);
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
  this.cityService.reloadServerSideData(state, this.predicate).subscribe(data => this.gridSettings.gridData = data);
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(CITY_EDIT_URL + dataItem.Id, {queryParams: dataItem, skipLocationChange: true});

  }

  public filter() {
    this.preparePrediacte();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(SharedConstant.CODE, Operation.contains, this.city, false, true));
    this.predicate.Filter.push(new Filter(SharedConstant.LABEL, Operation.contains, this.city, false, true));
    this.predicate.Filter.push(new Filter(this.textName, Operation.contains, this.city, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
}
