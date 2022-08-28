import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';
import { Job } from './job.model';

export class JobEmployee extends Resource {
  IdJob: number;
  IdEmployee: number;
  IdEmployeeNavigation: Employee;
  IdJobNavigation: Job;
  constructor(IdJob: number, IdEmployee: number) {
    super();
    this.IdJob = IdJob;
    this.IdEmployee = IdEmployee;
  }
}
