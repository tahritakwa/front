import { Injectable, Inject } from '@angular/core';
import { ResourceServiceJava } from '../../../shared/services/resource/resource.serviceJava';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {ReducedCurrency} from "../../../models/administration/reduced-currency.model";
import {FieldTypeConstant} from '../../../constant/shared/fieldType.constant';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {
  Filter as predicate,
  OperationTypeDateAcc,
  OperationTypeDropDown,
  OperationTypeNumber,
  OperationTypeString
} from '../../../shared/utils/predicate';
import {EnumValues} from 'enum-values';

@Injectable()
export class OrganisationService extends ResourceServiceJava {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, 'crm', 'Organisation');
  }

  /***
   * params are the search or the filter value with pagination params
   * @param params
   */
  public getOrganizationByParam(params: any): Observable<any> {
    return this.getJavaGenericService().sendData('paginatingParams', params);
  }

  public getOrganisationsByIds(ids: number[]): Observable<any> {
    return this.callService(Operation.POST, 'list-by-ids', ids);
  }

  public downloadOrganisationExcelTemplate(currencyList :any,countries:any,cities:any): Observable<any> {
    const organisationDataExcel = {countries :countries,cities:cities,currencyList:currencyList};
    return super.callService(Operation.POST, 'downloadOrganisationExcelTemplate',organisationDataExcel);
  }

  public saveOrganisationFromFile(data: any): Observable<any> {
    const  url = 'upload';
    return this.callService(Operation.POST, url,data);
  }
  public getFilterType(type: string) {
    if (type === FieldTypeConstant.TEXT_TYPE || type === FieldTypeConstant.numerictexbox_type) {
      return SharedAccountingConstant.FILTER_TYPES.STRING;
    } else if (type === FieldTypeConstant.planCodeComponent ||
      type === FieldTypeConstant.closingStateComponent ||
      type === FieldTypeConstant.journalComponent) {
      return SharedAccountingConstant.FILTER_TYPES.DROP_DOWN_LIST;
    } if (type === FieldTypeConstant.DATE_TYPE_ACC) {
      return  SharedAccountingConstant.FILTER_TYPES.DATE;
    }    else {
      return type;
    }
  }
  public getType(filter, filterFieldsColumns: any, filterFieldsInputs: any) {
    const filterFieldsColumn = filterFieldsColumns.filter(filterField => filterField.columnName === filter.prop);
    const filterFieldsInput = filterFieldsInputs.filter(filterField => filterField.columnName === filter.prop);
    if (filterFieldsColumn.length === NumberConstant.ONE) {
      return filterFieldsColumn[NumberConstant.ZERO].type;
    } else if (filterFieldsInput.length === NumberConstant.ONE) {
      return filterFieldsInput[NumberConstant.ZERO].type;
    }
  }
  public getOperation(filter: predicate, filterFieldsColumns, filterFieldsInputs ) {
    const type = this.getType(filter, filterFieldsColumns, filterFieldsInputs);
    let operationTypeEnum ;
    if (type === FieldTypeConstant.TEXT_TYPE) {
      operationTypeEnum = OperationTypeString;
    } else if (type === FieldTypeConstant.DATE_TYPE_ACC ) {
      operationTypeEnum = OperationTypeDateAcc;
    } else if (type === FieldTypeConstant.numerictexbox_type) {
      operationTypeEnum = OperationTypeNumber;
    } else  {
      operationTypeEnum = OperationTypeDropDown;
    }
    return (EnumValues.getNameFromValue(operationTypeEnum, filter.operation));
  }
  public getOrganizationByParamFilter(params: any, filter: any): Observable<any> {
    return this.getJavaGenericService().sendData('paginatingParamsAndFilter', params);
  }
}
