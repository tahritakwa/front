import {Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, ViewChild} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SettlementMode } from '../../../models/sales/settlement-mode.model';
import { SettlementModeService } from '../../../sales/services/settlement-mode/settlement-mode.service';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { TranslationKeysConstant } from '../../../constant/shared/translation-keys.constant';
import { ComponentsConstant } from '../../../constant/shared/components.constant';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { SettlementModeAddComponent } from '../../../payment/settlement-mode-add/settlement-mode-add.component';
import { SettlementMethodService } from '../../../payment/services/payment-method/settlement-method.service';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';


@Component({
  selector: 'app-settlement-mode-drop-down',
  templateUrl: './settlement-mode-drop-down.component.html',
  styleUrls: ['./settlement-mode-drop-down.component.scss']
})
export class SettlementModeDropDownComponent implements OnInit, DropDownComponent {
  @Input() group: FormGroup;
  @Input() allowCustom;
  @Output() Selected = new EventEmitter<any>();
  @Output() SelectedCode = new EventEmitter<any>();
  @Input() openPaymentModal = new EventEmitter<boolean>();
  @Input() selectedValue;
  @Input() isInGrid: boolean;
  @Input() setDefaultValue: boolean;
  @Input() showAddButton: boolean = true;
  @Input() disabled;
  selectedValueWithNoFrom: number;
  public selectedValueMultiSelect: SettlementMode[];
  // Currency List
  private settlementModeDataSource: SettlementMode[];
  public settlementModeFiltredDataSource: SettlementMode[];
  @ViewChild(ComboBoxComponent) public settlementComboBoxComponent: ComboBoxComponent;
  @Input()public addNewLine = true;
  /**
 * contructor
 * @param settlementModeService
 * @param viewRef
 * @param modalOpen
 */
  constructor(private settlementModeService: SettlementModeService, private settlementMethodService: SettlementMethodService,
    private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService) {
    this.settlementMethodService.getResult().subscribe((data) => {
      if (data.value == true) {
        this.selectedValue = { Code: data.data.Code, Id: data.data.Id };
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.initDataSource();
    if (this.selectedValue) {
      this.selectedValueMultiSelect = this.selectedValue;
    }
  }
  public onSelect(event): void {
    this.Selected.emit(event);
    this.SelectedCode.emit(this.settlementModeDataSource.find(x=> x.Id==event).Code);
  }
  public onSelected(event): void {
    this.openPaymentModal.emit(event);
  }
  initDataSource($event?): void {
    this.settlementModeService.list().subscribe(data => {
      this.settlementModeDataSource = data;
      this.settlementModeFiltredDataSource = this.settlementModeDataSource.slice(0);
      if (this.setDefaultValue) {
        if (!this.group.controls['IdSettlementMode'].value) {

          this.Selected.emit(this.settlementModeFiltredDataSource[0].Id);
        }
      }
    });
  }
  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.settlementModeFiltredDataSource = this.settlementModeDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
  }
  addNew() {
    const modalTitle = TranslationKeysConstant.ADD_PAYMENT;
    this.formModalDialogService.openDialog(modalTitle, SettlementModeAddComponent,
      this.viewRef, this.closeModal.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_ML);
  }
  closeModal() {
    this.initDataSource(true);
  }
  get IdSettlementMode(): FormGroup {
    return this.group.get(ComponentsConstant.ID_SETTLEMENT_MODE) as FormGroup;
  }
}
