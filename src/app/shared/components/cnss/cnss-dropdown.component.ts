import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {CnssConstant} from '../../../constant/payroll/cnss.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {ReducedCnss} from '../../../models/payroll/reduced-cnss.model';
import {AddCnssComponent} from '../../../payroll/cnss-type/add-cnss/add-cnss.component';
import {CnssService} from '../../../payroll/services/cnss/cnss.service';
import {FormModalDialogService} from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {OrderBy, OrderByDirection, PredicateFormat} from '../../utils/predicate';
import {PermissionConstant} from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-cnss-dropdown',
  templateUrl: './cnss-dropdown.component.html',
  styleUrls: ['./cnss-dropdown.component.scss']
})
export class CnssDropdownComponent implements OnInit {
  @Input() group;
  @Input() allowCustom;
  @Output() Selected = new EventEmitter<any>();
  @Output() selectedValue = new EventEmitter<any>();
  public cnssDataSource: ReducedCnss[];
  public cnssFiltredDataSource: ReducedCnss[];
  public hasAddPermission: boolean;
  private predicate: PredicateFormat;


  constructor(private cnssTypeService: CnssService, private formModalDialogService: FormModalDialogService,
              private viewContainerRef: ViewContainerRef, private authService: AuthService) {
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_CNSS);
    this.initDataSource();
  }

  initDataSource(): void {
    this.preparePredicate();
    this.cnssTypeService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
      this.cnssDataSource = data.listData;
      this.cnssFiltredDataSource = this.cnssDataSource.slice(0);
    });
  }

  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.LABEL, OrderByDirection.asc));
  }

  /**
   * filter by label
   * @param value
   */
  handleFilter(value: string): void {
    this.cnssFiltredDataSource = this.cnssDataSource.filter((s) =>
      s.Label.toLowerCase().includes(value.toLowerCase()));
  }

  onValueChange(event) {
    const selected = this.cnssFiltredDataSource.filter(x => x.Id === event)[0];
    if (selected) {
      this.Selected.emit(selected);
    }
  }

  addNew(): void {
    const TITLE = CnssConstant.ADD_CNSS;
    this.formModalDialogService.openDialog(TITLE, AddCnssComponent, this.viewContainerRef, this.initDataSource.bind(this), null, true,
      SharedConstant.MODAL_DIALOG_SIZE_M);
  }

}
