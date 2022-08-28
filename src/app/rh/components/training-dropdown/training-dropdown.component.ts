import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Training} from '../../../models/rh/training.model';
import {TrainingService} from '../../services/training/training.service';
import {FormControl} from '@angular/forms';
import {TrainingConstant} from '../../../constant/rh/training.constant';

@Component({
  selector: 'app-training-dropdown',
  templateUrl: './training-dropdown.component.html',
  styleUrls: ['./training-dropdown.component.scss']
})
export class TrainingDropdownComponent implements OnInit {

  @Input() group;
  @Input() allowCustom;
  @Output() selected: EventEmitter<any> = new EventEmitter();
  trainingDataSource: Training[];
  trainingFiltredDataSource: Training[];

  constructor(private trainingService: TrainingService) {
  }

  get IdTraining(): FormControl {
    return this.group.get(TrainingConstant.ID_TRAINING) as FormControl;
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.trainingService.listdropdown().subscribe((data: any) => {
      this.trainingDataSource = data.listData;
      this.trainingFiltredDataSource = this.trainingDataSource;
    });
  }

  /***
   * training  search filter by name
   * @param value
   */
  handleFilter(value: string): void {
    this.trainingFiltredDataSource = this.trainingDataSource.filter((s) =>
      s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  /**
   * Select training in dropdown
   * @param $event
   */
  onSelect($event) {
    const selectedCandidate = this.trainingFiltredDataSource.filter(x => x.Id === this.IdTraining.value)[0];
    this.selected.emit(selectedCandidate);
  }

  /**
   * Add new training to dropdown
   */
  addNew(): void {

  }
}
