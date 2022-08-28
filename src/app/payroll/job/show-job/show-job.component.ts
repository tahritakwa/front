import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Job} from '../../../models/payroll/job.model';

@Component({
  selector: 'app-show-job',
  templateUrl: './show-job.component.html',
  styleUrls: ['./show-job.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShowJobComponent implements OnInit {
  skills: any[] = new Array<any>();
  employees: any[] = new Array<any>();
  selectedItem: Job;

  constructor() {
  }


  showDetails(selectedItem: Job): void {
    this.selectedItem = selectedItem;
    this.skills = new Array<any>();
    this.employees = new Array<any>();
    if (this.selectedItem.JobSkills) {
      this.selectedItem.JobSkills.forEach(jobSk => {
        this.skills.push({'Name': jobSk.IdSkillNavigation.Label, 'Rate': jobSk.Rate});
      });
    }
    if (this.selectedItem.JobEmployee) {
      this.selectedItem.JobEmployee.forEach(jobEmpl => {
        if (jobEmpl.IdEmployeeNavigation && jobEmpl.IdEmployeeNavigation.PictureFileInfo && jobEmpl.IdEmployeeNavigation.PictureFileInfo.Data) {
          jobEmpl.IdEmployeeNavigation['SrcImg'] = 'data:image/png;base64,' + jobEmpl.IdEmployeeNavigation.PictureFileInfo.Data;
        } else {
          jobEmpl.IdEmployeeNavigation['SrcImg'] = '../../../../assets/image/user-new-icon.png';
        }
        this.employees.push(jobEmpl.IdEmployeeNavigation);
      });
    }
  }

  ngOnInit() {

  }

}
