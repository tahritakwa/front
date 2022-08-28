import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import { ResourceService } from '../resource/resource.service';
import { Resource } from '../../../models/shared/ressource.model';
import { ResourceServiceJava } from '../resource/resource.serviceJava';
import { CompanyService } from '../../../administration/services/company/company.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { SwalWarring } from '../../components/swal/swal-popup';
import { WarehouseConstant } from '../../../constant/inventory/warehouse.constant';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';

@Injectable()
export class ValidationService {

  /**
   * @param translate
   * @param swalWarrings
   * @param companyService
   * @param swalWarrings
   */
  constructor(private translate: TranslateService, private swalWarrings: SwalWarring) {

  }

  /**
   * get validation error message
   * @param validatorName
   * @param validatorValue
   */
  public getValidatorErrorMessage(validatorName: string, validatorValue?: any): string {
    const config = {
      'required': `${this.translate.instant('FORM_VALIDATION_REQUIRED')}`,
      'numericWithDashsParam': `${this.translate.instant('FORM_VALIDATION_NUMERIC_WITH_DASHS')}`,
      'alphabeticalParam': `${this.translate.instant('FORM_VALIDATION_ALPHABETICAL')}`,
      'requiredTrue': `${this.translate.instant('FORM_VALIDATION_REQUIRED_TRUE')}`, // Used for checkbox like
      'minlength': `${this.translate.instant('FORM_VALIDATION_MIN_LENGTH')} ${validatorValue.requiredLength}`,
      'maxlength': `${this.translate.instant('FORM_VALIDATION_MAX_LENGTH')} ${validatorValue.requiredLength}`,
      'min': `${this.translate.instant('FORM_VALIDATION_MIN')} ${validatorValue.min}`,
      'max': `${this.translate.instant('FORM_VALIDATION_MAX')} ${validatorValue.max}`,
      'email': `${this.translate.instant('FORM_VALIDATION_EMAIL')}`, // email format validation
      'pattern': validatorValue.requiredPattern == '^[A-Za-zñÑáâéèêçôîíóúÁÉÍÓÚ]+$' ?
        `${this.translate.instant('FORM_VALIDATION_FORMAT_STRING_SPECIAL_CHARACTERS')}` : `${this.translate.instant('FORM_VALIDATION_FORMAT')}`, // pattern validation
      'compose': '', // union of validations
      'composeAsync': '', // union return one validation error,
      // check if date is greater than other date value
      'dateValueGT': `${this.translate.instant('FORM_VALIDATION_DATE_VALUE_GT')} ${validatorValue.minValue}`,
      // check if date is lower than other date value
      'dateValueLT': `${this.translate.instant('FORM_VALIDATION_DATE_VALUE_LT')} ${validatorValue.maxValue}`,
      'unique': `${validatorValue.value} ${this.translate.instant('FORM_VALIDATION_UNIQUE')}`,
      'between': `${this.translate.instant('FORM_VALIDATION_BETWEEN')} ${validatorValue.value1}
       ${this.translate.instant('AND')} ${validatorValue.value2} `,
      'strictSup': `${this.translate.instant('FORM_VALIDATION_STRICT_SUP')} ${validatorValue.minValue}`,
      'strictInf': `${this.translate.instant('FORM_VALIDATION_STRICT_INF')} ${validatorValue.maxValue}`,
      'uniqueStartPeriode': `${this.translate.instant('FORM_VALIDATION_UNIQUE_START_PERIODE')}`,
      'uniqueParam': ` ${this.translate.instant('FORM_VALIDATION_MUST_BE_UNIQUE')}`,
      'alphabeticalAndNumeric': `${this.translate.instant('FORM_VALIDATION_ALPHABETICAL_AND_NUMERIC')}`,
      'numeric': `${this.translate.instant('FORM_VALIDATION_NUMERIC')}`,
      'numericWithPrecision': `${this.translate.instant('FORM_VALIDATION_NUMERIC_WITH_PRECISION')}`,
      'digitsAfterComma': `${this.translate.instant('MAX')} ${validatorValue.value} ${this.translate.instant('FORM_VALIDATION_DIGITSAFTERCOMMA')} `,
      'cessionInvalidDate': `${this.translate.instant('CESSION_DATE_INVALID')}`,
      'documentAccountInvalidDate': `${this.translate.instant('DOCUMENT_ACCOUNT_DATE_INVALID')}`,
      'actionInvalidDate': `${this.translate.instant('ACTION_DATE_INVALID')}`,
      'equalLength': `${this.translate.instant('EQUAL_LENGTH')} ${validatorValue.value}`,
      'minQuantity': `${this.translate.instant('FORM_VALIDATION_MIN_QUANTITY')} ${validatorValue.value}`,
      'precision': `${this.translate.instant('CURRENCY_PRECISION')} ${validatorValue.value}`,
      'shelfAndStoragePattern': `${this.translate.instant('FORM_VALIDATION_INVALID_SHELF_AND_STORAGE')}`,
      'equalValue': `${this.translate.instant('EQUAL_VALUE_VALIDATOR')} ${validatorValue.value}`,
      'maxQuantity': `${this.translate.instant('FORM_VALIDATION_MAX_QUANTITY')} ${validatorValue.value}`,
      'digitsAfterCommaCMD': `${this.translate.instant('FORM_VALIDATION_DIGITSAFTERCOMMACMD')} ${validatorValue.value}`,
      'cmdNotDecomposable': `${this.translate.instant('FORM_VALIDATION_CMD')}`
    };
    return config[validatorName];
  }

