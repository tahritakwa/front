import {Component, ComponentRef, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StatusConstant} from '../../../../constant/crm/status.constant';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {StatusOpportunityService} from '../../../services/list-status-opportunity/status-opportunity.service';
import {StyleConfigService} from '../../../../shared/services/styleConfig/style-config.service';
import {StatusOpportunity} from '../../../../models/crm/status-opportunity.model';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {uniquePropCrmJavaServices} from '../../../../shared/services/validation/validation.service';
import {Observable} from 'rxjs/Observable';
import {GenericCrmService} from '../../../generic-crm.service';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {UrlServicesService} from '../../../services/url-services.service';

const NAME_REFERENCE = 'name';

@Component({
  selector: 'app-add-status',
  templateUrl: './add-status.component.html',
  styleUrls: ['./add-status.component.scss']
})
export class AddStatusComponent implements OnInit {
  statusFormGroup: FormGroup;
  isUpdateMode: boolean;

  /**
   To hold the id in the update mode
   */
  private id = 0;
  /**
   * To Hold the color to be persisted
   */
  color = '#fff';

  public isModal: boolean;
  @ViewChild(NAME_REFERENCE) public nameInput: ElementRef;
  private colorAlreadyExists: boolean;
  dialogOptions: Partial<IModalDialogOptions<any>>;

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
  }

  constructor(private statusOpportunityService: StatusOpportunityService,
              private formBuilder: FormBuilder,
              private modalService: ModalDialogInstanceService,
              private styleConfigService: StyleConfigService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private growlService: GrowlService,
              private genericCrmService: GenericCrmService,
              private urlService: UrlServicesService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.checkMode();
    this.createAddFormGroup();
    this.colorChange();
  }

  checkMode() {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
      if (this.id > 0) {
        this.isUpdateMode = true;
        this.getDataToUpdate();
      }
    });
  }

  getDataToUpdate() {
    if (this.isUpdateMode) {
      this.statusOpportunityService.getJavaGenericService().getEntityById(this.id).subscribe((data) => {
        if (data) {
          this.color = data.color;
          this.statusFormGroup.patchValue(data);
        }
      });
    }
  }

  createAddFormGroup() {
    const actionToDo = this.isUpdateMode ? CrmConstant.UPDATED_ELEMENT : CrmConstant.INSERTED_ELEMENT;
    this.statusFormGroup = this.formBuilder.group({
      id: [0],
      title: ['', {
        validators: [Validators.required],
        asyncValidators: uniquePropCrmJavaServices(StatusConstant.TITLE, this.statusOpportunityService, actionToDo), updateOn: 'blur'
      }],
      color: ['', Validators.required]
    });
  }

  colorChange() {
    if (this.statusFormGroup) {
      this.statusFormGroup.controls[StatusConstant.COLOR].setValue(this.color);
    }
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  save() {
    if ((this.statusFormGroup as FormGroup).valid) {
      const statusOpportunity: StatusOpportunity = this.statusFormGroup.value;
      if (!this.isUpdateMode) {
        this.statusOpportunityService.getJavaGenericService().saveEntity(statusOpportunity).subscribe((data) => {
          if (data) {
            this.growlService.successNotification(this.translate.instant(SharedCrmConstant.SUCCESS_OPERATION));
            this.closeOrBackToList(data);
          }
        });
      } else {
        this.statusOpportunityService.getJavaGenericService()
          .updateEntity(statusOpportunity, statusOpportunity.id).subscribe((data) => {
          if (data) {
            this.growlService.successNotification(this.translate.instant(SharedCrmConstant.SUCCESS_OPERATION));
            this.closeOrBackToList(data);
          }
        });
      }
    }
  }

  onMouseOut() {
    this.nameInput.nativeElement.blur();
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericCrmService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupChanged.bind(this));
  }

  private isFormGroupChanged(): boolean {
    return this.statusFormGroup.touched;
  }

  closeOrBackToList(data) {
    if (this.isModal) {
      this.dialogOptions.data = data;
      this.modalService.closeAnyExistingModalDialog();
      this.dialogOptions.onClose();
    } else {
      this.router.navigateByUrl(StatusConstant.STATUS_LIST_URL);
      this.modalService.closeAnyExistingModalDialog();
    }
  }
}
