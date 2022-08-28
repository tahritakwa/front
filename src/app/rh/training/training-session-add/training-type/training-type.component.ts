import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainingConstant } from '../../../../constant/rh/training.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { ExternalTrainer } from '../../../../models/rh/external-trainer.model';
import { ExternalTraining } from '../../../../models/rh/external-training.model';
import { TrainingCenterRoom } from '../../../../models/rh/training-center-room.model';
import { TrainingCenter } from '../../../../models/rh/training-center.model';
import { TrainingSession } from '../../../../models/rh/training-session.model';
import { EmployeeService } from '../../../../payroll/services/employee/employee.service';
import { FormModalDialogService } from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../../shared/utils/predicate';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { AddExternalTrainerComponent } from '../../../components/add-external-trainer/add-external-trainer/add-external-trainer.component';
import { ExternalTrainerService } from '../../../services/external-trainer/external-trainer.service';
import { ExternalTrainingService } from '../../../services/external-training/external-training.service';
import { TrainingCenterRoomService } from '../../../services/training-center-room/training-center-room.service';
import { TrainingCenterService } from '../../../services/training-center/training-center.service';
import { TrainingSessionService } from '../../../services/training-session/training-session.service';
import { AddTrainingCenterComponent } from '../../add-training-center/add-training-center/add-training-center.component';

@Component({
  selector: 'app-training-type',
  templateUrl: './training-type.component.html',
  styleUrls: ['./training-type.component.scss']
})
export class TrainingTypeComponent implements OnInit {

  IsInternal = true;
  IsExternal = false;
  centerList: TrainingCenter[];
  roomList: TrainingCenterRoom[];
  externalTrainingFormGroup: FormGroup;
  predicate: PredicateFormat;
  idSelectedRoom = 0;
  idSelectedCenter: number;
  @Input() idSkill: number[];
  externalTrainorList: ExternalTrainer[];
  trainingSession: TrainingSession;
  idSelectedEmployee: number[] = [];
  idSelectedExternalTrainer: number;
  @Input() idTraining: number;
  @Input() isUpdateMode: boolean;
  @Input() trainingSessionToUpdate: TrainingSession;
  externalTrainingPredicate: PredicateFormat;
  isSelectedRoomInUpdateMode: boolean;
  externalTraining: ExternalTraining;
  showEmployeeDropdown: boolean;
  public hasAddCenterPermission = false;
  public hasAddTrainerPermission = false;
  public hasAddTrainingSessionPermission = false;
  public hasUpdateTrainingSessionPermission = false;

  constructor(private fb: FormBuilder, private trainingCenterService: TrainingCenterService,
              private trainingCenterRoomService: TrainingCenterRoomService, private formModalDialogService: FormModalDialogService,
              private viewContainerRef: ViewContainerRef, private externalTrainerService: ExternalTrainerService,
              public authService: AuthService,
              private trainingSessionService: TrainingSessionService, private router: Router, private employeeService: EmployeeService,
              private externalTrainingService: ExternalTrainingService) {
  }

