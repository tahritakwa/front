/**
 *
 * Message model, contains message to send to list of emails
 *
 *
 * */
export class MessageToSend {
  public Mails: Array<string>;
  public Message: number;
  constructor(Mails: Array<string>, Message: number) {
    this.Mails = Mails;
    this.Message = Message;
  }
}
