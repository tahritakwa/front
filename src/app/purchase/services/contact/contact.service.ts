import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Contact } from '../../../models/shared/contact.model';
import { AppConfig } from '../../../../COM/config/app.config';


@Injectable()
export class ContactService extends ResourceService<Contact> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'contact', 'Contact', 'Shared');
  }

}
