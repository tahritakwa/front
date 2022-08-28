import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { Garage } from '../../../models/garage/garage.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { GarageService } from '../../services/garage/garage.service';

@Component({
  selector: 'app-garage-dropdown',
  templateUrl: './garage-dropdown.component.html',
  styleUrls: ['./garage-dropdown.component.scss']
})
export class GarageDropdownComponent implements OnInit {
  @ViewChild(ComboBoxComponent) public garageComboBox: ComboBoxComponent;
  @Input() group: FormGroup;
  @Output() Selected = new EventEmitter<any>();
  @Input() withoutPlaceholder: boolean;
  garageDataSource: Garage[];
  garageFilterDataSource: Garage[];
  selectedValue: Garage;
  public placeholder = GarageConstant.GARAGE_PLACE_HOLDER;
  constructor(private garageService: GarageService) {
  }

  ngOnInit() {
    if (this.withoutPlaceholder) {
      this.placeholder = '';
    }
    this.intiGridDataSource();
  }

  intiGridDataSource() {
    this.garageService.readDropdownPredicateData(new PredicateFormat()).subscribe((data) => {
      this.garageDataSource = data;
      this.garageFilterDataSource = this.garageDataSource.slice(0);
    });
  }

  handleFilter(value) {
    this.garageFilterDataSource = this.garageDataSource.filter((s) =>
      s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onSelectGarage($event) {
    this.selectedValue = this.garageFilterDataSource.find(x => x.Id === $event);
    this.Selected.emit(this.selectedValue);
  }

  public reset() {
    this.garageComboBox.reset();
    this.garageFilterDataSource = this.garageDataSource.slice(0);
  }

}
