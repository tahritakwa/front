import {Injectable, ViewContainerRef} from '@angular/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs/Subject';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {MODAL_SETTINGS} from '../../../../constant/shared/services.constant';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';

/**
 * service for creating new modal dialog contains component.
 *
 * */
@Injectable()
export class FormModalDialogService {
  /**
   * create new form modal service
   * @param modalService
   * @param translate
   */
  constructor(private modalService: ModalDialogService, private translate: TranslateService,
              private formModalDialogService: ModalDialogInstanceService) {
  }

  /**
   * open dialog form
   * @param title
   * @param component
   * @param viewRef
   * @param actionOnClose
   * @param dataToSend
   * @param actionOnCloseHaveDataArg
   * @param sizeConfig
   * @returns void
   */
  public openDialog(title: string, component: any, viewRef: ViewContainerRef, actionOnClose: Function,
                    dataToSend?: any, actionOnCloseHaveDataArg?: boolean, sizeConfig?: string,showCloseButton? : boolean): void {
    if (sizeConfig === undefined) {
      sizeConfig = SharedConstant.MODAL_DIALOG_SIZE_S;
    }
    let titleText = '';
    if (title) {
      titleText = `${this.translate.instant(title)}`;
    }
    this.modalSetting(sizeConfig);
    const dialogOptions = {
      title: titleText,
      childComponent: component,
      settings: MODAL_SETTINGS,
      data: dataToSend ? dataToSend : undefined,
      placeOnTop: true,
      closeDialogSubject: new Subject<any>(),
      onClose: (): boolean | Promise<any> | Observable<any> => {
        if (actionOnClose) {
          if (actionOnCloseHaveDataArg) {
            actionOnClose(dialogOptions.data);
          } else {
            actionOnClose();
          }
        }
        return true;
      }
    };
    if(showCloseButton != undefined && !showCloseButton){
      MODAL_SETTINGS.closeButtonClass = 'not-show-close-button';
    }
    this.modalService.openDialog(viewRef, dialogOptions);

  }
  modalSetting(sizeConfig: string) {
    switch (sizeConfig) {
      case 'small':
        MODAL_SETTINGS.modalDialogClass = SharedConstant.MODAL_DIALOG_CLASS_S;
        MODAL_SETTINGS.contentClass = SharedConstant.CONTENT_CLASS_S;
        break;
      case 'medium':
        MODAL_SETTINGS.modalDialogClass = SharedConstant.MODAL_DIALOG_CLASS_M;
        MODAL_SETTINGS.contentClass = SharedConstant.CONTENT_CLASS_M;
        break;
      case  'x-medium':
        MODAL_SETTINGS.modalDialogClass = SharedConstant.MODAL_DIALOG_CLASS_XM;
        MODAL_SETTINGS.contentClass = SharedConstant.CONTENT_CLASS_XM;
        break;
      case 'medium-large':
        MODAL_SETTINGS.modalDialogClass = SharedConstant.MODAL_DIALOG_CLASS_ML;
        MODAL_SETTINGS.contentClass = SharedConstant.CONTENT_CLASS_ML;
        break;
      case 'large':
        MODAL_SETTINGS.modalDialogClass = SharedConstant.MODAL_DIALOG_CLASS_L;
        MODAL_SETTINGS.contentClass = SharedConstant.CONTENT_CLASS_L;
        break;
      case 'extra-large':
        MODAL_SETTINGS.modalDialogClass = SharedConstant.MODAL_DIALOG_CLASS_XXL;
        MODAL_SETTINGS.contentClass = SharedConstant.CONTENT_CLASS_XXL;
        break;
    }
    MODAL_SETTINGS.modalClass = 'modal fade ngx-modal  modal-body-scrolable';
    MODAL_SETTINGS.closeButtonTitle = this.translate.instant(SharedConstant.CLOSE);
    MODAL_SETTINGS.closeButtonClass = 'close icon-close close-icon';
    MODAL_SETTINGS.bodyClass = 'modal-body';
  }
}
