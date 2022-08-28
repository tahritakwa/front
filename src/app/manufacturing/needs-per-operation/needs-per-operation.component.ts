import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemService} from '../../inventory/services/item/item.service';
import {SwalWarring} from '../../shared/components/swal/swal-popup';
import {GridSettings} from '../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../shared/utils/column-settings.interface';
import {Nomenclature} from '../../models/manufacturing/nomenclature.model';
import {DataSourceRequestState, State} from '@progress/kendo-data-query';
import {NomenclatureType} from '../../models/enumerators/nomenclature-type.enum';
import {Subscription} from 'rxjs/Subscription';
import {forkJoin} from 'rxjs/observable/forkJoin';
import { DataStateChangeEvent, PageChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {ItemDropdownComponent} from '../../shared/components/item-dropdown/item-dropdown.component';
import {NumberConstant} from '../../constant/utility/number.constant';
import {FiltersItemDropdown} from '../../models/shared/filters-item-dropdown.model';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {preparePredicateFilterToGetCostPrice} from '../manufactoring-shared/prepare-predicate-cost-price';
import { NeedPerOperationConstant } from '../../constant/manufuctoring/needPerOperation.constant';
import { GammeService } from '../service/gamme.service';
import { UserService } from '../../administration/services/user/user.service';
import { Gamme } from '../../models/manufacturing/gamme.model';
import { OperationModel } from '../../models/manufacturing/operation.model';
import { NumberFormatOptions } from '@progress/kendo-angular-intl';
import { CompanyService } from '../../administration/services/company/company.service';
import { Currency } from '../../models/administration/currency.model';

@Component({
  selector: 'app-needs-per-operation',
  templateUrl: './needs-per-operation.component.html',
  styleUrls: ['./needs-per-operation.component.scss']
})
export class NeedsPerOperationComponent  implements OnInit, OnDestroy {
  @ViewChild(ItemDropdownComponent) itemDropDown;
  private subscription$: Subscription;
  public nomenclature = new Nomenclature();
  public productLineFormGroup: FormGroup;
  public SelectedItem;
  public idGamme: number;
  public idOperation: number;
  public formGroup: FormGroup;
  public hideSearch = true;
  public value = '';
  public operationsGamme: any[] = [];
  public gamme = new Gamme();
  public listUsers: any[] = [];
  public idGammeOp: any;
  private machineList: any = [];
  private prNomenclaturesList: any = [];
  private responsibleIds: any = [];
  public btnEditVisible: boolean;
  public typesList: any = [];
  public data: any[] = [];
  public montantTotal = 0;
  public listItems: any[] = [];

  private  size = NumberConstant.TEN;
  private  size1 = NumberConstant.TEN;
  private  size2 = NumberConstant.TEN;
  private currentPage = NumberConstant.ZERO;
  private currentPage1 = NumberConstant.ZERO;
  private currentPage2 = NumberConstant.ZERO;
  public product: any;
  public nomenclatureReference = '';
  public spinner = false;
  public idArticle: number;
  public tempsNetMachine: any;
  public coutNetMachine: any;
  public tempsNetPersonnel: any;
  public coutNetPersonnel: any;
  public listOperations: Array<OperationModel> = [];
  public formatNumberOptions: NumberFormatOptions;
  private currency: Currency;
  public gridData: any[] = [];
  pagerSettingsEquip: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  pagerSettingsPers: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  pagerSettingsProd: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public selectedValue: NomenclatureType = this.typesList[NumberConstant.ONE];
  public gridStateNomenclatures: DataSourceRequestState = {
    skip: 0,
    take: this.size,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridStateEquipement: DataSourceRequestState = {
    skip: 0,
    take: this.size1,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridStatePersonnel: DataSourceRequestState = {
    skip: 0,
    take: this.size2,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: NeedPerOperationConstant.ARTICLE_FIELD,
      title: NeedPerOperationConstant.ARTICLE_TITLE,
      tooltip: NeedPerOperationConstant.ARTICLE_TITLE,
      filterable: true,
    },
    {
      field: NeedPerOperationConstant.REVENUE_COST_FIELD,
      title: NeedPerOperationConstant.REVENUE_COST_TITLE,
      tooltip: NeedPerOperationConstant.REVENUE_COST_TITLE,
      filterable: true
    },
    {
      field: NeedPerOperationConstant.OPERATION_FIELD,
      title: NeedPerOperationConstant.OPERATION_TITLE,
      tooltip: NeedPerOperationConstant.OPERATION_TITLE,
      filterable: true
    },
  ];
  public columnsConfigProducts: ColumnSettings[] = [
    {
      field: NeedPerOperationConstant.COMPONENT_FIELD,
      title: NeedPerOperationConstant.COMPONENT_TITLE,
      tooltip: NeedPerOperationConstant.COMPONENT_TITLE,
      filterable: true,
      width: NumberConstant.ONE_HUNDRED_TWENTY
    },
    {
      field: NeedPerOperationConstant.QUANTITE_FIELD,
      title: NeedPerOperationConstant.QUANTITE_TITLE,
      tooltip: NeedPerOperationConstant.QUANTITE_TITLE,
      filterable: true,
      width: NumberConstant.ONE_HUNDRED_TWENTY
    },
    {
      field: NeedPerOperationConstant.UNITE_FIELD,
      title: NeedPerOperationConstant.UNITE_TITLE,
      tooltip: NeedPerOperationConstant.UNITE_TITLE,
      filterable: true,
      width: NumberConstant.ONE_HUNDRED_TWENTY
    },
    {
      field: NeedPerOperationConstant.BRUT_COST_FIELD,
      title: NeedPerOperationConstant.BRUT_COST_TITLE,
      tooltip: NeedPerOperationConstant.BRUT_COST_TITLE,
      filterable: true,
      width: NumberConstant.ONE_HUNDRED_TWENTY
    },
    {
      field: NeedPerOperationConstant.QUANTITY_CHUTE_FIELD,
      title: NeedPerOperationConstant.QUANTITY_CHUTE_TITLE,
      tooltip: NeedPerOperationConstant.QUANTITY_CHUTE_TITLE,
      filterable: true,
      width: NumberConstant.ONE_HUNDRED_TWENTY
    },
    {
      field: NeedPerOperationConstant.CHUTE_COST_FIELD,
      title: NeedPerOperationConstant.CHUTE_COST_TITLE,
      tooltip: NeedPerOperationConstant.CHUTE_COST_TITLE,
      filterable: true,
      width: NumberConstant.ONE_HUNDRED_TWENTY
    },
    {
      field: NeedPerOperationConstant.QUANTITY_NET_FIELD,
      title: NeedPerOperationConstant.QUANTITY_NET_TITLE,
      tooltip: NeedPerOperationConstant.QUANTITY_NET_TITLE,
      filterable: true,
      width: NumberConstant.ONE_HUNDRED_TWENTY
    },
    {
      field: NeedPerOperationConstant.NET_COST_FIELD,
      title: NeedPerOperationConstant.NET_COST_TITLE,
      tooltip: NeedPerOperationConstant.NET_COST_TITLE,
      filterable: true,
      width: NumberConstant.ONE_HUNDRED_TWENTY
    }
  ];
  public gridSettingsNomenclatures: GridSettings = {
    state: this.gridStateNomenclatures,
    columnsConfig: this.columnsConfigProducts
  };
  public columnsConfigPersonnel: ColumnSettings[] = [
    {
      field: NeedPerOperationConstant.RESPONSABLE_NAME_FIELD,
      title: NeedPerOperationConstant.RESPONSABLE_NAME_TITLE,
      tooltip: NeedPerOperationConstant.RESPONSABLE_NAME_TITLE,
      filterable: false,
      width: NumberConstant.ONE_HUNDRED_TWENTY
    },
    {
      field: NeedPerOperationConstant.NET_COST_PERSONNEL_FIELD,
      title: NeedPerOperationConstant.HOUR_COST_PERSONNEL_TITLE,
      tooltip: NeedPerOperationConstant.HOUR_COST_PERSONNEL_TITLE,
      filterable: false,
      width: NumberConstant.ONE_HUNDRED_TWENTY
    }
  ];
  public gridPersonnelSettings: GridSettings = {
    state: this.gridStatePersonnel,
    columnsConfig: this.columnsConfigPersonnel
  };
  public columnsConfigEquipment: ColumnSettings[] = [

    {
      field: NeedPerOperationConstant.MACHINE_NAME_FIELD,
      title: NeedPerOperationConstant.MACHINE_NAME_TITLE,
      filterable: false,
      width: NumberConstant.FIFTY_FIVE
    },
    {
      field: NeedPerOperationConstant.NET_COST_MACHINE_FIELD,
      title: NeedPerOperationConstant.HOUR_COST_MACHINE_TITLE,
      filterable: false,
      width: NumberConstant.FIFTY_FIVE
    }

    
  ];
  public gridEquipmentSettings: GridSettings = {
    state: this.gridStateEquipement,
    columnsConfig: this.columnsConfigEquipment
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gammeService: GammeService,
    private itemService: ItemService,
    private userService: UserService,
    private companyService: CompanyService) {
    this.activatedRoute.params.subscribe(params => {
      this.idGamme = +params['id'] || 0;
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.initFormGroup();
  }

  public initFormGroup() {
    this.formGroup = new FormGroup({
      article: new FormControl(''),
      revenueCost: new FormControl(''),
    });
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  public sortChange(): void {
    this.resetToFirstPage();
    this.initGridData();
  }
  public resetToFirstPage(): any {
    this.currentPage = 0;
    this.currentPage1 = 0;
    this.currentPage2 = 0;
    this.gridEquipmentSettings.state.skip = this.currentPage1;
    this.gridPersonnelSettings.state.skip = this.currentPage2;
    this.gridSettingsNomenclatures.state.skip = this.currentPage;
  }

  initGridData(page?: number) {
    if (page) {
      this.currentPage = page;
      this.currentPage1 = page;
      this.currentPage2 = page;
    }
    this.montantTotal = 0;
    this.loadFormValues();
    
    this.loadEquipmentDetails();
    this.loadPersonnelDetails();
    this.loadProductsByOperation();
  }

    onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / event.take;
    this.currentPage1 = (event.skip) / event.take;
    this.currentPage2 = (event.skip) / event.take;
    this.size = event.take;
    this.size1 = event.take;
    this.size2 = event.take;
    this.initGridData();
  }
 

  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettingsNomenclatures.state = state;
  }
  dataStateChange1(state: DataStateChangeEvent) {
    this.gridEquipmentSettings.state = state;
  }
  dataStateChange2(state: DataStateChangeEvent) {
    this.gridPersonnelSettings.state = state;
  }

  ngOnInit() {
      this.initGridData();
      this.getCompanyCurrency();
  }

  receiveOperation(id) {
    this.idOperation= id;
    this.loadEquipmentDetails();
    this.loadProductsByOperation();
    this.loadPersonnelDetails();
  }
receiveFirstId(id){
  this.idOperation= id;
    this.loadProductsByOperation();
    this.loadEquipmentDetails();
    this.loadPersonnelDetails();
}
getCompanyCurrency() {
  this.companyService.getDefaultCurrencyDetails().subscribe((currency: Currency) => {
    this.currency= currency;
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: this.currency.Precision,
      minimumFractionDigits: this.currency.Precision
    };
  });
}

  loadPersonnelDetails(){
    if (this.idOperation != null){
      this.gammeService.getIdGammeOpByOperation(this.idGamme, this.idOperation).subscribe(res=>{ this.idGammeOp = res});
    this.subscription$ = this.gammeService.getJavaGenericService()
      .getEntityById(this.idGamme)
      .subscribe(data => {
        this.gamme = JSON.parse(JSON.stringify(data));
        this.operationsGamme = this.operationsGamme.concat(data.gammeOperations);
        this.userService.getAllUserWithoutState().subscribe(result => {
          this.listUsers = result.data;
          this.gamme.gammeOperations.forEach(go => {
            if (go.id == this.idGammeOp){
              this.tempsNetPersonnel= go.personTimeNet;
              this.coutNetPersonnel=go.costPersons;
              this.responsibleIds= [];
              this.listUsers.forEach(user => {
                if (go.responsibles.find(selected => selected.idResponsable === user.Id) && go.id == this.idGammeOp) {
                 this.responsibleIds.push({ id: user.Id, FullName: user.FullName ,costPerson: go.costPersons });
                  go.FullName = user.FullName;
                  go.costPerson = go.costPerson;
                }
              });
            }
            this.gridPersonnelSettings.gridData = { data: this.responsibleIds, total: this.responsibleIds.length };
          });
        });
      });
    }

    }


  loadEquipmentDetails(){
    if (this.idOperation != null){
      this.gammeService.getIdGammeOpByOperation(this.idGamme, this.idOperation).subscribe(res=>{ this.idGammeOp = res});
      this.subscription$= this.gammeService.getJavaGenericService().sendData(NeedPerOperationConstant.PAGEABLE +
        `?idGamme=${this.idGamme}&opId=${this.idOperation}&page=${this.currentPage1}&size=${this.size1}`)
      .subscribe(data =>{
        this.machineList= data;
        this.gridEquipmentSettings.gridData = {data: this.machineList.content , total: this.machineList.totalElements };
      });
      this.gammeService.getJavaGenericService()
      .getEntityById(this.idGamme)
      .subscribe(res => {
        this.gamme = JSON.parse(JSON.stringify(res));
        this.gamme.gammeOperations.forEach(go => {
          if (go.id == this.idGammeOp){
          this.tempsNetMachine= go.machineTimeNet;
          this.coutNetMachine=go.costMachines;
          }
        });
      });
    }
  }



  loadFormValues(){
    this.gammeService.getJavaGenericService().getEntityById(this.idGamme)
    .subscribe(data => {
      this.gamme = JSON.parse(JSON.stringify(data));
      this.itemService.getById(data.articleId).subscribe(article => {
      this.formGroup.patchValue({
        article: article.Description,
        revenueCost: data.costPrice
      });
    });
  });
}

loadProductsByOperation(){
  if (this.idOperation != null){
  this.subscription$ =  this.gammeService.getProductsNomenclaturesByOperation(this.idGamme, this.idOperation, this.currentPage, this.size)
.subscribe(data =>{
this.prNomenclaturesList= data;
data.content.forEach( (element) => {
  element.quantityNet =(element.quantity) - (element.quantityChute);
  forkJoin( this.itemService.getModelByCondition(preparePredicateFilterToGetCostPrice(element.productId)),
  this.itemService.getById(element.productId)
  )
  .subscribe(data => {
    element.brutCost = (data[NumberConstant.ZERO].CostPrice * element.quantity).toFixed(NumberConstant.THREE);
    element.chuteCost = (data[NumberConstant.ZERO].CostPrice * element.quantityChute).toFixed(NumberConstant.THREE);
    element.netCost = (data[NumberConstant.ZERO].CostPrice * ((element.quantity) - (element.quantityChute))).toFixed(NumberConstant.THREE);
    element.description = data[NumberConstant.ZERO].Description;
    element.unite = data[NumberConstant.ONE].IdUnitStockNavigation.Label;
  });
});
this.gridSettingsNomenclatures.gridData = { data: this.prNomenclaturesList.content, total: this.prNomenclaturesList.totalElements };
});
  }


}

}
