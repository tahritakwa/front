import { Resource } from '../shared/ressource.model';
import { JobEmployee } from './job-employee.model';
import { JobSkills } from './job-skill.model';

export class Job extends Resource {
  Designation: string;
  FunctionSheet: string;
  IdUpperJob: number;
  IdUpperJobNavigation: Job;
  JobEmployee: Array<JobEmployee>;
  JobSkills: Array<JobSkills>;
  HierarchyLevel: string;


  constructor(Designation: string, FunctionSheet: string, IdUpperJob: number, JobEmployee: Array<JobEmployee>, JobSkills: Array<JobSkills>) {
    super();
    this.Designation = Designation;
    this.FunctionSheet = FunctionSheet;
    this.IdUpperJob = IdUpperJob;
    this.JobEmployee = JobEmployee;
    this.JobSkills = JobSkills;
  }
}
