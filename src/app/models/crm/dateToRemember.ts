export class DateToRemember {
  public id: number;
  public eventName: string;
  public date: Date;
  public description: string;


  constructor(id?: number, eventName?: string, date?: Date, description?: string) {
    this.id = id;
    this.eventName = eventName;
    this.date = date;
    this.description = description;
  }
}
