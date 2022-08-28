import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ReviewConstant} from '../../../constant/rh/review.constant';
import {FormationTypeService} from '../../services/formation-type/formation-type.service';
import {FormationType} from '../../../models/rh/formation-type.model';

@Component({
  selector: 'app-formation-type-combobox',
  templateUrl: './formation-type-combobox.component.html',
  styleUrls: ['./formation-type-combobox.component.scss']
})
export class FormationTypeComboboxComponent implements OnInit {
  @Input() group;
  @Input() allowCustom;
  @Output() selected: EventEmitter<any> = new EventEmitter();

  formationTypeDataSource: FormationType[];
  formationTypeFiltredDataSource: FormationType[];

  constructor(private formationTypeService: FormationTypeService) {
  }

  get IdFormation(): FormControl {
    return this.group.get(ReviewConstant.ID_FORMATION_TYPE) as FormControl;
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.formationTypeService.list().subscribe(data => {
      this.formationTypeDataSource = data;
      this.formationTypeFiltredDataSource = this.formationTypeDataSource.slice(0);
    });
  }

  onSelect($event) {
    const selectedFormation = this.formationTypeFiltredDataSource.filter
    (x => x.Id === this.group.get(ReviewConstant.ID_FORMATION_TYPE).value)[0];
    this.selected.emit(selectedFormation);
  }
}
