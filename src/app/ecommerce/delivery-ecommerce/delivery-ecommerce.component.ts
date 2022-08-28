import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../shared/services/validation/validation.service';
import { DeliveryService } from '../services/ecommerce-delivery/delivery.service';
import { PredicateFormat, OrderBy, OrderByDirection } from '../../shared/utils/predicate';
import { NumberConstant } from '../../constant/utility/number.constant';
import { Item } from '../../models/inventory/item.model';
import { Delivery } from '../../models/ecommerce/delivery.model';
import { or } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { SharedConstant } from '../../constant/shared/shared.constant';

@Component({
  selector: 'app-delivery-ecommerce',
  templateUrl: './delivery-ecommerce.component.html',
  styleUrls: ['./delivery-ecommerce.component.scss']
})
export class DeliveryEcommerceComponent implements OnInit {

  public hideSearch = true;
  public formGroup: FormGroup;
  public delivery: Delivery;
  constructor(protected formBuilder: FormBuilder,
    private validationService: ValidationService, public deliveryService: DeliveryService) { }

  ngOnInit() {
    this.delivery = new Delivery();
    this.getLastDeliveryItemAndInitFormGroup();
  }
  getLastDeliveryItemAndInitFormGroup(): any {
    this.deliveryService.reloadServerSideData({
      skip: 0,
      take: 1,
      filter: {
        logic: 'and',
        filters: []
      }
    }, this.preparePredicate()).subscribe(res => {

      if (res && res.data && res.total && res.total > NumberConstant.ZERO) {
        this.delivery = res.data[0];
      }

      this.initFormGroup();

    });
  }

  preparePredicate(): PredicateFormat {
    let myPredicate = new PredicateFormat()
    myPredicate.OrderBy = new Array<OrderBy>();

    myPredicate.OrderBy.push.apply(myPredicate.OrderBy,
      [new OrderBy(SharedConstant.ID, OrderByDirection.desc)]);

    return myPredicate
  }
  initFormGroup(): any {
    this.formGroup = this.formBuilder.group({
      Id: [NumberConstant.ZERO],
      IdItem: [this.delivery ? this.delivery.IdItem : undefined, Validators.required]
    });
  }

  save() {
    if (this.formGroup.valid) {

      const obj: Delivery = Object.assign({}, this.delivery, this.formGroup.value);

      this.deliveryService.save(obj, true).subscribe(data => {
      });
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

}
