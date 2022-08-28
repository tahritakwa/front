import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ActionConstant} from '../../../constant/payroll/action.constant';
import {AdministrativeDocumentConstant} from '../../../constant/payroll/administrative-document-constant';
import {RecruitmentConstant} from '../../../constant/rh/recruitment.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {RecruitmentLanguage} from '../../../models/rh/recruitment-language.model';
import {RecruitmentSkills} from '../../../models/rh/recruitment-skills.model';
import {Recruitment} from '../../../models/rh/recruitment.model';
import {ObjectToSend} from '../../../models/sales/object-to-save.model';
import {Comment} from '../../../models/shared/comment.model';
import {CreatedData} from '../../../models/shared/created-data.model';
import {EmployeeService} from '../../../payroll/services/employee/employee.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {CommentService} from '../../../shared/services/signalr/comment/comment.service';
import {InformationTypeEnum} from '../../../shared/services/signalr/information/information.enum';
// tslint:disable-next-line: max-line-length
import { MessageAdministrativeDocumentsService } from '../../../shared/services/signalr/message-administrative-documents/message-administrative-documents.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { RecruitmentLanguageService } from '../../services/recruitment-language/recruitment-language.service';
import { RecruitmentSkillsService } from '../../services/recruitment-skills/recruitment-skills.service';
import { RecruitmentService } from '../../services/recruitment/recruitment.service';
import { FileInfo } from '../../../models/shared/objectToSend';
import { StarkPermissionsService } from '../../../stark-permissions/stark-permissions.module';
import { GenericRecruitmentAddComponent } from '../../generic-recruitment-add/generic-recruitment-add.component';
import { JobSkillsService } from '../../../payroll/services/job-skills/job-skills.service';
import { Employee } from '../../../models/payroll/employee.model';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';