  /**
   * validate from
   * @param formGroup
   */
  public validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.updateValueAndValidity();
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control instanceof FormArray) {
        (control as FormArray).controls.forEach((ctrls) => {
          this.validateAllFormFields(ctrls as FormGroup);
        });
        control.updateValueAndValidity();
        control.markAsTouched();
      }
    });
  }

  /**
   * Validate all formGroup of formArray
   * @param formArray
   */
  public validateAllFormGroups(formArray: FormArray): void {
    formArray.controls.forEach((formGroup: FormGroup) => {
      this.validateAllFormFields(formGroup);
    });
  }

  /**
   *  Conditional validator of input
   * @param condition
   * @param validator
   */
  public conditionalValidator(condition: (() => boolean), validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!condition()) {
        return null;
      }
      return validator(control);
    };
  }

  /**
   * conditional async unique validator
   * @param condition 
   * @param property 
   * @param service 
   * @param value 
   */
  public conditionalAsyncUniqueValidator(condition: (() => boolean), property: string, service: ResourceService<Resource>, value: string): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (!condition) {
        return Observable.of(null);
      }
      if (!control.valueChanges) {
        return Observable.of(null);
      }
      return service.getUnicity(property, control.value, value).toPromise().then((res: boolean) => {
        return (res && (control.touched || control.dirty) && control.value) ?
          {
            'unique': { isUnique: true, value: control.value }
          } : null;
      });;
    };
  }

  handleCanDeactivateToLeaveCurrentComponent(checkIfFormGroupComponentHasChanged: Function) {
    if (this.isOperationInProgress(checkIfFormGroupComponentHasChanged)) {
      return this.getModalResponseToLeaveCurrentComponent();
    }
    return true;
  }


  public scrollToInvalidField(invalidControl) {
    window.scroll({
      top: this.getTopOffset(invalidControl),
      left: NumberConstant.ZERO,
      behavior: 'smooth'
    });
  }

  public getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = NumberConstant.FIFTY;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }


  openModalToConfirmSwitchingToAnotherOperationType(): any {
    const swalWarningMessage = `${this.translate.instant(SharedConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    return this.swalWarrings.CreateSwal(swalWarningMessage, SharedConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO);
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

  isFormGroupDataChanged(isFormGroupDataChanged: Function): boolean {
    return isFormGroupDataChanged();
  }

  isOperationInProgress(checkIfFormGroupComponentHasChanged: Function): boolean {
    return this.isFormGroupDataChanged(checkIfFormGroupComponentHasChanged);
  }

}

/**
 * date mut be greater than _entred_date_ validator
 * @param dateObservable
 * @returns Validator
 */
export function dateValueGT(dateObservable: Observable<Date>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    dateObservable.subscribe(date => {
      if (date && (control.touched || control.dirty) && control.value) {
        const controlDate = new Date(control.value);
        controlDate.setHours(NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO);
        const referenceDate = new Date(date);
        referenceDate.setHours(NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO);
        const error = controlDate.getTime() < referenceDate.getTime();
        result = error ? {
          'dateValueGT': {
            currentValue: control.value,
            minValue: new DatePipe('en-US').transform(date, 'dd/MM/yyyy')
          }
        } : null;
      }
    });
    return result;
  };
}

/**
 * date must be lower than _entred_date_ validator
 * @param dateObservable
 * @returns Validator
 */
export function dateValueLT(dateObservable: Observable<Date>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    dateObservable.subscribe(date => {
      if (date && (control.touched || control.dirty) && control.value) {
        const controlDate = new Date(control.value);
        controlDate.setHours(NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO);
        const referenceDate = new Date(date);
        referenceDate.setHours(NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO);
        const error = controlDate.getTime() > referenceDate.getTime();
        result = error ? {
          'dateValueLT': {
            currentValue: control.value,
            maxValue: new DatePipe('en-US').transform(date, 'dd/MM/yyyy')
          }
        } : null;
      }
    });
    return result;
  };
}

/**
 * dateTime mut be greater than _entred_date_ validator
 * @param dateObservable
 * @returns Validator
 */
export function dateTimeValueGT(dateObservable: Observable<Date>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    dateObservable.subscribe(date => {
      if (date && (control.touched || control.dirty) && control.value) {
        const controlDate = new Date(control.value);
        const referenceDate = new Date(date);
        const error = controlDate.getTime() < referenceDate.getTime();
        result = error ? {
          'dateValueGT': {
            currentValue: control.value,
            minValue: new DatePipe('en-US').transform(date, 'dd/MM/yyyy HH:mm')
          }
        } : null;
      }
    });
    return result;
  };
}

/**
 * date must be lower than _entred_date_ validator
 * @param dateObservable
 * @returns Validator
 */
export function dateTimeValueLT(dateObservable: Observable<Date>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    dateObservable.subscribe(date => {
      if (date && (control.touched || control.dirty) && control.value) {
        const controlDate = new Date(control.value);
        const referenceDate = new Date(date);
        const error = controlDate.getTime() > referenceDate.getTime();
        result = error ? {
          'dateValueLT': {
            currentValue: control.value,
            maxValue: new DatePipe('en-US').transform(date, 'dd/MM/yyyy HH:mm')
          }
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
 * @param value
 * @returns AsyncValidatorFn
 * @requires field must be required
 */
export function unique(property: string, service: ResourceService<Resource>, value: string)
  : AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (!control.valueChanges) {
      return Observable.of(null);
    } else {
      return service.getUnicity(property, control.value, value).toPromise().then((res: boolean) => {
        return (res && (control.touched || control.dirty) && control.value) ?
          {
            'unique': { isUnique: true, value: control.value }
          } : null;
      });
    }
  };
}

/**
 * Compare value precision with current company precision
 * @param service
 */
export function companyCurrencyPrecision(service: ResourceService<Resource>)
  : AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (!control.valueChanges) {
      return Observable.of(null);
    } else {
      return service.getCompanyCurrencyPrecision(control.value).toPromise().then((res: number) => {
        return (res !== 0 && res !== undefined && (control.touched || control.dirty) && control.value) ?
          {
            'precision': { value: res }
          } : null;
      });
    }
  };
}

/**
 * required with condition
 * @param condition
 */
export function requiredIf(condition: Observable<boolean>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    result = condition.subscribe(c => {
      return (c && (control.touched || control.dirty) && control.value !== '') ? {
        'required': { required: true, value: control.value }
      } : null;
    });
    return result;
  };
}


/**
 * value mut be lower than nbr_validator
 * @param nbr
 */
export function strictInf(nbr: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    if (nbr && (control.touched || control.dirty) && control.value) {
      const error = control.value >= nbr;
      result = error ? {
        'strictInf': {
          maxValue: nbr
        }
      } : null;
    }
    return result;
  };
}

/**
 * @param nbr
 */
export function minQuantity(nbr: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    const error = control.value < 1;
    result = error ? {
      'minQuantity': {
        value: nbr
      }
    } : null;
    return result;
  };
}

/**
 * @param nbr
 */
export function maxQuantity(nbr: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    const error = control.value > nbr;
    result = error ? {
      'maxQuantity': {
        value: nbr
      }
    } : null;
    return result;
  };
}

/**
 * value mut be equal to nbr_validator
 * @param nbr
 */
export function between(nbr1: number, nbr2: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    const error = control.value >= nbr1 || control.value <= nbr2;
    result = error ? {
      'between': {
        value1: nbr1,
        value2: nbr2
      }
    } : null;
    return result;
  };
}

/**
 * value mut be greater than nbr_validator
 * @param nbr
 */
export function strictSup(nbr: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    if (nbr !== undefined && control.value !== undefined && (control.touched || control.dirty)) {
      const error = control.value <= nbr;
      result = error ? {
        'strictSup': {
          minValue: nbr
        }
      } : null;
    }
    return result;
  };
}

/**
 * value mut be lower than nbr_validator
 * @param nbrObs: Observable of number
 */
export function lowerOrEqualThan(nbrObs: Observable<number>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    nbrObs.subscribe(nbr => {
      if (nbr && (control.touched || control.dirty) && control.value) {
        const error = control.value > nbr;
        result = error ? {
          'strictInf': {
            maxValue: nbr
          }
        } : null;
      }
    });
    return result;
  };
}

/**
 * value mut be greater than nbr_validator
 * @param nbr : Observable of number
 */
export function greaterOrEqualThan(nbrObs: Observable<number>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    nbrObs.subscribe(nbr => {
      if (nbr !== undefined && control.value !== undefined && (control.touched || control.dirty)) {
        const error = control.value < nbr;
        result = error ? {
          'strictSup': {
            minValue: nbr
          }
        } : null;
      }
    });
    return result;
  };
}

/**
 * this validator is used when we have a form array that contains a start periode control which we want to make it unique.
 * @param datesObs: Observable<Date[]>
 */
export function uniqueStartPeriode(datesObs: Observable<Date[]>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    datesObs.subscribe(dates => {
      if (dates && control.value && (control.touched || control.dirty)) {
        const error = dates.filter(x => x.getTime() === new Date(control.value).getTime()).length > 1;
        result = error ? {
          'uniqueStartPeriode': {}
        } : null;
      }
    });
    return result;
  };
}

/**
 * validate unique value in a formArray
 * @param formArray
 * @param value
 */
export function uniqueValueInFormArray(formArray: Observable<FormArray>, field: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    formArray.subscribe(form => {
      if (form && control.value && (control.touched || control.dirty)) {
        const error = form.value.filter(x => x[field] === control.value).length > 1;
        result = error ? {
          'uniqueParam': { isUnique: true }
        } : null;
      }
    });
    return result;
  };
}

export function isNumericWithHighDashs(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let result = null;
    if (control.value && (control.touched || control.dirty) &&
      (control.value.match('^[0-9-]*')[0] !== control.value)) {
      result = { 'numericWithDashsParam': {} };
    }
    return result;
  };
}

export function isNumeric(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let result = null;
    if (control.value && (control.touched || control.dirty) &&
      (String(control.value).match('^[0-9]*')[0] !== String(control.value))) {
      result = { 'numeric': {} };
    }
    return result;
  };
}

export function isNumericWithPrecision(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let result = null;
    if (control.value && (control.touched || control.dirty) &&
      (String(control.value).match('[-+]?[0-9]*\.?[0-9]*')[0] !== String(control.value))) {
      result = { 'numericWithPrecision': {} };
    }
    return result;
  };
}

export function isEqualLength(length: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let result = null;
    if (control.value && (control.touched || control.dirty) && (control.value.length !== length)) {
      result = {
        'equalLength': {
          value: length
        }
      };
    }
    return result;
  };
}

export function isAlphabetical(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let result = null;
    if (control.value && (control.touched || control.dirty) &&
      (control.value.match('^[a-zA-Z]*')[0] !== control.value)) {
      result = { 'alphabeticalParam': {} };
    }
    return result;
  };
}


export function digitsAfterComma(digitsNumber: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let result = null;
    if (control.value && (control.touched || control.dirty) &&
      (String(control.value).match('[-+]?[0-9]*\.?[0-9]*')[0] !== String(control.value))) {
      result = { 'numericWithPrecision': {} };
      return result;
    }
    if (control.value && (control.touched || control.dirty) &&
      (String(control.value).match('[-+]?[0-9]*\\.?[0-9]{0,' + digitsNumber + '}')[0] !== String(control.value))) {
      result = { 'digitsAfterComma': { value: digitsNumber } };
    }
    return result;
  };
}

export function observableDigitsAfterComma(digitsNumber: Observable<number> ): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let result = null;
    var test = String(control.value).match('[0-9]+[.,]?[0-9]*');
    digitsNumber.subscribe(digit => {
      if(control.value && (control.touched || control.dirty) && (!test || (test &&  test[0] !== String(control.value)))){
        result = { 'numericWithPrecision': {} };
        return  result;
      } 
      if (control.value && (control.touched || control.dirty) &&
        (String(control.value).match('[-+]?[0-9]*\\.?[0-9]{0,' + digit + '}')[0] !== String(control.value))) {
        result = { 'digitsAfterComma': { value: digit } };
        return result;
      }  
    }) 
    return result;
  };  
}

export function digitsAfterCommaCMD(digitsNumber: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let result = null;
    if (control.value && (control.touched || control.dirty) &&
      !new RegExp('[-+]?[0-9]*\.[0-9]{' + digitsNumber + '}').test(control.value)) {
      result = { 'digitsAfterCommaCMD': { value: digitsNumber } };
    }
    return result;
  };
}

export function CmdNotDecomposable(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let result = null;
    if (control.value && (control.touched || control.dirty) &&
      (control.value.match('^[0-9]*')[0] != control.value)) {
      result = { 'cmdNotDecomposable': { value: 0 } };
    }
    return result;
  };
}

export function isAlphabeticalAndNumeric(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let result = null;
    if (control.value && (control.touched || control.dirty) &&
      (control.value.match('^[a-zA-Z0-9_é\' ]*')[0] !== control.value)) {
      result = { 'alphabeticalAndNumeric': {} };
    }
    return result;
  };
}

export function shelfAndStoragePattern(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let result = null;
    if (control.value && (control.touched || control.dirty) &&
      (control.value.match(WarehouseConstant.SHELF_AND_STORAGE_LABEL_PATTERN) === null)) {
      result = { 'shelfAndStoragePattern': {} };
    }
    return result;
  };
}

export function isDateValidAccounting(currentExerciceStartDate: Date, currentExerciceEndDate?: Date): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let result = null;
    const dateValue = new Date(control.value);
    if (control.value === null || control.value === undefined) {
      result = { 'documentAccountInvalidDate': {} };
      return result;
    }
    if (currentExerciceStartDate && currentExerciceEndDate) {
      if (control.value && (control.touched || control.dirty) &&
        (dateValue > currentExerciceEndDate || dateValue < currentExerciceStartDate)) {
        result = { 'documentAccountInvalidDate': {} };
      }
    } else if (currentExerciceStartDate && currentExerciceEndDate === undefined) {
      if (control.value && (control.touched || control.dirty) &&
        (dateValue < currentExerciceStartDate)) {
        result = { 'cessionInvalidDate': {} };
      }
    }
    return result;
  };
}

export function leavesValidator(leaves: any[], field: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let result = null;
    if (leaves) {
      leaves.forEach(leave => {
        const start = new Date(leave.StartDate);
        const end = new Date(leave.EndDate);
        const dateValue = new Date(control.value);
        if (field === 'startDate' && dateValue && dateValue.getDate() >= start.getDate()
          && dateValue.getDate() <= end.getDate()) {
          result = { 'actionInvalidDate': {} };
          return result;
        }
        if (field === 'endDate' && dateValue && dateValue.getDate() >= start.getDate()
          && dateValue.getDate() <= end.getDate()) {
          result = { 'actionInvalidDate': {} };
          return result;
        }
      });
    }
    return result;
  };
}

export function isValidDate(startDate: Date, endDate: Date, startTime: FormControl,
  endTime: FormControl, messageToShow: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const result = {};
    if (control.value && (control.touched || control.dirty) && (startDate.toDateString() === endDate.toDateString())
      && startTime.value && endTime.value && (startTime.value.getTime() >= endTime.value.getTime())) {
      result[messageToShow] = {};
      startTime.markAsTouched();
      endTime.markAsTouched();
    } else {
      startTime.markAsUntouched();
      endTime.markAsUntouched();
    }
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
export function uniquePropCrmJavaServices(property: string, service: ResourceServiceJava, actionToDo)
  : AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (!control.valueChanges) {
      return Observable.of(null);
    } else {
      return service.getUnicity(property, control.value, actionToDo).toPromise().then((res: boolean) => {
        return (res && (control.touched || control.dirty) && control.value) ?
          {
            'unique': { isUnique: true, value: control.value }
          } : null;
      });
    }
  };
}

/**
 * value mut be equal to nbr
 * @param nbr
 */
export function equalValue(nbr: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let result = null;
    const error = control.value != nbr;
    result = error ? {
      'equalValue': {
        value: nbr
      }
    } : null;
    return result;
  };
}

export function customEmailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && (control.touched || control.dirty)) {
      return Validators.email(control);
    }
    return null;
  };
}


