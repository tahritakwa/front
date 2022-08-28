import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { ExitReason } from '../../../models/payroll/exit-reason.model';
import { PredicateFormat, Filter, Operation, OrderBy, OrderByDirection } from '../../utils/predicate';
import { ExitReasonService } from '../../../payroll/services/exit-reason/exit-reason.service';
import { Router } from '@angular/router';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ExitReasonConstant } from '../../../constant/payroll/exit-reason.constant';
import { ListExitReasonComponent } from '../../../payroll/exit-reason/list-exit-reason.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ExitReasonTypeEnumerator } from '../../../models/enumerators/exit-reason-type-enum';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-exit-reason-dropdown',
  templateUrl: './exit-reason-dropdown.component.html',
  styleUrls: ['./exit-reason-dropdown.component.scss']
})
export class ExitReasonDropdownComponent implements OnInit {
  @Input() group;
  @Input() allowCustom;
  @Input() isConnectedEmployee: boolean;
  @Input() noAddButton: boolean;
  @Output() Selected = new EventEmitter<boolean>();
  public exitReasonDataSource: ExitReason[];
  public exitReasonFiltredDataSource: ExitReason[];
  private predicate: PredicateFormat;
  @ViewChild(ComboBoxComponent) public exitReasonDropdownComponent: ComboBoxComponent;

  constructor(private exitReasonService: ExitReasonService, private router: Router,
    private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef) { }

  ngOnInit() {
    this.initDataSource();
  }

  preparePredicate () {
    this.predicate = new PredicateFormat();
    if (this.isConnectedEmployee) {
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(SharedConstant.TYPE, Operation.neq, ExitReasonTypeEnumerator.TerminationByTheEmployer));
    }
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.LABEL, OrderByDirection.asc));
  }
  initDataSource(): void {
      this.preparePredicate();
      this.exitReasonService.readDropdownPredicateData(this.predicate).subscribe(result => {
        this.exitReasonDataSource = result;
        this.exitReasonFiltredDataSource = this.exitReasonDataSource.slice(0);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isConnectedEmployee && changes.isConnectedEmployee.currentValue !== changes.isConnectedEmployee.previousValue) {
      this.initDataSource();
    }
  }

  handleFilter(value: string): void {
    this.exitReasonFiltredDataSource = this.exitReasonDataSource.filter((s) =>
      s.Label.toLowerCase().includes(value.toLowerCase())
    );
  }
  getContractTypeCodeById(idContractType: number): String {

    return this.exitReasonFiltredDataSource.find(x => x.Id === idContractType)
      ? this.exitReasonFiltredDataSource.find(x => x.Id === idContractType).Label : '';
  }
  addNew(): void {
    this.formModalDialogService.openDialog(ExitReasonConstant.LIST_EXIT_REASON, ListExitReasonComponent,
      this.viewRef, this.initDataSource.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_ML);
    this.initDataSource();
  }

  onSelect($event) {
    this.Selected.emit($event);
  }

}
