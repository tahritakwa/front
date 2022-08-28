import {Component, ComponentRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {Opportunity} from '../../../models/crm/opportunity.model';
import {OpportunityService} from '../../services/opportunity.service';

@Component({
  selector: 'app-status-change',
  templateUrl: './status-change.component.html',
  styleUrls: ['./status-change.component.scss']
})
export class StatusChangeComponent implements OnInit {
  /*
 * Form Group
 */
  opportinityFormGroup: FormGroup;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public disabledOpportinityParent: boolean;

  constructor(private formBuilder: FormBuilder,
    private opportunityService: OpportunityService,
    private modalService: ModalDialogInstanceService, ) {
  }
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
  }

  save() {
    const valueToSend = this.opportinityFormGroup.value as Opportunity;
    this.modalService.closeAnyExistingModalDialog();
  }

  /**
   * Create Bonus form
   * @param bonus
   */
  private validateStatusChange(): void {
    this.opportinityFormGroup = this.formBuilder.group({
      description: [''],
    });
  }
  /**Select warehouse Source */
  zoneFocused($event) {
    // Init list of warehouse data source
    $event.warehouseDataSource = [];
    $event.warehouseDataSource = $event.warehouseDataSource.concat($event.listOfAllWarehouseDataSource.filter(
      w => (w.IsCentral || !w.IsWarehouse)));
  }
  ngOnInit() {
    this.validateStatusChange();
  }
}
