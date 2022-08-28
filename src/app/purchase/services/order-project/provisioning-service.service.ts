import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { ProvisioningConstant } from '../../../constant/purchase/provisioning.constant';
import { CreatedData } from '../../../models/shared/created-data.model';
import { EquivalentItem } from '../../../models/purchase/equivalent-iItem.model';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { Provisioning } from '../../../models/purchase/provisioning.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { ProvisioningDetails } from '../../../models/purchase/provisioning-details.model';
import { ProvisionPredicate } from '../../../models/purchase/provision-predicate.model';




@Injectable()
export class ProvisioningService extends ResourceService<Provisioning> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
    @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService) {
    super(httpClient, appConfig,
      ProvisioningConstant.PROVISIONNING, ProvisioningConstant.PROVISIONNING, ProvisioningConstant.SALES, dataTransferShowSpinnerService);
  }
  public itemPrices(data: Provisioning): Observable<any> {
    return this.callService(Operation.POST, ProvisioningConstant.SELECTED_METHOD, data);
  }
  public itemDetails(data: ProvisioningDetails, isToUpdate: boolean): Observable<any> {
    return this.callService(Operation.POST, ProvisioningConstant.ITEM_DETAILS, data, null, !isToUpdate);
  }
  public addItemFromModal(data: ProvisioningDetails): Observable<any> {
    return this.callService(Operation.POST, 'AddItemFromModal', data);
  }
  public GenereateOrderProject(idProvision: number): Observable<Array<CreatedData>> {
    return this.callService(Operation.POST, 'GenereateOrderProject/' + idProvision) as Observable<Array<CreatedData>>;
  }
  public SupplierTotlRecap(idprovision: number, idProvionDetail?: number): Observable<Array<any>> {
    return this.callService(Operation.GET, 'SupplierTotlRecap/' + idprovision + '/' + idProvionDetail);
  }
  public GetEquivalentList(data: EquivalentItem): Observable<any> {
    return this.callService(Operation.POST, 'GetEquivalentList', data, null, true);
  }
  public ProvisioningList(data: ProvisionPredicate): Observable<any> {
    return this.callService(Operation.POST, 'ProvisioningList', data, null, true);
  }
  public GetItemsWithPaging(idProvision: number, data: PredicateFormat): Observable<any> {
    return this.callService(Operation.POST, 'GetItemsWithPaging/' + idProvision, data, null);
  }

  public GetProvision(idProvision: number): Observable<any> {
    return this.callService(Operation.GET, 'GetProvision/' + idProvision);
  }
  public addEquivalentItemToProvisioningGrid(idEquivalentItem: Array<number>, idProvision: number , mvtQty : number): Observable<any> {
    return this.callService(Operation.POST, 'addEquivalentItemToProvisioningGrid/' + idProvision + '/' + mvtQty, idEquivalentItem);
  }
  importOrderProject(SelectedProjects: Array<number>, idProvision: number): Observable<any> {
    return this.callService(Operation.POST, 'importOrderProject/' + idProvision, SelectedProjects);
  }

}
