import {Component, Input, OnInit} from '@angular/core';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {HistoryConstant} from '../../../../constant/accounting/historic.constant';
import {State} from '@progress/kendo-data-query';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {UserService} from '../../../../administration/services/user/user.service';
import {HistoryService} from '../../../services/history/history.service';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-historic-reporting-details',
  templateUrl: './historic-reporting-details.component.html',
  styleUrls: ['./historic-reporting-details.component.scss']
})
export class HistoricReportingDetailsComponent implements OnInit {

  @Input()
  public entityId: number;
  private createdByIds: any;
  private pageSize = NumberConstant.TEN;
  private entityActions = [];
  public formatDateTime = this.translate.instant(SharedConstant.DATE_FORMAT);
  pagerSettings: PagerSettings = {
    buttonCount: NumberConstant.FIVE, info: true, type: 'numeric', pageSizes: false, previousNext: true
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: HistoryConstant.OPERATION_DATE_FIELD,
      title: HistoryConstant.OPERATION_DATE_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.OPERATION_TYPE_FIELD,
      title: HistoryConstant.OPERATION_TYPE_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.CONCERNED_ELEMENT_FIELD,
      title: HistoryConstant.CONCERNED_ELEMENT_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.OLD_VALUE_FIELD,
      title: HistoryConstant.OLD_VALUE_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.NEW_VALUE_FIELD,
      title: HistoryConstant.NEW_VALUE_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.ENTITY_NAME_FIELD,
      title: HistoryConstant.ENTITY_NAME_COLUMN,
      filterable: true
    },
    {
      field: HistoryConstant.CURRENT_USER_FIELD,
      title: HistoryConstant.CURRENT_USER_COLUMN,
      filterable: true
    }
  ];
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  constructor(private userService: UserService, private historyService: HistoryService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.initGridData(this.gridState.skip);
  }

  public initGridData(page: number) {
    this.historyService.getJavaGenericService().getData(`historic-line-by-reportLine-id` +
      '?entityId=' + this.entityId + '&page=' + page + '&size=' + NumberConstant.TEN
    ).subscribe(
      (data) => {
        if (data) {
          this.checkEntityFieldType(data);
        }
      });
  }

  onPageChange(event) {
    this.pageSize = event.take;
    this.initGridData(event.skip / NumberConstant.TEN);
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
  }

  private mapHistoricCreatedBy(data: any) {
    this.createdByIds = data.historicDtoList.map(historic => {
      return historic.createdBy;
    });
    // dintinct array of employees ids values
    this.createdByIds = Array.from(new Set(this.createdByIds));
    this.userService.getUsersListByArray(this.createdByIds).subscribe(employees => {
      data.historicDtoList.map(historic => {
        return historic.createdByFullName = employees.find(employee => Number(employee.Id) === Number(historic.createdBy)).FullName;
      });
    });
  }

  private checkEntityFieldType(data) {
    data.historicDtoList.map(historic => {
      this.entityActions.push(historic.action);
    });
    this.mapHistoricCreatedBy(data);
    this.initHistoricData(data);
  }

  private initHistoricData(data: any) {
    this.gridSettings.gridData = {
      data: data.historicDtoList,
      total: data.totalElements
    };
  }
}
