import { Component, ComponentRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Subscription } from 'rxjs/Subscription';
import { TrainingConstant } from '../../../constant/rh/training.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { TrainingExpectedSkills } from '../../../models/rh/training-expected-skills.model';
import { Training } from '../../../models/rh/training.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TrainingService } from '../../services/training/training.service';

const ID = 'id';

@Component({
  selector: 'app-training-add',
  templateUrl: './training-add.component.html',
  styleUrls: ['./training-add.component.scss']
})
export class TrainingAddComponent implements OnInit, OnDestroy {
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  public id = 0;
  /*
   * If modal=true
   */
  public isModal: boolean;
  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  /*
   * Data input of the modal
   */
  public data: Training;
  TrainingPictureFileInfo: FileInfo;

  /*
   * if the training is of an internal type
   */
  public posterTrainingSrc: any;
  public trainingFormGroup: FormGroup;
  public training: Training;
  public hasUpdateTrainingPermission: boolean;
  public hasAddTrainingPermission: boolean;
  idSkill: number;
  predicate: PredicateFormat;
  public selectedExpectedSkills: number[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private trainingService: TrainingService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private modalService: ModalDialogInstanceService,
              private validationService: ValidationService,
              private authService: AuthService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params[ID] || 0;
    }));
  }

  /**
   * Intitialise the component
   */
  ngOnInit() {
    this.isUpdateMode = this.id > 0 ? true : false;
    this.hasUpdateTrainingPermission =
    this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_TRAINING);
    this.hasAddTrainingPermission =
    this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TRAINING);
    this.createAddForm();
    if (this.isUpdateMode && !this.hasUpdateTrainingPermission) {
      this.trainingFormGroup.disable();
  }
    if (this.data) {
      this.selectedExpectedSkills = this.data.TrainingExpectedSkills ? this.data.TrainingExpectedSkills.map(x => x.IdSkills) : [];
      // Set the training picture
      if (this.data.TrainingPictureFileInfo) {
        this.posterTrainingSrc = 'data:image/png;base64,' + this.data.TrainingPictureFileInfo.Data;
      }
    }
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
    this.data = this.dialogOptions.data;
    if (this.data) {
      this.isUpdateMode = true;
      this.id = this.data.Id;
    } else {
      this.isUpdateMode = false;
    }
  }

  /**
   * do update or save
   */
  onClickAddTraining() {
    if (this.trainingFormGroup.valid) {
      this.prepareObjectToSend();
      this.subscriptions.push(this.trainingService.save(this.training, !this.isUpdateMode).subscribe(() => {
        if (this.isModal) {
          this.dialogOptions.onClose();
          this.modalService.closeAnyExistingModalDialog();
        } else {
          this.router.navigate([TrainingConstant.CATALOG_URL]);
        }
      }));
    } else {
      this.validationService.validateAllFormFields(this.trainingFormGroup);
    }
  }

  prepareObjectToSend() {
    this.training = Object.assign({}, this.data ? this.data : new Training(), this.trainingFormGroup.value);
    this.training.TrainingPictureFileInfo = this.TrainingPictureFileInfo;
    this.training.TrainingExpectedSkills = new Array<TrainingExpectedSkills>();
    if (this.isUpdateMode) {
      // update mode
      this.prepareExpectedSkillsForUpdateCase();
    } else {
      // add mode
      this.prepareExpectedSkillsForAddCase();
    }
  }

  /**
   * Upload training picture to remplace the default
   * @param event
   */
  uploadPictureFile(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.TrainingPictureFileInfo = new FileInfo();
        this.TrainingPictureFileInfo.Name = file.name;
        this.TrainingPictureFileInfo.Extension = file.type;
        this.TrainingPictureFileInfo.FileData = String(reader.result).split(',')[1];
        this.posterTrainingSrc = reader.result;
      };
    }
  }

  /**
   * Delete training picture and charge the default
   */
  deleteTrainingPicture() {
    this.TrainingPictureFileInfo = new FileInfo();
    this.posterTrainingSrc = null;
  }

  /**
   * get Expected Skills from app-skills-multiselect
   * @param $event
   */
  public selectExpectedSkills($event) {
    this.selectedExpectedSkills = $event.selectedValueMultiSelect;
  }

  prepareExpectedSkillsForAddCase() {
    this.training.TrainingExpectedSkills = [];
    if (this.selectedExpectedSkills.length) {
      this.selectedExpectedSkills.forEach(
        (id) => {
          const traininExpectedSkills = new TrainingExpectedSkills();
          traininExpectedSkills.IdSkills = id;
          traininExpectedSkills.IdTraining = NumberConstant.ZERO;
          this.training.TrainingExpectedSkills.push(traininExpectedSkills);
        }
      );
    }
  }

  public prepareExpectedSkillsForUpdateCase() {
    const trainingExpectedSkillsList = [];
    if (this.selectedExpectedSkills) {
      this.selectedExpectedSkills.forEach((id) => {
        let element = this.data.TrainingExpectedSkills ? this.data.TrainingExpectedSkills.filter(x => x.Id === id)[0] : undefined;
        if (!element) {
          const trainingExpectedSkills = new TrainingExpectedSkills();
          trainingExpectedSkills.IdSkills = id;
          trainingExpectedSkills.IdTraining = NumberConstant.ZERO;
          element = trainingExpectedSkills;
        }
        trainingExpectedSkillsList.push(element);
      });
      if (this.data.TrainingExpectedSkills) {
        this.data.TrainingExpectedSkills.forEach(element => {
          const existe = trainingExpectedSkillsList.filter(x => x.Id === element.Id)[0];
          if (!existe) {
            element.IsDeleted = true;
            trainingExpectedSkillsList.push(element);
          }
        });
      }
    }
    this.training.TrainingExpectedSkills = trainingExpectedSkillsList;
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * create and prepare form
   */
  private createAddForm() {
    this.trainingFormGroup = this.fb.group({
      Id: [this.data ? this.data.Id : NumberConstant.ZERO],
      Name: [this.data ? this.data.Name : '', [Validators.required]],
      Description: [this.data ? this.data.Description : '', [Validators.required]],
      TrainingExpectedSkills: [this.data ? this.data.TrainingExpectedSkills : '']
    });
  }
}
