import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { BenefitInKindConstant } from '../../../constant/payroll/benefit-in-kind.constant';
import { BonusConstant } from '../../../constant/payroll/bonus.constant';
import { CnssConstant } from '../../../constant/payroll/cnss.constant';
import { SalaryRuleConstant } from '../../../constant/payroll/salary-rule.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { BenefitInKind } from '../../../models/payroll/benefit-in-kind.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { BenefitInKindService } from '../../services/benefit-in-kind/benefit-in-kind.service';
import { AddBenefitInKindComponent } from '../add-benefit-in-kind/add-benefit-in-kind.component';

@Component({
  selector: 'app-list-benefit-in-kind',
  templateUrl: './list-benefit-in-kind.component.html',
  styleUrls: ['./list-benefit-in-kind.component.scss']
})
export class ListBenefitInKindComponent implements OnInit , OnDestroy {

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

  public columnsConfig: ColumnSettings[] = [
    {
      field: BonusConstant.CODE,
      title: BonusConstant.CODE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: BonusConstant.NAME,
      title: BonusConstant.NAME_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: BonusConstant.DESCRIPTION,
      title: BonusConstant.DESCRIPTION_UPPERCASE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: CnssConstant.CNSS_LABEL_FROM_CNSS_NAVIGATION,
      title: CnssConstant.CNSS_TYPE,
      tooltip: CnssConstant.TYPE_CNSS,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: BonusConstant.IS_TAXABLE,
      title: BonusConstant.TAXABLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: SalaryRuleConstant.DEPEND_NUMBER_DAYS_WORKED,
      title: SalaryRuleConstant.DEPEND_NUMBER_DAYS_WORKED_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  typeDropdownFormGroup: FormGroup;
  type: number;
  private subscriptions: Subscription[] = [];

  public hasAddPermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowPermission: boolean;
  public hasUpdatePermission: boolean;

  constructor(public benefitInKindService: BenefitInKindService, private swalWarrings: SwalWarring,
    private formModalDialogService: FormModalDialogService, private viewContainerRef: ViewContainerRef, private fb: FormBuilder,
    private authService: AuthService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_BENEFITINKIND);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_BENEFITINKIND);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_BENEFITINKIND);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_BENEFITINKIND);
    this.preparePredicate();
    this.initGridDataSource();
    this.createTypeDropdownForm();
  }

  /**
   * Get the benefits in kind list from the server
   */
  public initGridDataSource(): void {
    this.subscriptions.push(this.benefitInKindService.reloadServerSideData(this.gridSettings.state, this.predicate)
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
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(BonusConstant.CNSS_NAVIGATION)]);
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.predicate.Filter = new Array<Filter>();
    if (this.type !== undefined) {
      this.predicate.Filter.push(new Filter(SharedConstant.TYPE, Operation.eq, this.type));
    }
    this.subscriptions.push(this.benefitInKindService.reloadServerSideData(state, this.predicate)
      .subscribe(data => this.gridSettings.gridData = data));
  }

  /**
   * remove a benefit in kind
   * @param dataItem
   */
  public removeHandler(dataItem): void {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.benefitInKindService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Edit Bonus
   * @param dataItem
   */
  public editHandler(dataItem): void {
    this.addNewBenefitInKind(dataItem);
  }

  /**
     * Add New benefitInKind
     * @param benefitInKind
     */
  public addNewBenefitInKind(benefitInKind?: BenefitInKind): void {
    const dataToSend = benefitInKind ? benefitInKind : undefined;
    const TITLE = benefitInKind ? BenefitInKindConstant.EDIT_BENEFIT_IN_KIND : BenefitInKindConstant.ADD_BENEFIT_IN_KIND;
    this.formModalDialogService.openDialog(TITLE, AddBenefitInKindComponent,
      this.viewContainerRef, this.initGridDataSource.bind(this), dataToSend, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  createTypeDropdownForm(): void {
    this.typeDropdownFormGroup = this.fb.group({
      Type: ''
    });
  }

  typeFilter(event) {
    this.type = event;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.dataStateChange(this.gridSettings.state);
  }
  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
