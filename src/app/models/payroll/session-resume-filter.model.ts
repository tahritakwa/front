import { PayslipDetails } from './payslip-details.model';

export class SessionResumeFilter {
    public IdSession: number;
    public EmployeesId: Number[];
    public Page: Number;
    public PageSize: Number;
    public PayslipDetails: PayslipDetails[];
}
