import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { State } from '@progress/kendo-data-query';
import { AdministrativeDocumentConstant } from '../../../constant/payroll/administrative-document-constant';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Note } from '../../../models/payroll/note.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { NotesService } from '../../services/notes/notes.service';

@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.scss']
})
export class AddNotesComponent implements OnInit {
  @Input() public idEmployee: number;
  @Input() public idConnectedUser: number;
  @Input() isDisabled: boolean;
  public commentsData: Note[] = [];
  public notesFormGroup: FormGroup;
  public predicate: PredicateFormat;
  public noteToUpdate: Note;
  public isUpdateMode: boolean;
  /** Permissions */
  public hasUpdateEmployeePermission = false;
  public hasAddRemarkPermission = false;
  public hasUpdateRemarkPermission = false;
  public hasDeleteRemarkPermission = false;
  public pictureData: any;
  public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState,
  };
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private fb: FormBuilder, public authService: AuthService, public notesService: NotesService,
    private swalWarrings: SwalWarring, private translate: TranslateService) { }

  get Date(): FormControl {
    return this.notesFormGroup.get(EmployeeConstant.DATE) as FormControl;
  }

  ngOnInit() {
    this.hasAddRemarkPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_NOTE);
    this.hasUpdateRemarkPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_NOTE);
    this.hasDeleteRemarkPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_NOTE);
    this.createAddForm();
    this.initGridDataSource();
  }

  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (this.idEmployee > 0) {
      this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.EMPLOYEE_ID, Operation.eq, this.idEmployee));
    }
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(AdministrativeDocumentConstant.ID_CREATOR_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(AdministrativeDocumentConstant.ID_EMPLOYEE_NAVIGATION)]);

  }

  public initGridDataSource(): any {
    this.preparePredicate();
    this.notesService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe(
      result => {
        this.commentsData = result.data;
        this.commentsData.forEach(note => {
          this.getSrcPictureEmployee(note);
        });
      }
    );
  }

  getSrcPictureEmployee(note: Note): Note {
    if (note && note.IdEmployeeNavigation.PictureFileInfo && note.IdEmployeeNavigation.PictureFileInfo.Data
    ) {
      this.pictureData = note.IdEmployeeNavigation.PictureFileInfo.Data;
      note.SrcPictureEmployee = 'data:image/png;base64,'.concat(this.pictureData);
    } else {
      note.SrcPictureEmployee = '../../../../assets/image/user-new-icon1.jpg';
    }
    return note;
  }

  public GetCreator(): string {
    return localStorage.getItem(EmployeeConstant.ID);
  }

  save() {
    if (this.notesFormGroup.valid) {
      const obj: Note = Object.assign({}, this.noteToUpdate, this.notesFormGroup.getRawValue());
      this.notesService.save(obj, !this.isUpdateMode).subscribe(data => {
        this.initGridDataSource();
        this.noteToUpdate = null;
        this.createAddForm(this.noteToUpdate);
      });

    }
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.notesService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  public Update(dataItem) {
    if (dataItem) {
      this.createAddForm(dataItem);
    }
  }

  private createAddForm(noteToUpdate?: Note) {
    if (!noteToUpdate) {
      this.isUpdateMode = false;
      this.notesFormGroup = this.fb.group({
        Mark: ['', [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
        IdCreator: [this.idConnectedUser],
        IdEmployee: [this.idEmployee],
        Date: [new Date()],
      });
    } else {
      this.isUpdateMode = true;
      this.notesFormGroup = this.fb.group({
        Id: [noteToUpdate.Id],
        Mark: [noteToUpdate.Mark, [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
        IdCreator: [noteToUpdate.IdCreator],
        IdEmployee: [noteToUpdate.IdEmployee],
        Date: [new Date()],
      });
    }
  }
}
