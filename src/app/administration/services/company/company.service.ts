import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {ResourceService} from '../../../shared/services/resource/resource.service';
import {Company} from '../../../models/administration/company.model';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {CompanyConstant} from '../../../constant/Administration/company.constant';
import {DataTransferShowSpinnerService} from '../../../shared/services/spinner/data-transfer-show-spinner.service';


@Injectable()
export class CompanyService extends ResourceService<Company> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig, @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService) {
    super(
      httpClient, appConfig,
      'company', 'Company', 'Shared',dataTransferShowSpinnerService);
  }

  public getCurrentCompany(): Observable<any> {
    return super.callService(Operation.GET, 'getCurrentCompany');
  }
  public getCurrentCompanyCurrency(): Observable<any> {
    return super.callService(Operation.GET, 'getCurrentCompanyCurrency');
  }

  public updateCompany(obj: any): Observable<any> {
    return super.callService(Operation.PUT, 'updateCompany', obj);
  }
  public getDefaultCurrencyDetails(): Observable<any> {
    return this.callService(Operation.GET, 'getCurrencyCompanyDetails');
  }

  public getAllCompanies(): Observable<any> {
    return this.callService(Operation.GET, CompanyConstant.GET_ALL_COMPANIES_DB_SETTINGS);
  }
  public getAllMasterCompanies(): Observable<any> {
    return this.callService(Operation.GET, CompanyConstant.GET_ALL_MASTER_COMPANIES);
  }
  public getCommRhVersionProperties(): Observable<any> {
    return this.callService(Operation.GET, CompanyConstant.GET_COMM_RH_VERSION_PROPERTIES);
  }
  public getCurrencyCompanySymbol(): Observable<any> {
    return this.callService(Operation.GET, CompanyConstant.GET_CURRENCY_COMPANY_SYMBOL);
  }
  public getReducedDataOfCompany(): Observable<any> {
    return this.callService(Operation.GET, CompanyConstant.GET_REDUCED_DATA_OF_COMPANY);
  }
   public getCurrentCompanyWithContactPictures(): Observable<any> {
    return this.callService(Operation.GET, CompanyConstant.GET_CURRENT_COMPANY_WITH_CONTACT_PICTURES);
  }
  public getCurrentCompanyActivityArea(): Observable<any> {
    return this.callService(Operation.GET, 'getCurrencyCompanyActivityArea');
  }

}
