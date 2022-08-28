import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TaxeService } from '../../../administration/services/taxe/taxe.service';
import { ReducedTaxe } from '../../../models/administration/reduced-taxe.model';
import { TaxeConstant } from '../../../constant/Administration/taxe.constant';
import { AddTaxeComponent } from '../../../administration/taxe/add-taxe/add-taxe.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
const TAX_COMBOBOX = 'taxComboBox';

@Component({
  selector: 'app-taxe-dropdown',
  templateUrl: './taxe-dropdown.component.html',
  styleUrls: ['./taxe-dropdown.component.scss']
})
export class TaxeDropdownComponent implements OnInit, DropDownComponent {

  @Input() allowCustom;
  @Input() form: FormGroup;
  @Input() selectedValue;
  @Input() TaxeControl = 'IdTaxe';
  @Input() hideAddBtn = true;
  @Output() selected = new EventEmitter<boolean>();
  @Output() selectedItem = new EventEmitter<any>();
  @ViewChild(TAX_COMBOBOX) public taxComboBox: ComboBoxComponent;
  public hasAddTaxePermission: boolean;

  // data sources
  public taxesDataSource: ReducedTaxe[];
  public taxesFiltredDataSource: ReducedTaxe[];

  constructor(private taxeService: TaxeService, private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef, private authService: AuthService) {
  }

  ngOnInit() {
    this.hasAddTaxePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_TAX);
    this.initDataSource();
  }


  public onSelect($event): void {
    this.selected.emit($event);
    const selectedTaxe: ReducedTaxe = this.taxesDataSource.find(x => x.Id === $event);
    this.selectedItem.emit(selectedTaxe);
  }

  initDataSource(): void {
    this.taxeService.listdropdown().subscribe((data: any) => {
      this.taxesDataSource = data.listData;
      this.taxesFiltredDataSource = this.taxesDataSource.slice(0);
    });
  }

  /**
   * filter by name
   * @param value
   */
  /**
   * filter by code taxe and label
   * @param value
   */
  handleFilter(value: string): void {
    this.taxesFiltredDataSource = this.taxesDataSource.filter((s) =>
      s.CodeTaxe.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLowerCase().includes(value.toLowerCase()));
  }

  addNew() {
    this.formModalDialogService.openDialog(TaxeConstant.ADD_TAX, AddTaxeComponent,
      this.viewRef, this.initDataSource.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }
  public openComboBox() {
    this.taxComboBox.toggle(true);
  }
}

