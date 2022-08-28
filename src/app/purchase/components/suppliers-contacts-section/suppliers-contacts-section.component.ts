import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ContactService } from '../../services/contact/contact.service';
import { ContactDropdownComponent } from '../../../shared/components/contact-dropdown/contact-dropdown.component';
import { TiersPriceRequestConstant } from '../../../constant/purchase/tiers-price-request';
@Component({
  selector: 'app-suppliers-contacts-section',
  templateUrl: './suppliers-contacts-section.component.html',
  styleUrls: ['./suppliers-contacts-section.component.scss']
})

export class SuppliersContactsSectionComponent implements OnInit {
  @ViewChild(ContactDropdownComponent) childListContactDropDown;
  supplierId:
  number;
  @Input() tierPriceRequestform;
  @Output() valueChange = new EventEmitter<any>();
  constructor(private contactService: ContactService) { }

  ngOnInit() {
    if (this.tierPriceRequestform.controls[TiersPriceRequestConstant.ID_TIERS]) {
      this.supplierId = this.tierPriceRequestform.controls[TiersPriceRequestConstant.ID_TIERS].value;
      this.childListContactDropDown.SetContact(this.supplierId);
    }

  }

  receiveSupplier($event) {
    this.supplierId = $event.selectedValue;
    if (this.supplierId) {
      this.tierPriceRequestform.controls[TiersPriceRequestConstant.ID_CONTACT].setValue(undefined);
      this.childListContactDropDown.SetContact(this.supplierId);
    }
    this.valueChange.emit($event);
  }
}
