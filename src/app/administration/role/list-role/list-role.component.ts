import {Component, OnInit} from '@angular/core';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {Filter, PredicateFormat} from '../../../shared/utils/predicate';
import {State} from '@progress/kendo-data-query';
import {FormGroup} from '@angular/forms';
import {DataStateChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {Router} from '@angular/router';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {RoleConstant} from '../../../constant/Administration/role.constant';
import {RoleService} from '../../services/role/role.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {RoleConfigConstant} from '../../../constant/Administration/role-config.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { RoleJavaService } from '../../services/role/role.java.service';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';


@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss']
})
export class ListRoleComponent implements OnInit {
  public actionColumnWidth = SharedConstant.COLUMN_ACTIONS_WIDTH;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  private pageSize = SharedConstant.DEFAULT_ITEMS_NUMBER;
  private currentPage = NumberConstant.ZERO;
  public predicate: PredicateFormat;
  public formGroup: FormGroup;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [

    {
      field: SharedConstant.CODE,
      title: SharedConstant.CODE_UPPERCASE,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
    {
      field: SharedConstant.LABEL,
      title: RoleConstant.DESIGNATION,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  /** Permissions */
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  public hasUpdatePermission: boolean;

  public allData: any[];
  public filtredData: any[] ;

  constructor(private swalWarrings: SwalWarring,
              public roleService: RoleService,
              public roleServiceJava: RoleJavaService,
              private router: Router, public authService: AuthService,
              private growlService: GrowlService, private translate: TranslateService,
              private localStorageService: LocalStorageService
) {
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_ROLE);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_ROLE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_ROLE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_ROLE);
    this.initGridDataSource();
  }

  public initPredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
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
    this.currentPage = (state.skip) / this.pageSize;
    this.pageSize = state.take;
    this.initGridDataSource();
  }


  initGridDataSource() {
    this.roleServiceJava.getJavaGenericService()
      .getEntityList(`?companyCode=${(this.localStorageService.getCompanyCode())}&page=${this.currentPage}&size=${this.pageSize}`)
      .subscribe(data => {
        this.allData = data.content ;
        this.gridSettings.gridData = { data: data.content, total: data.totalElements };
      });

  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler({ dataItem }) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.roleServiceJava.getJavaGenericService().deleteEntity(dataItem.Id).subscribe(() => {
           this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
          this.initGridDataSource();
        });
      }
    });
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(RoleConstant.URL_ROLE_EDIT.concat(dataItem.Id), {queryParams: dataItem, skipLocationChange: true});
  }
  public initGridDataSourceSearch($event){
    if($event){
      this.filtredData = this.allData.filter(x=> (x.Code.toUpperCase().includes($event.toUpperCase())) ||
      (x.Label.toUpperCase().includes($event.toUpperCase())));
      this.gridSettings.gridData = { data: this.filtredData, total: this.filtredData.length };

    }else{
      this.gridSettings.gridData = { data: this.allData, total: this.allData.length };
    }
  }
}

