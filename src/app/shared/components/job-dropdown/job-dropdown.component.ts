import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {JobService} from '../../../payroll/services/job/job.service';
import {ReducedJob} from '../../../models/payroll/reduced-job.model';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat} from '../../utils/predicate';
import {JobConstant} from '../../../constant/payroll/job.constant';
import {FormModalDialogService} from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {AddJobComponent} from '../../../payroll/job/add-job/add-job.component';
import {PermissionConstant} from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-job-dropdown',
  templateUrl: './job-dropdown.component.html',
  styleUrls: ['./job-dropdown.component.scss']
})
export class JobDropdownComponent implements OnInit {
  @Input() group;
  @Input() allowCustom;
  @Input() jobToIgnore: number;
  @Input() isModal: boolean;
  @Input() disabled: boolean;
  @Output() jobDropdownValueChanged = new EventEmitter<number>();
  @ViewChild(ComboBoxComponent) public jobDropdownComponent: ComboBoxComponent;
  public jobDataSource: ReducedJob[];
  public jobFilterDataSource: ReducedJob[];
  public hasAddJobPermission: boolean;

  constructor(private jobService: JobService, private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef, private authService: AuthService) {
    this.hasAddJobPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_JOB);
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.jobService.readDropdownPredicateData(this.preparePredicate()).subscribe((data) => {
      this.jobDataSource = data;
      this.jobFilterDataSource = this.jobDataSource.slice(0);
    });
  }

  preparePredicate(): PredicateFormat {
    let predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    if (this.jobToIgnore) {
      predicate.Filter.push(new Filter(JobConstant.ID, Operation.neq, this.jobToIgnore));
    }
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy(JobConstant.DESIGNIATION, OrderByDirection.asc));
    return predicate;
  }

  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.jobFilterDataSource = this.jobDataSource.filter((s) =>
      s.Designation.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  public onValueChanged(event): void {
    this.jobDropdownValueChanged.emit(event);
  }

  addNew(): void {
    this.formModalDialogService.openDialog(JobConstant.ADD_JOB, AddJobComponent,
      this.viewRef, this.initDataSource.bind(this), true, true, SharedConstant.MODAL_DIALOG_CLASS_M);
  }
}
