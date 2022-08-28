import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {DropDownComponent} from '../../interfaces/drop-down-component.interface';
import {FormGroup} from '@angular/forms';
import {Job} from '../../../models/payroll/job.model';
import {JobService} from '../../../payroll/services/job/job.service';
import {JobEmployee} from '../../../models/payroll/job-employee.model';
import {AddJobComponent} from '../../../payroll/job/add-job/add-job.component';
import {JobConstant} from '../../../constant/payroll/job.constant';
import {FormModalDialogService} from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';

const ID = 'Id';

@Component({
  selector: 'app-job-multiselect',
  templateUrl: './job-multiselect.component.html',
  styleUrls: ['./job-multiselect.component.scss']
})
export class JobMultiselectComponent implements OnInit, DropDownComponent {
  @Input() group: FormGroup;
  @Input() allowCustom;
  public jobDataSource: Job[];
  public jobFiltredDataSource: Job[];
  public selectedValues: number[];

  constructor(private jobService: JobService, private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef) {
  }

  get selectedJobEmployee(): JobEmployee[] {
    const selectedJobs = new Array<JobEmployee>();
    if (this.selectedValues) {
      this.selectedValues.forEach((x) => {
        selectedJobs.push(new JobEmployee(x, this.group.get(ID).value));
      });
    }
    return selectedJobs;
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.jobService.readDropdownData().subscribe(data => {
      this.jobDataSource = data['listData'];
      this.jobFiltredDataSource = this.jobDataSource.slice(0);
    });
  }

  /**
   * filter by designation
   * @param value
   */
  handleFilter(value: string): void {
    this.jobFiltredDataSource = this.jobDataSource.filter((s) =>
      s.Designation.toLowerCase().includes(value.toLowerCase()));
  }

  addNew(): void {
    this.formModalDialogService.openDialog(JobConstant.ADD_JOB, AddJobComponent,
      this.viewRef, this.initDataSource.bind(this), true, true, SharedConstant.MODAL_DIALOG_CLASS_M);
  }
}
