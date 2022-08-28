export class CrmConfig {
  importOrganisations: boolean;
  exportExcel: boolean;
  sendMail: boolean;
  sendSms: boolean;
  updatePermissions: boolean;
  deleteSelected: boolean;
  archiveSelected: boolean;
  restoreSelected: boolean;
  addPopup: boolean;

  constructor(deleteSelected?: boolean, archiveSelected?: boolean, restoreSelected?: boolean, importOrganisations?: boolean,
              exportExcel?: boolean, sendMail?: boolean, sendSms?: boolean, updatePermissions?: boolean) {
    this.importOrganisations = importOrganisations ? importOrganisations : false;
    this.exportExcel = exportExcel ? exportExcel : false;
    this.sendMail = sendMail ? sendMail : false;
    this.sendSms = sendSms ? sendSms : false;
    this.updatePermissions = updatePermissions ? updatePermissions : false;
    this.deleteSelected = deleteSelected ? deleteSelected : false;
    this.archiveSelected = archiveSelected ? archiveSelected : false;
    this.restoreSelected = restoreSelected ? restoreSelected : false;
  }
}
