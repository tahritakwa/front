import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TypeConstant } from '../../../constant/utility/Type.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { ContractStateEnumerator } from '../../../models/enumerators/contractStateEnumerator.model';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operator, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ContractService } from '../../services/contract/contract.service';

@Component({
  selector: 'app-list-contract',
  templateUrl: './list-contract.component.html',
  styleUrls: ['./list-contract.component.scss']
})
export class ListContractComponent implements OnInit {
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  predicate: PredicateFormat;
  contractStateEnumerator = ContractStateEnumerator;
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
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
      field: ContractConstant.EMPLOYEE_FULL_NAME,
      title: ContractConstant.EMPLOYEE_FULL_NAME_TITLE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: ContractConstant.CONTRACT_TYPE_CODE,
      title: ContractConstant.CONTRACT_TYPE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: ContractConstant.SALARY_STRUCTURE_REFERENCE,
      title: ContractConstant.SALARY_STRUCTURE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: ContractConstant.START_DATE,
      title: SharedConstant.START_DATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: ContractConstant.END_DATE,
      title: SharedConstant.END_DATE_UPPERCASE,
      filterable: true,
      filter: 'date',
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: ContractConstant.STATE,
      title: SharedConstant.STATE_UPPERCASE,
      filterable: true,
      filter: 'date',
      _width: NumberConstant.TWO_HUNDRED
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  private subscriptions: Subscription[] = [];

  /** Permissions */
  public hasAddPermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowPermission: boolean;
  public hasUpdatePermission: boolean;

  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];

  constructor(public contractService: ContractService, private router: Router,
    private swalWarrings: SwalWarring, public authService: AuthService, public translate: TranslateService) {
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_CONTRACT);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_CONTRACT);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_CONTRACT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_CONTRACT);
    this.preparePredicate();
    this.initContractFiltreConfig();
    this.initGridDataSource();
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  public initGridDataSource(): void {
    this.subscriptions.push(this.contractService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe(data => {
      this.gridSettings.gridData = data;
    }
    ));
  }

  public preparePredicate(): PredicateFormat {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ContractConstant.ID_EMPLOYEE_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ContractConstant.ID_CONTRACT_TYPE_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ContractConstant.ID_SALARY_STRUCTURE_NAVIGATION)]);
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = (this.gridSettings.state.skip / this.gridSettings.state.take) + 1;
    return this.predicate;
  }

  public goToAdvancedEdit(id) {
    this.router.navigateByUrl(ContractConstant.CONTRACT_EDIT_URL.concat(id), { skipLocationChange: true });
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(ContractConstant.DELETE_CONTRACT).then((result) => {
      if (result.value) {
        this.subscriptions.push(this.contractService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private initContractFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(ContractConstant.EMPLOYEE_FULL_NAME_TITLE,
      FieldTypeConstant.EMPLOYEE_DROPDOWN_TYPE, ContractConstant.ID_EMPLOYEE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(ContractConstant.CONTRACT_TYPE_UPPERCASE,
      FieldTypeConstant.CONTRACT_TYPE_DROPDOWN_COMPONENT, ContractConstant.ID_CONTRACT_TYPE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(ContractConstant.SALARY_STRUCTURE,
      FieldTypeConstant.SALARY_STRUCTURE_DROPDOWN_COMPONENT, ContractConstant.ID_SALARY_STRUCTURE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(ContractConstant.START_DATE_UPPERCASE, FieldTypeConstant.DATE_TYPE,
      ContractConstant.START_DATE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(ContractConstant.END_DATE_UPPERCASE, FieldTypeConstant.DATE_TYPE,
      ContractConstant.END_DATE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.STATE_UPPERCASE, FieldTypeConstant.CONTRACT_STATE_DROPDOWN,
      ContractConstant.STATE));
  }

  getFiltrePredicate(filtre) {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    if (!this.predicate.Filter || (this.predicate.Filter && this.predicate.Filter.length === NumberConstant.ZERO)) {
      this.predicate.Filter = new Array<Filter>();
    }
    this.prepareFiltreFromAdvancedSearch(filtre);
  }

  private prepareFiltreFromAdvancedSearch(filtre) {
    this.predicate.Filter = this.predicate.Filter.filter(value => value.prop !== filtre.prop);
    if (filtre.isDateFiltreBetween && filtre.filtres) {
      const  startDate = filtre.filtres[NumberConstant.ZERO].value;
      const  endDate = filtre.filtres[NumberConstant.ONE].value;

      filtre.filtres[NumberConstant.ZERO].value = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
      filtre.filtres[NumberConstant.ONE].value = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));

      this.predicate.Filter.push(filtre.filtres[NumberConstant.ZERO]);
      this.predicate.Filter.push(filtre.filtres[NumberConstant.ONE]);
    }
    if (filtre.operation && filtre.value && !filtre.SpecificFiltre) {
      this.predicate.Filter.push(filtre);
    }
  }
  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
  getOperatorPredicate(operator: Operator) {
    this.predicate.Operator = operator;
  }

  /**
   * Reset dataGrid
   */
  resetClickEvent() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.preparePredicate();
    this.initGridDataSource();
  }
}
