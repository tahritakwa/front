import {SourceDeduction} from '../../../models/payroll/source-deduction.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {Operation} from '../../../../COM/Models/operations';
import {SourceDeductionConstant} from '../../../constant/payroll/source-deduction.constant';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {State} from '@progress/kendo-data-query';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

export class SourceDeductionService extends ResourceServiceRhPaie<SourceDeduction> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'sourceDeduction', 'SourceDeduction', 'PayRoll');
  }

  public generateSourceDeduction(id: number, max: number): Observable<any> {
    return this.callService(Operation.GET, SourceDeductionConstant.GENERATE_SOURCE_DEDUCTION.concat(id.toString()).concat('/').concat(max.toString()));
  }

  public getEmployerDeclaration(state: State, predicate: PredicateFormat): Observable<any> {
    this.prepareServerOptions(state, predicate);
    return this.callService(Operation.POST, SourceDeductionConstant.GET_EMPLOYER_DECLARATION, predicate);
  }

  public checkAllSourceDeductionIsCorrect(idSession: number): Observable<boolean> {
    return this.callService(Operation.GET, SourceDeductionConstant.CHECK_ALL_SOURCE_DEDUCTION_IS_CORRECT.concat('/').concat(idSession.toString())) as Observable<boolean>;
  }

  public broadcastSourceDeduction(idSourceDeduction: number, url: string): Observable<any> {
    const data: any = {};
    data['url'] = url;
    data['idSourceDeduction'] = idSourceDeduction;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SourceDeductionConstant.BROADCAST_SOURCE_DEDUCTION, objectToSave);
  }

  public broadcastOneSourceDeduction(url: string, sourceDeduction: SourceDeduction, idSourceDeduction: number): Observable<any> {
    const data: any = {};
    data['url'] = url;
    data['idSourceDeduction'] = idSourceDeduction;
    data['sourceDeduction'] = sourceDeduction;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, SourceDeductionConstant.BROADCAST_ONE_SOURCE_DEDUCTION, objectToSave);
  }

  public downloadAllSourceDeduction(idSession: number): Observable<any> {
    return super.callService(Operation.GET, `${SourceDeductionConstant.ALL_REPORT_ROOT}${idSession}`);
  }

  public regenerateOneSourceDeduction(sourceDeduction: SourceDeduction): Observable<any> {
    return this.callService(Operation.POST, SourceDeductionConstant.REGENERATE_ONE_SOURCE_DEDUCTION_URL, sourceDeduction);
  }
}
