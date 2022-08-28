import {FormControl, FormGroup} from '@angular/forms';
import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {NatureService} from '../../services/nature/nature.service';
import {DropDownComponent} from '../../interfaces/drop-down-component.interface';
import {FormModalDialogService} from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {ReducedNature} from '../../../models/administration/reduced-nature.model';
import {ItemService} from '../../../inventory/services/item/item.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {AddNatureComponent} from '../../../administration/nature/add-nature/add-nature.component';
import {NatureTypesEnum} from '../../../models/shared/enum/natureTypes.enum';
import {ItemConstant} from '../../../constant/inventory/item.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';


@Component({
  selector: 'app-nature-dropdown',
  templateUrl: './nature-dropdown.component.html',
  styleUrls: ['./nature-dropdown.component.scss']
})
export class NatureDropdownComponent implements OnInit, DropDownComponent {
  @Input() itemForm: FormGroup;
  @Input() allowCustom;
  @Input() selectDefaultNature: boolean;
  @Output() TypeSelected = new EventEmitter<boolean>();
  @Output() typeNatureSelected = new EventEmitter<boolean>();
  @Input() isForAddNewItem = false;
  @Input() hasDefaultWarehouse;
  @Input() disabled: boolean;
  public selectedValue;

  public natureDataSource: ReducedNature[];
  public natureFiltredDataSource: ReducedNature[];
  public addNewPermission = false ;

  constructor(private natureService: NatureService,
              private itemService: ItemService,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.initDataSource();
    this.addNewPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_NATURE);
  }

  initDataSource(): void {
    this.natureService.listdropdown().subscribe((data: any) => {
      this.natureDataSource = data.listData;
      this.natureFiltredDataSource = this.natureDataSource.slice(0);
      if (this.isForAddNewItem) {
        this.natureFiltredDataSource = this.natureFiltredDataSource.filter(x => x.Code !== NatureTypesEnum.EXPENSE);
      }
      if (this.selectDefaultNature || this.hasDefaultWarehouse) {
        this.selectedValue = this.natureFiltredDataSource.filter((s) => s.Code === NatureTypesEnum.PRODUCT);
        if (this.selectedValue) {
          this.typeSelected(this.selectedValue[0].Id);
        }
      }
    });
  }

  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.natureFiltredDataSource = this.natureDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  addNew(): void {
    this.formModalDialogService.openDialog('ADD_NATURE', AddNatureComponent, this.viewRef, this.close.bind(this)
      , null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  get IdNature(): FormControl {
    return this.itemForm.get(ItemConstant.ID_NATURE) as FormControl;
  }

  public close(data) {
    if (data) {
      this.natureDataSource = data.data;
      this.natureFiltredDataSource = this.natureDataSource.slice(0);
      this.IdNature.setValue(data.data[data.total - 1].Id);
    }

  }

  /**
   * Fire Change Type Slected
   * @param $event
   */
  public typeSelected($event) {
    this.TypeSelected.emit($event);
    this.selectedValue = this.natureFiltredDataSource.filter((s) => s.Id === $event)[NumberConstant.ZERO];
    this.typeNatureSelected.emit(this.selectedValue);
  }


}

