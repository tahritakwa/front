import {Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {SourceDeductionSession} from '../../../models/payroll/source-deduction-session.model';
import {SourceDeductionConstant} from '../../../constant/payroll/source-deduction.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

export class SourceDeductionSessionService extends ResourceServiceRhPaie<SourceDeductionSession> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'sourceDeductionSession', 'SourceDeductionSession', 'PayRoll');
  }

  /**
   * Check the unicity of source deduction session per year
   * @param value
   * @param trimester
   * @param idCnssDeclaration
   */
  public getUnicitySourceDeductionSessionPerYear(data: SourceDeductionSession): Observable<boolean> {
    data.Id = data.Id ? data.Id : NumberConstant.ZERO;
    data.Code = data.Code ? data.Code : '';
    data.Year = data.Year ? data.Year : NumberConstant.ZERO;
    return this.callService(Operation.POST, SourceDeductionConstant.GET_UNICITY_SOURCE_DEDUCTION_SESSION, data) as Observable<boolean>;
  }

  public getByIdWithRelation(id: number): Observable<any> {
    return super.callService(Operation.GET, SourceDeductionConstant.SOURCE_DEDUCTION_SESSION_DETAILS.concat(id.toString()));
  }

  public checkSourceDeductionSessionBeforeClosing(sourceDeductionSession: SourceDeductionSession): Observable<boolean> {
    return this.callService(Operation.POST, SourceDeductionConstant.CHECK_SOURCE_DEDUCTION_SESSION_BEFORE_CLOSING,
      sourceDeductionSession) as Observable<boolean>;
  }

  public closeSourceDeduction(sourceDeductionSession: SourceDeductionSession): Observable<any> {
    return this.callService(Operation.POST, SourceDeductionConstant.CLOSE_SOURCE_DEDUCTION_URL, sourceDeductionSession);
  }
}
