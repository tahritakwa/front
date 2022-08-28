import {Component, ComponentRef, OnInit} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {ExternalTrainerSkills} from '../../../../models/rh/external-trainer-skills.model';
import {TrainingConstant} from '../../../../constant/rh/training.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {SkillsService} from '../../../../payroll/services/skills/skills.service';
import {ExternalTrainer} from '../../../../models/rh/external-trainer.model';
import {ExternalTrainerService} from '../../../services/external-trainer/external-trainer.service';

@Component({
  selector: 'app-add-external-trainer',
  templateUrl: './add-external-trainer.component.html',
  styleUrls: ['./add-external-trainer.component.scss']
})
export class AddExternalTrainerComponent implements OnInit {

  isModal = false;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  externalTrainerFormGroup: FormGroup;
  skillsList: string[];
  externalTrainer: ExternalTrainer;

  constructor(private modalService: ModalDialogInstanceService, private fb: FormBuilder, private validationService: ValidationService,
              private skillsService: SkillsService, private externalTrainerService: ExternalTrainerService) {
  }

  get ExternalTrainerSkills(): FormArray {
    return this.externalTrainerFormGroup.get(TrainingConstant.EXTERNAL_TRAINER_SKILLS) as FormArray;
  }

  ngOnInit() {
    this.getSkills();
    this.createForm();
    this.addExternalTrainerSkillsForm();
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
  }

  getSkills() {
    this.skillsService.list().subscribe((result) => {
      this.skillsList = result.map(x => x.Label);
    });
  }

  createForm() {
    this.externalTrainerFormGroup = this.fb.group({
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Email: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required]],
      YearsOfExperience: [null, [Validators.required]],
      HourCost: [null, [Validators.required]],
      ExternalTrainerSkills: this.fb.array([])
    });
  }

  addExternalTrainerSkillsForm(externalTrainerSkills?: ExternalTrainerSkills) {
    this.ExternalTrainerSkills.push(this.buildExternalTrainerSkillsForm(externalTrainerSkills));
  }

  /**
   * Build training seance form array
   * @param trainingSeance
   */
  buildExternalTrainerSkillsForm(externalTrainerSkills?: ExternalTrainerSkills): FormGroup {
    return this.fb.group({
      Id: [externalTrainerSkills ? externalTrainerSkills.Id : NumberConstant.ZERO],
      Label: [externalTrainerSkills ? externalTrainerSkills.IdSkillsNavigation.Label : '', Validators.required],
      Rate: [externalTrainerSkills ? externalTrainerSkills.Rate : '', Validators.required],
      IsDeleted: [false]
    });
  }

  /**
   * Check if the training seance array is visible
   * @param index
   */
  isExternalTrainerSkillsRowVisible(index: number): boolean {
    return !this.ExternalTrainerSkills.at(index).get(SharedConstant.IS_DELETED).value;
  }

  /**
   * Delete a training seance array
   * @param index
   */
  deleteExternalTrainerSkills(index: number) {
    if (this.ExternalTrainerSkills.at(index).get(SharedConstant.ID).value === NumberConstant.ZERO) {
      this.ExternalTrainerSkills.removeAt(index);
    } else {
      this.ExternalTrainerSkills.at(index).get(SharedConstant.IS_DELETED).setValue(true);
    }
  }

  save() {
    if (this.externalTrainerFormGroup.valid) {
      this.externalTrainer = this.externalTrainerFormGroup.getRawValue();
      this.externalTrainerService.save(this.externalTrainer, true).subscribe((result) => {
        this.dialogOptions.onClose();
        this.modalService.closeAnyExistingModalDialog();
      });
    } else {
      this.validationService.validateAllFormFields(this.externalTrainerFormGroup);
    }
  }

}
