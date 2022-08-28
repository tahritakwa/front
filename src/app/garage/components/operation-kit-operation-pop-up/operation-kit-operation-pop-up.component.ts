import { Component, ComponentRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, State } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Subject } from 'rxjs/Subject';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Company } from '../../../models/administration/company.model';
import { Currency } from '../../../models/administration/currency.model';
import { OperationKitOperation } from '../../../models/garage/operation-kit-operation.model';
import { LanguageService } from '../../../shared/services/language/language.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { OperationService } from '../../services/operation/operation.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-operation-kit-operation-pop-up',
  templateUrl: './operation-kit-operation-pop-up.component.html',
  styleUrls: ['./operation-kit-operation-pop-up.component.scss']
})
export class OperationKitOperationPopUpComponent implements OnInit {

   // Modal Settings
   dialogOptions: Partial<IModalDialogOptions<any>>;
   public closeDialogSubject: Subject<any>;

   language: string;
   companyCurrency: Currency;

   idOperationKit: number;

   /**
   * Operation Grid columns
   */
   columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.ID_OPERATION_NAVIGATION_NAME,
      title: GarageConstant.OPERATION,
      filterable: true,
      tooltip: GarageConstant.OPERATION
    },
    {
      field: GarageConstant.EXPECTED_DURATION,
      title: GarageConstant.EXPECTED_DURATION_TITLE,
      filterable: true,
      tooltip: GarageConstant.EXPECTED_DURATION_TITLE
    },
    {
      field: GarageConstant.HT_PRICE,
      title: GarageConstant.HT_AMOUNT_TITLE,
      filterable: true,
      tooltip: GarageConstant.HT_AMOUNT_TITLE
    }
  ];

   selectedOperations: any[];
   listOperationIdsToIgnore: number[];

   public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    },
    sort: [
      {
        field: GarageConstant.ID,
        dir: SharedConstant.DESC
      }
    ],
    group: []
  };

   public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

   // Filter
   pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
   predicate: PredicateFormat = new PredicateFormat();
   filterValue = '';



   constructor(public operationService: OperationService, public translateService: TranslateService,
     private companyService: CompanyService, private localStorageService : LocalStorageService) {
        this.language = this.localStorageService.getLanguage();
        }


   ngOnInit() {
    this.companyService.getCurrentCompany().subscribe((data: Company) => {
      this.companyCurrency = data.IdCurrencyNavigation;
    });
     this.predicate = new PredicateFormat();
     this.predicate.Relation = new Array<Relation>();
     this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(GarageConstant.ID_OPERATION_NAVIGATION)]);
     this.initGridDataSource();
   }

   dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
     this.dialogOptions = options;
     this.closeDialogSubject = options.closeDialogSubject;
     this.selectedOperations = this.dialogOptions.data.operationSelected;
     this.listOperationIdsToIgnore = this.dialogOptions.data.listOperationIdsToIgnore;
     this.idOperationKit = this.dialogOptions.data.idOperationKit;
   }

   doFilter() {
    if (this.filterValue) {
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(new Filter(GarageConstant.NAME,
        Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.EXPECTED_DURATION, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.HT_PRICE, Operation.contains, this.filterValue, false, true));
    } else {
      this.predicate.Filter = new Array<Filter>();
    }
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.gridSettings.state.take = NumberConstant.TWENTY;
    this.initGridDataSource();
   }

   /**
    * Intialise Grid with initial state
    */
   initGridDataSource() {
     this.operationService.getOperationsForKitOperation(this.gridSettings.state, this.predicate).subscribe(result => {
      this.gridSettings.gridData = new Object() as DataResult;
      this.gridSettings.gridData.data = result.Data;
      this.gridSettings.gridData.total = result.Total;
     }
     );
   }

   /**
    * change grid data while changing
    * @param state
    */
   dataStateChange(state: State) {
     this.gridSettings.state = state;
     this.initGridDataSource();
   }
   operationIsAlreadyAdded(dataItem): boolean {
     if (this.selectedOperations) {
       return this.selectedOperations.find(x => x.IdOperation === dataItem.IdOperation) ? true : false;
     }
     return false;
   }
   addOperation(dataItem) {
     const index = this.selectedOperations.findIndex(x => x.IdOperation === dataItem.IdOperation);
     if (index < 0) {
       dataItem.IdOperationKit = this.idOperationKit;
       this.selectedOperations.unshift(new OperationKitOperation(dataItem));
       this.listOperationIdsToIgnore.unshift(dataItem.IdOperation);
     }
   }

}
