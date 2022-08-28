import { Resource } from '../shared/ressource.model';
import { ExitEmployee } from './exit-employee.model';

export class ExitReason extends Resource {
    Label: string;
    Description: string;
    Type: number;
    ExitEmployee: Array<ExitEmployee>;
}
