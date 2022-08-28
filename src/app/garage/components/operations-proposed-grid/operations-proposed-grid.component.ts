import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { r } from '@angular/core/src/render3';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Company } from '../../../models/administration/company.model';
import { OperationStatusEnumerator } from '../../../models/enumerators/operation-status.enum';
import { OperationValidateByEnumerator } from '../../../models/enumerators/operation-validate-by.enum';
import { InterventionOperation } from '../../../models/garage/intervention-operation.model';
import { RepairOrderOperation } from '../../../models/garage/repair-order-operation.model';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { OperationService } from '../../services/operation/operation.service';

@Component({
  selector: 'app-operations-proposed-grid',
  templateUrl: './operations-proposed-grid.component.html',
  styleUrls: ['./operations-proposed-grid.component.scss']
})
export class OperationsProposedGridComponent implements OnInit, OnChanges {
  @Input() idIntervention: number;
  @Input() idRepairOrder: number;
  @Input() idMileageProgrammed: number;
  @Input() companyCurrency: Company;
  @Input() language: string;
  @Input() isUpdateMode: boolean;
  @Input() isInterventionCompleted: boolean;
  @Input() isRepairOrderValid: boolean;
  @Input() isForRepairOrder: boolean;
  @Input() interventionOperations: InterventionOperation[];
  @Input() repairOrderOperations: RepairOrderOperation[];
  @Input() hasUpdatePermission: boolean;
  @Output() idAddedOperation: EventEmitter<number> = new EventEmitter<number>();
  
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  // The list of selected operations in the grid
  public operationsIdsSelected: number[] = [];

