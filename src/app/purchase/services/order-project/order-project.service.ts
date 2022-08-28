import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { ProvisioningDetails } from '../../../models/purchase/provisioning-details.model';
import { Subject, Observable } from 'rxjs';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { CmdNotDecomposable, digitsAfterCommaCMD } from '../../../shared/services/validation/validation.service';
export const orders = [];
export const EquivalentItem = [];

@Injectable()
export class OrderProjectService {
  orderObject: ProvisioningDetails;
  public data: ProvisioningDetails[] = orders;
  public equivalentData: any[] = EquivalentItem;
  public importedData: any[] = [];
  public SelectedProjects: any[] = [];
  public counter: number = orders.length;
  public counterEquivalent: number = EquivalentItem.length;
  public currency: number;
  public formatOptions: any;
  public isSelectedSupplier = new Subject<any>();

  /**
   *
   */
  constructor(public currencyService: CurrencyService,
    private formBuilder: FormBuilder) {
  }
  public createFormGroup(dataItem?: ProvisioningDetails, idProvision?: number): FormGroup {
    const form = this.formBuilder.group(new ProvisioningDetails(dataItem));
    form.controls['IdProvisioning'].setValue(idProvision);
    if(dataItem != null && dataItem.IdItemNavigation != null && dataItem.IdItemNavigation.IdUnitStockNavigation != null){
      if(dataItem.IdItemNavigation.IdUnitStockNavigation.IsDecomposable){
        form.controls['MvtQty']
      .setValidators([Validators.minLength(1),
      Validators.min(0),
      Validators.max(NumberConstant.MAX_QUANTITY),
      digitsAfterCommaCMD(dataItem.IdItemNavigation.IdUnitStockNavigation.DigitsAfterComma)]);
      } else{
        form.controls['MvtQty']
      .setValidators([Validators.minLength(1),
      Validators.min(0),
      Validators.max(NumberConstant.MAX_QUANTITY),
      CmdNotDecomposable()]);
      }
      form.controls['IdItem']
        .setValidators([Validators.required,Validators.minLength(1)]);
      return form;
    }
    form.controls['MvtQty']
      .setValidators([Validators.minLength(1),
      Validators.min(0),
      Validators.max(NumberConstant.MAX_QUANTITY),
      Validators.pattern('[-+]?[0-9]*\.?[0-9]*')]);
      form.controls['IdItem']
      .setValidators([Validators.required,Validators.minLength(1)]);
    return form;
  }
  public orders(): any[] {
    return this.data;
  }
  public equivalentItem(): any[] {
    return this.equivalentData;
  }
  /**remove element from item list */
  public remove(rowIndex: any): void {
    this.data.splice(rowIndex, 1);
  }
  /**save element in item list*/
  public save(data: any, isNew: boolean): void {
    if (isNew) {
      data.IdLine = this.counter++;
      this.data.splice(0, 0, data);
    } else {
      Object.assign(
        this.data.find(({ Id }) => Id === data.Id),
        data
      );
    }
  }
  /**save element in equivalent item list*/
  public saveEquivalentItem(data: any, isNew: boolean): void {
    if (isNew) {
      data.IdLine = this.counter++;
      this.equivalentData.splice(this.equivalentData.length, 0, data);
    } else {
      Object.assign(
        this.equivalentData.find(({ IdLine }) => IdLine === data.IdLine),
        data
      );
    }
  }
  /**assign data to grid */
  public assignValues(element: ProvisioningDetails, isAdvencedList): ProvisioningDetails {
    this.orderObject = Object.assign({}, new ProvisioningDetails(), element);
    if(element.IdTiersNavigation){
    this.currency = element.IdTiersNavigation.IdCurrency;
    // this.formatOptions = this.getSelectedCurrency();
  }
    return this.orderObject;
  }
  show(data: any) {
    this.isSelectedSupplier.next({ value: true, data: data });

  }
  getResult(): Observable<any> {

    return this.isSelectedSupplier.asObservable();
  }

}
