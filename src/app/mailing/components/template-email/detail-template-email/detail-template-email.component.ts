import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TemplateEmail} from '../../../../models/mailing/template-email';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {MailingConstant} from '../../../../constant/mailing/mailing.constant';
import {State} from '@progress/kendo-data-query';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {TemplateEmailService} from '../../../services/template-email/template-email.service';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {TemplateEmailSideNavService} from '../../../services/template-email-side-nav/template-email-side-nav.service';
import {Router} from '@angular/router';
import {ValidationService} from '../../../../shared/services/validation/validation.service';


@Component({
  selector: 'app-detail-template-email',
  templateUrl: './detail-template-email.component.html',
  styleUrls: ['./detail-template-email.component.scss']
})
export class DetailTemplateEmailComponent implements OnInit , OnChanges {
  public updateTemplateForm: FormGroup;
  public isUpdate = false;
  private pageSize = NumberConstant.TEN;
  public showButtonModify = true;
  public templateData;
  public dataArray: any = [];
  editorContent: string;

  public gridState: State = {
    skip: 0,
    take: this.pageSize,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: MailingConstant.SUBJECT_FIELD,
      title: MailingConstant.SUBJECT_TITLE,
      filterable: true
    },
    {
      field: MailingConstant.NAME_FIELD,
      title: MailingConstant.NAME_TITLE,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  pagerSettings: PagerSettings = {
    buttonCount: NumberConstant.FIVE, info: true, type: 'numeric', pageSizes: false, previousNext: true
  };

  @Input() templateDataFromListTemplate;
  @Output() backToList = new EventEmitter<void>();
  @Output() passeToUpdateMode = new EventEmitter<any>();

  constructor(private translateService: TranslateService,
              private swallWarning: SwalWarring, private validationService: ValidationService,
              private sidNavService: TemplateEmailSideNavService, private fb: FormBuilder,
              private templateEmailService: TemplateEmailService, private growlService: GrowlService, private router: Router) {
  }

  ngOnInit() {
    if (!this.updateTemplateForm) {
      this.createAddForm();
      this.sidNavService.getResult().subscribe(_data => {
        if (_data) {
          this.fillGridSettings(_data.data.dataItem ? _data.data.dataItem : _data.data);
        }
      });
    }
  }

  ngOnChanges() {
    this.fillGridSettings(this.templateDataFromListTemplate.data.dataItem ? this.templateDataFromListTemplate.data.dataItem
      : this.templateDataFromListTemplate.data);
  }

  private createAddForm(): void {
    this.updateTemplateForm = this.fb.group({
        name: ['', [Validators.required]],
        subject: ['', [Validators.required]],
        body: []
    });
  }

  changeModeToUpdate() {
    this.showButtonModify = false;
    this.isUpdate = true;
    this.passeToUpdateMode.emit({'isUpdate': true});
  }

  initUpdateMode() {
    this.showButtonModify = true;
    this.isUpdate = false;
  }

  returnToParent() {
      this.backToList.emit();
  }

  validateAndReturn() {
    this.passeToUpdateMode.emit({'isUpdate': false});
    this.backToList.emit();
    this.router.navigateByUrl(MailingConstant.TEMPLATE_EMAIL_LIST);
  }
  fillGridSettings(data) {
    this.initUpdateMode();
    this.createAddForm();
    this.getTemplateDetails(data);
  }

  getTemplateDetails(template) {
    this.templateData = template;
    this.editorContent = template.body;
    this.dataArray = [];
    this.dataArray.push(this.templateData);
    this.gridSettings.gridData = this.dataArray;
    this.updateTemplateForm.patchValue(template);
  }
  convertTemplateFormToTemplate(form: FormGroup) {
    let template: TemplateEmail;
    template = form.value;
    template.body = this.editorContent;
    return template;
  }
  update() {
    if (this.updateTemplateForm.valid) {
      this.templateEmailService.getJavaGenericService()
        .updateEntity(this.convertTemplateFormToTemplate(this.updateTemplateForm), this.templateData.id)
        .subscribe((_data) => {
          if (_data) {
            this.growlService.successNotification(this.translateService.instant(MailingConstant.SUCCESS_OPERATION));
            this.validateAndReturn();
          }
        });
    } else {
      this.validationService.validateAllFormFields(this.updateTemplateForm);
    }
  }


}
