import { Component, OnInit, Input } from '@angular/core';
import { GridDataResult, PagerSettings } from '@progress/kendo-angular-grid';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Filter, Operation, PredicateFormat, Relation, SpecFilter } from '../../../shared/utils/predicate';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { WorkerService } from '../../services/worker/worker.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { EnumValues } from 'enum-values';

const All_WORKERS = NumberConstant.THREE;
@Component({
  selector: 'app-list-worker',
  templateUrl: './list-worker.component.html',
  styleUrls: ['./list-worker.component.scss']
})
export class ListWorkerComponent implements OnInit {
  @Input() data: any[];

  public searchValue: string;
  formGroup: FormGroup;
  searchFormGroup: FormGroup;
  isEditingMode = false;
  isRemoved = false;
  selectedWorker: any;
  workerDataSource: any[];
  predicate: PredicateFormat = new PredicateFormat();
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public isQuickSearch = true;
  public workerTypeEnumerator = EnumValues.getNamesAndValues({
    Worker: 0,
    Responsible: 1
  });
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    },
    group: []
  };

  /*
   * Operation Grid columns
   */
  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.FIRST_NAME,
      title: GarageConstant.WORKER_TITLE,
      filterable: true,
      tooltip: GarageConstant.WORKER_TITLE
    },
    {
      field: GarageConstant.RESPONSABLE,
      title: GarageConstant.GRADE.toUpperCase(),
      filterable: true,
      tooltip: GarageConstant.GRADE.toUpperCase()
    },
    {
      field: GarageConstant.ADDRESS,
      title: GarageConstant.ADDRESS.toUpperCase(),
      filterable: true,
      tooltip: GarageConstant.ADDRESS.toUpperCase()
    },
    {
      field: GarageConstant.PHONE_NUMBER,
      title: GarageConstant.PHONE.toUpperCase(),
      filterable: true,
      tooltip: GarageConstant.PHONE.toUpperCase()
    },
    {
      field: GarageConstant.EMAIL_WORKER,
      title: GarageConstant.EMAIL.toUpperCase(),
      filterable: true,
      tooltip: GarageConstant.EMAIL.toUpperCase()
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;

  constructor(public workerService: WorkerService, private router: Router, private swalWarrings: SwalWarring,
      private authService: AuthService, private fb: FormBuilder, private translateService: TranslateService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_WORKER);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_WORKER);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.SHOW_WORKER);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.DELETE_WORKER);
    this.createSearchForm();
    this.workerTypeEnumerator.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translateService.get(elem.name).subscribe(trans => elem.name = trans);
    });
    this.preparePredicate();
    this.initGridDataSource();
  }

  createSearchForm() {
    this.searchFormGroup = this.fb.group({
      IsResponsible: [All_WORKERS]
    });
  }
  /**
    * initGridDataSource
    */
  public initGridDataSource(): void {
    this.workerService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe(data => {
      this.gridSettings.gridData = data;
    }
    );
  }

  preparePredicate() {
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(GarageConstant.ID_PHONE_NAVIGATION)]);
  }

  dataStateChange($event) {
    this.gridSettings.state = $event;
    this.initGridDataSource();
  }

  goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(GarageConstant.WORKER_ADVANCED_EDIT_URL.concat(dataItem.Id));
  }
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(GarageConstant.WORKER_DELETE_TEXT_MESSAGE, GarageConstant.WORKER_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.workerService.remove(dataItem).subscribe(() => {
          this.gridSettings.state = this.gridState;
          this.initGridDataSource();
        });
      }
    });
  }
  pictureSrc(dataItem) {
    if (dataItem.ImgFileInfo) {
      return SharedConstant.PICTURE_BASE + dataItem.ImgFileInfo.Data;
    }
  }
  filter() {
    this.predicate.Filter = new Array<Filter>();
    const formGroupData = this.searchFormGroup.getRawValue();
    if (formGroupData && (formGroupData.IsResponsible === 0 || formGroupData.IsResponsible === 1)) {
      this.predicate.Filter.push(new Filter(GarageConstant.RESPONSABLE, Operation.eq, formGroupData.IsResponsible));
    }
    if (this.searchValue) {
      this.predicate.Filter.push(new Filter(GarageConstant.FIRST_NAME, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.LAST_NAME, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ADDRESS, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.CIN, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.EMAIL, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ID_PHONE_NAVIGATION_TO_NUMBER, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ID_PHONE_NAVIGATION_TO_DIAL_CODE, Operation.contains, this.searchValue, false, true));

      const workerTypeFiltered = this.workerTypeEnumerator
        .filter(x => x.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1);
      if (workerTypeFiltered) {
        const workerTypeValue: any[] = workerTypeFiltered.map(x => x.value);
        workerTypeValue.forEach((x) => {
          this.predicate.Filter.push(new Filter(GarageConstant.RESPONSABLE, Operation.eq, x, false, true));
        });
      }
    }
    this.gridSettings.state = this.gridState;
    this.initGridDataSource();
  }

}

