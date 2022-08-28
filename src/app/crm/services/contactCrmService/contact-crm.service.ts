import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {ContactConstants} from '../../../constant/crm/contact.constant';


@Injectable()
export class ContactCrmService extends ResourceServiceJava {

  public editContact: Subject<boolean> = new Subject();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, 'crm', 'contactCrm');
  }

  public deleteContactPhones(idPhonesToDelete): Observable<any> {
    return this.callService(Operation.POST, ContactConstants.DELETE_CONTACT_PHONE_URL, idPhonesToDelete);
  }

  public getContactsByIds(ids: number[]): Observable<any> {
    return this.callService(Operation.POST, 'list-by-ids', ids);
  }
  public saveOrganisationFromFile(data: any): Observable<any> {
    const  url = 'upload';
    return this.callService(Operation.POST, url,data);
  }
  public downloadContactExcelTemplate(countries:any,cities:any): Observable<any> {
   const address = {countries :countries,cities:cities};
    return super.callService(Operation.POST, 'downloadContactExcelTemplate',address);
  }

  public saveContactFromFile(data: any): Observable<any> {
    const  url = 'upload';
    return this.callService(Operation.POST, url,data);
  }
  public deleteContactAddress(idAddressToDelete,idContact): Observable<any> {
    return this.callService(Operation.POST, '/contactAddressToDelete/'+ idContact , idAddressToDelete);
  }
}
