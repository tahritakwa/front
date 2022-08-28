import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { ComponentsConstant } from '../../../constant/shared/components.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { OperationKit } from '../../../models/garage/operation-kit.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { OperationKitService } from '../../services/operation-kit/operation-kit.service';

@Component({
  selector: 'app-opration-kit-multiselect',
  templateUrl: './opration-kit-multiselect.component.html',
  styleUrls: ['./opration-kit-multiselect.component.scss']
})
export class OprationKitMultiselectComponent implements OnInit {

  @Input() itemForm: FormGroup;
  @Input() isCheckboxMode: boolean;
  @Input() public disabled = false;
  @Input() public placeholder = GarageConstant.CHOOSE_AN_OPERATION_KIT_PLACE_HOLDER;
  @Input() selectedValueMultiSelect: number[];
  @Input() limitSelection = NumberConstant.THREE;
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedOneValueFromCheckbox = new EventEmitter<any>();
  @Output() deSelectedOneValueFromCheckbox = new EventEmitter<any>();
  @Output() selectedAllValueFromCheckbox = new EventEmitter<any>();
  operationKitDataSource: OperationKit[];
  public operationKitFiltredDataSource: OperationKit[];
  public dropdownSettings = {};
  constructor(private operationKitService: OperationKitService, private translateService: TranslateService) { }

  ngOnInit() {
    this.initDataSource();
    if (this.isCheckboxMode) {
      this.initCheckboxDropdownMode();
    }
  }

  public initDataSource(): void {
    this.operationKitService.readDropdownPredicateData(new PredicateFormat()).subscribe((data) => {
      this.operationKitDataSource = data;
      this.operationKitFiltredDataSource = this.operationKitDataSource.slice(0);
    });
  }

  public onSelect($event): void {
    this.selected.emit($event);
  }

  handleFilter(value: string): void {
    this.operationKitFiltredDataSource = this.operationKitDataSource.filter((s) =>
      s.Name.toLowerCase().includes(value.toLowerCase())
    );
  }

  public initCheckboxDropdownMode() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: GarageConstant.ID_UPPER_CASE,
      textField: GarageConstant.NAME,
      selectAllText: this.translateService.instant(ComponentsConstant.SELECT_ALL),
      unSelectAllText: this.translateService.instant(ComponentsConstant.DESELECT_ALL),
      itemsShowLimit: this.limitSelection ? this.limitSelection : NumberConstant.THREE,
      allowSearchFilter: true
    };
  }

  onOperationKitSelectFromCheckBox($event) {
    const listSelected: OperationKit = this.operationKitDataSource.find((s) =>
      $event.Id === s.Id);
    this.selectedOneValueFromCheckbox.emit(listSelected);
  }

  onOperationKitDeSelectFromCheckBox($event) {
    const listSelected: OperationKit = this.operationKitDataSource.find((s) =>
      $event.Id === s.Id);
    this.deSelectedOneValueFromCheckbox.emit(listSelected);
  }

  onSelectAllOperationKit($event) {
    const listSelected: OperationKit[] = this.operationKitDataSource.filter((s) =>
      $event.map(x => x.Id).includes(s.Id));
    this.selectedAllValueFromCheckbox.emit(listSelected);
  }

  get ListOperationKit(): FormControl {
    return this.itemForm.get(GarageConstant.LIST_OPERATION_KIT) as FormControl;
  }
}
