import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { DropDownComponent } from '../../../shared/interfaces/drop-down-component.interface';
import { ClaimStatus } from '../../../models/helpdesk/claim-status.model';
import { ClaimStatusConstant } from '../../../constant/helpdesk/claim-status.constant';
import { ClaimStatusService } from '../../services/claim-status/claim-status.service';
import { TranslateService } from '@ngx-translate/core';

const STATUS_FOR_CLAIMS = 'getStatusDropdownForClaims';
@Component({
  selector: 'app-claim-status-dropdown',
  templateUrl: './claim-status-dropdown.component.html',
  styleUrls: ['./claim-status-dropdown.component.scss']
})
export class ClaimStatusDropdownComponent implements OnInit, DropDownComponent {
  @Input() parent: FormGroup;
  @Input() FromComponent: boolean;
  @Input() disabled: boolean;
  @Input() allowCustom;
  @Input() placeholder;
  @Input() ClaimStatusName = ClaimStatusConstant.CLAIM_STATUS_NAME;
  @Output() Selected = new EventEmitter<boolean>();

  public claimStatusExternalDataSource: ClaimStatus[];
  //public claimStatusDataSource: ClaimStatus[];
  public claimStatusFiltredDataSource: ClaimStatus[];

  constructor(private claimStatusService: ClaimStatusService, public translationService: TranslateService) { }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.claimStatusService.listdropdown().subscribe((data: any) => {
      //this.claimStatusExternalDataSource = data.listData;
      this.claimStatusExternalDataSource = data.listData;
      this.claimStatusFiltredDataSource = this.claimStatusExternalDataSource.slice(0);
      this.claimStatusFiltredDataSource.forEach(x => {
        const trans = this.translationService.instant(x.TranslationCode);
        x.TranslationCode = trans;
      });
    });
  }

  /**
  * filter by code and label
  * @param value
  */
  handleFilter(value: string): void {
    this.claimStatusFiltredDataSource = this.claimStatusExternalDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  /**
   * on change
   * @param $event
   */
  handleChange($event): void {
    this.Selected.emit($event);
  }
}
