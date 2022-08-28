import { Component, ComponentRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subject } from 'rxjs/Subject';
import { SharedConstant } from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-contract-informations',
  templateUrl: './contract-informations.component.html',
  styleUrls: ['./contract-informations.component.scss']
})
export class ContractInformationsComponent implements OnInit {
  public reference: ComponentRef<IModalDialog>;
  public options: Partial<IModalDialogOptions<any>>;
  public isModal: boolean;
  public data: any;
  public closeDialogSubject: Subject<any>;

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private translate: TranslateService) { }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.data = options.data;


    this.closeDialogSubject = options.closeDialogSubject;
  }

  ngOnInit() {
  }

}
