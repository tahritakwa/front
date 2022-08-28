import {FormGroup, FormControl, FormArray} from '@angular/forms';
import {
  Component, Input, EventEmitter, Output, ViewChild
} from '@angular/core';
import {AddClaimComponent} from '../../claim/add-claim/add-claim.component';
import {TranslateService} from '@ngx-translate/core';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';

const TYPE_COMBOBOX = 'type';

@Component({
  selector: 'app-add-claim-interaction',
  templateUrl: './add-claim-interaction.component.html',
  styleUrls: ['./add-claim-interaction.component.scss']
})
export class AddClaimInteractionComponent {
  @Input() ClaimInteractionStorage: FormGroup;
  @Output() formReady = new EventEmitter<FormGroup>();
  @Input() public listInteractionItems: Array<string> = ['E-mail', 'Courrier', 'Telephone'];
  @Output() public selectedInteractionValue;
  @ViewChild(TYPE_COMBOBOX) public typeCombobox: ComboBoxComponent;


  constructor(public claim: AddClaimComponent, public translateService: TranslateService) {
    this.listInteractionItems = [translateService.instant('EMAIL'),
      translateService.instant('POSTAL_MAIL'),
      translateService.instant('PHONE'),
      translateService.instant('FAX'),];
      this.listInteractionItems.sort();
      this.listInteractionItems.push(translateService.instant('OTHER'));

  }

  public openCombobox() {
    this.typeCombobox.toggle(true);
  }
}
