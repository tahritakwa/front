import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { GarageConstant } from '../../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { SwalWarring } from '../../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { PredicateFormat, Relation } from '../../../../shared/utils/predicate';
import { RepairOrderService } from '../../../services/repair-order/repair-order.service';
import { SmsTiersService } from '../../../services/sms-tiers/sms-tiers.service';
import { SmsBodyEditorComponent } from '../../sms-body-editor/sms-body-editor.component';

@Component({
  selector: 'app-reminder-sms-list',
  templateUrl: './reminder-sms-list.component.html',
  styleUrls: ['./reminder-sms-list.component.scss']
})
export class ReminderSmsListComponent implements OnInit {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  gridState: State;
  predicate: PredicateFormat = new PredicateFormat();
  generalPredicate: PredicateFormat[] = [];
  public validReceiversArray: any;
  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.SENDER,
      title: GarageConstant.SENDER_TITLE,
      filterable: true,
      tooltip: GarageConstant.SENDER_TITLE
    },
    {
      field: GarageConstant.ID_TIERS,
      title: GarageConstant.CUSTOMER,
      filterable: true,
      tooltip: GarageConstant.CUSTOMER
    },
    {
      field: GarageConstant.VALID_RECEIVERS,
      title: GarageConstant.VALID_RECEIVERS_TITLE,
      filterable: true,
      tooltip: GarageConstant.VALID_RECEIVERS_TITLE
    },
    {
      field: GarageConstant.INVALID_RECEIVERS,
      title: GarageConstant.INVALID_RECEIVERS_TITLE,
      filterable: true,
      tooltip: GarageConstant.INVALID_RECEIVERS_TITLE
    },
    {
      field: GarageConstant.TOTAL_CREDITS_REMOVED,
      title: GarageConstant.CREDITS_REMOVED_TITLE,
      filterable: true,
      tooltip: GarageConstant.CREDITS_REMOVED_TITLE
    }
  ];

  gridSettings: GridSettings = {
    state: this.initialiseState(),
    columnsConfig: this.columnsConfig
  };

  initialiseState() {
    return this.gridState = {
      skip: 0,
      take: 20,
      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      }
    };
  }

  constructor(private repairOrderService: RepairOrderService, public smsTiersService: SmsTiersService,
    private swalWarrings: SwalWarring, private router: Router, private formModalDialogService: FormModalDialogService,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.preparePredicate();
    this.smsTiersService.reloadServerSideDataWithListPredicate(this.gridSettings.state,
      this.generalPredicate, GarageConstant.GET_SMS_LIST).subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  preparePredicate() {
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(GarageConstant.SMS_TIER_NAVIGATION)]);
    this.generalPredicate.push(this.predicate);
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }


  goToAdvancedEdit(id) {
    this.router.navigateByUrl(GarageConstant.NAVIGATE_TO_EDIT_SMS.concat(id));
  }

  openDetail(dataItem) {
    const title = GarageConstant.SMS_BODY;
    const data = { body: dataItem.Body };
    this.formModalDialogService.openDialog(title, SmsBodyEditorComponent,
      this.viewContainerRef, null, data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

}

