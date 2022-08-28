import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cash-register-general-section',
  templateUrl: './cash-register-general-section.component.html',
  styleUrls: ['./cash-register-general-section.component.scss']
})
export class CashRegisterGeneralSectionComponent implements OnInit {
  cashRegisterFormGroup: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createLineFormGroup();
  }

  createLineFormGroup() {
    this.cashRegisterFormGroup = this.fb.group({
      Id: [0]
  });
  }

}
