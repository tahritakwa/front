import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { AddTiersComponent } from '../../../shared/components/add-tiers/add-tiers.component';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent extends AddTiersComponent implements OnInit {
  public customerTypeId;
  @ViewChild(AddTiersComponent) addTier;
  ngOnInit() {
    this.customerTypeId = TiersConstants.CUSTOMER_TYPE;
  }
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.addTier.isSaveOperation) {
      this.addTier.isSaveOperation;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this.addTier));
  }
}
