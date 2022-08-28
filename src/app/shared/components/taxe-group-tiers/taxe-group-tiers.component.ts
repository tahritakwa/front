import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TaxeGroupTiers } from '../../../models/administration/taxe-group-tiers.model';
import { TaxeGroupTiersService } from '../../../sales/services/taxe-group-tiers/sale-group-tiers.service';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { NumberConstant } from '../../../constant/utility/number.constant';



@Component({
  selector: 'app-taxe-group-tiers',
  templateUrl: './taxe-group-tiers.component.html',
  styleUrls: ['./taxe-group-tiers.component.scss']
})
export class TaxeGroupTiersComponent implements OnInit, DropDownComponent {
  @Input() allowCustom;
  @Input() group: FormGroup;
  @Input() isInGrid;
  @Input() isFromFormGroup;
  @Input() disabled;
  @Output() Selected = new EventEmitter<any>();
  @ViewChild(ComboBoxComponent) public taxe: ComboBoxComponent;
  private taxeGroupTiersListDataSource: TaxeGroupTiers[];
  public taxeGroupTiersListFiltredDataSource: TaxeGroupTiers[];
  public selectedValue;
  public isUpdateMode: boolean;
  constructor(private tiersService: TiersService, private taxeGroupTiersService: TaxeGroupTiersService
    , private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef) {
    this.tiersService.getResult().subscribe((data) => {
      if (data.value === true) {
        this.isUpdateMode = data.data;
      }
    });
  }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.taxeGroupTiersService.list().subscribe(data => {
      this.taxeGroupTiersListDataSource = data;
      this.taxeGroupTiersListFiltredDataSource = this.taxeGroupTiersListDataSource.slice(0);
      if (this.isUpdateMode === false) {
        this.selectedValue = this.taxeGroupTiersListFiltredDataSource.filter((s) => s.Code === 'NonExo');
        this.onSelect(this.selectedValue[0].Id);
      }
    });
  }
  public onSelect(event): void {
    if (this.taxeGroupTiersListFiltredDataSource) {
      const selected = this.taxeGroupTiersListFiltredDataSource.filter(taxeGroup => taxeGroup.Id === event)[NumberConstant.ZERO];
      if (this.isFromFormGroup) {
        this.Selected.emit(event);
      } else {
        this.Selected.emit(selected);
      }
    }
  }
  /**
   * Filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.taxeGroupTiersListFiltredDataSource = this.taxeGroupTiersListDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLowerCase().includes(value.toLowerCase()));
  }
  addNew(): void {
    throw new Error('Method not implemented.');
  }
}
