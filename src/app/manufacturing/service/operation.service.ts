import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../COM/config/app.config';
import {GammeConstant} from '../../constant/manufuctoring/gamme.constant';
import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';
import {NumberConstant} from '../../constant/utility/number.constant';
import {FabricationArrangementConstant} from '../../constant/manufuctoring/fabricationArrangement.constant';

@Injectable()
export class OperationService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, GammeConstant.MANUFACTURING, GammeConstant.OPERATION);
  }

  convertDuration(duration: string) {
    let valueSeconds: string;
    duration = duration.substring(NumberConstant.TWO, duration.length);
    if (duration.indexOf(FabricationArrangementConstant.ALPHABETIC_H.toString().toUpperCase()) === NumberConstant.MINUS_ONE) {
      valueSeconds = FabricationArrangementConstant.DOUBLE_ZERO;
    } else {
      if (duration.substring(NumberConstant.ZERO, duration.indexOf(FabricationArrangementConstant.ALPHABETIC_H.toString().toUpperCase())).length === NumberConstant.TWO) {
        valueSeconds = duration.substring(NumberConstant.ZERO, duration.indexOf(FabricationArrangementConstant.ALPHABETIC_H.toString().toUpperCase()));
      } else {
        valueSeconds = String(NumberConstant.ZERO) + duration.substring(NumberConstant.ZERO, duration.indexOf(FabricationArrangementConstant.ALPHABETIC_H.toString().toUpperCase()));
      }
    }
    valueSeconds += 'h:';
    if (duration.indexOf(FabricationArrangementConstant.ALPHABETIC_M.toString().toUpperCase()) === NumberConstant.MINUS_ONE) {
      valueSeconds += FabricationArrangementConstant.DOUBLE_ZERO;
    } else {
      if (duration.substring(duration.indexOf(FabricationArrangementConstant.ALPHABETIC_H.toString().toUpperCase()) +
        NumberConstant.ONE, duration.indexOf(FabricationArrangementConstant.ALPHABETIC_M.toString().toUpperCase())).length === NumberConstant.TWO) {
        valueSeconds += duration.substring(duration.indexOf(FabricationArrangementConstant.ALPHABETIC_H.toString().toUpperCase()) + NumberConstant.ONE, duration.indexOf(FabricationArrangementConstant.ALPHABETIC_M.toString().toUpperCase()));
      } else {
        valueSeconds += NumberConstant.ZERO + duration.substring(duration.indexOf(FabricationArrangementConstant.ALPHABETIC_H.toString().toUpperCase()) + NumberConstant.ONE, duration.indexOf(FabricationArrangementConstant.ALPHABETIC_M.toString().toUpperCase()));
      }
    }
    valueSeconds += FabricationArrangementConstant.ALPHABETIC_M;
    return valueSeconds;
  }

}
