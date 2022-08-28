import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {NoteConstant} from '../../../../constant/crm/note.constant';
import {State} from '@progress/kendo-data-query';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {NoteService} from '../../../services/note/note.service';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {AddNoteComponent} from '../add-note/add-note.component';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {TooltipDirective} from '@progress/kendo-angular-tooltip';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {Note} from '../../../../models/crm/note.model';
import {FileConstant} from '../../../../constant/crm/file.constant';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';

@Component({
  selector: 'app-list-note',
  templateUrl: './list-note.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./list-note.component.scss']
})
export class ListNoteComponent implements OnInit, OnChanges {
  @Input() organisationId;
  @Output() nbrNoteEvent = new EventEmitter<number>();
  @Input() related = false;
  @Input() isProspect;
  @Input() source: string;
  @Input() sourceId: number;
  @Input() isArchivingMode: false;
  @Input() fromRelatedArchiving = false;
  @Input() entityType;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  public formatDate: string = this.translateService.instant(SharedConstant.DATE_FORMAT);

  noteToSend: Note = new Note();
  dataToSendToPoPUp: any;
  public titlePopUp;
  private able_to_delete: boolean;
  public isUpdateMode: Boolean = false;
  pagerSettings: PagerSettings = {
    buttonCount: NumberConstant.FIVE, info: true, type: 'numeric', pageSizes: false, previousNext: true
  };
  private pageSize = NumberConstant.TEN;
  public columnsConfig: ColumnSettings[] = [
    {
      field: NoteConstant.DATE_FIELD,
      title: NoteConstant.DATE_TITLE,
      filterable: true,
      width: 100


    },
    {
      field: NoteConstant.NAME_FIELD,
      title: NoteConstant.NAME_TITLE,
      filterable: true,
      width: 150

    },
    {
      field: NoteConstant.NOTE_CORPS_FIELD,
      title: NoteConstant.NOTE_CORPS_TITLE,
      filterable: true,
      width: 100
    }

  ];
  public gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public CRMPermissions = PermissionConstant.CRMPermissions;

  constructor(private noteService: NoteService,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              private swallWarning: SwalWarring,
              private translateService: TranslateService,
              private growlService: GrowlService,
              public authService: AuthService) {

  }

