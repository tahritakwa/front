import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ListLanguageComponent} from '../../../administration/language/list-language/list-language.component';
import {LanguageConstant} from '../../../constant/Administration/language.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TranslationKeysConstant} from '../../../constant/shared/translation-keys.constant';
import {Language} from '../../../models/shared/Language.model';
import {DropDownComponent} from '../../interfaces/drop-down-component.interface';
import {FormModalDialogService} from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {LanguageKnowledgeService} from '../../services/language-knowledge/language-knowledge.service';
import {OrderBy, OrderByDirection, PredicateFormat} from '../../utils/predicate';
import {PermissionConstant} from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-language-knowledge-dropdown',
  templateUrl: './language-knowledge-dropdown.component.html',
  styleUrls: ['./language-knowledge-dropdown.component.scss']
})
export class LanguageknowledgeDropdownComponent
  implements OnInit, DropDownComponent {
  @Input() group;
  @Input() allowCustom;
  @Input() disabled: boolean;
  @Output() LanguagesListChanged = new EventEmitter<boolean>();
  @Output() selected = new EventEmitter<boolean>();

  public languageDataSource: Language[];
  public languageFiltredDataSource: Language[];
  public predicate: PredicateFormat;
  public hasAddLanguagePermission: boolean;

  constructor(
    private languageKnowledgeService: LanguageKnowledgeService,
    public translate: TranslateService,
    private viewRef: ViewContainerRef,
    private formModalDialogService: FormModalDialogService,
    private authService: AuthService
  ) {
    this.hasAddLanguagePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_LANGUAGE);
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.preparePredicate();
    this.languageKnowledgeService.listdropdownWithPerdicate(this.predicate).toPromise()
      .then((data: any) => {
        this.languageDataSource = data.listData;
        this.languageFiltredDataSource = this.languageDataSource.slice(0);
      });
  }

  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(LanguageConstant.NAME, OrderByDirection.asc));
  }

  handleFilter(value: string): void {
    this.languageFiltredDataSource = this.languageDataSource.filter(s =>
      s.Name.toLowerCase().includes(value.toLowerCase())
    );
  }

  addNew(): void {
    this.formModalDialogService.openDialog(
      TranslationKeysConstant.ADD_LANGUAGE,
      ListLanguageComponent,
      this.viewRef,
      this.initDataSource.bind(this),
      true,
      true,
      SharedConstant.MODAL_DIALOG_SIZE_M
    );
  }

  checkIfSkillsHasBeenAdded(data: any) {
    this.initDataSource();
    this.LanguagesListChanged.emit(true);
  }

  public skillsSelected($event) {
    this.selected.emit($event);
  }

}
