import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridDataResult, PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Company } from '../../../models/administration/company.model';
import { Currency } from '../../../models/administration/currency.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { LanguageService } from '../../../shared/services/language/language.service';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { OperationTypeService } from '../../services/operation-type/operation-type.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-list-operation-type',
  templateUrl: './list-operation-type.component.html',
  styleUrls: ['./list-operation-type.component.scss']
})
export class ListOperationTypeComponent implements OnInit {

      // Permission Parameters
      public hasAddPermission: boolean;
      public hasUpdatePermission: boolean;
      public hasShowPermission: boolean;
      public hasDeletePermission: boolean;
  constructor(public operationTypeService: OperationTypeService, private router: Router, private swalWarring: SwalWarring,
      private companyService: CompanyService, private localStorageService : LocalStorageService, private authService: AuthService) {
     this.language = this.localStorageService.getLanguage();

  }

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  language: string;
  predicate: PredicateFormat = new PredicateFormat();
  companyCurrency: Currency;
  public filterValue = '';
  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      filters: [],
      logic: 'and'
    },
    group: []
  };

  gridData: GridDataResult = new Object() as GridDataResult;

  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.NAME,
      title: GarageConstant.TYPE_OF_OPERATION,
      filterable: true,
      tooltip: GarageConstant.TYPE_OF_OPERATION
    },
    {
      field: GarageConstant.ID_UNIT,
      title: GarageConstant.UNIT_NAME,
      filterable: true,
      tooltip: GarageConstant.UNIT_NAME
    },
    {
      field: GarageConstant.UNIT_PRICE,
      title: GarageConstant.UNIT_PRICE_TITLE,
      filterable: true,
      tooltip: GarageConstant.UNIT_PRICE_TITLE
    }
  ];


  gridSettings: GridSettings = {
    state: this.gridState,
    gridData: this.gridData,
    columnsConfig: this.columnsConfig
  };


  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_OPERATIONTYPE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_OPERATIONTYPE);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.SHOW_OPERATIONTYPE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.DELETE_OPERATIONTYPE);
    this.companyService.getCurrentCompany().subscribe((data: Company) => {
      this.companyCurrency = data.IdCurrencyNavigation;
    });
    this.preparePredicate();
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.operationTypeService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe((data) => {
      this.gridSettings.gridData = data;
    });
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  public doFilter() {
    this.predicate.Filter = new Array<Filter>();
    if (this.filterValue) {
      this.filterValue = this.filterValue ? this.filterValue.replace(/\s+/g, SharedConstant.BLANK_SPACE) : this.filterValue;
      this.predicate.Filter.push(new Filter(GarageConstant.NAME, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ID_UNIT_NAVIGATION_TO_NAME, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.UNIT_PRICE, Operation.contains, this.filterValue, false, true));
    }
    this.gridSettings.state = this.gridState;
    this.initGridDataSource();
  }

  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(GarageConstant.ID_UNIT_NAVIGATION)]);
  }

  goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(GarageConstant.OPERATION_TYPE_EDIT_URL.concat(dataItem.Id));
  }

  public removeHandler(dataItem) {
    this.swalWarring.CreateSwal().then((result) => {
      if (result.value) {
        this.operationTypeService.remove(dataItem).subscribe(() => {
          this.gridSettings.state = this.gridState;
          this.initGridDataSource();
        });
      }
    });
  }

}
