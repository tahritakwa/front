export class ExactDate {

 getDateExact(date: Date) {
    const timeZone = date.getTimezoneOffset();
    return new Date(date.getTime() - timeZone * 60 * 1000);
  }
}
