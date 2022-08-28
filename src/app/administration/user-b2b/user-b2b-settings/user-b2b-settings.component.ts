import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {PredicateFormat, Filter, OrderBy, OrderByDirection, Operation, Relation} from '../../../shared/utils/predicate';
import {FormGroup} from '@angular/forms';
import {PagerSettings, DataStateChangeEvent} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {State, SortDescriptor} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {UserConstant} from '../../../constant/Administration/user.constant';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {UserService} from '../../services/user/user.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {Router} from '@angular/router';
import {User} from '../../../models/administration/user.model';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-user-b2b-settings',
  templateUrl: './user-b2b-settings.component.html',
  styleUrls: ['./user-b2b-settings.component.scss']
})
export class UserB2bSettingsComponent implements OnInit {

  public predicate: PredicateFormat = new PredicateFormat();
  public formGroup: FormGroup;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  choosenFilter = NumberConstant.ONE;

  public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: UserConstant.ID,
      title: UserConstant.ID,
      filterable: true
    },
    {
      field: UserConstant.LAST_NAME_FIELD,
      title: UserConstant.LAST_NAME,
      filterable: true,
      _width: 180
    },
    {
      field: UserConstant.FIRST_NAME_FIELD,
      title: UserConstant.FIRST_NAME,
      filterable: true,
      _width: 180
    },
    {
      field: UserConstant.EMAIL_FIELD,
      title: UserConstant.EMAIL,
      filterable: true,
      _width: 240

    },
    {
      field: UserConstant.CUSTOMER,
      title: UserConstant.CUSTOMERS,
      filterable: true,
      _width: 180
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };


  public sort: SortDescriptor[] = [{
    field: 'LastName',
    dir: 'asc'
  }];

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.initGridDataSource();
  }

  constructor(public userService: UserService,
              private swalWarrings: SwalWarring,
              private router: Router) {
  }

  ngOnInit() {
    this.initGridDataSource();
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
    this.initGridDataSource();
  }

  initGridDataSource(predicate?: PredicateFormat) {
    if (isNotNullOrUndefinedAndNotEmptyValue(predicate)) {
      this.predicate.Filter = predicate.Filter;
    } else {
      this.preparePredicate();
    }
    this.userService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  private preparePredicate() {
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [
      new Relation(UserConstant.CUSTOMER_ID)
    ]);
    this.predicate.Filter.push(new Filter(UserConstant.IS_BTOB, Operation.eq, true));
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy,
      [new OrderBy(UserConstant.ID, OrderByDirection.desc)]);
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateDeleteSwal(UserConstant.USER_LABEL).then((result) => {
      if (result.value) {
        this.userService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  public goToAdvancedEdit(dataItem?) {
    this.router.navigateByUrl(UserConstant.EDIT_USER_B2B.concat(dataItem.Id),
      {skipLocationChange: true});
  }

  public receiveData(event: any) {
    const predicate: PredicateFormat = Object.assign({}, null, event.predicate);
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(predicate);
  }

  signOut(Email: string) {
    this.userService.signOut(Email).subscribe(() => {
      this.initGridDataSource();
    });
  }
}