  ngOnInit() {
    this.isUpdateMode = false;
    if (!this.related) {
      this.initNotesFromRelatedSource();
    }
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange.sourceId !== undefined && this.related) {
      this.initNotesFromRelatedSource();
    }
  }


  initNotesFromRelatedSource() {
    switch (this.source) {
      case NoteConstant.CONTACT :
        if (this.isProspect) {
          this.initNotesFromRelatedSourceByContact();
        } else {
          this.initNotesFromRelatedSourceByContactClient();
        }
        break;
      case FileConstant.ACTION :
        this.initNotesFromRelatedSourceByActions();
        break;
      case NoteConstant.OPPORTUNITY:
        this.initNotesFromRelatedSourceByOpportunity();
        break;
      case NoteConstant.ORGANISATION :
        if (this.isProspect) {
          this.getNotes(this.organisationId, this.gridSettings.state.skip / NumberConstant.TEN);
        } else {
          this.getNoteFromClient();
        }
        break;
      case NoteConstant.CLAIM :
        this.initNotesFromRelatedSourceByClaim();
        break;
      case NoteConstant.ACTION :
        this.initNotesFromRelatedSourceByAction();
        break;
      default:
        return;
    }
  }

  initNotesFromRelatedSourceByContact() {
    this.noteService
      .getJavaGenericService()
      .getData(
        NoteConstant.CONTACT +
        `?contactId=${this.sourceId}&page=${NumberConstant.ZERO}&size=${this.pageSize}`
      )
      .subscribe(_data => {
        this.nbrNoteEvent.emit(_data.totalElements);
        if (_data) {
          this.gridSettings.gridData = {
            data: _data.noteDtoList,
            total: _data.totalElements
          };
        }
      });
  }

  initNotesFromRelatedSourceByContactClient() {
    this.noteService
      .getJavaGenericService()
      .getData(
        NoteConstant.CONTACT_CLIENT +
        `?contactId=${this.sourceId}&page=${NumberConstant.ZERO}&size=${this.pageSize}`
      )
      .subscribe(_data => {
        this.nbrNoteEvent.emit(_data.totalElements);
        if (_data) {
          this.gridSettings.gridData = {
            data: _data.noteDtoList,
            total: _data.totalElements
          };
        }
      });
  }

  initNotesFromRelatedSourceByActions() {
    this.noteService
      .getJavaGenericService()
      .getData(
        FileConstant.ACTION +
        `?actionId=${this.sourceId}&page=${NumberConstant.ZERO}&size=${this.pageSize}`
      )
      .subscribe(_data => {
        this.nbrNoteEvent.emit(_data.totalElements);
        if (_data) {
          this.gridSettings.gridData = {
            data: _data.noteDtoList,
            total: _data.totalElements
          };
        }
      });
  }

  initNotesFromRelatedSourceByOpportunity() {
    this.noteService
      .getJavaGenericService()
      .getData(
        NoteConstant.OPPORTUNITY +
        `?opportunityId=${this.sourceId}&page=${NumberConstant.ZERO}&size=${this.pageSize}`
      )
      .subscribe(_data => {
        this.nbrNoteEvent.emit(_data.totalElements);
        if (_data) {
          this.gridSettings.gridData = {
            data: _data.noteDtoList,
            total: _data.totalElements
          };
        }
      });
  }

  private getNotes(organisationId, page?) {
    if (this.organisationId) {

      this.noteService.getJavaGenericService().getEntityById(organisationId, 'pages/' + (page + NumberConstant.ONE)).subscribe(data => {
        if (data) {
          this.gridSettings.gridData = {
            data: data.noteDtoList,
            total: data.totalElements
          };
          this.nbrNoteEvent.emit(data.totalElements);
        }
      });
    }
  }

  private getNoteFromClient() {
    this.noteService
      .getJavaGenericService()
      .getData(
        NoteConstant.ORGANIZATION_CLIENT +
        `?organisationId=${this.sourceId}&page=${NumberConstant.ZERO}&size=${this.pageSize}`
      )
      .subscribe(_data => {
        this.nbrNoteEvent.emit(_data.totalElements);
        if (_data) {
          this.gridSettings.gridData = {
            data: _data.noteDtoList,
            total: _data.totalElements
          };
        }
      });
  }

  initNotesFromRelatedSourceByAction() {
    this.noteService
      .getJavaGenericService()
      .getData(
        NoteConstant.ACTION +
        `?actionId=${this.sourceId}&page=${NumberConstant.ZERO}&size=${this.pageSize}`
      )
      .subscribe(_data => {
        this.nbrNoteEvent.emit(_data.totalElements);
        if (_data) {
          this.gridSettings.gridData = {
            data: _data.noteDtoList,
            total: _data.totalElements
          };
        }
      });
  }

  initNotesFromRelatedSourceByClaim() {
    this.noteService
      .getJavaGenericService()
      .getData(
        NoteConstant.CLAIM +
        `?claimId=${this.sourceId}&page=${NumberConstant.ZERO}&size=${this.pageSize}`
      )
      .subscribe(_data => {
        this.nbrNoteEvent.emit(_data.totalElements);
        if (_data) {
          this.gridSettings.gridData = {
            data: _data.noteDtoList,
            total: _data.totalElements
          };
        }
      });
  }

  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if ((element.nodeName === 'TD' || element.nodeName === 'TH')
      && element.offsetWidth < element.scrollWidth) {
      this.tooltipDir.toggle(element);
    } else {
      this.tooltipDir.hide();
    }
  }


  setAddMode(event) {
    this.isUpdateMode = false;
    this.dataToSendToPoPUp = {
      organisationId: this.organisationId,
      note: null,
      source: this.source,
      sourceId: this.sourceId,
      isProspect: this.isProspect
    };
    this.titlePopUp = 'NOTE_ADD';
    this.showPopUp();
  }

  setModeToModify(note) {
    this.isUpdateMode = true;
    this.noteToSend = note;
    this.dataToSendToPoPUp = {
      organisationId: this.organisationId,
      note: this.noteToSend,
      source: this.source,
      sourceId: this.sourceId,
      isProspect: this.isProspect
    };
    this.titlePopUp = 'NOTE_UPDATE';
    this.showPopUp();
  }

  showPopUp() {
    this.formModalDialogService.openDialog(
      this.titlePopUp, AddNoteComponent, this.viewRef, this.initNotesFromRelatedSource.bind(this),
      this.dataToSendToPoPUp, false, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  onPageChange(event) {
    this.pageSize = event.take;
    this.initNotesFromRelatedSource();
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
  }

  initGridDataSource(page?: number) {
  }

  removeHandler(event) {
    this.swallWarning.CreateSwal(this.translateService.instant(NoteConstant.PUP_UP_DELETE_NOTE_TEXT)).then((result) => {
      if (result.value) {
        this.noteService.getJavaGenericService().deleteEntity(event.id).subscribe((data) => {
            this.able_to_delete = data;
          }, error => {
          }, () => {
            if (this.able_to_delete === true) {
              this.growlService.successNotification(this.translateService.instant(NoteConstant.SUCCESS_OPERATION));
              this.initNotesFromRelatedSource();
            }
          }
        );
      }
    });
  }


}
