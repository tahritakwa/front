import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {State} from '@progress/kendo-data-query';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {HistoryConstant} from '../../../../constant/crm/history.constant';
import {HistoryService} from '../../../services/history/history.service';
import {TranslateService} from '@ngx-translate/core';
import {OpportunityConstant} from '../../../../constant/crm/opportunityConstant';
import {DatePipe} from '@angular/common';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {OpportunityService} from '../../../services/opportunity.service';
import {ActionService} from '../../../services/action/action.service';
import {CurrencyService} from '../../../../administration/services/currency/currency.service';
import {GenericCrmService} from '../../../generic-crm.service';
import {ItemService} from '../../../../inventory/services/item/item.service';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {ContactService} from '../../../../purchase/services/contact/contact.service';
import {ActionConstant} from '../../../../constant/crm/action.constant';
import {Sort} from '../../../../models/crm/enums/Sort';
import {UserService} from '../../../../administration/services/user/user.service';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {ClaimCrmService} from '../../../services/claim/claim.service';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {ClaimConstants} from '../../../../constant/crm/claim.constant';


@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit, OnChanges {

  @Input() source;
  @Input() sourceId;
  private pageSize = NumberConstant.TEN;
  public formatDate = HistoryConstant.DATE_FORMAT;
  public formatDateTime = SharedCrmConstant.DD_MM_YYYY;
  private responsabelsIds = [];
  private responsablesDetails = [];
  private entityActions = [];
  public searchValue = '';
  public startDate: Date;
  public endDate: Date;
  public startTime: Date;
  public endTime: Date;
  public historySearchFields: any;
  public selectedSearchType: any;
  public selectedField: any;
  public isSearchType = false;
  public searchByField = HistoryConstant.SEARCH_HISTORIC_BY_ATTRIBUT;
  public searchType = [HistoryConstant.SEARCH_HISTORIC_BY_ATTRIBUT, HistoryConstant.SEARCH_HISTORIC_BY_ACTION_TYPE];
  public searchByAction: any = [HistoryConstant.SEARCH_HISTORIC_BY_ACTION_INSERTED, HistoryConstant.SEARCH_HISTORIC_BY_ACTION_UPDATED];
  private contactsClients = [];
  private employeesIdsCreatedBy: any;
  private sort = new Sort('id', 'DESC');
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
  public listUsers = [];
  public Users = [];
  public listUsersFilter = [];
  private connectedUser: any;
  public predicateHistoric: PredicateFormat;

  /**
   *
   * @param historyService
   * @param opportunityService
   * @param datePipe
   * @param actionService
   * @param currencyService
   * @param genericCrmService
   * @param itemService
   * @param translateService
   * @param tiersService
   * @param contactService
   */
  constructor(private historyService: HistoryService,
              private opportunityService: OpportunityService,
              private userService: UserService,
              private datePipe: DatePipe,
              private actionService: ActionService,
              private currencyService: CurrencyService,
              private genericCrmService: GenericCrmService,
              private itemService: ItemService,
              private translateService: TranslateService,
              private tiersService: TiersService,
              private contactService: ContactService,
              private organisationService: OrganisationService,
              private contactCrmService: ContactCrmService,
              private claimService: ClaimCrmService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initGridDataSourceBySource(this.gridState.skip);
  }

  onPageChange(event) {
    this.pageSize = event.take;
    this.initGridDataSourceBySource(event.skip / NumberConstant.TEN);
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
  }

  initGridDataSourceBySource(page: number) {
    switch (this.source) {
      case HistoryConstant.OPPORTUNITY_ENTITY:
        this.initGridDataSourceByOpportunitySource(page);
        break;
      case HistoryConstant.ACTION:
        this.initGridDataSourceByActionSource(page);
        break;
      case HistoryConstant.CONTACT_CRM_ENTITY:
        this.initGridDataSourceByContactSource(page);
        break;
      case HistoryConstant.ORGANISATION_ENTITY:
        this.initGridDataSourceByOrganisationSource(page);
        break;
      case HistoryConstant.CLAIM_ENTITY:
        this.initGridDataSourceByClaimSource(page);
        break;
    }
  }

  private checkFilterByDate(searchDate: Date, time: Date, type: string) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(searchDate) &&
      this.genericCrmService.isNullOrUndefinedOrEmpty(time)) {
      return this.datePipe.transform(searchDate, SharedCrmConstant.YYYY_MM_DD_HH_MM_SS_FORMAT);
    } else if (this.genericCrmService.isNullOrUndefinedOrEmpty(searchDate) &&
      !this.genericCrmService.isNullOrUndefinedOrEmpty(time)) {
      searchDate = this.resetDate(type, searchDate);
      return this.datePipe.transform(searchDate, SharedCrmConstant.YYYY_MM_DD_HH_MM_SS_FORMAT);
    } else if (!this.genericCrmService.isNullOrUndefinedOrEmpty(searchDate) &&
      !this.genericCrmService.isNullOrUndefinedOrEmpty(time)) {
      const dateTime = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate(),
        time.getUTCHours() + 1, time.getUTCMinutes(), time.getUTCSeconds());
      return this.datePipe.transform(dateTime, SharedCrmConstant.YYYY_MM_DD_HH_MM_SS_FORMAT);
    } else {
      return '';
    }
  }

  private translateEntityField(data) {
    data.historicDtoList.map(item => {
      if (item.entityField) {
        item.entityField = this.translateService.instant(item.entityField);
      }
    });
  }

  private checkEntityFieldType(data) {
    data.historicDtoList.map(historic => {
      this.entityActions.push(historic.action);
      this.mapEmployeeField(historic);
      this.mapCurrencyField(historic);
      this.mapDurationField(historic);
      this.mapProductField(historic);
      this.mapOrganizationClientFieldOpportunity(historic);
      this.mapContactClientFieldOpportunity(historic);
      this.mapActionReminderInserted(historic);
      this.mapActionReminderDeleted(historic);
      this.mapHistoricCreatedBy(data);
    });
  }

  private mapProductField(historic) {
    if (this.isEntityFieldTypeItem(historic)) {
      if (!this.genericCrmService.isNullOrUndefinedOrEmpty(historic.fieldOldValue)) {
        const oldFields = historic.fieldOldValue.slice(1, -1).split(', ').map(Number);
        this.getFieldDescription(oldFields, historic, HistoryConstant.OLD_FIELD);
      }
      if (!this.genericCrmService.isNullOrUndefinedOrEmpty(historic.fieldNewValue)) {
        const newFields = historic.fieldNewValue.slice(1, -1).split(', ').map(Number);
        this.getFieldDescription(newFields, historic, HistoryConstant.NEW_FIELD);
      }
    }
  }

  private getFieldDescription(fields: number[], historic, fieldType) {
    this.clearFields(fieldType, historic);
    fields.forEach(ab => {
      this.getItem(ab).then((product: any) => {
        const productDescription = product.Description.split(' ').join('') + ' ';
        if (fieldType === HistoryConstant.OLD_FIELD) {
          historic.fieldOldValue += productDescription;
        }
        if (fieldType === HistoryConstant.NEW_FIELD) {
          historic.fieldNewValue += productDescription;
        }
      });
    });
  }

  private clearFields(fieldType, historic) {
    if (fieldType === HistoryConstant.OLD_FIELD) {
      historic.fieldOldValue = '';
    }
    if (fieldType === HistoryConstant.NEW_FIELD) {
      historic.fieldNewValue = '';
    }
  }

  private mapCurrencyField(historic) {
    if (this.isEntityFieldTypeCurrency(historic)) {
      if (!this.genericCrmService.isNullOrUndefinedOrEmpty(historic.fieldOldValue) &&
        historic.fieldOldValue !== NumberConstant.ZERO.toString()) {
        this.getCurrency(historic, historic.fieldOldValue, HistoryConstant.OLD_FIELD);
      }
      if (!this.genericCrmService.isNullOrUndefinedOrEmpty(historic.fieldNewValue) &&
        historic.fieldNewValue !== NumberConstant.ZERO.toString()) {
        this.getCurrency(historic, historic.fieldNewValue, HistoryConstant.NEW_FIELD);
      }
    }
  }

  private mapDurationField(historic) {
    if (this.isEntityFieldTypeDuration(historic)) {
      if (!this.genericCrmService.isNullOrUndefinedOrEmpty(historic.fieldOldValue) &&
        historic.fieldOldValue !== NumberConstant.ZERO.toString()) {
        this.getDuration(historic, historic.fieldOldValue, HistoryConstant.OLD_FIELD);
      }
      if (!this.genericCrmService.isNullOrUndefinedOrEmpty(historic.fieldNewValue) &&
        historic.fieldNewValue !== NumberConstant.ZERO.toString()) {
        this.getDuration(historic, historic.fieldNewValue, HistoryConstant.NEW_FIELD);
      }
    }
  }

  private getCurrency(historic, field, filedType) {
    let currency: string;
    this.currencyService.getById(field).subscribe((data) => {
      currency = data.Code;
    }, error => {
    }, () => {
      if (filedType === HistoryConstant.OLD_FIELD) {
        historic.fieldOldValue = currency;
      } else if (filedType === HistoryConstant.NEW_FIELD) {
        historic.fieldNewValue = currency;
      }
    });
  }

  private getDuration(historic, field, filedType) {
    const duration: string = this.genericCrmService.getDuration(field);
    if (filedType === HistoryConstant.OLD_FIELD) {
      historic.fieldOldValue = duration;
    } else if (filedType === HistoryConstant.NEW_FIELD) {
      historic.fieldNewValue = duration;
    }
  }

  private getItem(field) {
    return new Promise(resolve => {
      this.itemService.getById(field).subscribe((data) => {
        resolve(data);
      });
    });
  }

  private mapEmployeeField(historic) {
    if (this.isEntityFieldTypeEmployee(historic)) {
      this.pushResponsibleId(historic.fieldOldValue);
      this.pushResponsibleId(historic.fieldNewValue);
      this.pushResponsibleId(historic.createdBy);
    }
  }

  pushResponsibleId(id: string) {
    if (Number(id)) {
      this.responsabelsIds.push(Number(id));
    }
  }

  isEntityFieldTypeEmployee(historic): boolean {
    return historic.entityField === OpportunityConstant.RESPONSABLE_OF_FIELD_TITLE ||
      historic.entityField === OpportunityConstant.COMMERCIAL_OF_FIELD_TITLE ||
      historic.entityField === OpportunityConstant.EMPLOYEE ||
      historic.entityField === ActionConstant.RESPONSABLE_FIELD_HISTORIC ||
      historic.entityField === ClaimConstants.RESPONSABLE_FIELD_HISTORIC;
  }

  isReminderEntityAndEntityFieldIsInserted(historic): boolean {
    return historic.action === ActionConstant.INSERTED &&
      historic.entity.toLowerCase() === ActionConstant.REMINDERS.toLowerCase();
  }

  isReminderEntityAndEntityFieldIsDeleted(historic): boolean {
    return historic.entityField === ActionConstant.IS_DELETED_FIELD &&
      historic.entity.toLowerCase() === ActionConstant.REMINDER.toLowerCase();
  }

  isEntityFieldTypeCurrency(historic): boolean {
    return historic.entityField === OpportunityConstant.CURRENCY;
  }

  isEntityFieldTypeDuration(historic): boolean {
    return historic.entityField === OpportunityConstant.DURATION;
  }

  isEntityFieldTypeItem(historic): boolean {
    return historic.entityField === OpportunityConstant.ITEM;
  }

  isEntityFieldTypeOrganizationClientOpp(historic): boolean {
    return historic.entityField === OpportunityConstant.CLIENT_ORGANIZATION ||
      historic.entityField === ActionConstant.CONCERNED_ORG_CLIENT_TITLE;
  }

  isEntityFieldTypeContactClientOpp(historic): boolean {
    return historic.entityField === OpportunityConstant.CLIENT_CONTACT_ORGANIZATION ||
      historic.entityField === ActionConstant.CONTACT_CLIENT_TITLE;
  }

  private getResponsablesFullNames(data: any) {
    if (this.responsabelsIds.length > NumberConstant.ZERO) {
      this.userService.getUsersListByArray(this.responsabelsIds).subscribe(employees => {
        this.responsablesDetails = employees;
      }, () => {
      }, () => {
        this.setResponsabledFullNames(data);
        this.translateEntityField(data);
        this.initHistoricData(data);
      });
    } else {
      this.translateEntityField(data);
      this.initHistoricData(data);
    }
  }

  private setResponsabledFullNames(data: any) {
    data.historicDtoList.map(item => {
      if (this.isEntityFieldTypeEmployee(item)) {
        const oldField = this.responsablesDetails.find(reponsable => reponsable.Id === +item.fieldOldValue);
        const newField = this.responsablesDetails.find(reponsable => reponsable.Id === +item.fieldNewValue);
        item.fieldOldValue = this.setItemFullName(oldField, item.fieldOldValue);
        item.fieldNewValue = this.setItemFullName(newField, item.fieldNewValue);
      }
    });
  }

  setItemFullName(field, value) {
    if (field && field.FullName) {
      value = field.FullName;
      return value;
    }
  }

  private initHistoricData(data: any) {
    this.gridSettings.gridData = {
      data: this.filterDataHistory(data),
      total:  this.filterDataHistory(data).length
    };
  }
