import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { InterviewConstant } from '../../../constant/rh/interview.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { InterviewType } from '../../../models/rh/interview-type.model';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { OrderBy, OrderByDirection, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { InterviewTypeService } from '../../services/interview-type/interview-type.service';
import { ListInterviewTypeComponent } from '../list-interview-type/list-interview-type.component';

@Component({
  selector: 'app-interview-type-dropdownlist',
  templateUrl: './interview-type-dropdownlist.component.html',
  styleUrls: ['./interview-type-dropdownlist.component.scss']
})
export class InterviewTypeDropdownlistComponent implements OnInit {

  @Input() group;
  @Input() allowCustom;
  @Input() disabled;
  @Output() interviewTypeAdded = new EventEmitter<boolean>();
  interviewTypeDataSource: InterviewType[];
  interviewTypeFiltredDataSource: InterviewType[];
  public hasAddInterviewTypePermission: boolean;


  constructor(private interviewTypeService: InterviewTypeService, private translate: TranslateService,
              private formModalDialogService: FormModalDialogService, private viewContainerRef: ViewContainerRef, private authService: AuthService) {
  }

  get IdInterviewType(): FormControl {
    return this.group.get(InterviewConstant.ID_INTERVIEW_TYPE) as FormControl;
  }

  ngOnInit() {
    this.hasAddInterviewTypePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_INTERVIEWTYPE);
    this.initDataSource();
  }

  initDataSource(): void {
    this.interviewTypeService.readDropdownPredicateData(this.preparePredicate()).subscribe(data => {
      this.interviewTypeDataSource = data;
      this.interviewTypeDataSource.forEach(iT => {
        iT.Label = `${this.translate.instant(iT.Label)}`;
      });
      this.interviewTypeFiltredDataSource = this.interviewTypeDataSource;
    });
  }

  preparePredicate(): PredicateFormat {
    const myPredicate = new PredicateFormat();

    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy,
      [new OrderBy(InterviewConstant.LABEL, OrderByDirection.asc)]);

    return myPredicate;
  }

  addNew(): void {
    const data = {interviewTypeAdded: false};
    this.formModalDialogService.openDialog(InterviewConstant.ADD_OF_INTERVIEW_TYPE, ListInterviewTypeComponent,
      this.viewContainerRef, this.updateTheInterviewTypeDropdownn.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  updateTheInterviewTypeDropdownn(data: any) {
    this.initDataSource();
    this.interviewTypeAdded.emit(true);
  }
}
