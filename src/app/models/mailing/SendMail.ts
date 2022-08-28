import {TemplateEmail} from './template-email';

export class SendMail {
  templateEmail: TemplateEmail;
  idSender;
  toList: Array<String>;
  ccList: Array<String>;
  bccList: Array<String>;
  listPathAttachment: Array<String>;
  attchments: any;


}
