import { Resource } from '../shared/ressource.model';
import { EmployeeState } from '../enumerators/employee-state.enum';
export class ReducedEmployee extends Resource {
  FirstName: string;
  LastName: string;
  FullName: string;
  Email: string;
  Status: EmployeeState;
}
