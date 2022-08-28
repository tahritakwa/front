export class ConfirmationModalSettings {
    Action: any;
    ModalTitle: string;
    ModalText: string;
    Confirm: string;
    Cancel: string;

    constructor (action: any, modalTitle: string , modalText: string , confirm: string , cancel: string) {
        this.Action = action;
        this.ModalTitle = modalTitle;
        this.ModalText = modalText;
        this.Confirm = confirm;
        this.Cancel = cancel;
    }

  }
