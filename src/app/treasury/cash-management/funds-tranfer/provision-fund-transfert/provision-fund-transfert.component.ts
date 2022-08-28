import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileInfo } from '../../../../models/shared/objectToSend';

@Component({
  selector: 'app-provision-fund-transfert',
  templateUrl: './provision-fund-transfert.component.html',
  styleUrls: ['./provision-fund-transfert.component.scss']
})
export class ProvisionFundTransfertComponent implements OnInit {

  @Input() fundTransfertAddFormGroup: FormGroup;
  filesInfos: Array<FileInfo> = new Array<FileInfo>();
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  createForm() {
  }

}
