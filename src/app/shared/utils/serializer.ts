import { Resource } from '../../models/shared/ressource.model';

export interface ISerializer<T extends Resource> {
  deserialize(response: any): T;
  serialize(resource: T, isWithDateCorrection: boolean): any;
  serializeAny(resource: any, isWithDateCorrection: boolean): any;
}

export class Serializer<T extends Resource> implements ISerializer<T> {

  deserialize(response: any): T {
    return (JSON.parse(response)) as T;
  }

  serialize(resource: T, isWithDateCorrection: boolean) {
    return this.serializeAny(resource, isWithDateCorrection);
  }

  serializeAny(resource: any, isWithDateCorrection: boolean) {
    if (isWithDateCorrection) {
      this.correctDate(resource);
    }
    return JSON.stringify(resource);
  }
  public correctDate(resource: any) {
    for (const paramName in resource) {
      if (resource[paramName] instanceof Date) {
        let x: Date = resource[paramName];
        x.setHours(x.getHours() - x.getTimezoneOffset() / 60);
        resource[paramName] = x;
      } else if (resource[paramName] instanceof Object) {
        this.correctDate(resource[paramName]);
      }
    }
  }

}
