import { Resource } from "../shared/ressource.model";

export class JobTable extends Resource {
  LastExecuteDate: Date;
  NextExecuteDate: Date;
}
