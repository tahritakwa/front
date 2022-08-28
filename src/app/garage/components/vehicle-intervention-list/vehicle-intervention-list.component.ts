import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { State, process } from '@progress/kendo-data-query';
import { InterventionOrderStateEnumerator } from '../../../models/enumerators/intervention-order-state.enum';
import { Currency } from '../../../models/administration/currency.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicle-intervention-list',
  templateUrl: './vehicle-intervention-list.component.html',
  styleUrls: ['./vehicle-intervention-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VehicleInterventionListComponent implements OnInit {
  @Input() currency: Currency;
  @Input() idVehicle: number;
  interventionSearchFormGroup: FormGroup;
  vehicleInterventionList: any;
  totalAmount: number;
  interventionList: any[] = JSON.parse(localStorage.getItem(GarageConstant.INTERVENTIONS_ORDER_LIST));
  interventionState = InterventionOrderStateEnumerator;
  vehicleInterventionToTake = NumberConstant.FIVE;
  totalVehicleIntervention = NumberConstant.ZERO;
  state: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.FIVE,
  };
  

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  constructor(private fb: FormBuilder, private translate: TranslateService) { }

  ngOnInit() {
    this.createSearchForm();
    this.initVehicleInterventionGrid();
  }

  initVehicleInterventionGrid() {
    const interventions = this.interventionList ? this.interventionList.filter(x => x.IdVehicle === this.idVehicle) : [];
    this.totalVehicleIntervention = interventions.length;
    if (interventions.length > 0) {
    this.totalAmount = interventions.map(z => z.InterventionPrice).reduce((x, y) => x + y);
    }
    this.vehicleInterventionList = process(interventions, this.state);
    this.vehicleInterventionList.data.forEach(element => {
      element.Hide = true;
    });
  }

  createSearchForm() {
    this.interventionSearchFormGroup = this.fb.group({
      StartDate: [],
      EndDate: [],
      IdOperation: [],
      IdInterventionState: []
    });
  }


  paginate($event) {
    this.vehicleInterventionToTake = $event.rows;
    const skip = $event.page * this.vehicleInterventionToTake;
    this.state = {
      skip: skip,
      take: this.vehicleInterventionToTake,
    };
    this.initVehicleInterventionGrid();
  }

}
