import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../../COM/config/app.config';

const SockJs = require('sockjs-client');
const Stomp = require('stompjs');
const API_CONFIG = 'root_api';

@Injectable()
export class WebSocketService {
  private connection: string;
  private section = 'crmWs';
  private endpoint = 'socket';

  constructor(@Inject(AppConfig) appConfigCrm) {
    this.connection = appConfigCrm.getConfig(API_CONFIG);
  }

// Open connection with the CRM-back-end socket
  public connect() {
    const socket = new SockJs(`${this.connection}/${this.section}/${this.endpoint}`);
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {
    };
    return stompClient;
  }
}
