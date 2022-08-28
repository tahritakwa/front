import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { ResourceService } from '../../../services/resource/resource.service';
import { Resource } from '../../../../models/shared/ressource.model';
import { FileInfo } from '../../../../models/shared/objectToSend';
import { QualificationConstant } from '../../../../constant/payroll/qualification.constant';
import { CandidateService } from '../../../../rh/services/candidate/candidate.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-qualification',
  templateUrl: './manage-qualification.component.html',
  styleUrls: ['./manage-qualification.component.scss']
})
export class ManageQualificationComponent implements OnInit {
  // Format Date
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);

  @Input() group: FormGroup;
  @Input() service: ResourceService<Resource>;
  @Input() canUpdateFile = true;
  @Output() formReady = new EventEmitter<FormGroup>();
  @Input() parentIsDisabled: boolean;
  public qualificationFileToUpload: Array<FileInfo>;

    constructor(public candidateService: CandidateService, private translate: TranslateService) {
    this.qualificationFileToUpload = new Array<FileInfo>();
  }

  ngOnInit() {
    this.qualificationFileToUpload = new Array<FileInfo>();
    if (this.QualificationFileInfo) {
      this.qualificationFileToUpload = this.QualificationFileInfo.value;
    }
    if (this.parentIsDisabled) {
      this.University.disable();
      this.GraduationYearDate.disable();
      this.IdQualificationCountry.disable();
      this.IdQualificationType.disable();
      this.QualificationDescritpion.disable();
    }
  }

  /**
   * Contract FileInfo getter
   */
  get QualificationFileInfo(): FormControl {
    return this.group.get(QualificationConstant.QUALIFICATION_FILE_INFO) as FormControl;
  }
  /**
   * University getter
   */
  get University(): FormControl {
    return this.group.get(QualificationConstant.UNIVERSITY) as FormControl;
  }

  /**
   * GraduationYearDate getter
   */
  get GraduationYearDate(): FormControl {
    return this.group.get(QualificationConstant.GRADUATION_YEAR_DATE) as FormControl;
  }

  /**
   * QualificationCountry getter
   */
  get IdQualificationCountry(): FormControl {
    return this.group.get(QualificationConstant.ID_QUALIFICATION_COUNTRY) as FormControl;
  }

  /**
   * IdQualificationType getter
   */
  get IdQualificationType(): FormControl {
    return this.group.get(QualificationConstant.ID_QUALIFICATION_TYPE) as FormControl;
  }

  /**
   * QualificationDescritpion getter
   */
  get QualificationDescritpion(): FormControl {
    return this.group.get(QualificationConstant.QUALIFICATION_DESCRIPTION) as FormControl;
  }
}
