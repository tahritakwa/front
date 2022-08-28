export class TemplateEmail {
  id: number;
  name: string;
  subject: string;
  body: string;

  constructor(id?: number, name?: string, subject?: string, body?: string) {
    this.id = id;
    this.name = name;
    this.subject = subject;
    this.body = body;
  }
}
