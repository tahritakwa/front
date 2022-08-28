import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeliveryType } from '../../../models/shared/deliveryType.model';
import { FormGroup } from '@angular/forms';
import { PredicateFormat, Filter, Operation, OrderBy, OrderByDirection } from '../../utils/predicate';
import { DeliveryTypeService } from '../../../sales/services/delivery-type/delivery-type.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-delivery-type-dropdown',
  templateUrl: './delivery-type-dropdown.component.html',
  styleUrls: ['./delivery-type-dropdown.component.scss']
})
export class DeliveryTypeDropdownComponent implements OnInit {
  public deliveryTypeDataSource: DeliveryType[];
  @Input() itemForm: FormGroup;
  predicate: PredicateFormat;
  selectedValue: any;
  @Output() Selected = new EventEmitter<boolean>();
  @Input() setDefaultValue: boolean;
  @Input() disabled;

  constructor(private deliveryTypeService: DeliveryTypeService) {
  }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.deliveryTypeService.listdropdownWithPerdicate(this.preparePredicate()).subscribe((data: any) => {
      this.deliveryTypeDataSource = data.listData;
      this.selectedValue = this.deliveryTypeDataSource.filter((s) => s.Code === '002');
      if (this.setDefaultValue) {
      if(!this.itemForm.controls['IdDeliveryType'].value){

        this.onSelectDeliveryType(this.selectedValue[0].Id);
      }
    }
    });
  }
  onSelectDeliveryType($event) {
    this.Selected.emit($event);
  }
  preparePredicate(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy( SharedConstant.LABEL ,OrderByDirection.asc));
    return predicate;
  }
}
