import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { MileageService } from '../../services/mileage/mileage.service';
const ID_MILEAGE = 'IdMileage';
@Component({
  selector: 'app-mileage-dropdown',
  templateUrl: './mileage-dropdown.component.html',
  styleUrls: ['./mileage-dropdown.component.scss']
})
export class MileageDropdownComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() fieldName: string;
  @Output() Selected = new EventEmitter<any>();

  mileagesDataSource: any[];
  mileagesFilterDataSource: any[];
  predicate: PredicateFormat;
  public selectedValue: any;

  constructor(public mileageService: MileageService) { }

  ngOnInit() {
    if (!this.fieldName) {
      this.fieldName = ID_MILEAGE;
    }
    this.predicate = new PredicateFormat();
    this.intiGridDataSource();
  }

  intiGridDataSource() {
    this.mileageService.readDropdownPredicateData(this.predicate).subscribe(data => {
      this.mileagesDataSource = data;
      this.mileagesFilterDataSource = this.mileagesDataSource.slice(0);
    });
  }

  handleFilter(value) {
      this.mileagesFilterDataSource = this.mileagesDataSource.filter((s) => s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  onSelectValue($event) {
    this.selectedValue = this.mileagesFilterDataSource.find(x => x.Id === $event);
    this.Selected.emit(this.selectedValue);
  }

}
