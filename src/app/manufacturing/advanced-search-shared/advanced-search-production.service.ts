import {FieldTypeConstant} from '../../constant/shared/fieldType.constant';
import {SharedAccountingConstant} from '../../constant/accounting/sharedAccounting.constant';
import {NumberConstant} from '../../constant/utility/number.constant';
import {
  Filter as predicate, OperationProdTypeString, OperationTypeDate, OperationTypeDateAcc,
  OperationTypeDropDown,
  OperationTypeString
} from '../../shared/utils/predicate';
import {EnumValues} from 'enum-values';
import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {NumberFormatOptions} from '@progress/kendo-angular-intl';

import {isNotNullOrUndefinedAndNotEmptyValue} from '../../stark-permissions/utils/utils';

@Injectable()
export class AdvancedSearchProductionService {

  constructor(public datePipe: DatePipe) {

  }

  isNullAndUndefinedAndEmpty(value) {
    if (value === null || value === undefined || value === '') {
      return true;
    }
  }

  public getFilterType(type: string) {
    if (type === FieldTypeConstant.TEXT_TYPE) {
      return SharedAccountingConstant.FILTER_TYPES.STRING;
    }
    if (type === FieldTypeConstant.DATE_TYPE) {
      return SharedAccountingConstant.FILTER_TYPES.DATE;
    }
    if (type === FieldTypeConstant.PROD_ARTICLE_TEXT) {
      return SharedAccountingConstant.FILTER_TYPES.STRING;
    }
    if (type === FieldTypeConstant.PROD_STATUS_DROPDOWN || FieldTypeConstant.PROD_ARTICLE_DROPDOWN) {
      return SharedAccountingConstant.FILTER_TYPES.STRING;
    } else {
      return type;
    }
  }

  public getOperation(filter: predicate, filterFieldsColumns, filterFieldsInputs) {
    const type = this.getType(filter, filterFieldsColumns, filterFieldsInputs);
    let operationTypeEnum;
    if (type === FieldTypeConstant.TEXT_TYPE) {
      operationTypeEnum = OperationTypeString;
    } else if (type === FieldTypeConstant.DATE_TYPE) {
      operationTypeEnum = OperationTypeDateAcc;
    } else if (type === FieldTypeConstant.PROD_ARTICLE_TEXT ||
      FieldTypeConstant.PROD_ARTICLE_DROPDOWN ||
    FieldTypeConstant.PROD_STATUS_DROPDOWN) {
      operationTypeEnum = OperationProdTypeString;
    } else {
      operationTypeEnum = OperationTypeDropDown;
    }
    return (EnumValues.getNameFromValue(operationTypeEnum, filter.operation));
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

  public getValue(value: any, numberFormatOptions?: NumberFormatOptions) {
    if (isNotNullOrUndefinedAndNotEmptyValue(numberFormatOptions)) {
      value = Number.parseFloat(value).toFixed(numberFormatOptions.minimumFractionDigits);
    }
    return value;
  }

  getSortParams(sort) {
    if (sort.length === 0) {
      return '';
    } else {
      return '&sort=' + sort[0].field + ',' + (sort[0].dir === undefined ? '' : sort[0].dir);
    }
  }
}
