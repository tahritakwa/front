import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { CandidateConstant } from '../../../constant/rh/candidate.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { CandidateService } from '../../services/candidate/candidate.service';

@Component({
  selector: 'app-list-candidate',
  templateUrl: './list-candidate.component.html',
  styleUrls: ['./list-candidate.component.scss']
})
export class ListCandidateComponent implements OnInit, OnDestroy {
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat = new PredicateFormat();

  /** Permission */
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  public hasUpdatePermission: boolean;

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
      field: CandidateConstant.FIRST_NAME,
      title: CandidateConstant.FIRST_NAME_CANDIDATE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: CandidateConstant.LAST_NAME,
      title: CandidateConstant.LAST_NAME_CANDIDATE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: CandidateConstant.EMAIL,
      title: CandidateConstant.EMAIL_CANDIDATE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: CandidateConstant.CREATION_DATE,
      title: CandidateConstant.CREATION_DATE_UPPER,
      filterable: true,
      filter: 'date',
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: CandidateConstant.CREATION_USER_NAVIGATION_FIRST_NAME,
      title: CandidateConstant.CREATED_BY_UPPER,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public sort: SortDescriptor[] = [{
    field: CandidateConstant.FIRST_NAME,
    dir: SharedConstant.ASC
  }];
  private subscriptions: Subscription[] = [];

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.initGridDataSource();
  }
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  constructor(public candidateService: CandidateService, private router: Router, 
      private translate: TranslateService, private swalWarrings: SwalWarring, public authService: AuthService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_CANDIDATE);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_CANDIDATE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_CANDIDATE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_CANDIDATE);
    this.initGridDataSource();
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  public initGridDataSource(predicate?: PredicateFormat, isFromSearch?: boolean): void {
    if (isFromSearch) {
      this.gridSettings.state.skip = NumberConstant.ZERO;
    }
    this.preparePredicate(predicate);
    this.subscriptions.push(this.candidateService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe(data => {
        this.gridSettings.gridData = data;
      }
    ));
  }

  public preparePredicate(predicate?: PredicateFormat): void {
    this.predicate = predicate ? predicate : this.predicate;
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(CandidateConstant.CREATION_USER)]);
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = (this.gridSettings.state.skip / this.gridSettings.state.take) + 1;
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(CandidateConstant.DELETE_CANDIDATE).then((result) => {
      if (result.value) {
        this.subscriptions.push(this.candidateService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  public goToAdvancedEdit(id) {
    this.router.navigateByUrl(CandidateConstant.CANDIDATE_EDIT_URL.concat(id));
  }
  public receiveData(event: any) {
    const predicate: PredicateFormat = Object.assign({}, null, event.predicate);
    this.initGridDataSource(predicate);
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
