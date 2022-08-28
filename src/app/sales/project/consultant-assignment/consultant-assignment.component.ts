import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { EmployeeProject } from '../../../models/rh/employee-project.model';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { EmployeeProjectService } from '../../services/employee-project/employee-project.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-consultant-assignment',
  templateUrl: './consultant-assignment.component.html',
  styleUrls: ['./consultant-assignment.component.scss']
})
export class ConsultantAssignmentComponent implements OnInit {
  @Input()
  IdProject: number;
  @Input()
  projectFormGroup: FormGroup;
  public freeResources: EmployeeProject[];
  public assignResources: EmployeeProject[];
  public pictureEmployesSrc: any;
  private sysDate: Date = new Date();
  /**
  * Format Date
  */
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private fb: FormBuilder, private employeeProjectService: EmployeeProjectService,
    private translate: TranslateService, private viewRef: ViewContainerRef) { }

  ngOnInit() {
    this.initResources();
  }

  /**
   * For assign an employee from a project
   */
  private assignResourcesFormGroup(employeeProject: EmployeeProject) {
    const assignFormGroup = this.fb.group({
      Id: [employeeProject.Id ? employeeProject.Id : NumberConstant.ZERO],
      IdEmployee: [employeeProject.IdEmployee],
      IdProject: [employeeProject.IdProject],
      AssignmentDate: [employeeProject.AssignmentDate],
      AverageDailyRate: [employeeProject.AverageDailyRate ? employeeProject.AverageDailyRate : '']
    });
    // if (employeeProject.Id > NumberConstant.ZERO) {
    //   assignFormGroup.addControl(ProjectConstant.ASSIGNMENTDATE, this.fb.control(employeeProject.AssignmentDate));
    // }
    if (employeeProject.UnassignmentDate) {
      assignFormGroup.addControl(ProjectConstant.UNASSIGNMENTDATE, this.fb.control(employeeProject.UnassignmentDate));
    }
    return assignFormGroup;
  }

  /**
   * Get list of free resouces, not affected to the project
   */
  private initResources() {
    this.employeeProjectService.getProjectResources(this.IdProject).subscribe(result => {
      this.assignResources = result.filter(resource => resource.AssignmentDate);
      this.freeResources = result.filter((resource: EmployeeProject) => !resource.AssignmentDate);
    });
  }

  /**
   * Assign employees to the current project
   */
  public assignEmployeeToProject() {
    this.assignResources.forEach(assign => {
      this.EmployeeProject.push(this.assignResourcesFormGroup(assign));
    });
    this.freeResources.filter(m => m.UnassignmentDate).forEach(unassign => {
      this.EmployeeProject.push(this.assignResourcesFormGroup(unassign));
    });
  }

  /**
   * Opens the information model for assignment information
   */
  public setAssignementInformations(employeeProject: EmployeeProject) {
    //this.formModalDialogService.openDialog(ProjectConstant.ASSIGN_INFORMATIONS,
    //  MoveToAssignComponent, this.viewRef, this.onCloseMoveToAssignModal.bind(this), employeeProject,
    //  true, SharedConstant.MODAL_DIALOG_SIZE_S);
  }

  /**
   * on close assignment informations modal
   * @param data
   */
  private onCloseMoveToAssignModal(data: any): void {
    if (data !== undefined) {
      const employeeProject: EmployeeProject = data.value;
      if (employeeProject) {
        const index = this.assignResources.findIndex(m => m.IdEmployee === employeeProject.IdEmployee);
        this.assignResources[index].AssignmentDate = employeeProject.AssignmentDate;
        this.assignResources[index].AverageDailyRate = employeeProject.AverageDailyRate;
      }
    }
  }

  public onMoveToAssignResources(employeeProjects: Array<EmployeeProject>) {
    for (let i = 0; i < employeeProjects[ProjectConstant.ITEMS].length; i++) {
      const index = this.assignResources.findIndex(m => m.IdEmployee ===
        employeeProjects[ProjectConstant.ITEMS][i].IdEmployee);
      if (index >= NumberConstant.ZERO) {
        this.assignResources[index].AssignmentDate = new Date();
        this.assignResources[index].UnassignmentDate = undefined;
      }
    }
  }

  public onMoveToFreeResources(employeeProjects: Array<EmployeeProject>) {
    for (let i = 0; i < employeeProjects[ProjectConstant.ITEMS].length; i++) {
      const index = this.freeResources.findIndex(m => m.IdEmployee ===
        employeeProjects[ProjectConstant.ITEMS][i].IdEmployee);
      if (index >= NumberConstant.ZERO) {
        this.freeResources[index].UnassignmentDate = new Date();
      }
    }
  }

  /**
   * Opens the information model for unassignment information
   */
  public setUnAssignementInformations(employeeProject: EmployeeProject) {
    //this.formModalDialogService.openDialog(ProjectConstant.UN_ASSIGN_INFORMATIONS,
    //  MoveToUnAssignComponent, this.viewRef, this.onCloseMoveToUnAssignModal.bind(this), employeeProject,
    //  true, SharedConstant.MODAL_DIALOG_SIZE_S);
  }

  /**
   * on close unassignment informations modal
   * @param data
   */
  private onCloseMoveToUnAssignModal(data: any): void {
    if (data !== undefined) {
      const employeeProject: EmployeeProject = data.value;
      if (employeeProject) {
        const index = this.freeResources.findIndex(m => m.IdEmployee === employeeProject.IdEmployee);
        this.freeResources[index].UnassignmentDate = employeeProject.UnassignmentDate;
      }
    }
  }

  /**
   * Employee project from array getter
   */
  get EmployeeProject(): FormArray {
    return this.projectFormGroup.get(ProjectConstant.EMPLOYEE_PROJECT) as FormArray;
  }

}
