import { Component, ComponentRef, OnInit } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subject } from 'rxjs/Subject';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { OperationService } from '../../services/operation/operation.service';

@Component({
  selector: 'app-operations-proposed-pop-up',
  templateUrl: './operations-proposed-pop-up.component.html',
  styleUrls: ['./operations-proposed-pop-up.component.scss']
})
export class OperationsProposedPopUpComponent implements OnInit {

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
      tooltip: GarageConstant.OPERATION
    },
    {
      field: GarageConstant.ID_OPERATION_TYPE,
      title: GarageConstant.OPERATION_TYPE_TITLE,
      filterable: true,
      tooltip: GarageConstant.OPERATION_TYPE_TITLE
    }
  ];
  gridState: State;

  value: any;

  public gridSettings: GridSettings = {
    state: this.initialiseState() ,
    columnsConfig: this.columnsConfig,
  };

  // Filter
  allProposedOperations = [];
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  predicate: PredicateFormat = new PredicateFormat();
  filterValue = '';

  initialiseState(): State {
   return  {
      skip: 0,
      take: 20,
      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      }
    };
  }

  constructor( private operationService: OperationService) { }


  ngOnInit() {
    this.gridState = this.initialiseState();
    this.predicate.Filter = new Array<Filter>();
    this.initGridDataSource();
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.closeDialogSubject = options.closeDialogSubject;
    this.value = this.dialogOptions.data;
  }

  doFilter() {
    if (this.filterValue) {
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(new Filter(GarageConstant.NAME,
        Operation.contains, this.filterValue, false, true));
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
   * Intialise Grid
   */
  initGridDataSource() {
    this.operationService.getProposedOperationWithPredicate(this.gridSettings.state, this.predicate, this.value).subscribe(result => {
      if (result) {
        this.gridSettings.gridData = process(result, this.gridSettings.state);
        this.allProposedOperations = result;
      }
    });
  }


  /**
   * change grid data while changing
   * @param state
   */
  dataStateChange(state: State) {
    this.gridSettings.state = state;
    const list = Object.assign([], this.allProposedOperations);
    this.gridSettings.gridData = process(list, this.gridSettings.state);
  }
}
