import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Ticket } from '../../../models/treasury/ticket.model';
import { Operation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs/Observable';
import { TicketPayment } from '../../../models/treasury/ticket-payment';
const GENERATE_TICKET_API = 'generateTicket/';
@Injectable()
export class TicketPaymentService  extends ResourceService<TicketPayment> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'ticketPayment', 'TicketPayment', 'Treasury');
  }

}
