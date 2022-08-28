import {Component, OnInit} from '@angular/core';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {HistoryConstant} from '../../../constant/accounting/historic.constant';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {State} from '@progress/kendo-data-query';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {HistoryService} from '../../services/history/history.service';
import {UserService} from '../../../administration/services/user/user.service';
import {DatePipe} from '@angular/common';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import {FiscalYearConstant} from '../../../constant/accounting/fiscal-year.constant';

@Component({
  selector: 'app-fiscal-year-historic',
  templateUrl: './fiscal-year-historic.component.html',
  styleUrls: ['./fiscal-year-historic.component.scss']
})
export class FiscalYearHistoricComponent implements OnInit {

  private pageSize = NumberConstant.TEN;
  public formatDateTime = this.translate.instant(SharedConstant.DATE_FORMAT);
  private createdByIds: any;
  public fiscalYearListUrl = FiscalYearConstant.LIST_FISCAL_YEARS_URL;
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

  /**
   *
   * @param historyService
   * @param userService
   * @param datePipe
   * @param genericAccountingService
   * @param translateService
   */
  constructor(private historyService: HistoryService, private userService: UserService, private datePipe: DatePipe,
              private genericAccountingService: GenericAccountingService, private translateService: TranslateService,
              private translate: TranslateService, private styleConfigService: StyleConfigService, private router: Router) {
  }

  ngOnInit() {
    this.initGridData(this.gridState.skip);
  }

  onPageChange(event) {
    this.pageSize = event.take;
    this.initGridData(event.skip / NumberConstant.TEN);
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
  }

  initGridData(page: number) {
    this.initGridDataSourceDocumentAccount(page);
  }


  private checkEntityFieldType(data) {
    this.mapHistoricCreatedBy(data);
  }

  private initHistoricData(data: any) {
    this.gridSettings.gridData = {
      data: data.historicDtoList,
      total: data.totalElements
    };
  }

  onSearch() {
    this.initHistoryData();
  }

  /** get history data  */
  initHistoryData() {
    this.initGridDataSourceDocumentAccount(NumberConstant.ZERO);
  }

  /**
   * Fiscal year historique
   */
  initGridDataSourceDocumentAccount(page: number) {
    this.historyService.getJavaGenericService().getData(`historic-fiscal-year` +
      '?page=' + page + '&size=' + NumberConstant.TEN
    ).subscribe(
      (data) => {
        if (data) {
          this.checkEntityFieldType(data);
          this.initHistoricData(data);
        }
      });
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

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  public goToList() {
    this.router.navigateByUrl(this.fiscalYearListUrl);
  }
}
