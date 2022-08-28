import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridDataResult, PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Currency } from '../../../models/administration/currency.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { LanguageService } from '../../../shared/services/language/language.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { OperationKitService } from '../../services/operation-kit/operation-kit.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { Company } from '../../../models/administration/company.model';

@Component({
  selector: 'app-list-operation-kit',
  templateUrl: './list-operation-kit.component.html',
  styleUrls: ['./list-operation-kit.component.scss']
})
export class ListOperationKitComponent implements OnInit {

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  predicate: PredicateFormat = new PredicateFormat();
  userCurrency: Currency;
  language: string;
  public searchValue: string;

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
      title: GarageConstant.KIT_NAME_TITLE,
      filterable: true,
      tooltip: GarageConstant.KIT_NAME_TITLE
    },
    {
      field: GarageConstant.HT_PRICE_KIT,
      title: GarageConstant.HT_AMOUNT_TITLE,
      filterable: true,
      tooltip: GarageConstant.HT_AMOUNT_TITLE
    },
  ];

  gridSettings: GridSettings = {
    state: this.gridState,
    gridData: this.gridData,
    columnsConfig: this.columnsConfig
  };

      // Permission Parameters
      public hasAddPermission: boolean;
      public hasUpdatePermission: boolean;
      public hasShowPermission: boolean;
      public hasDeletePermission: boolean;
  constructor(private router: Router, public operationKitService: OperationKitService, private swalWarring: SwalWarring,
      private authService: AuthService, private localStorageService : LocalStorageService, private companyService: CompanyService) {
          this.language = this.localStorageService.getLanguage();
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_OPERATIONKIT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_OPERATIONKIT);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.SHOW_OPERATIONKIT);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.DELETE_OPERATIONKIT); 
    this.companyService.getCurrentCompany().subscribe((data: Company) => {
      this.userCurrency = data.IdCurrencyNavigation;
    });
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.operationKitService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe((data) => {
      this.gridSettings.gridData = data;
    });
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  public doFilter() {
    if (this.searchValue) {
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(new Filter(GarageConstant.NAME, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.HT_PRICE_KIT, Operation.contains, this.searchValue, false, true));
    } else {
      this.predicate.Filter = new Array<Filter>();
    }
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.gridSettings.state.take = NumberConstant.TWENTY;
    this.initGridDataSource();
  }

  goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(GarageConstant.KIT_EDIT_URL.concat(dataItem.Id));
  }

  public removeHandler(dataItem) {
    this.swalWarring.CreateSwal().then((result: { value: any; }) => {
      if (result.value) {
        this.operationKitService.remove(dataItem).subscribe(() => {
          this.gridSettings.state = this.gridState;
          this.initGridDataSource();
        });
      }
    });
  }


}
