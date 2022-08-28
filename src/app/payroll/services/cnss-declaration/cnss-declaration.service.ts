import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {CnssDeclaration} from '../../../models/payroll/cnss-declaration.model';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {CnssDeclarationConstant} from '../../../constant/payroll/cnss-declaration.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class CnssDeclarationService extends ResourceServiceRhPaie<CnssDeclaration> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'cnssDeclaration', 'CnssDeclaration', 'PayRoll');
  }

  public generateDeclaration(model: CnssDeclaration): Observable<any> {
    return super.callService(Operation.POST, CnssDeclarationConstant.GENERATE_DECLARATION, model) as Observable<any>;
  }

  public GetTeleDeclaration(idCnssDeclaration: number): Observable<any> {
    return super.callService(Operation.GET, CnssDeclarationConstant.GET_TELE_DECLARATION
      .concat(idCnssDeclaration.toString())) as Observable<any>;
  }

  public closeCnssDeclaration(model: CnssDeclaration): Observable<any> {
    return super.callService(Operation.POST, CnssDeclarationConstant.CLOSE_CNSS_DECLARATION_URL, model) as Observable<any>;
  }
}

