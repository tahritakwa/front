import { Resource } from '../shared/ressource.model';
import { Active } from './active.model';
import { Employee } from '../payroll/employee.model';

export class ActiveAssignment extends Resource {
  IdEmployee: number;
  IdActive: number;
  AcquisationDate: Date;
  AbandonmentDate: Date;
  IdActiveNavigation: Active;
  IdEmployeeNavigation: Employee;
  History;

}
