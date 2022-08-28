import { SkillsRating } from "../payroll/skills-rating.model";

export class EmployeeSkillsMatrixFilter {

    public IdTeam: Number;
    public EmployeesId: Number[];
    public Page: Number;
    public PageSize: Number;
    public SkillsLevels: SkillsRating[];

}
