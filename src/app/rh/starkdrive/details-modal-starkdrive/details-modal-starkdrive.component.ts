import {Component, ComponentRef, OnInit} from '@angular/core';
import {StarkdriveFileService} from '../../services/starkdrive-file/starkdrive-file.service';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FileDrive} from '../../../models/rh/file-drive.model';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {StarkdriveConstant} from '../../../constant/rh/starkdrive.constant';

@Component({
  selector: 'app-details-modal-starkdrive',
  templateUrl: './details-modal-starkdrive.component.html',
  styleUrls: ['./details-modal-starkdrive.component.scss']
})
export class DetailsModalStarkdriveComponent implements OnInit, IModalDialog {

  public data: any;
  public fileDrive: FileDrive;
  public isModal: boolean;
  public options: Partial<IModalDialogOptions<any>>;
  public reference: ComponentRef<IModalDialog>;
  public extension: string;
  public formatDate: string = StarkdriveConstant.FORMAT_DATE;

  constructor(public starkdriveFileService: StarkdriveFileService) {
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.data = options.data;
  }

  initGridDataSource() {
    this.starkdriveFileService.getById(this.data.Id).subscribe(res => {
      this.fileDrive = res;
      this.extension = this.fileDrive.Name.substring(this.fileDrive.Name.indexOf(SharedConstant.DOT) + NumberConstant.ONE);
    });
  }

  ngOnInit() {
    this.initGridDataSource();
  }
}
