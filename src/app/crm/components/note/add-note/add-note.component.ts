import {Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewContainerRef} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Note} from '../../../../models/crm/note.model';
import {Organisation} from '../../../../models/crm/organisation.model';
import {TranslateService} from '@ngx-translate/core';
import {NoteService} from '../../../services/note/note.service';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {OpportunityService} from '../../../services/opportunity.service';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {Router} from '@angular/router';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {NoteConstant} from '../../../../constant/crm/note.constant';
import {FileConstant} from '../../../../constant/crm/file.constant';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss']
})
export class AddNoteComponent implements OnInit, IModalDialog {
  @Input() notes: FormGroup;
  @Input() organisationId: any;
  source: string;
  sourceId: number;
  private isProspect: boolean;
  org: number = this.organisationId;
  public addFormGroup: FormGroup;
  noteRecieved: Note;
  valueToSend: Note;
  organisation: Organisation;
  public isUpdateMode: Boolean = false;
  public isModal;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public startComponent: Boolean = false;

  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              private noteService: NoteService,
              private validationService: ValidationService,
              private opportunitiesService: OpportunityService,
              private viewRef: ViewContainerRef,
              private modalService: ModalDialogInstanceService,
              public modal: ModalDialogInstanceService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private growlService: GrowlService,
              private router: Router,
              private formModalDialogService: FormModalDialogService) {
    this.valueToSend = new Note();
    this.organisation = new Organisation();
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.org = this.optionDialog.data.organisationId;
    this.noteRecieved = this.optionDialog.data.note;
    this.source = this.optionDialog.data.source;
    this.sourceId = this.optionDialog.data.sourceId;
    this.isProspect = this.optionDialog.data.isProspect;
    this.isModal = true;
  }

  ngOnInit() {
    this.isUpdateMode = this.noteRecieved != null;
    this.createAddForm();
    if (this.isUpdateMode) {
      this.addFormGroup.patchValue(this.noteRecieved);
    }
  }

  private createAddForm(): void {
    this.addFormGroup = this.fb.group({
      title: ['', [Validators.required]],
      description: ['']
    });
  }

  buildNoteModel(): Note {
    const note: Note = this.addFormGroup.value;
    if (this.org !== undefined) {
      note.concernedOrganistaionId = this.org;
    }
    if (this.source && this.sourceId) {
      switch (this.source) {
        case NoteConstant.CONTACT:
          if (this.isProspect) {
            note.contactId = this.sourceId;
          } else {
            note.idConClient = this.sourceId;
          }
          break;
        case FileConstant.ACTION : {
          note.actionId = this.sourceId;
        }
          break;
        case NoteConstant.OPPORTUNITY:
          note.opportunityId = this.sourceId;
          break;
        case NoteConstant.ORGANISATION:
          note.concernedOrganistaionId = this.sourceId;
          break;
        case NoteConstant.ACTION:
          note.actionId = this.sourceId;
          break;
        case NoteConstant.CLAIM:
          note.claimId = this.sourceId;
          break;
        default :
          break;
      }
    }
    return note;
  }

  save() {
    if (this.addFormGroup.valid) {
      const note: Note = this.buildNoteModel();
      if (this.isUpdateMode) {
        this.noteService.getJavaGenericService().updateEntity(note, this.noteRecieved.id)
          .subscribe(data => {
            if (data != null) {
              this.startComponent = false;
              this.addFormGroup.reset();
              this.onBackToListOrCancel();
              this.growlService.successNotification(this.translate.instant(NoteConstant.SUCCESS_OPERATION));
            }
          });
      } else {
        this.noteService.getJavaGenericService().saveEntity(note)
          .subscribe(data => {
            if (data != null) {
              this.startComponent = false;
              this.addFormGroup.reset();
              this.onBackToListOrCancel();
              this.growlService.successNotification(this.translate.instant(NoteConstant.SUCCESS_OPERATION));
            }
          });
      }
    }
  }

  onBackToListOrCancel() {
    if (!this.isModal) {
      this.router.navigateByUrl(NoteConstant.NOTES_LIST);
    } else {
      this.optionDialog.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }
  }
}
