import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ResourceService } from '../../../../services/resource/resource.service';
import { Resource } from '../../../../../models/shared/ressource.model';
import { CompanyConstant } from '../../../../../constant/Administration/company.constant';

@Component({
  selector: 'app-manage-bank-account',
  templateUrl: './manage-bank-account.component.html',
  styleUrls: ['./manage-bank-account.component.scss']
})
export class ManageBankAccountComponent implements OnInit {

  @Input()
  group: FormGroup;
  @Input()
  service: ResourceService<Resource>;
  @Output()
  formReady = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  /**
 *  Code getter
 */
  get Code(): FormControl {
    return this.group.get(CompanyConstant.CODE) as FormControl;
  }
  /**
   *  Rib getter
   */
  get Rib(): FormControl {
    return this.group.get(CompanyConstant.RIB) as FormControl;
  }
  /**
   *  Iban getter
   */
  get Iban(): FormControl {
    return this.group.get(CompanyConstant.IBAN) as FormControl;
  }
  /**
   *  Bic getter
   */
  get Bic(): FormControl {
    return this.group.get(CompanyConstant.BIC) as FormControl;
  }
  /**
   *  Agence getter
   */
  get Agence(): FormControl {
    return this.group.get(CompanyConstant.AGENCE) as FormControl;
  }
  /**
   *  Locality getter
   */
  get Locality(): FormControl {
    return this.group.get(CompanyConstant.LOCALITY) as FormControl;
  }

}
