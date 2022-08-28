import { Resource } from '../shared/ressource.model';
import { Employee } from '../payroll/employee.model';
import { Interview } from './interview.model';
import { CriteriaMark } from './criteria-mark.model';

export class InterviewMark extends Resource {
  Mark: number;
  IsRequired: boolean;
  Status: number;
  IdEmployee: number;
  IdInterview: number;
  IdEmployeeNavigation: Employee;
  IdInterviewNavigation: Interview;
  InterviewerDecision: number;
  StrongPoints: string;
  Weaknesses: string;
  OtherInformations: string;
  CriteriaMark: CriteriaMark[];
}
