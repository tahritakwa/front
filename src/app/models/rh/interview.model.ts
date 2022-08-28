import { Resource } from '../shared/ressource.model';
import { InterviewType } from './interview-type.model';
import { InterviewMark } from './interview-mark.model';
import { Candidacy } from './candidacy.model';
import { Email } from './email.model';
import { Review } from './Review.model';
import { Employee } from '../payroll/employee.model';
import { Question } from './question.model';
import { Time } from '@angular/common';
import { ExitEmployee } from '../payroll/exit-employee.model';

export class Interview extends Resource {
  AverageMark: number;
  CreationDate: Date;
  InterviewDate: Date;
  InterviewHour: number;
  InterviewMinute: number;
  StartTime: Time;
  Remarks: string;
  Status: number;
  IdInterviewType: number;
  IdCandidacy: number;
  IdEmail: number;
  IdCandidacyNavigation: Candidacy;
  IdInterviewTypeNavigation: InterviewType;
  IdEmailNavigation: Email;
  InterviewMark: InterviewMark[];
  OptionalInterviewMark: InterviewMark[];
  IdReview: number;
  IdReviewNavigation: Review;
  IdExitEmployee: number;
  IdExitEmployeeNavigation: ExitEmployee;
  IdSupervisor: number;
  IdSupervisorNavigation: Employee;
  Question: Question[];
  IsSelected: boolean;
  IdCreator: number;
  EndTime: Time;
}
