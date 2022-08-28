import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import { PredicateFormat, Relation, Filter, Operation } from '../../../shared/utils/predicate';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { TaxeService } from '../../services/taxe/taxe.service';
import { TaxeConstant } from '../../../constant/Administration/taxe.constant';
import {Router} from '@angular/router';
import {DataStateChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import { NumberConstant } from '../../../constant/utility/number.constant';
import {Taxe} from '../../../models/administration/taxe.model';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';




@Component({
  selector: 'app-list-taxe',
  templateUrl: './list-taxe.component.html',
  styleUrls: ['./list-taxe.component.scss']
})
export class ListTaxeComponent implements OnInit {
  public predicate: PredicateFormat;
  public formGroup: FormGroup;
  public actionColumnWidth = SharedConstant.COLUMN_ACTIONS_WIDTH;
  taxe: string;

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public hasAddTaxePermission: boolean;
  public hasShowTaxePermission: boolean;
  public hasDeleteTaxePermission: boolean;
  public hasUpdateTaxePermission: boolean;

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
      field: TaxeConstant.CodeTaxe,
      title: TaxeConstant.CODE,
      filterable: false,
      _width: 240
    },
    {
      field: TaxeConstant.Label,
      title: this.translate.instant(TaxeConstant.LABEL),
      filterable: false,
      _width: 240
    },
    {
      field: TaxeConstant.TaxeValue,
      title: this.translate.instant(TaxeConstant.TAXE_VALUE_TITLE),
      filterable: false,
      _width: 160
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  constructor(public taxeService: TaxeService,
              private swalWarrings: SwalWarring,
              private fb: FormBuilder,
              private translate: TranslateService,
              private validationService: ValidationService,
              private authService: AuthService,
              private router: Router) {
    this.preparePrediacte();
  }

  ngOnInit() {
    this.hasAddTaxePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_TAX);
    this.hasShowTaxePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_TAX);
    this.hasDeleteTaxePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_TAX);
    this.hasUpdateTaxePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_TAX);
    this.initGridDataSource();
  }
  initGridDataSource() {
    this.taxeService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.taxeService.reloadServerSideData(state, this.predicate).subscribe(data => this.gridSettings.gridData = data);
  }
  /**
   * Remove an item of taxe
   * @param param
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(TaxeConstant.TAX_DELETE_TEXT_MESSAGE, TaxeConstant.TAX_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.taxeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  preparePrediacte(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(TaxeConstant.TAXE_NAVIGATION)]);
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(TaxeConstant.TAXE_ADVANCED_EDIT_URL.concat(dataItem.Id));
  }
  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(TaxeConstant.CODE, Operation.contains, this.taxe, false, true));
    this.predicate.Filter.push(new Filter(TaxeConstant.LABEL, Operation.contains, this.taxe, false, true));
    this.predicate.Filter.push(new Filter(TaxeConstant.TaxeValue, Operation.eq, this.taxe, false, true));
    this.predicate.Relation = new Array<Relation>();
      this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(TaxeConstant.TAXE_NAVIGATION)]);
      this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
}
