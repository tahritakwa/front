import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { VehicleModel } from '../../../models/garage/vehicle-model.model';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate'; 
import { VehicleModelService } from '../../services/vehicle-model/vehicle-model.service';

@Component({
  selector: 'app-model-dropdown',
  templateUrl: './model-dropdown.component.html',
  styleUrls: ['./model-dropdown.component.scss']
})
export class ModelDropdownComponent implements OnInit {

  @Input() form: FormGroup;
  @Output() Selected = new EventEmitter<VehicleModel>();
  modelDataSource: VehicleModel[];
  modelFiltredDataSource: VehicleModel[];
  predicate: PredicateFormat;
  isDisabled = true;
  idBrand;
  constructor(private modelService: VehicleModelService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.preparePredicate(this.idBrand);
    this.modelService.readDropdownPredicateData(this.predicate).subscribe((data: any) => {
      this.modelDataSource = data;
      this.modelFiltredDataSource = this.modelDataSource.slice(0);
    });
  }

  setModel(idBrand: number) {
    this.idBrand = idBrand;
    if (this.idBrand) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
    this.initGridDataSource();
  }

  preparePredicate(idBrand: number) {
    this.predicate = new PredicateFormat();
    if (idBrand) {
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(new Filter(GarageConstant.ID_VEHICLE_BRAND, Operation.eq, idBrand));
    }
  }

  handleFilter($event) {
    this.modelFiltredDataSource = this.modelDataSource.filter(x => x.Designation.toLowerCase().includes($event.toLowerCase()));
  }

  onSelectModel($event) {
    const selectedModel: VehicleModel = this.modelFiltredDataSource.find(x => x.Id === $event);
    this.Selected.emit(selectedModel);
  }
}
