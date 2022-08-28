import { Component, OnInit, Input } from '@angular/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { FormGroup, FormControl } from '@angular/forms';
import { FileInfo } from '../../../models/shared/objectToSend';
import { CvConstant } from '../../../constant/rh/cv.constant';
import { CandidateService } from '../../services/candidate/candidate.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-cv-document',
  templateUrl: './add-cv-document.component.html',
  styleUrls: ['./add-cv-document.component.scss']
})
export class AddCvDocumentComponent implements OnInit {
  // Format Date
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  @Input() AddCvFormGroup: FormGroup;
  @Input() parentIsDisabled: boolean;
  @Input() canUpdateFile: boolean;
  public isFileArrayReady: boolean;

  public CvFileInfo: Array<FileInfo>;

  constructor(public candidateService: CandidateService, private translate: TranslateService) {
    this.CvFileInfo = new Array<FileInfo>();
  }

  get DepositDate(): FormControl {
    return this.AddCvFormGroup.get(CvConstant.DEPOSIT_DATE) as FormControl;
  }

  get Entitled(): FormControl {
    return this.AddCvFormGroup.get(CvConstant.ENTITLED) as FormControl;
  }

  get CvFileInfoControl() {
    return this.AddCvFormGroup.get(CvConstant.CV_FILE_INFO) as FormControl;
  }

  ngOnInit() {
    if (this.CvFileInfoControl) {
      this.CvFileInfo = this.CvFileInfoControl.value;
      this.isFileArrayReady = true;
    }
    if (this.parentIsDisabled) {
      this.Entitled.disable();
      this.DepositDate.disable();
    }
  }
}