@Component({
  selector: 'app-add-recruitment-request-offer',
  templateUrl: './add-recruitment-request-offer.component.html',
  styleUrls: ['./add-recruitment-request-offer.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AddRecruitmentRequestOfferComponent extends GenericRecruitmentAddComponent implements OnInit, OnDestroy {
  public SkillHasError = false;
  idCommentToEdit = NumberConstant.ZERO;
  public employeeAssociated: Employee;
  toEditComent: Comment;
  public validateAllPermission: boolean;
  public hasValidateRecruitmentRequestPermission: boolean;
  public hasRefuseRecruitmentRequestPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasAddPermission: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected router: Router,
    protected recruitmentService: RecruitmentService,
    protected validationService: ValidationService,
    protected recruitmentSkillsService: RecruitmentSkillsService,
    protected recruitmentLanguageService: RecruitmentLanguageService,
    protected translate: TranslateService,
    protected swalWarrings: SwalWarring,
    protected messageAdministrativeDocumentsService: MessageAdministrativeDocumentsService,
    protected employeeService: EmployeeService,
    protected permissionsService: StarkPermissionsService,
    protected commentService: CommentService,
    protected jobSkillsService: JobSkillsService, private growlService: GrowlService,
    protected authService: AuthService,
    private imageCompress: NgxImageCompressService,
    private localStorageService: LocalStorageService  ) {
    super(
      fb,
      router,
      recruitmentService,
      validationService,
      recruitmentSkillsService,
      recruitmentLanguageService,
      translate,
      swalWarrings,
      messageAdministrativeDocumentsService,
      employeeService,
      permissionsService,
      jobSkillsService,
      authService);
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || NumberConstant.ZERO;
    }));
    const url = this.router.url.split(SharedConstant.SLASH);
    this.isRequest = url[NumberConstant.THREE] === RecruitmentConstant.REQUIRMENT_REQUEST;
    this.isOffer = url[NumberConstant.THREE] === RecruitmentConstant.REQUIRMENT_OFFER;
  }

  ngOnInit() {
    this.hasUpdatePermission = this.isRequest ? this.authService.hasAuthority
      (PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENTREQUEST) :  this.authService.hasAuthority
      (PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENTOFFER);
    this.hasAddPermission = this.isRequest ? this.authService.hasAuthority
      (PermissionConstant.RHAndPaiePermissions.ADD_RECRUITMENTREQUEST) :  this.authService.hasAuthority
      (PermissionConstant.RHAndPaiePermissions.ADD_RECRUITMENTOFFER);
    super.ngOnInit();
      this.connectedUser = this.localStorageService.getUser();
      this.employeeService.getEmployeeByEmail(this.connectedUser.Email).subscribe((data: Employee) => {
          this.connectedUser.Employee = data;
          this.employeeAssociated = this.connectedUser.Employee;
      });
    this.createAddForm();
    const url = this.router.url.split(SharedConstant.SLASH);
    this.isUpdateMode = url[NumberConstant.FOUR] === 'edit';
    this.subscriptions.push(this.employeeService
      .getEmployeesHierarchicalList(true, true).subscribe(data => {
        this.EmployeeHierarchy = data.map(x => x.Id);
      }));
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  /***
   * add skills
   */
  addRequestSkills() {
    this.RecruitmentSkills.push(this.buildRequestSkillsForm());
  }

  /***
   * delete skills
   */

  deleteRequestSkills($event: RecruitmentSkills, index: number) {
    if ($event.Id !== NumberConstant.ZERO) {
      this.swalWarrings.CreateSwal(RecruitmentConstant.DELETE_REQUEST_SKILLS).then(result => {
        if (result.value) {
          this.subscriptions.push(this.recruitmentSkillsService.remove($event).subscribe(() => {
            this.RecruitmentSkills.removeAt(index);
          }));
        }
      });
    } else if (this.RecruitmentSkills.at(index).get(RecruitmentConstant.ID).value === NumberConstant.ZERO) {
      this.RecruitmentSkills.removeAt(index);
    }
    this.SkillHasError = false;
  }

  /**
   * add language
   */
  addRequestLanguage() {
    this.RecruitmentLanguage.push(this.buildRequestLanguageForm());
  }

  /**
   * delete language
   * @param $event
   * @param index
   */
  deleteRequestLanguage($event: RecruitmentLanguage, index: number) {
    if ($event.Id !== NumberConstant.ZERO) {
      this.swalWarrings
        .CreateSwal(RecruitmentConstant.DELETE_REQUEST_LANGUAGE)
        .then(result => {
          if (result.value) {
            this.subscriptions.push(this.recruitmentLanguageService.remove($event).subscribe(() => {
              this.RecruitmentLanguage.removeAt(index);
            }));
          }
        });
    } else if (this.RecruitmentLanguage.at(index).get(RecruitmentConstant.ID).value === NumberConstant.ZERO) {
      this.RecruitmentLanguage.removeAt(index);
    }
    this.LanguageHasError = false;
  }

  onSelectSkill($event) {
    let findSkill = this.skills.find(x => x.IdSkills === $event);
    if (findSkill) {
      this.SkillHasError = true;
      this.errorValidationSkill = this.translate.instant('FORM_VALIDATION_UNIQUE');
      findSkill = undefined;
    } else {
      this.errorValidationSkill = '';
      findSkill = undefined;
      this.SkillHasError = false;
      if (!this.isUpdateMode) {
        this.skills.unshift({IdSkills: $event});
      }

    }
  }

  onSelectLanguage($event) {
    const duplicatedLanguages = this.RecruitmentLanguage.controls.filter(x => x.get(RecruitmentConstant.ID_LANGUAGE).value === $event);
    if (duplicatedLanguages.length > NumberConstant.ONE) {
      this.LanguageHasError = true;
      this.errorValidationSkill = this.translate.instant('FORM_VALIDATION_UNIQUE');
    } else {
      this.LanguageHasError = false;
    }
  }

  /**
   * Accept or reject request
   * @param state
   */
  public setRequestState(state) {
    const isValidate = this.checkValidateFormGroup();
    if (this.recruitmentNeedFormGroup.valid && !this.SkillHasError && !this.LanguageHasError && isValidate) {
      this.swalWarrings
        .CreateSwal(this.getSwalText(state), null, AdministrativeDocumentConstant.OKAY).then(result => {
        if (result.value) {
          const requestToSave: Recruitment = new Recruitment();
          if (state !== this.statusCode.Canceled) {
            Object.assign(this.requestOfferToUpdate, this.recruitmentNeedFormGroup.getRawValue());
          }
          Object.assign(requestToSave, this.requestOfferToUpdate);
          requestToSave.RequestStatus = state;
          // Save or update the request
          const objectToSave = new ObjectToSend(requestToSave);
          this.isSaveOperation = true;
          this.subscriptions.push(this.recruitmentService.validateRequest(objectToSave).subscribe((data) => {
            // switch (state) {
            //   case this.statusCode.Accepted: {
            //     this.messageAdministrativeDocumentsService.startSendMessageRHDocuments(
            //       requestToSave,
            //       InformationTypeEnum.VALIDATE_RECRUITMENT_REQUEST,
            //       data,
            //       data.Id,
            //       true,
            //       ActionConstant.VALIDATION
            //     );
            //     break;
            //   }
            //   case this.statusCode.Refused: {
            //     this.messageAdministrativeDocumentsService.startSendMessageRHDocuments(
            //       requestToSave,
            //       InformationTypeEnum.REFUSE_RECRUITMENT_REQUEST,
            //       this.connectedUser.Employee,
            //       this.connectedUser.IdEmployee,
            //       true,
            //       ActionConstant.REJECTION
            //     );
            //     break;
            //   }
            //   case this.statusCode.Canceled: {
            //     this.messageAdministrativeDocumentsService.startSendMessageRHDocuments(
            //       requestToSave,
            //       InformationTypeEnum.CANCEL_RECRUITMENT_REQUEST,
            //       this.connectedUser.Employee,
            //       this.connectedUser.IdEmployee,
            //       true,
            //       ActionConstant.CANCELLATION
            //     );
            //     break;
            //   }
            //   default:
            //     break;
            // }
            this.router.navigate([RecruitmentConstant.REQUEST_LIST_URL]);
          }));
        }
      });
    } else {
      this.validationService.validateAllFormFields(this.recruitmentNeedFormGroup);
    }
  }

  /**
   * Publish or close the job offer
   * @param state
   */
  public setOfferState(state) {
    const isValidate = this.checkValidateFormGroup();
    if (this.recruitmentNeedFormGroup.valid && !this.SkillHasError && !this.LanguageHasError && isValidate) {
      this.swalWarrings.CreateSwal(this.getSwalText(state), null, AdministrativeDocumentConstant.OKAY)
        .then(result => {
          if (result.value) {
            const offerToSave: Recruitment = new Recruitment();
            const requestOfferAssign: Recruitment = Object.assign(this.requestOfferToUpdate, this.recruitmentNeedFormGroup.getRawValue());
            // Save file
            if (this.PictureFileInfo) {
              requestOfferAssign.PictureFileInfo = this.PictureFileInfo;
            }
            Object.assign(offerToSave, this.requestOfferToUpdate);
            offerToSave.OfferStatus = state;
            // open or close the job offer
            const objectToSave = new ObjectToSend(offerToSave);
            this.isSaveOperation = true;
            this.subscriptions.push(this.recruitmentService.OpenOrCloseOffer(objectToSave).subscribe(data => {
              this.router.navigate([RecruitmentConstant.OFFER_LIST_URL]);
            }));
          }
        });
    } else {
      this.validationService.validateAllFormFields(this.recruitmentNeedFormGroup);
    }

  }

  getSwalText(state): string {
    if (this.isRequest) {
      if (state === this.statusCode.Accepted) {
        return RecruitmentConstant.VALIDATE_RECRUITMENT_REQUEST_ALERT;
      }
      if (state === this.statusCode.Refused) {
        return RecruitmentConstant.REFUS_RECRUITMENT_REQUEST_ALERT;
      }
      if (state === this.statusCode.Canceled) {
        return RecruitmentConstant.CANCEL_RECRUITMENT_REQUEST_ALERT;
      }
    }
    if (this.isOffer) {
      if (state === this.offerStatus.Opened) {
        return RecruitmentConstant.OPEN_JOB_OFFER_ALERT;
      }
      if (state === this.offerStatus.Closed) {
        return RecruitmentConstant.CLOSE_JOB_OFFER_ALERT;
      }
    }
  }

  /**
   * Upload Picture Related To Job offer
   * @param event
   */
  public uploadPictureFile(event) {
    const file = event.target.files[NumberConstant.ZERO];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.PictureFileInfo = new FileInfo();
        this.PictureFileInfo.Name = file.name;
        this.PictureFileInfo.Extension = file.type;
        this.OfferPicture = reader.result;
        this.compressFile(reader.result);
      };
    }
  }

  compressFile(image) {
    var orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
        this.PictureFileInfo.FileData = (result).split(',')[1];
      });
  }

  /**
   * Delete offer  picture and charge the default
   */
  deleteOfferPicture() {
    this.PictureFileInfo = new FileInfo();
    this.OfferPicture = null;
  }

  validCommentary(): boolean {
    if (this.Message.value) {
      return this.Message.value.replace(/^\s+|\s+$/g, '') === '';
    } else {
      return true;
    }
  }

  deletecomment(idComment: number) {
    const element = this.commentsData.find(x => x.Id === idComment);
    if (element && element.Employee.Id === this.connectedUser.IdEmployee) {
      this.commentService.remove(element).subscribe(() => {
        const index = this.commentsData.findIndex(x => x.Id === idComment);
        this.commentsData.splice(index, NumberConstant.ONE);
        this.Message.reset();
      });
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.UNAUTHRIZED_ERROR_MSG));
    }
  }

  editcomment(idComment: number ) {
    const element = this.commentsData.find(x => x.Id === idComment);
    if (element && element.Employee.Id === this.connectedUser.IdEmployee) {
      this.Message.setValue(element.Message);
      this.idCommentToEdit = element.Id;
      this.toEditComent = element;
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.UNAUTHRIZED_ERROR_MSG));
    }
  }

  /**
   * Add comment
   */
  private addComment(): void {
    if (this.Message.value) {
      // Prepare comment entity
      const commentEntity: Comment = new Comment();
      commentEntity.Id = NumberConstant.ZERO;
      if (this.toEditComent) {
        Object.assign(commentEntity, this.toEditComent);
      }
      commentEntity.Message = (this.Message.value as string).replace('\n', '<br>');
      commentEntity.CreationDate = new Date();
      commentEntity.IdEntityCreated = this.id;
      commentEntity.EmailCreator = this.connectedUser.Email;
      commentEntity.EntityName = RecruitmentConstant.ENTITY_NAME;
      this.subscriptions.push(this.commentService.save(commentEntity, this.idCommentToEdit === NumberConstant.ZERO).subscribe(res => {
        if (res) {
          const createdData: CreatedData = new CreatedData(this.requestOfferToUpdate.Id, this.requestOfferToUpdate.Code);
          this.commentService.addCommentAndSendNotifTheSuperior(
            commentEntity,
            this.requestOfferToUpdate.IdEmployeeAuthor,
            createdData,
            InformationTypeEnum.ADD_COMMENT_RECRUITMENT_REQUEST,
            true
          );
          if (this.idCommentToEdit) {
            const index = this.commentsData.findIndex(x => x.Id === this.idCommentToEdit);
            this.commentsData[index] = commentEntity;
            this.idCommentToEdit = NumberConstant.ZERO;
            this.toEditComent = null;
            this.Message.reset();
          } else {
            res = this.getSrcPictureEmployee(res);
            this.Message.reset();
            this.commentsData.push(res);
          }
        }
      }));
    }
  }
}
