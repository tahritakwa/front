import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { DocumentRequestTypeService } from '../../../payroll/services/document-request-type/document-request-type.service';
import { DocumentRequestType } from '../../../models/payroll/document-request-type.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { DocumentRequestConstant } from '../../../constant/payroll/document-request.constant';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { DocumentRequestTypeComponent } from '../document-request-type/document-request-type.component';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { isNullOrUndefined } from 'util';
import { notEmptyValue } from '../../../stark-permissions/utils/utils';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { OrderBy, OrderByDirection, PredicateFormat } from '../../utils/predicate';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-document-request-type-dropdown',
  templateUrl: './document-request-type-dropdown.component.html',
  styleUrls: ['./document-request-type-dropdown.component.scss']
})
export class DocumentRequestTypeDropdownComponent implements OnInit {
  @Input() group;
  @Input() allowCustom;
  public DocumentRequestTypeDataSource: DocumentRequestType [];
  public  DocumentRequestTypeFiltredDataSource: DocumentRequestType [];
  public showAddButton = false;
  @ViewChild(ComboBoxComponent) public documentRequestTypeDropdownComponent: ComboBoxComponent;
  @Input() InGrid;
  @Output() selectedValue = new EventEmitter<any>();
  public predicate: PredicateFormat;
  @Input() disabled:boolean;


  constructor(private documentRequestTypeService: DocumentRequestTypeService,
    private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService, private roleService: StarkRolesService) { }

  ngOnInit() {
    this.initDataSource();
    this.roleService.ListRoleConfigsAsObservable().subscribe((roledata: Array<any>) => {
      if (!isNullOrUndefined(roledata) && notEmptyValue(roledata)) {
        this.roleService.hasOnlyRoles([RoleConfigConstant.Resp_RhConfig, RoleConfigConstant.ManagerConfig]).then( y  => {
          this.showAddButton = y;
        });
      }
  });
  }

  initDataSource(): void {
    this.preparePredicate();
    this.documentRequestTypeService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
      this.DocumentRequestTypeDataSource = data.listData;
      this.DocumentRequestTypeFiltredDataSource = this.DocumentRequestTypeDataSource.slice(0);
    });
  }

  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.LABEL, OrderByDirection.asc));
  }
  /**
   * filter by Code or Label
   * @param value
   */
  handleFilter(value: string): void {
    this.DocumentRequestTypeDataSource = this.DocumentRequestTypeDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase()) || s.Label.toLowerCase().includes(value.toLowerCase()));
  }

  /**
   * Add new Document request type
   */
  addNew(): void {
    this.formModalDialogService.openDialog(DocumentRequestConstant.DOCUMENT_REQUEST_TYPE_TITLE, DocumentRequestTypeComponent,
      this.viewRef, this.initDataSource.bind(this), null, null, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  onSelect(event) {
    this.selectedValue.emit(event);
  }

}
