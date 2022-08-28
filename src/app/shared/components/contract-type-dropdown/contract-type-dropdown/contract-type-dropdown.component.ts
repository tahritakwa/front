import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {ContractTypeConstant} from '../../../../constant/payroll/contract-type.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {ContractType} from '../../../../models/payroll/contract-type.model';
import {AddContractTypeComponent} from '../../../../payroll/contract-type/add-contract-type/add-contract-type.component';
import {ContractTypeService} from '../../../../payroll/services/contract-type/contract-type.service';
import {DropDownComponent} from '../../../interfaces/drop-down-component.interface';
import {FormModalDialogService} from '../../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {OrderBy, OrderByDirection, PredicateFormat} from '../../../utils/predicate';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-contract-type-dropdown',
  templateUrl: './contract-type-dropdown.component.html',
  styleUrls: ['./contract-type-dropdown.component.scss']
})
export class ContractTypeDropdownComponent implements OnInit, DropDownComponent {
  @Input() group;
  @Input() allowCustom;
  @Input() selectedContractType: number;
  @Output() Selected = new EventEmitter<Boolean>();
  @Output() selected = new EventEmitter<any>();
  @Output() selectedValue = new EventEmitter<any>();
  @Input() disabled;
  @ViewChild(ComboBoxComponent) public contractTypeDropdownComponent: ComboBoxComponent;
  public contractTypeDataSource: ContractType[];
  public contractTypeFiltredDataSource: ContractType[];
  public hasAddPermission: boolean;
  private predicate: PredicateFormat;

  constructor(private contractTypeService: ContractTypeService, private authService: AuthService, private router: Router,
              private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef) {
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_CONTRACTTYPE);
    this.initDataSource();
  }

  initDataSource(): void {
    this.preparePredicate();
    this.contractTypeService.listdropdownWithPerdicate(this.predicate)
      .subscribe((data: any) => {
        this.contractTypeDataSource = data.listData;
        this.contractTypeFiltredDataSource = this.contractTypeDataSource.slice(0);
      });
  }

  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(ContractTypeConstant.CODE, OrderByDirection.asc));
  }

  handleFilter(value: string): void {
    this.contractTypeFiltredDataSource = this.contractTypeDataSource.filter((s) =>
      s.Label.toLowerCase().includes(value.toLowerCase())
      || s.Code.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  getContractTypeCodeById(idContractType: number): String {

    return this.contractTypeFiltredDataSource.find(x => x.Id === idContractType)
      ? this.contractTypeFiltredDataSource.find(x => x.Id === idContractType).Label : '';
  }

  addNew(): void {
    this.formModalDialogService.openDialog(ContractTypeConstant.CONTRACT_TYPE_ADD,
      AddContractTypeComponent,
      this.viewRef,
      this.initDataSource.bind(this),
      true,
      true,
      SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  /**
   * Select event
   * @param event
   */
  onSelect(event) {
    this.selectedValue.emit(event);
    const selected = this.contractTypeDataSource.filter(x => x.Id === event)[0];
    if (selected) {
      this.selected.emit(selected);
      this.Selected.emit(selected.HasEndDate);
    }
  }


}
