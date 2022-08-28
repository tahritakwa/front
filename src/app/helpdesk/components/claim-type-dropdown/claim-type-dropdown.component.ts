import {FormGroup, FormControl} from '@angular/forms';
import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {PredicateFormat, Filter, Relation, OrderBy, OrderByDirection} from '../../../shared/utils/predicate';
import {DropDownComponent} from '../../../shared/interfaces/drop-down-component.interface';
import {isNullOrUndefined} from 'util';
import {ClaimType} from '../../../models/helpdesk/claim-type.model';
import {ClaimConstant} from '../../../constant/helpdesk/claim.constant';
import {ClaimTypeService} from '../../services/claim-type/claim-type.service';
import {TranslateService} from '@ngx-translate/core';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';



const TYPE_FOR_CLAIMS = 'getTypeDropdownForClaims';
const TYPE_COMBOBOX = 'typeComboBox';
const CODE_TYPE ='CodeType';
@Component({
  selector: 'app-claim-type-dropdown',
  templateUrl: './claim-type-dropdown.component.html',
  styleUrls: ['./claim-type-dropdown.component.scss']
})
export class ClaimTypeDropdownComponent implements OnInit, DropDownComponent {
  @Input() parent: FormGroup;
  @Input() FromComponent: boolean;
  @Input() disabled: boolean;
  @Input() allowCustom;
  @Input() allowCustomData;
  @Input() typePlaceholder;
  @Input() placeholder;
  @Input() SelectedValue: number;
  @Input() ExternalDataSource: Array<ClaimType>;
  @Input() ClaimTypeName = ClaimConstant.CLAIM_TYPE_NAME;
  @ViewChild(ComboBoxComponent) public typeComboBox: ComboBoxComponent;

  public claimTypeDataSource: ClaimType[];
  public claimTypeExternalDataSource: ClaimType[];
  public claimTypeFiltredDataSource: ClaimType[];
  public listOfAllclaimTypeDataSource: ClaimType[];
  predicate: PredicateFormat;
  @Output() Selected = new EventEmitter<boolean>();
  @Output() Focused = new EventEmitter<boolean>();
  ClaimType: any[];

  ClaimTypeSelected;

  constructor(private claimTypeService: ClaimTypeService, public translationService: TranslateService) {
  }

  ngOnInit() {
    this.initDataSource();
    this.ClaimTypeSelected = this.SelectedValue;
  }

  get IdClaimType(): FormControl {
    return this.parent.get(ClaimConstant.CLAIM_TYPE_NAME) as FormControl;
  }


  public initDataSource(): void {
    if (this.allowCustom) {
      this.claimTypeExternalDataSource = this.ExternalDataSource;
      this.claimTypeDataSource = this.claimTypeExternalDataSource;
      this.listOfAllclaimTypeDataSource = this.claimTypeExternalDataSource;
      if (!isNullOrUndefined(this.claimTypeDataSource)) {
        this.claimTypeFiltredDataSource = this.claimTypeDataSource.slice(0);
        this.claimTypeFiltredDataSource.forEach(claim => {
          this.translateClaimCode(claim);
        });
        this.claimTypeFiltredDataSource.sort((a,b)=> a.TranslationCode.localeCompare(b.TranslationCode));
      }
    } else {
      this.claimTypeService.listdropdown().subscribe(
        (data: any) => {
          this.claimTypeExternalDataSource = new Array<ClaimType>();
          this.claimTypeExternalDataSource = data.listData;
          this.claimTypeExternalDataSource.forEach(claim => {
            this.translateClaimCode(claim);
          });
          this.claimTypeDataSource = this.claimTypeExternalDataSource;
          this.listOfAllclaimTypeDataSource = this.claimTypeExternalDataSource;
          if (!isNullOrUndefined(this.claimTypeDataSource)) {
            this.claimTypeFiltredDataSource = this.claimTypeDataSource.slice(0);
            this.claimTypeFiltredDataSource.forEach(claim => {
              this.translateClaimCode(claim);
            });
             this.claimTypeFiltredDataSource.sort((a,b)=> a.TranslationCode.localeCompare(b.TranslationCode));
          }
        });
    }
  }

  handleFilter(value: string): void {
    this.claimTypeFiltredDataSource = this.ExternalDataSource.filter((s) =>
      s.Type.toLowerCase().includes(value.toLowerCase())
      || s.CodeType.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  addNew(): void {
    throw new Error('Method not implemented.');
  }

  onSelect($event) {
    this.Selected.emit($event);
  }

  public onFocus(event): void {
    if (this.typeComboBox) {
      this.typeComboBox.toggle(true);
    }
    this.Focused.emit(event);
  }

  public initDataSource2(): void {
    this.claimTypeService.listdropdown().subscribe((data: any) => {
      this.claimTypeDataSource = data.listData;
      this.listOfAllclaimTypeDataSource = data.listData;
      this.claimTypeFiltredDataSource = this.claimTypeDataSource.slice(0);
    });
  }

  public translateClaimCode(claim) {
    claim.TranslationCode = this.translationService.instant(claim.TranslationCode);
  }
}