  allProposedOperations = [];
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  predicate: PredicateFormat = new PredicateFormat();
  operationValidateByEnumerator = OperationValidateByEnumerator;
  operationStatusEnumerator = OperationStatusEnumerator;
  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.NAME,
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
      field: GarageConstant.HT_PRICE_TITLE,
      title: GarageConstant.HT_PRICE,
      filterable: true,
      tooltip: GarageConstant.HT_PRICE_TITLE
    },
    {
      field: GarageConstant.TTC_PRICE,
      title: GarageConstant.TTC_AMOUNT_TITLE,
      filterable: true,
      tooltip: GarageConstant.TTC_AMOUNT_TITLE
    },
    {
      field: GarageConstant.STATUS,
      title: GarageConstant.STATE_TITLE,
      filterable: true,
      tooltip: GarageConstant.STATE_TITLE
    }
  ];

  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      filters: [],
      logic: 'and'
    },
    group: []
  };

  gridSettings: GridSettings = { state: this.gridState, columnsConfig: this.columnsConfig };

  constructor(public operationService: OperationService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes['idMileageProgrammed']) {
      this.initGridDataSource();
    }
  }

  public initGridDataSource() {
    this.operationService.getProposedOperationWithPredicate(this.gridSettings.state, this.predicate,
      this.idMileageProgrammed).subscribe(res => {
        if (res) {
          this.gridSettings.gridData = process(res, this.gridSettings.state);
          this.allProposedOperations = res;
        }
      });
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    const list = Object.assign([], this.allProposedOperations);
    this.gridSettings.gridData = process(list, this.gridSettings.state);
  }

  addItemToEffectedOperationsGrid(dataItem: any) {
    if (!this.isForRepairOrder) {
      if (!this.interventionOperations.find(x => x.IdOperation === dataItem.Id)) {
        const interventionOperation = this.createInterventionOperationFromOperation(dataItem);
        this.interventionOperations.unshift(interventionOperation);
        this.idAddedOperation.emit(interventionOperation.IdOperation);
      }
    } else {
      if (!this.repairOrderOperations.find(x => x.IdOperation === dataItem.Id)) {
        const repairOrderOperation = this.createRepairOrderOperationFromOperation(dataItem);
        this.repairOrderOperations.unshift(repairOrderOperation);
        this.idAddedOperation.emit(repairOrderOperation.IdOperation);
      }
    }
  }

  private createInterventionOperationFromOperation(dataItem): InterventionOperation {
    const interventionOperation = new Object() as InterventionOperation;
    interventionOperation.Id = 0;
    interventionOperation.IdIntervention = this.idIntervention;
    interventionOperation.IdOperation = dataItem.Id;
    interventionOperation.IdOperationNavigation = dataItem;
    interventionOperation.Ttcprice = dataItem.Ttcprice;
    interventionOperation.Duration = dataItem.ExpectedDuration;
    interventionOperation.Status = this.operationStatusEnumerator.New;
    if (!this.idIntervention) {
      interventionOperation.ValidateBy = this.operationValidateByEnumerator.ValidateByUser;
    } else {
      interventionOperation.ValidateBy = this.operationValidateByEnumerator.ValidateByPhone;
    }
    return interventionOperation;
  }

  private createRepairOrderOperationFromOperation(dataItem): RepairOrderOperation {
    const repairOrderOperation = new Object() as RepairOrderOperation;
    repairOrderOperation.Id = 0;
    repairOrderOperation.IdRepairOrder = this.idRepairOrder;
    repairOrderOperation.IdOperation = dataItem.Id;
    repairOrderOperation.IdOperationNavigation = dataItem;
    repairOrderOperation.Htprice = dataItem.Htprice;
    repairOrderOperation.Duration = dataItem.ExpectedDuration;
    return repairOrderOperation;
  }

  operationIsAlreadyAdded(dataItem): boolean {
    if (!this.isForRepairOrder && this.interventionOperations && dataItem) {
      return this.interventionOperations.find(x => x.IdOperation === dataItem.Id) ? true : false;
    }
    else if (this.isForRepairOrder && this.repairOrderOperations && dataItem) {
      return this.repairOrderOperations.find(x => x.IdOperation === dataItem.Id) ? true : false;
    }
    return false;
  }

  addAllSelectedItemsToList() {
    if (this.operationsIdsSelected.length > 0) {
      this.operationsIdsSelected.forEach(id => {
        const dataItem = this.allProposedOperations.filter(x => x.Id === id)[0];
        this.addItemToEffectedOperationsGrid(dataItem);
      });
      this.operationsIdsSelected = this.operationsIdsSelected.filter((e) => !this.allProposedOperations
        .map(x => x.Id).includes(e));
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    }
  }

  /**
   * this method aims to select all elements of the grid or deselect it
   */
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    let allIds = [];
    if (!this.isForRepairOrder) {
      allIds = Object.assign([], this.allProposedOperations.map(x => x.Id).filter(x =>
        !this.interventionOperations.map(y => y.IdOperation).includes(x)));
    } else {
      allIds = Object.assign([], this.allProposedOperations.map(x => x.Id).filter(x =>
        !this.repairOrderOperations.map(y => y.IdOperation).includes(x)));
    }
    if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
      this.operationsIdsSelected = this.operationsIdsSelected.concat(allIds.filter((e) => !this.operationsIdsSelected.includes(e)));
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      this.operationsIdsSelected = this.operationsIdsSelected.filter((e) => !allIds.includes(e));
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    }
  }

  public onSelectedKeysChange($event) {
    const selectionLength = this.operationsIdsSelected.length;
    let allItemLength = 0;
    if (!this.isForRepairOrder) {
      allItemLength = this.allProposedOperations.map(x => x.Id).filter(x =>
        !this.interventionOperations.map(y => y.IdOperation).includes(x)).length;
    } else {
      allItemLength = this.allProposedOperations.map(x => x.Id).filter(x =>
        !this.repairOrderOperations.map(y => y.IdOperation).includes(x)).length;
    }
    if (selectionLength === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (selectionLength > NumberConstant.ZERO && selectionLength === allItemLength) {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    }
  }

  checkSelectAllVisibility() {
    return (this.allProposedOperations.length > 0 &&
      this.operationsIdsSelected.length <= this.allProposedOperations.length) ? true : false;
  }
}
