import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {SharedConstant} from '../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../shared/components/swal/swal-popup';
import {Observable} from 'rxjs/Observable';
import {AbstractControl, AsyncValidatorFn, FormArray, ValidationErrors, ValidatorFn} from '@angular/forms';
import {GridSettings} from '../shared/utils/grid-settings.interface';
import {Filter} from '../models/crm/Filter';
import {DatePipe} from '@angular/common';
import {CrmConstant} from '../constant/crm/crm.constant';
import {OrderBy, OrderByDirection, PredicateFormat} from '../shared/utils/predicate';
import {TiersConstants} from '../constant/purchase/tiers.constant';
import {OrganisationConstant} from '../constant/crm/organisation.constant';
import {NumberConstant} from '../constant/utility/number.constant';
import {orderBy} from 'lodash';
import {SharedCrmConstant} from '../constant/crm/sharedCrm.constant';
import {ResourceServiceJava} from '../shared/services/resource/resource.serviceJava';

@Injectable()
export class GenericCrmService {

  /**
   * @param translate
   * @param swalWarrings
   * @param datePipe
   */
  constructor(private translate: TranslateService, private swalWarrings: SwalWarring, public datePipe: DatePipe) {
  }

  public isNullOrUndefinedOrEmpty(value): boolean {
    if (value === null || value === undefined || value === '') {
      return true;
    }
  }

  public dateWithoutTime(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  public getDuration(duration): string {
    let nbMonths;
    let nbWeeks;
    let nbDays;
    let nbHours;
    let nbMinutes;
    if (duration) {
      const units = {
        'month': 24 * 60 * 30,
        'week': 24 * 60 * 7,
        'day': 24 * 60,
        'hours': 60,
        'minute': 1
      };
      for (const name in units) {
        switch (name) {
          case 'month':
            nbMonths = Math.floor(duration / units['month']);
            break;
          case 'week':
            nbWeeks = Math.floor(duration / units['week']);
            break;
          case 'day': {
            nbDays = Math.floor(duration / (24 * 60));
            break;
          }
          case 'hours':
            nbHours = Math.floor(duration / units['hours']);
            break;
          case 'minute':
            nbMinutes = Math.floor(duration / units['minute']);
            break;
        }
        duration %= units[name];
      }
    }
    const durationString = ''.concat(nbMonths ? nbMonths : '')
      .concat(nbMonths ? this.translate.instant('MONTHS AND ') : '')
      .concat(nbWeeks ? nbWeeks : ' ')
      .concat(nbWeeks ? this.translate.instant('WEEKS AND') : ' ')
      .concat(nbDays ? nbDays : ' ')
      .concat(nbDays ? this.translate.instant('DAYS AND') : ' ')
      .concat(nbHours ? nbHours : ' ')
      .concat(nbHours ? this.translate.instant('HOURS AND ') : ' ')
      .concat(nbMinutes).concat(this.translate.instant('MINUTES'));
    return durationString;
  }

  handleCanDeactivateToLeaveCurrentComponent(checkIfFormGroupComponentHasChanged: Function) {
    if (this.isOperationInProgress(checkIfFormGroupComponentHasChanged)) {
      return this.getModalResponseToLeaveCurrentComponent();
    }
    return true;
  }

  openModalToConfirmSwitchingToAnotherOperationType(): any {
    const swalWarningMessage = `${this.translate.instant(CrmConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    return this.swalWarrings.CreateSwal(swalWarningMessage, CrmConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO);
  }

  isOperationInProgress(checkIfFormGroupComponentHasChanged: Function): boolean {
    return this.isFormGroupDataChanged(checkIfFormGroupComponentHasChanged);
  }

  getModalResponseToLeaveCurrentComponent(): Promise<boolean> {
    return new Promise(resolve => {
      let canDeactivate = false;
      this.openModalToConfirmSwitchingToAnotherOperationType().then((result) => {
        if (result.value) {
          canDeactivate = true;
        }
        resolve(canDeactivate);
      });
    });
  }

  private isFormGroupDataChanged(isFormGroupDataChanged: Function): boolean {
    return isFormGroupDataChanged();
  }

  /**
   *
   * @param formArray
   * @param field
   */
  public uniqueValueInFormArray(formArray: Observable<FormArray>, field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let result = null;
      formArray.subscribe(form => {
        if (form && control.value && (control.touched || control.dirty)) {
          const length = form.value.filter(x => {
              if (x[field] && x[field].id && control.value.id) {
                return x[field].id === control.value.id;
              } else {
                return x[field] === control.value;
              }
            }
          ).length;
          const error = length > 0;
          result = error ? {
            'uniqueParam': {isUnique: true}
          } : null;
        }
      });
      return result;
    };
  }

  /**
   * Validate unique fields
   * @param property
   * @param service
   * @returns AsyncValidatorFn
   * @requires field must be required
   */
  unique(property: string, service: ResourceServiceJava, value: string)
    : AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (!control.valueChanges) {
        return Observable.of(null);
      } else {
        return service.getUnicity(property, control.value).toPromise().then((res: boolean) => {
          return (res && (control.touched || control.dirty) && control.value) ?
            {
              'unique': {isUnique: true, value: control.value}
            } : null;
        });
      }
    };
  }

  public buildFilters(gridSettings: GridSettings): Array<Filter> {
    const filters = new Array<Filter>();
    gridSettings.state.filter.filters.forEach(filter => {
      let type = CrmConstant.FILTER_TYPES.STRING;
      const relatedColumnsConfig =
        gridSettings.columnsConfig.filter(column => column.field === filter[CrmConstant.FILTER_FIELDS.FIELD])[0];
      if (relatedColumnsConfig.hasOwnProperty(CrmConstant.FILTER_KEY)) {
        type = relatedColumnsConfig.filter;
      }
      let value = filter[CrmConstant.FILTER_FIELDS.VALUE];
      if (type === CrmConstant.FILTER_TYPES.DATE) {
        value = this.datePipe.transform(new Date(filter[CrmConstant.FILTER_FIELDS.VALUE]), SharedConstant.PIPE_FORMAT_DATE);
      }
      filters.push(new Filter(type, filter[CrmConstant.FILTER_FIELDS.OPERATOR],
        filter[CrmConstant.FILTER_FIELDS.FIELD], value,));
    });
    return filters;
  }

  public preparePredicateForClientsList(predicate: PredicateFormat) {
    predicate = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy(OrganisationConstant.NAME_TIERS, OrderByDirection.asc));
    return predicate;
  }

  /**
   *
   * @param event
   */
  isNumber(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > NumberConstant.THIRTY_ONE && (charCode < NumberConstant.FOURTY_EIGHT || charCode > NumberConstant.FIFTY_SEVEN));
  }

  public sortListByColumnAndOrder(list: any[], order: any, column: string = ''): any[] {
    if (!list || order === '' || !order) {
      return list;
    }
    if (list.length <= 1) {
      return list;
    }
    if (!column || column === SharedCrmConstant.EMPTY_STRING) {
      if (order === SharedCrmConstant.ASC_SORT.toLowerCase()) {
        return list.sort();
      } else {
        return list.sort().reverse();
      }
    }
    return orderBy(list, [column], [order]);
  }
}
