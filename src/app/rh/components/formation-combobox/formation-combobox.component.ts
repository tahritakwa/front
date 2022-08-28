import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Formation} from '../../../models/rh/formation.model';
import {FormControl} from '@angular/forms';
import {ReviewConstant} from '../../../constant/rh/review.constant';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat} from '../../../shared/utils/predicate';
import {DropDownComponent} from '../../../shared/interfaces/drop-down-component.interface';
import {TrainingService} from '../../services/training/training.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-formation-combobox',
  templateUrl: './formation-combobox.component.html',
  styleUrls: ['./formation-combobox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormationComboboxComponent implements OnInit, DropDownComponent {
  @Input() group;
  @Input() allowCustom;
  @Input() currentFormationId: number;
  @Input() formationToIgnore: number[];
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Input() disabled;

  formationDataSource: Formation[];
  formationFiltredDataSource: Formation[];
  predicate: PredicateFormat;

  constructor(private trainingService: TrainingService) {
  }

  get IdFormation(): FormControl {
    return this.group.get(ReviewConstant.ID_FORMATION) as FormControl;
  }

  ngOnInit() {
    this.preparePredicate();
    this.initDataSource();
  }

  initDataSource(): void {
    this.trainingService.readPredicateData(this.predicate).subscribe(data => {
      this.formationDataSource = data;
      this.formationFiltredDataSource = this.formationDataSource.slice(0);
      this.formationFiltredDataSource.forEach((valueForm) => {
        if (this.IdFormation.value === valueForm.Id) {
          this.IdFormation.patchValue(valueForm.Id);
        }
      });
    });
  }

  preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (this.formationToIgnore && this.formationToIgnore.length > 0) {
      this.formationToIgnore.forEach(x => {
        if (x !== this.currentFormationId) {
          this.predicate.Filter.push(new Filter(ReviewConstant.ID, Operation.neq, x));
        }
      });
    }
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.LABEL, OrderByDirection.asc));
  }

  onSelect($event) {
    const selectedFormation = this.formationFiltredDataSource.filter(x => x.Id === this.group.get(ReviewConstant.ID_FORMATION).value)[0];
    this.selected.emit(selectedFormation);
  }

  handleFilter(value: string): void {
    throw new Error('Method not implemented.');
  }

  addNew(): void {
    throw new Error('Method not implemented.');
  }
}
