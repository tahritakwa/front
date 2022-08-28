import { Injectable } from '@angular/core';
import { ProjectsEmployeeSection } from '../../../models/sales/projects-employee-section.model';

@Injectable()
export class ExchangeEmployeeProjectsDataService  {

    private index = 0;
    private allChildrenData: ProjectsEmployeeSection[] = [];
    // is true is the connected user is an admin and has the role to validate timesheet
    public hasValidateRole = false;
    // List of ids of employees that has the connected user as super hierarchical
    public employeeHierarchy: number[] = [];
    // Currencyused by the current Company
    public companyCurrency;

    public getIndex(): number {
        return this.index;
    }
    public setIndex(data): void {
      this.index = data;
    }
    public incrementIndex(): void {
      this.index++;
    }
    public getProjectsEmployeefromPosition(i): ProjectsEmployeeSection {
      return this.allChildrenData[i];
    }
    public getProjectsEmployeeSharedBetweenChildren(): ProjectsEmployeeSection[] {
      return this.allChildrenData;
    }
    public setProjectsEmployeeSharedBetweenChildren(data) {
      this.allChildrenData = data;
    }
    public appendProjectsEmployeeToSharedData(data) {
      this.allChildrenData.push(data);
    }
}