  ngOnInit() {
    this.createForm();
    this.getListOfCenter();
    this.getExternalTrainorList();
    this.hasAddCenterPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_CENTER);
    this.hasAddTrainerPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TRAINER);
    this.hasAddTrainingSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TRAININGSESSION);
    this.hasUpdateTrainingSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_TRAININGSESSION);
    this.trainingSession = new TrainingSession();
    if (this.isUpdateMode) {
      if (!this.trainingSessionToUpdate.EmployeeTrainingSession) {
        this.trainingSessionToUpdate.EmployeeTrainingSession = [];
      }
      if (!this.trainingSessionToUpdate.IdExternalTrainer) {
        this.IsInternal = true;
        this.IsExternal = false;
      } else {
        this.IsInternal = false;
        this.IsExternal = true;
      }
      this.externalTraining = new ExternalTraining();
      this.getTrainingType();
    } else {
      this.trainingSession.IdTraining = this.idTraining;
    }
  }

  getExternalTrainorList() {
    this.externalTrainerService.list().subscribe((result) => {
      if (result) {
        this.externalTrainorList = result;
      }
    });
  }

  getListOfCenter() {
    this.trainingCenterService.list().subscribe((result) => {
      this.centerList = result;
    });
  }

  getListOfRooms(predicate: PredicateFormat) {
    this.trainingCenterRoomService.callPredicateData(predicate).subscribe((result) => {
      this.roomList = result;
      if (!this.isSelectedRoomInUpdateMode) {
        this.idSelectedRoom = undefined;
      } else {
        this.isSelectedRoomInUpdateMode = false;
      }
    });
  }

  public checkIsInternal(e) {
    this.IsInternal = true;
    this.IsExternal = false;
    this.idSelectedRoom = undefined;
    this.idSelectedExternalTrainer = undefined;
    this.idSelectedCenter = undefined;
    this.roomList = [];
  }

  public checkIsExternal(e) {
    this.IsInternal = false;
    this.IsExternal = true;
  }

  onChange(center) {
    this.preparePredicate(center as number);
    this.getListOfRooms(this.predicate);
  }

  public preparePredicate(idCenter?: number) {
    if (idCenter) {
      this.predicate = new PredicateFormat();
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Relation = new Array<Relation>();
      this.predicate.Filter.push(new Filter(TrainingConstant.ID_TRAINING_CENTER, Operation.eq, idCenter));
    } else {
      this.externalTrainingPredicate = new PredicateFormat();
      this.externalTrainingPredicate.Filter = new Array<Filter>();
      this.externalTrainingPredicate.Relation = new Array<Relation>();
      this.externalTrainingPredicate.Filter.push(new Filter(TrainingConstant.ID_TRAINING_SESSION, Operation.eq,
        this.trainingSessionToUpdate.Id));
      this.externalTrainingPredicate.Filter.push(new Filter(TrainingConstant.ID_EXTERNAL_TRAINER, Operation.eq,
        this.trainingSessionToUpdate.IdExternalTrainer));
      this.externalTrainingPredicate.Relation.push.apply(this.externalTrainingPredicate.Relation,
        [new Relation(TrainingConstant.ID_TRAINING_CENTER_ROOM_NAVIGATION)]);
    }
  }

  addCenter() {
    this.formModalDialogService.openDialog(TrainingConstant.ADD_TRAINING_CENTER,
      AddTrainingCenterComponent,
      this.viewContainerRef, this.getListOfCenter.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  addTrainer() {
    this.formModalDialogService.openDialog(TrainingConstant.ADD_EXTERNAL_TRAINER,
      AddExternalTrainerComponent,
      this.viewContainerRef, this.getExternalTrainorList.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  onChangeEmployee(event) {
    this.idSelectedEmployee = event.selectedValueMultiSelect;
  }

  onChangeExternalTrainer(event) {
    this.idSelectedExternalTrainer = event;
  }

  saveTrainingSessionWithTrainingType() {
    if (this.IsInternal) {
      this.trainingSession.IdExternalTrainer = null;
      this.idSelectedRoom = NumberConstant.ZERO;
    } else {
      this.idSelectedEmployee = [];
      if (this.idSelectedExternalTrainer) {
        this.trainingSession.IdExternalTrainer = this.idSelectedExternalTrainer;
      } else {
        this.trainingSession.IdExternalTrainer = null;
      }
      if (!this.idSelectedRoom) {
        this.idSelectedRoom = NumberConstant.ZERO;
      }
    }
    if (this.isUpdateMode) {
      this.trainingSession = Object.assign({}, this.trainingSessionToUpdate, this.trainingSession);
    }
    if (!this.isUpdateMode) {
      this.trainingSessionService.addExternalTrainingWithTrainingSession(this.trainingSession,
        this.idSelectedRoom, this.idSelectedEmployee).subscribe((result) => {
        this.router.navigate([TrainingConstant.NAVIGATE_TO_TRAINING_SESSSION_LIST]);
      });
    } else {
      this.trainingSessionService.updateExternalTrainingWithTrainingSession(this.trainingSession,
        this.idSelectedRoom, this.externalTraining, this.idSelectedEmployee).subscribe((result) => {
        this.router.navigate([TrainingConstant.NAVIGATE_TO_TRAINING_SESSSION_LIST]);
      });
    }
  }

  getTrainingType() {
    if (this.IsInternal) {
      if (this.trainingSessionToUpdate.EmployeeTrainingSession &&
        this.trainingSessionToUpdate.EmployeeTrainingSession.length > NumberConstant.ZERO) {
        this.idSelectedEmployee = this.trainingSessionToUpdate.EmployeeTrainingSession.map(x => x.IdEmployee);
      }
    } else {
      this.isSelectedRoomInUpdateMode = true;
      this.preparePredicate();
      this.idSelectedExternalTrainer = this.trainingSessionToUpdate.IdExternalTrainer;
      this.externalTrainingService.getModelByCondition(this.externalTrainingPredicate).subscribe((result) => {
        if (result) {
          this.externalTraining = result;
          this.idSelectedCenter = result.IdTrainingCenterRoomNavigation.IdTrainingCenter;
          this.preparePredicate(this.idSelectedCenter);
          this.getListOfRooms(this.predicate);
          this.idSelectedRoom = result.IdTrainingCenterRoom ? result.IdTrainingCenterRoom : NumberConstant.ZERO;
          this.externalTraining.IdTrainingCenterRoomNavigation = null;
        }
      });
    }
  }

  onEmloyeeWithSkill(event: boolean) {
    this.showEmployeeDropdown = event;
  }

  private createForm(): void {
    this.externalTrainingFormGroup = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Level: ['', Validators.required],
      TrainingLocation: ['', Validators.required]
    });
  }
}
