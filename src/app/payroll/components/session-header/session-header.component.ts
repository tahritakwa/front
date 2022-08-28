import { Component, OnInit, Input } from '@angular/core';
import { Session } from '../../../models/payroll/session.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-session-header',
  templateUrl: './session-header.component.html',
  styleUrls: ['./session-header.component.scss']
})
export class SessionHeaderComponent implements OnInit {
  TreatmentTypeFormGroup: FormGroup;
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  // Courant session passed from the parent
  @Input()
  courantSession: Session;
  @Input()
  page: string;

  constructor(private formBuilder: FormBuilder, private translate: TranslateService) { }

  ngOnInit() {
    if (this.page === 'payslip') {
      this.createBonusTypeForm();
    }
  }

  private createBonusTypeForm(): void {
    this.TreatmentTypeFormGroup = this.formBuilder.group({
      typeTreatment: ['', Validators.required],
    });
  }

}
