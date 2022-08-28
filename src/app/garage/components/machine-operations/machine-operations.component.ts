import { Component, ComponentRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Subject } from 'rxjs/Subject';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { OperationService } from '../../services/operation/operation.service';
import { NumberConstant } from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-machine-operations',
  templateUrl: './machine-operations.component.html',
  styleUrls: ['./machine-operations.component.scss']
})
export class MachineOperationsComponent implements OnInit {

  // Modal Settings
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public closeDialogSubject: Subject<any>;

  /**
  * Operation Grid columns
  */
  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.NAME,
      title: GarageConstant.OPERATION,
      filterable: true,
    },
    {
      field: GarageConstant.ID_OPERATION_TYPE_NAVIGATION_TO_NAME,
      title: GarageConstant.OPERATION_TYPE_TITLE,
      filterable: true,
    },
    {
      field: GarageConstant.EXPECTED_DURATION,
      title: GarageConstant.EXPECTED_DURATION_TITLE,
      filterable: true,
    }
  ];
  gridState: State;

  selectedOperations: any[];
  listOperationIdsToIgnore: number[];

  public gridSettings: GridSettings = {
    state: this.initialiseState(),
    columnsConfig: this.columnsConfig,
  };

  // Filter
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  predicate: PredicateFormat = new PredicateFormat();
  filterValue = '';

  initialiseState(): State {
    return {
      skip: 0,
      take: 10,
      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      }
    };
  }

  constructor(private modalService: ModalDialogInstanceService, public operationService: OperationService,
    public translateService: TranslateService) { }


  ngOnInit() {
    this.gridState = this.initialiseState();
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.initGridDataSource();
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.closeDialogSubject = options.closeDialogSubject;
    this.selectedOperations = this.dialogOptions.data.operationSelected;
    this.listOperationIdsToIgnore = this.dialogOptions.data.listOperationIdsToIgnore;
  }

  doFilter() {
    if (this.filterValue) {
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(new Filter(GarageConstant.NAME,
        Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.EXPECTED_DURATION, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ID_OPERATION_TYPE_NAVIGATION_TO_NAME,
        Operation.contains, this.filterValue, false, true));
    } else {
      this.predicate.Filter = new Array<Filter>();
    }
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.gridSettings.state.take = NumberConstant.TWENTY;
    this.initGridDataSource();
  }

  /**
   * Intialise Grid with intial state
   */
  initGridDataSource() {
    this.operationService.reloadServerSideData(this.gridSettings.state , this.predicate).subscribe(data => {
      this.gridSettings.gridData = data;
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
      return this.selectedOperations.find(x => x.Id === dataItem.Id) ? true : false;
    }
    return false;
  }

  addOperation(dataItem) {
    const index = this.selectedOperations.findIndex(x => x.Id === dataItem.Id);
    if (index < 0) {
      dataItem.OperationTypeName = dataItem.IdOperationTypeNavigation ?
        dataItem.IdOperationTypeNavigation.Name : '';
      dataItem.ExpectedDurationFormat = this.operationService.getExpectedDuration(dataItem, this.translateService);
      this.selectedOperations.unshift(dataItem);
      this.listOperationIdsToIgnore.unshift(dataItem.Id);
    }
  }
}
