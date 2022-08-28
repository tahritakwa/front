import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { Vehicle } from '../../../models/sales/vehicle.model';
import { VehicleService } from '../../../shared/services/vehicle/vehicle.service';
import { Filter, Operation, OrderBy, PredicateFormat, Relation } from '../../../shared/utils/predicate';

@Component({
  selector: 'app-vehicle-dropdown',
  templateUrl: './vehicle-dropdown.component.html',
  styleUrls: ['./vehicle-dropdown.component.scss']
})
export class VehicleDropdownComponent implements OnInit {

  @Input() selectedValue;
  @Input() formGroup: FormGroup;
  @Output() selected = new EventEmitter<boolean>();
  @Output() selectedSalesPrice = new EventEmitter<any>();
  @ViewChild('vehicleComboBox') public vehicleComboBox: ComboBoxComponent;
  @Input() idTier;
  public vehicleDataSource: Vehicle[];
  public vehicleFiltredDataSource: Vehicle[];
  predicate: PredicateFormat;

  constructor(private vehicleService: VehicleService) {
  }

  ngOnInit() {
    this.initDataSource();
  }


  public onSelect($event): void {
    this.selected.emit($event);
    if($event){
    const selectedVehicle: Vehicle = this.vehicleDataSource.find(x => x.Id === $event.Id);
    this.selectedSalesPrice.emit(selectedVehicle);
    }
  }

  initDataSource(): void {
    this.preparePredicate(this.idTier);
    this.vehicleService.readDropdownPredicateData(this.predicate).subscribe((data: any) => {
      this.vehicleDataSource = data;
      this.vehicleFiltredDataSource = this.vehicleDataSource.slice(0);
    });
  }
  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.vehicleFiltredDataSource = this.vehicleDataSource.filter((s) =>
      ((s.VehicleName && s.VehicleName.split(' ').join('').toLowerCase().includes(value.split(' ').join('').toLowerCase())) ||
      (s.RegistrationNumber && s.RegistrationNumber.split(' ').join('').toLowerCase().includes(value.split(' ').join('').toLowerCase())) ||
      (s.ChassisNumber && s.ChassisNumber.split(' ').join('').toLowerCase().includes(value.split(' ').join('').toLowerCase())) ||
      (s.IdVehicleBrandNavigation && s.IdVehicleBrandNavigation.Code && s.IdVehicleBrandNavigation.Code.split(' ').join('').toLowerCase().includes(value.split(' ').join('').toLowerCase())) ||
      (s.IdVehicleModelNavigation && s.IdVehicleModelNavigation.Code && s.IdVehicleModelNavigation.Code.split(' ').join('').toLowerCase().includes(value.split(' ').join('').toLowerCase()))));
  }
  public openComboBox() {
    this.vehicleComboBox.toggle(true);
  }
 public preparePredicate(idTier : number){
  this.predicate = new PredicateFormat();
  this.predicate.Filter = new Array<Filter>();
  if(idTier){
    this.predicate.Filter.push(new Filter(ItemConstant.ID_TIERS, Operation.eq, idTier));
  }
  this.predicate.OrderBy = new Array<OrderBy>();
  this.predicate.Relation = new Array<Relation>();
  this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ItemConstant.VEHICULE_BRAND_NAVIGATION),new Relation(ItemConstant.VEHICLE_MODEL_NAVIGATION)]);
 }


}
