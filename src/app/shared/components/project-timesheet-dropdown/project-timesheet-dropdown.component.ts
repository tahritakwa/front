import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { FormGroup, FormArray } from '@angular/forms';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { Project } from '../../../models/sales/project.model';
import { ProjectService } from '../../../sales/services/project/project.service';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';

@Component({
  selector: 'app-project-timesheet-dropdown',
  templateUrl: './project-timesheet-dropdown.component.html',
  styleUrls: ['./project-timesheet-dropdown.component.scss']
})

export class ProjectTimesheetDropdownComponent implements OnInit, OnChanges {

  @Input() group: FormGroup;
  @Input() timeSheetDay: FormGroup;
  @Input() reportObject: ObjectToSend;
  @Output() Selected = new EventEmitter<string>();

  public projectDataSource: Project [];
  public projectFiltredDataSource: Project [];

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    if (this.timeSheetDay) {
      this.projectDataSource = this.Project.value as Project[];
      this.projectFiltredDataSource = this.projectDataSource.slice(NumberConstant.ZERO);
      this.projectFiltredDataSource.forEach(x => {
          if (!x.ProjectLabel) {
            x.ProjectLabel = x.Name;
          }
        }
      );
    } else if (this.reportObject) {
      this.initDataSourceForReporting();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only run when property reportObject changed
    if (changes[ProjectConstant.REPORT_OBJECT]) {
      this.reportObject = changes[ProjectConstant.REPORT_OBJECT].currentValue;
      this.projectFiltredDataSource = [];
      this.initDataSourceForReporting();
    }
  }

  /**
   * The selected project name is sent to build the DocumentName when the report is printed
   * @param $event
   */
  public valueChange($event): void {
    const selectProject = this.projectFiltredDataSource.filter(x => x.Id === $event)[0];
    if (selectProject) {
      this.Selected.emit(selectProject.Name);
    }
  }

  public initDataSourceForReporting() {
    this.projectService.getEmployeeWorkedProject(this.reportObject).subscribe(result => {
      this.projectDataSource = result;
      this.projectFiltredDataSource = this.projectDataSource.slice(NumberConstant.ZERO);
        this.projectFiltredDataSource.forEach(x => {
          if (!x.ProjectLabel) {
            x.ProjectLabel = x.Name;
          }
        });
    });
  }

  /**
   * filter by Code or Label
   * @param value
   */
   handleFilter(value: string): void {
    this.projectFiltredDataSource = this.projectDataSource.filter((s) =>
      s.Name.toLowerCase().includes(value.toLowerCase()));
  }

  get Project() {
    return this.timeSheetDay.get(ProjectConstant.PROJECT) as FormArray;
  }
}
