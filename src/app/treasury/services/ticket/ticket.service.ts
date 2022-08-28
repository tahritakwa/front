import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Ticket } from '../../../models/treasury/ticket.model';
import { Operation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs/Observable';
import { FilterSearchTicket } from '../../../models/treasury/filter-search-ticket-model';
import { ObjectToSave } from '../../../models/shared/objectToSend';
const GENERATE_TICKET_API = 'generateTicket/';
const GENERATE_TICKET_AFTER_BL_IMPORT = 'generateTicketAfterBlImport/';
@Injectable()
export class TicketService  extends ResourceService<Ticket> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'ticket', 'Ticket', 'Treasury');
  }

  ValidateBLAndGenerateTicket(idBl: number, idSession: number): Observable<any> {
    return this.callService(Operation.GET, GENERATE_TICKET_API.concat(idBl.toString().concat('/').concat(idSession.toString())));
  }

  generateTicketAfterBlImport(idBl: number, idSession: number): Observable<any> {
    return this.callService(Operation.GET, GENERATE_TICKET_AFTER_BL_IMPORT.concat(idBl.toString().concat('/').concat(idSession.toString())));
  }
  public getTicketDataWithSpecificFilter(ticketFilter: FilterSearchTicket): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = ticketFilter;
    return this.callService(Operation.POST, 'getTicketsForSettlement', objectToSave);
  }
}
