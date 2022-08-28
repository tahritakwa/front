import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {purchaseRequestDocumentStatusCode} from '../../../models/enumerators/document.enum';
import {EnumValues} from 'enum-values';
import {TranslateService} from '@ngx-translate/core';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-purchase-request-status-dropdown',
  templateUrl: './purchase-request-status-dropdown.component.html',
  styleUrls: ['./purchase-request-status-dropdown.component.scss']
})
export class PurchaseRequestStatusDropdownComponent implements OnInit {
  /**
   * Decorator to emit the purchase request status selected value
   */
  @Output() public Selected = new EventEmitter<number>();
  /**
   * purchase request status codes
   */
  public purchaseRequestsStatusEnumValues = EnumValues.getNamesAndValues(purchaseRequestDocumentStatusCode);
  public purchaseRequestsStatusEnumValuesFiltred = EnumValues.getNamesAndValues(purchaseRequestDocumentStatusCode);

  /**
   * Decorator to identify  purchase request status dropdwn component
   */
  @ViewChild(ComboBoxComponent) purchaseRequestStatusComponent : ComboBoxComponent;
  /**
   *
   * @param translateService
   */
  constructor(public translateService: TranslateService) {
  }

  /**
   * translate filtre operations
   * @private
   */
  private translateFiltreOperations() {
    this.purchaseRequestsStatusEnumValues.sort((a,b)=> this.translateService.instant(a.name).localeCompare(this.translateService.instant(b.name)));
    this.purchaseRequestsStatusEnumValues = this.purchaseRequestsStatusEnumValues.map((status) => {
      return {text: this.translateService.instant(status.name.toUpperCase()), name: status.name, value: status.value};
    });    
  }

  ngOnInit() {
    this.translateFiltreOperations();
  }

  handleValueChange(value) {
    this.Selected.emit(value);
  }

  handleFiltreChange(statusSearched) {
    this.purchaseRequestsStatusEnumValues = this.purchaseRequestsStatusEnumValuesFiltred.filter(status => {
      return (this.translateService.instant(status.name).toUpperCase().indexOf(statusSearched.toUpperCase()) !== -1);
    });
    this.translateFiltreOperations();
  }
}