filterDataHistory(data: any):any{
    if (data) {
     data = data.historicDtoList.filter(historic => historic.entityField !== 'reasonForChanges');
    }
    return data ;
}
  initGridDataSourceByActionSource(page: number) {
    const startDate = this.checkFilterByDate(this.startDate, this.startTime, HistoryConstant.START_DATE);
    const endDate = this.checkFilterByDate(this.endDate, this.endTime, HistoryConstant.END_DATE);
    this.actionService.getJavaGenericService().getData(HistoryConstant.HISTORY_BY_ENTITY_ID +
      '?entityId=' + this.sourceId + '&searchValue=' + this.searchValue + '&startDate=' + startDate + '&endDate=' +
      endDate + '&page=' + page + '&size=' + NumberConstant.TEN + '&field=' + this.sort.field + '&direction=' + this.sort.direction
    ).subscribe((
      (data) => {
        if (data) {
          this.responsabelsIds = [];
          this.responsablesDetails = [];
          this.checkEntityFieldType(data);
          this.getResponsablesFullNames(data);
        }
      }
    ));
  }

  initGridDataSourceByOpportunitySource(page: number) {
    const startDate = this.checkFilterByDate(this.startDate, this.startTime, HistoryConstant.START_DATE);
    const endDate = this.checkFilterByDate(this.endDate, this.endTime, HistoryConstant.END_DATE);
    this.opportunityService.getJavaGenericService().getData(HistoryConstant.HISTORY_BY_ENTITY_ID +
      '?entityId=' + this.sourceId + '&searchValue=' + this.searchValue + '&startDate=' + startDate + '&endDate=' +
      endDate + '&page=' + page + '&size=' + NumberConstant.TEN + '&field=' + this.sort.field + '&direction=' + this.sort.direction
    ).subscribe((data) => {
      this.responsabelsIds = [];
      this.responsablesDetails = [];
      this.checkEntityFieldType(data);
      this.getResponsablesFullNames(data);
    });
  }

  onSearch() {
    if (this.endDate && this.startDate && this.endDate < this.startDate) {
      this.endDate = this.startDate;
    }
    this.initHistoryData();
  }

  /*init search dropDown field */
  private initHistoricSearchFields() {
    this.historySearchFields = [];
    switch (this.source) {
      case OpportunityConstant.OPPORTUNITY_ENTITY:
        this.initOpportunitySearchFields();
        break;
      case HistoryConstant.ACTION_ENTITY:
        this.initActionSearchFields();
        break;
      case HistoryConstant.CONTACT_CRM_ENTITY:
        this.initContactCrmSearchFields();
        break;
      case HistoryConstant.ORGANISATION_ENTITY:
        this.initOrganisationSearchFields();
        break;
      case HistoryConstant.CLAIM_ENTITY:
        this.initClaimSearchFields();
        break;
    }
  }

  /*init dropdown by opportunity search fields*/
  private initOpportunitySearchFields() {
    this.opportunityService.getJavaGenericService().getData(OpportunityConstant.HISTORIC_SEARCH_FILEDS_URL)
      .subscribe(historicSearchFields => {
        this.historySearchFields = this.mapHistorySearchFields(historicSearchFields);
      });
  }

  /*init dropdown by action search fields*/
  private initActionSearchFields() {
    this.actionService.getJavaGenericService().getData(OpportunityConstant.HISTORIC_SEARCH_FILEDS_URL).subscribe(historicSearchFields => {
      this.historySearchFields = this.mapHistorySearchFields(historicSearchFields);
    });
  }

  /*init action dropDown field*/
  private initHistoricSearchByType() {
    this.historySearchFields = [];
    this.historySearchFields = this.searchByAction.map(value => {
      return value = {key: value, value: this.translateService.instant(value)};
    });
  }

  /*on change field or action search value*/
  onChangeSearchField(key) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(key)) {
      this.searchValue = key;
    } else {
      this.searchValue = '';
      this.selectedField = '';
    }
    this.initHistoryData();
  }

  /*on change type Filtre value*/
  onChangeSearchByType(searchType) {
    if (searchType === HistoryConstant.SEARCH_HISTORIC_BY_ATTRIBUT) {
      this.resetAndInitSearchFieldValues();
      this.initHistoricSearchFields();
    } else if (searchType === HistoryConstant.SEARCH_HISTORIC_BY_ACTION_TYPE) {
      this.resetAndInitSearchFieldValues();
      this.initHistoricSearchByType();
    } else {
      this.resetDropdownFields();
      this.initHistoryData();
    }
  }

  private resetAndInitSearchFieldValues() {
    this.selectedField = '';
    this.isSearchType = true;
  }

  private resetDropdownFields() {
    this.historySearchFields = [];
    this.selectedSearchType = '';
    this.selectedField = '';
    this.isSearchType = false;
    this.searchValue = '';
  }


  private mapOrganizationClientFieldOpportunity(historic) {
    if (this.isEntityFieldTypeOrganizationClientOpp(historic)) {
      this.getTiersCode(historic, HistoryConstant.OLD_FIELD);
      this.getTiersCode(historic, HistoryConstant.NEW_FIELD);
    }
  }

  private mapContactClientFieldOpportunity(historic) {
    this.getAllTiersContactList(historic);
  }

  private getTiersCode(historic, type) {
    const idTiers = type === HistoryConstant.OLD_FIELD ? historic.fieldOldValue : historic.fieldNewValue;
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(idTiers) && Number(idTiers)) {
      this.tiersService.getTiersById(idTiers).subscribe(data => {
        if (type === HistoryConstant.OLD_FIELD) {
          historic.fieldOldValue = data.Name;
        } else if (type === HistoryConstant.NEW_FIELD) {
          historic.fieldNewValue = data.Name;
        }
      });
    }
  }

  private getAllTiersContactList(historic) {
    if (this.isEntityFieldTypeContactClientOpp(historic)) {
      this.tiersService.getContactTiers().subscribe(data => {
          this.contactsClients = data.listData;
        }, () => {
        },
        () => {
          const oldValue = this.contactsClients.find(contact => contact.Id === +historic.fieldOldValue);
          const newValue = this.contactsClients.find(contact => contact.Id === +historic.fieldNewValue);
          historic.fieldOldValue = !this.genericCrmService.isNullOrUndefinedOrEmpty(oldValue) ?
            `${oldValue.FirstName}  ${oldValue.LastName}` : '';
          historic.fieldNewValue = !this.genericCrmService.isNullOrUndefinedOrEmpty(newValue) ?
            `${newValue.FirstName}  ${newValue.LastName}` : '';
        });
    }
  }

  /*reset startDate or endDate to date of now*/
  private resetDate(type, searchDate) {
    if (type === HistoryConstant.START_DATE && this.genericCrmService.isNullOrUndefinedOrEmpty(searchDate)) {
      return this.startDate = new Date();
    } else if (type === HistoryConstant.END_DATE && this.genericCrmService.isNullOrUndefinedOrEmpty(searchDate)) {
      return this.endDate = new Date();
    }
  }

  private mapHistoricCreatedBy(data: any) {
    this.employeesIdsCreatedBy = data.historicDtoList.map(historic => {
      return historic.commercialId;
    });
    // dintinct array of employees ids values
    this.employeesIdsCreatedBy = Array.from(new Set(this.employeesIdsCreatedBy));

    this.predicateHistoric = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicateHistoric).subscribe(users => {
      this.listUsers = users.data;
      this.listUsersFilter = users.data;
      this.filterUsers();
      data.historicDtoList.map(historic => {
        return historic.createdByFullName = this.listUsers.find(employee => employee.Email === historic.commercialId).FullName;
      });
    }, () => {
    }, () => {
    });
  }

  filterUsers() {
    this.listUsersFilter = this.listUsersFilter.filter(responsable => responsable.FullName != null);
    this.removeDuplicateUsers();
    this.listUsers = this.listUsersFilter;
  }

  removeDuplicateUsers() {
    this.listUsersFilter = this.listUsersFilter.reduce((a, b) => {
      if (!a.find(data => data.Email === b.Email)) {
        a.push(b);
      }
      return a;
    }, []);
  }


  private mapActionReminderInserted(historic) {
    if (this.isReminderEntityAndEntityFieldIsInserted(historic)) {
      const parsedFieldNewValue = historic.fieldNewValue.split(';');
      historic.entityField = this.translateService.instant(ActionConstant.REMINDERS);
      historic.fieldOldValue = '';
      historic.fieldNewValue = `${this.translateService.instant(ActionConstant.REMINDER_TYPE)} : ${parsedFieldNewValue[NumberConstant.ZERO]}
       ${this.translateService.instant(ActionConstant.REMINDER_DELAY_UNITY)} :
        ${this.translateService.instant(parsedFieldNewValue[NumberConstant.TWO])}
       ${this.translateService.instant(ActionConstant.REMINDER_DELAY_COUNT)} : ${parsedFieldNewValue[NumberConstant.ONE]}`;
    }
  }

  private mapActionReminderDeleted(historic) {
    if (this.isReminderEntityAndEntityFieldIsDeleted(historic)) {
      historic.entityField = this.translateService.instant(ActionConstant.REMINDER);
      historic.fieldOldValue = '';
      historic.fieldNewValue = '';
    }
  }

  public onSortChange(event) {
    if (event[0]) {
      const selectedSort = event[0];
      if (selectedSort.dir) {
        if (selectedSort.field === HistoryConstant.CONCERNED_ELEMENT_FIELD || selectedSort.field === HistoryConstant.CURRENT_USER_FIELD) {
          this.gridSettings.gridData.data =
            this.genericCrmService.sortListByColumnAndOrder(this.gridSettings.gridData.data, selectedSort.dir, selectedSort.field);
        } else {
          this.sort = new Sort(selectedSort.field, ''.concat(selectedSort.dir).toUpperCase());
          this.initHistoryData();
        }
      }
    }
  }


  /**
   * Contact crm historique
   */
  initGridDataSourceByContactSource(page: number) {
    const startDate = this.checkFilterByDate(this.startDate, this.startTime, HistoryConstant.START_DATE);
    const endDate = this.checkFilterByDate(this.endDate, this.endTime, HistoryConstant.END_DATE);
    this.contactCrmService.getJavaGenericService().getData(HistoryConstant.HISTORY_BY_ENTITY_ID +
      '?entityId=' + this.sourceId + '&searchValue=' + this.searchValue + '&startDate=' + startDate + '&endDate=' +
      endDate + '&page=' + page + '&size=' + NumberConstant.TEN + '&field=' + this.sort.field + '&direction=' + this.sort.direction
    ).subscribe((
      (data) => {
        if (data) {
          this.responsabelsIds = [];
          this.responsablesDetails = [];
          this.checkEntityFieldType(data);
          this.getResponsablesFullNames(data);
        }
      }
    ));
  }

  /*init dropdown by Contact Crm search fields*/
  private initContactCrmSearchFields() {
    this.contactCrmService.getJavaGenericService().getData(OpportunityConstant.HISTORIC_SEARCH_FILEDS_URL)
      .subscribe(historicSearchFields => {
        this.historySearchFields = this.mapHistorySearchFields(historicSearchFields);
      });
  }


  /**
   * organisation historique
   */

  initGridDataSourceByOrganisationSource(page: number) {
    const startDate = this.checkFilterByDate(this.startDate, this.startTime, HistoryConstant.START_DATE);
    const endDate = this.checkFilterByDate(this.endDate, this.endTime, HistoryConstant.END_DATE);
    this.organisationService.getJavaGenericService().getData(HistoryConstant.HISTORY_BY_ENTITY_ID +
      '?entityId=' + this.sourceId + '&searchValue=' + this.searchValue + '&startDate=' + startDate + '&endDate=' +
      endDate + '&page=' + page + '&size=' + NumberConstant.TEN + '&field=' + this.sort.field + '&direction=' + this.sort.direction
    ).subscribe((
      (data) => {
        if (data) {
          this.responsabelsIds = [];
          this.responsablesDetails = [];
          this.checkEntityFieldType(data);
          this.getResponsablesFullNames(data);
        }
      }
    ));
  }

  /*init dropdown by organisation search fields*/
  private initOrganisationSearchFields() {
    this.organisationService.getJavaGenericService().getData(OpportunityConstant.HISTORIC_SEARCH_FILEDS_URL)
      .subscribe(historicSearchFields => {
        this.historySearchFields = this.mapHistorySearchFields(historicSearchFields);
      });
  }

  /** get history data switch source type */
  initHistoryData() {
    switch (this.source) {
      case HistoryConstant.OPPORTUNITY_ENTITY:
        this.initGridDataSourceByOpportunitySource(NumberConstant.ZERO);
        break;
      case HistoryConstant.ACTION:
        this.initGridDataSourceByActionSource(NumberConstant.ZERO);
        break;
      case HistoryConstant.CONTACT_CRM_ENTITY:
        this.initGridDataSourceByContactSource(NumberConstant.ZERO);
        break;
      case HistoryConstant.ORGANISATION_ENTITY:
        this.initGridDataSourceByOrganisationSource(NumberConstant.ZERO);
        break;
      case HistoryConstant.CLAIM_ENTITY:
        this.initGridDataSourceByClaimSource(NumberConstant.ZERO);
        break;
    }
  }

  /** map historySearchFields */
  mapHistorySearchFields(historicSearchFields): any {
    return historicSearchFields.map((field: any) => {
      return field = {key: field.key, value: this.translateService.instant(field.value)};
    });
  }


  /**
   * claim historique
   */

  initGridDataSourceByClaimSource(page: number) {
    const startDate = this.checkFilterByDate(this.startDate, this.startTime, HistoryConstant.START_DATE);
    const endDate = this.checkFilterByDate(this.endDate, this.endTime, HistoryConstant.END_DATE);
    this.claimService.getJavaGenericService().getData(HistoryConstant.HISTORY_BY_ENTITY_ID +
      '?entityId=' + this.sourceId + '&searchValue=' + this.searchValue + '&startDate=' + startDate + '&endDate=' +
      endDate + '&page=' + page + '&size=' + NumberConstant.TEN + '&field=' + this.sort.field + '&direction=' + this.sort.direction
    ).subscribe(
      (data) => {
        if (data) {
          this.responsabelsIds = [];
          this.responsablesDetails = [];
          this.checkEntityFieldType(data);
          this.getResponsablesFullNames(data);
        }
      });
  }

  /*init dropdown by claim search fields*/
  private initClaimSearchFields() {
    this.claimService.getJavaGenericService().getData(OpportunityConstant.HISTORIC_SEARCH_FILEDS_URL)
      .subscribe(historicSearchFields => {
        this.historySearchFields = this.mapHistorySearchFields(historicSearchFields);
      });
  }

}
