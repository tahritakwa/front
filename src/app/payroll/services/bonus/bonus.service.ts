import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';
import {Bonus} from '../../../models/payroll/bonus.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {Operation} from '../../../../COM/Models/operations';
import {Observable} from 'rxjs/Observable';
import {BonusConstant} from '../../../constant/payroll/bonus.constant';

@Injectable()
export class BonusService extends ResourceServiceRhPaie<Bonus> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'bonus', 'Bonus', 'PayRoll');
  }

  /**
   * Check if bonus is associate with any payslips
   */
  public checkIfBonussHasAnyPayslip(model: Bonus): Observable<any> {
    return this.callService(Operation.POST,
      BonusConstant.CHECK_IF_BONUS_IS_ASSOCIATE_WITH_ANY_PAYSLIP, model);
  }
}
