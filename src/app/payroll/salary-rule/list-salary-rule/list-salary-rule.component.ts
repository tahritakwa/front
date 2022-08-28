import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { EnumValues } from 'enum-values';
import { Subscription } from 'rxjs/Subscription';
import { SalaryRuleConstant } from '../../../constant/payroll/salary-rule.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { RuleCategory } from '../../../models/enumerators/rule-category.enum';
import { RuleType } from '../../../models/enumerators/rule-type.enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SalaryRuleService } from '../../services/salary-rule/salary-rule.service';


@Component({
  selector: 'app-list-salary-rule',
  templateUrl: './list-salary-rule.component.html',
  styleUrls: ['./list-salary-rule.component.scss'],
})
export class ListSalaryRuleComponent implements OnInit, OnDestroy {
  public ruleTypeEnum = EnumValues.getNamesAndValues(RuleType);
  public ruleCategoryEnum = EnumValues.getNamesAndValues(RuleCategory);
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  private subscriptions: Subscription[] = [];

  public hasAddPermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowPermission: boolean;
  public hasUpdatePermission: boolean;

  constructor(public salaryRuleService: SalaryRuleService, private swalWarrings: SwalWarring, private router: Router,
              private authService: AuthService) { }


  public columnsConfig: ColumnSettings[] = [
    {
      field: SalaryRuleConstant.REFERENCE_NAVIGATION,
      title: SalaryRuleConstant.REFERENCE.toUpperCase(),
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_SEVENTY
    },
    {
      field: SalaryRuleConstant.NAME,
      title: SalaryRuleConstant.NAME.toUpperCase(),
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
    {
      field: SalaryRuleConstant.ORDER,
      title: SalaryRuleConstant.SALARY_RULE_ORDER,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED
    },
    {
      field: SalaryRuleConstant.RULE_TYPE,
      title: SalaryRuleConstant.RULE_TYPE_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: SalaryRuleConstant.APPEARS_ON_PAY_SLIP,
      title: SalaryRuleConstant.APPEARS_ON_PAY_SLIP_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_THIRTY
    },
    {
      field: SalaryRuleConstant.RULE_CATEGORY,
      title: SalaryRuleConstant.CATEGORY,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: SalaryRuleConstant.DEPEND_NUMBER_DAYS_WORKED,
      title: SalaryRuleConstant.DEPEND_NUMBER_DAYS_WORKED_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: SalaryRuleConstant.USED_IN_NEWS_PAPER,
      title: SalaryRuleConstant.USED_IN_NEWS_PAPER_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_THIRTY
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  /**
   * Get salary rule list from the server
   */
  public initGridDataSource(): void {
    this.subscriptions.push(this.salaryRuleService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
          this.gridSettings.gridData = data;
        }
      ));
  }

  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(SalaryRuleConstant.RULE_UNIQUE_REFERENCE_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(SalaryRuleConstant.ID_CONTRIBUTION_REGISTER_NAVIGATION)]);
  }

  /**
   * remove a salary rule
   * @param dataItem
   */
  public removeHandler(dataItem): void {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.salaryRuleService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Initialise Component
   */
  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_SALARYRULE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_SALARYRULE);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_SALARYRULE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_SALARYRULE);
    this.preparePredicate();
    this.initGridDataSource();
  }

  getRuleTypeName(ruleType): string {
    const associatedRuleTypeEnum = this.ruleTypeEnum.filter(x => x.value === ruleType)[0];
    return associatedRuleTypeEnum ? associatedRuleTypeEnum.name.toUpperCase() : '';
  }

  getRuleCategoryName(ruleCategory): string {
    const associatedRuleCategoryEnum = this.ruleCategoryEnum.filter(x => x.value === ruleCategory)[0];
    return associatedRuleCategoryEnum ? associatedRuleCategoryEnum.name.toUpperCase() : '';
  }

  /**
   * this method fis invoked if the page number or filter has changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.subscriptions.push(this.salaryRuleService.reloadServerSideData(state, this.predicate)
      .subscribe(data => this.gridSettings.gridData = data));
  }

  public goTOAddSalaryRule() {
    this.router.navigateByUrl(SalaryRuleConstant.SALARY_RULE_ADD_URL);
  }

  public goTOEditSalaryRule(dataItem): void {
    this.router.navigateByUrl(SalaryRuleConstant.SALARY_RULE_EDIT_URL.concat(dataItem.Id),
      { queryParams: dataItem, skipLocationChange: false });
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
