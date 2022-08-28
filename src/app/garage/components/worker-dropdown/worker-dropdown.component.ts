import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { WorkerService } from '../../services/worker/worker.service';
const ID_WORKER = 'IdWorker';
@Component({
  selector: 'app-worker-dropdown',
  templateUrl: './worker-dropdown.component.html',
  styleUrls: ['./worker-dropdown.component.scss']
})
export class WorkerDropdownComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() fieldName: string;
  @Input() isReponsible: false;
  @Input() workersInGrid: boolean;
  @Input() idGarage = 0;
  @Output() Selected = new EventEmitter<any>();
  predicate: PredicateFormat;
  workersDataSource: any[];
  workersFilterDataSource: any[];
  public selectedValue: any;
  placeholder = GarageConstant.WORKER_PLACE_HOLDER;
  constructor(public workerService: WorkerService) { }
  ngOnInit() {
    if (!this.fieldName) {
      this.fieldName = ID_WORKER;
    }
    this.preparePredicate();
    this.intiGridDataSource();
  }
  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (this.isReponsible) {
      this.predicate.Filter.push(new Filter(GarageConstant.RESPONSABLE, Operation.eq, true));
    }
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(GarageConstant.ID_PHONE_NAVIGATION)]);
  }
  intiGridDataSource() {
    if (!this.workersInGrid) {
      this.workerService.readDropdownPredicateData(this.predicate).subscribe(data => {
        this.workersDataSource = data;
        this.workersFilterDataSource = this.workersDataSource.slice(0);
      });
    } else {
      this.workerService.getDropdownDataWithNotAffectedWorkers(this.workersInGrid, this.idGarage,
        this.group.controls[this.fieldName].value).subscribe(data => {
          if (data != null) {
            this.workersDataSource = data.listData;
            this.workersFilterDataSource = this.workersDataSource.slice(0);
          }
        });
    }
  }
  handleFilter(value) {
    this.workersFilterDataSource = this.workersDataSource.filter((s) =>
     (s.FirstName + s.LastName).toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  onSelectWorker($event) {
    this.selectedValue = this.workersFilterDataSource.find(x => x.Id === $event);
    this.Selected.emit(this.selectedValue);
  }
}
