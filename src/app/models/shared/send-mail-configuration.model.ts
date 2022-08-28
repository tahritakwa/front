import { CreatedData } from './created-data.model';
/**
 *
 * send mail configuartion object
 *
 *
 * */
export class SendMailConfiguration {
  IdMsg: number;
  URL: string;
  Model: CreatedData;
  Users: Array<string>;
  constructor(_IdMsg: number, _URL: string, _Model: CreatedData, _users: Array<any>) {
    this.IdMsg = _IdMsg;
    this.URL = _URL;
    this.Model = _Model;
    this.Users = _users;
  }
}
