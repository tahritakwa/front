import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {FileConstant} from '../../../constant/crm/file.constant';
import {FileService} from '../../services/file/file.service';
import {OrganisationConstant} from '../../../constant/crm/organisation.constant';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {FileAddComponent} from './file-add/file-add.component';
import {NoteConstant} from '../../../constant/crm/note.constant';
import {AuthService} from '../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../Structure/permission-constant';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit, OnChanges {
  @Input() source: String;
  @Input() sourceId;
  @Input() contactCrm;
  @Input() isProspect;
  @Output() recount = new EventEmitter<any>();
  @Input() fromRelatedArchiving = false;
  @Input() entityType;
  public dataToSendToPoPUp;
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  public showModalAddFile = false;
  pagerSettings: PagerSettings = {
    buttonCount: NumberConstant.FIVE, info: true, type: 'numeric', pageSizes: false, previousNext: true
  };
  private pageSize = NumberConstant.TEN;
  private refresh = true;
  public fileDetails;
  private able_to_delete = false;
  public gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: FileConstant.DATE_FIELD,
      title: FileConstant.DATE_TITLE,
      filterable: true
    },
    {
      field: FileConstant.FILE_FIELD,
      title: FileConstant.FILE_TITLE,
      filterable: true
    }
  ];
  public CRMPermissions = PermissionConstant.CRMPermissions;

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  constructor(private fileService: FileService,
              private swallWarning: SwalWarring,
              private translate: TranslateService,
              private formModalDialogService: FormModalDialogService,
              private growlService: GrowlService,
              private viewRef: ViewContainerRef,
              public authService: AuthService) {
  }

  ngOnInit() {
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange.sourceId !== undefined) {
      this.initFileGridDataSource();
    }
  }


  initFileGridDataSource() {
    switch (this.source) {
      case FileConstant.ORGANISATION:
        if (this.isProspect) {
          this.getFileData(this.sourceId);
        } else {
          this.getFileOrganisationClient();
        }
        break;
      case FileConstant.ACTION:
        this.getFileDataByAction(this.sourceId);
        break;
      case FileConstant.CLAIM:
        this.getFileDataByClaim(this.sourceId);
        break;
      case FileConstant.OPPORTUNITY:
        this.getFileDataByOpportunity(this.sourceId);
        break;
      case  FileConstant.CONTACT:
        if (this.isProspect) {
          this.getFileDataByContact(this.sourceId);
        } else {
          this.getFileContactClient();
        }
        break;
      default:
        break;

    }

  }

  private getFileContactClient() {
    this.fileService
      .getJavaGenericService()
      .getData(
        NoteConstant.CONTACT_CLIENT +
        `?contactId=${this.sourceId}&page=${NumberConstant.ZERO}&size=${this.pageSize}`
      )
      .subscribe(_data => {
        this.recount.emit(_data.totalElements);
        if (_data) {
          this.gridSettings.gridData = {
            data: _data.fileDtos,
            total: _data.totalElements
          };
        }
      });
  }

  private getFileOrganisationClient() {
    this.fileService
      .getJavaGenericService()
      .getData(
        NoteConstant.ORGANIZATION_CLIENT +
        `?organisationId=${this.sourceId}&page=${NumberConstant.ZERO}&size=${this.pageSize}`
      )
      .subscribe(_data => {
        this.recount.emit(_data.totalElements);
        if (_data) {
          this.gridSettings.gridData = {
            data: _data.fileDtos,
            total: _data.totalElements
          };
        }
      });
  }

  getFileData(organisationId) {
    this.fileService.getJavaGenericService().getData('organisation/'.concat(organisationId.toString()).concat('/page/1'))
      .subscribe(data => {
        this.recount.emit(data.totalElements);
        this.gridSettings.gridData = data.fileDtos;
      });
  }

  getFileDataByOpportunity(opportunityId) {
    this.fileService
      .getJavaGenericService()
      .getData(
        FileConstant.OPPORTUNITY +
        `?opportunityId=${this.sourceId}&page=${NumberConstant.ZERO}&size=${this.pageSize}`
      )
      .subscribe(_data => {
        this.recount.emit(_data.totalElements);
        if (_data) {
          this.gridSettings.gridData = {
            data: _data.fileDtos,
            total: _data.totalElements
          };
        }
      });
  }

  getFileDataByAction(actionId) {
    this.fileService.getJavaGenericService().getData('action/'.concat(actionId.toString()).concat('/page/1')).subscribe(data => {
      this.recount.emit(data.totalElements);
      this.gridSettings.gridData = data.fileDtos;
    });
  }

  getFileDataByClaim(claimId) {
    this.fileService.getJavaGenericService().getData('claim/'.concat(claimId.toString()).concat('/page/1')).subscribe(data => {
      this.recount.emit(data.totalElements);
      this.gridSettings.gridData = data.fileDtos;
    });
  }

  getFileDataByContact(contactId) {
    this.fileService.getJavaGenericService().getData('contact/'.concat(contactId.toString()).concat('/page/1')).subscribe(data => {
      this.recount.emit(data.totalElements);
      this.gridSettings.gridData = data.fileDtos;
    });
  }

  onPageChange(event) {
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
  }

  /**
   * Fill the kendo with data
   */
  initGridDataSource(page?: number) {

  }

  /**
   * remove an action
   * @param $event
   */
  removeHandler(event) {
    this.swallWarning.CreateSwal(this.translate.instant(FileConstant.PUP_UP_DELETE_FILE_TEXT)).then((result) => {
      if (result.value) {
        this.fileService.getJavaGenericService().deleteFile(FileConstant.DELETE, {
          'id': event.id
          , 'fileName': event.pathAttachment
          , 'directory': this.source
        }).subscribe((data) => {
            this.able_to_delete = data;
          }, error => {
          }, () => {
            if (this.able_to_delete === true) {
              this.growlService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
              this.recount.emit(+(this.recount) - 1);
              this.modelClose();
            }
          }
        );
      }
    });
  }

  /**
   * show the files details
   * @param event
   */
  showDetails(event) {

    this.dataToSendToPoPUp = {
      isUpdateMode: true,
      file: event,
      source: this.source,
      sourceId: this.sourceId,
      contactCrm: this.contactCrm,
      isProspect: this.isProspect
    };
    this.showPopUp();

  }

  receiveData(event) {

  }

  showPopupAddFile() {
    if (event) {
      this.dataToSendToPoPUp = {
        isUpdateMode: false,
        file: null,
        source: this.source,
        sourceId: this.sourceId,
        contactCrm: this.contactCrm,
        isProspect: this.isProspect
      };
      this.showPopUp();
    }
  }

  showPopUp() {
    this.formModalDialogService.openDialog(
      'FILE.ADD_FORM_HEADER', FileAddComponent, this.viewRef, this.initFileGridDataSource.bind(this),
      this.dataToSendToPoPUp, false, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  modelClose(e?) {
    this.showModalAddFile = false;
    if (this.sourceId) {
      this.initFileGridDataSource();
    }
    this.recount.emit();
  }
}
