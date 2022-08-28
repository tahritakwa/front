import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, ViewContainerRef } from '@angular/core';
import { ProjectService } from '../../../sales/services/project/project.service';
import { Project } from '../../../models/sales/project.model';
import { PredicateFormat, Filter, Operation, OrderBy, OrderByDirection } from '../../utils/predicate';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { isUndefined } from 'util';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { AddProjectComponent } from '../../../sales/project/add-project/add-project.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-project-dropdown',
  templateUrl: './project-dropdown.component.html',
  styleUrls: ['./project-dropdown.component.scss']
})
export class ProjectDropdownComponent implements OnInit, OnChanges {
  @Input() group;
  @Input() allowCustom;
  @Input() default: boolean;
  @Input() isBillable: boolean;
  @Input() idTiers: number;
  @Input() isForBillingSession = false;
  @Input() month: Date;
  @Output() projectDropdownValueChanged = new EventEmitter<number>();
  public projectDataSource: Project[];
  public projectFilterDataSource: Project[];
  constructor(private projectService: ProjectService, private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef) { }

  ngOnInit() {
    if (!this.isForBillingSession) {
      this.initDataSource();
    } else {
      this.initDataSourceForBillingSession();
    }
  }

  initDataSource(): void {
    this.projectService.readDropdownPredicateData(this.preparePredicate()).subscribe((data) => {
      this.projectDataSource = data;
      this.projectFilterDataSource = this.projectDataSource.slice(0);
    });
  }

  initDataSourceForBillingSession(): void {
    this.projectService.getProjectDropdownForBillingSession(this.preparePredicate(), this.month).subscribe((data) => {
      this.projectDataSource = data.listData;
      this.projectFilterDataSource = this.projectDataSource.slice(0);
    });
  }

  preparePredicate(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy( ProjectConstant.NAME,OrderByDirection.asc));
    predicate.Filter = new Array<Filter>();
    if (!isUndefined(this.default)) {
      predicate.Filter.push(new Filter(ProjectConstant.DEFAULT, Operation.eq, this.default));
    }
    if (!isUndefined(this.isBillable)) {
      predicate.Filter.push(new Filter(ProjectConstant.IS_BILLABLE, Operation.eq, this.isBillable));
    }
    if (this.idTiers && (this.idTiers > NumberConstant.ZERO)) {
      predicate.Filter.push(new Filter(ProjectConstant.ID_TIERS, Operation.eq, this.idTiers));
    }
    return predicate;
  }

  handleFilter(value: string): void {
    this.projectFilterDataSource = this.projectDataSource.filter((s) =>
    s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1

    );
  }

  public onValueChanged(event): void {
    this.projectDropdownValueChanged.emit(event);
  }

  ngOnChanges(changes:  SimpleChanges): void {
    if (changes[SharedConstant.MONTH]) {
      this.month = changes[SharedConstant.MONTH].currentValue;
    }
    if (changes[ProjectConstant.ID_TIERS]) {
      this.idTiers = changes[ProjectConstant.ID_TIERS].currentValue;
    }
    if (!this.isForBillingSession) {
      this.initDataSource();
    } else {
      this.initDataSourceForBillingSession();
    }
  }

  addNew(): void {
    this.formModalDialogService.openDialog(ProjectConstant.ADD_SERVICE_CONTRACT, AddProjectComponent,
      this.viewRef, this.closeModal.bind(this), null, null, SharedConstant.MODAL_DIALOG_SIZE_L);
  }
  closeModal() {
    this.initDataSource();
  }

}
