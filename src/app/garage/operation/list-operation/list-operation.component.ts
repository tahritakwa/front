import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GridDataResult, PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Company } from '../../../models/administration/company.model';
import { Currency } from '../../../models/administration/currency.model';
import { TypeUnitEnumerator } from '../../../models/enumerators/type-unit.enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { OperationService } from '../../services/operation/operation.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-list-operation',
  templateUrl: './list-operation.component.html',
  styleUrls: ['./list-operation.component.scss']
})
export class ListOperationComponent implements OnInit {
  @Input() isForProposedOperation = false;
  @Input() proposedOperationIdsToIgnore: number[];
  @Output() receiveProposedIntervention = new EventEmitter<any>();
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  language: string;
  operationList: any[];
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  typeUnitEnumerator = TypeUnitEnumerator;
  operationToDelete: any;
  companyCurrency: Currency;
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
      title: GarageConstant.OPERATION,
      filterable: true,
      tooltip: GarageConstant.OPERATION
    },
    {
      field: GarageConstant.ID_OPERATION_TYPE,
      title: GarageConstant.OPERATION_TYPE_TITLE,
      filterable: true,
      tooltip: GarageConstant.OPERATION_TYPE_TITLE
    },
    {
      field: GarageConstant.UNIT_NUMBER,
      title: GarageConstant.UNIT_NUMBER_TITLE,
      filterable: true,
      tooltip: GarageConstant.UNIT_NUMBER_TITLE
    },
    {
      field: GarageConstant.EXPECTED_DURATION,
      title: GarageConstant.EXPECTED_DURATION_TITLE,
      filterable: true,
      tooltip: GarageConstant.EXPECTED_DURATION_TITLE
    },
    {
      field: GarageConstant.TTC_PRICE,
      title: GarageConstant.TTC_AMOUNT_TITLE,
      filterable: true,
      tooltip: GarageConstant.TTC_AMOUNT_TITLE
    }
  ];

  gridSettings: GridSettings = {
    state: this.gridState,
    gridData: this.gridData,
    columnsConfig: this.columnsConfig
  };

  predicate: PredicateFormat = new PredicateFormat();
  public filterValue = '';

  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  constructor(private router: Router, private swalWarrings: SwalWarring,
              private localStorageService : LocalStorageService, private authService: AuthService,
    public operationService: OperationService, private companyService: CompanyService, private translate: TranslateService) {
    this.language = this.localStorageService.getLanguage();

     }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_OPERATION);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_OPERATION);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.SHOW_OPERATION);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.DELETE_OPERATION);
    this.companyService.getCurrentCompany().subscribe((data: Company) => {
      this.companyCurrency = data.IdCurrencyNavigation;
    });
    if (!this.isForProposedOperation) {
      this.operationList = JSON.parse(localStorage.getItem(GarageConstant.OPERATION_LIST)) ?
        JSON.parse(localStorage.getItem(GarageConstant.OPERATION_LIST)) : [];
    } else {
      this.operationList = JSON.parse(localStorage.getItem(GarageConstant.PROPOSED_OPERATION_LIST)) ?
        JSON.parse(localStorage.getItem(GarageConstant.PROPOSED_OPERATION_LIST)) : [];
      this.proposedOperationIdsToIgnore.forEach((element) => {
        this.operationList = this.operationList.filter(x => x.Id !== element);
      });
    }
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.operationService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe((data) => {
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
      this.predicate.Filter.push(new Filter(GarageConstant.ID_OPERATION_TYPE_NAVIGATION_TO_NAME,
        Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.EXPECTED_DURATION, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.UNIT_NUMBER, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.TTC_PRICE, Operation.contains, this.filterValue, false, true));
    }
    this.gridSettings.state = this.gridState;
    this.initGridDataSource();
  }

  goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(GarageConstant.OPERATION_EDIT_URL.concat(dataItem.Id));
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.operationService.deleteOperation(dataItem.Id, dataItem.IdItem).subscribe(() => {
          this.gridSettings.state = this.gridState;
          this.initGridDataSource();
        });
      }
    });
  }

}

