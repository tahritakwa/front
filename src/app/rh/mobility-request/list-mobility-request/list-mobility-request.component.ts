import {Component, OnInit} from '@angular/core';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {MobilityRequestService} from '../../services/mobility-request/mobility-request.service';
import {MobilityRequestConstant} from '../../../constant/rh/mobility-request.constant';

@Component({
  selector: 'app-list-mobility-request',
  templateUrl: './list-mobility-request.component.html',
  styleUrls: ['./list-mobility-request.component.scss']
})
export class ListMobilityRequestComponent implements OnInit {


  //public statusFilter: Array<any> = [{ 'id': MobilityRequestState.Closed, 'name': this.translate.instant(MobilityRequestConstant.CLOSED) },
  //{
  //  'id': MobilityRequestState.Closed + NumberConstant.ONE,
  //  'name': this.translate.instant(MobilityRequestConstant.ALL_RECRUITMENT)
  //}];
  // public defaultStatus: any = { 'id': NumberConstant.ZERO, 'name': this.translate.instant(MobilityRequestConstant.IN_PROGRESS) };
  public statusSelected: number = NumberConstant.ZERO;
  /**
   * Page setting
   */
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  /**
   * Grid MobilityRequest State
   */
  public gridState: State = {
    skip: 0,
    take: 10
  };

  /***
   * Grid MobilityRequest columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: MobilityRequestConstant.ID_EMPLOYEE_NAVIGATION,
      title: SharedConstant.EMPLOYEE_UPPER,
      filterable: true,
    },
    {
      field: MobilityRequestConstant.ID_CURRENT_OFFICE_NAVIGATION,
      title: MobilityRequestConstant.CURRENT_OFFICE_UPPER,
      filterable: true,
    },
    {
      field: MobilityRequestConstant.ID_DESTINATION_OFFICE_NAVIGATION,
      title: MobilityRequestConstant.DESTINATION_OFFICE_UPPER,
      filterable: true,
    },
    {
      field: MobilityRequestConstant.DESIRED_MOBILITY_DATE,
      title: MobilityRequestConstant.DESIRED_MOBILITY_DATE_UPPER,
      filterable: true,
    },
    {
      field: MobilityRequestConstant.EFFECTIF_MOBILITY_DATE,
      title: MobilityRequestConstant.EFFECTIF_MOBILITY_DATE_UPPER,
      filterable: true,
    },
    {
      field: MobilityRequestConstant.STATUS,
      title: MobilityRequestConstant.STATE_TITLE,
      filterable: true,
    }
  ];

  /**
   * Grid MobilityRequest settings
   */
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  /**
   * constructor
   */constructor(
    private recruitmentService: MobilityRequestService,
    private swalWarrings: SwalWarring,
    private router: Router,
    public translate: TranslateService) {

  }

  ngOnInit() {
    this.initGridDataSource();
  }

  /**
   *
   * @param predicate
   */
  public initGridDataSource(): void {
    this.recruitmentService.processDataServerSide(this.preparePredicate()).subscribe(data => {
      this.gridSettings.gridData = data;
    });
  }

  public goToAdvancedEdit(dataItem: { Id: string; }) {
    this.router.navigateByUrl(MobilityRequestConstant.MOBILITY_REQUEST_EDIT.concat(dataItem.Id));
  }

  /***
   * remove the selected ligne from the leave grid list
   */
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal(MobilityRequestConstant.DELETE_RECRUITMENT).then((result: { value: any; }) => {
      if (result.value) {
        this.recruitmentService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  public dataStateChange($event: State) {
    this.gridSettings.state = $event;
    this.initGridDataSource();
  }

  public onStatusFilterChanged($event: any) {
    this.statusSelected = $event.id;
    this.initGridDataSource();
  }

  /**
   * prepare predicate
   */
  private preparePredicate(): PredicateFormat {
    let myPredicate = new PredicateFormat();

    myPredicate.Relation = new Array<Relation>();

    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(MobilityRequestConstant.ID_EMPLOYEE_NAVIGATION)]);
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(MobilityRequestConstant.ID_CURRENT_OFFICE_NAVIGATION)]);
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(MobilityRequestConstant.ID_DESTINATION_OFFICE_NAVIGATION)]);

    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push(new OrderBy(SharedConstant.ID, OrderByDirection.desc));
    myPredicate.pageSize = this.gridSettings.state.take;
    myPredicate.page = (this.gridSettings.state.skip / this.gridSettings.state.take) + 1;

    return myPredicate;
  }

}
