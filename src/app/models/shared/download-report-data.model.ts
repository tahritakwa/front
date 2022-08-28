
export class DownloadReportData {

  
  public id: number;
  public code: string;
  public startdate?: Date;
  public enddate?: Date;
  public PrintType: number;
  public printCopies: number;
  public isFromBl?: number;
  public idwarehouse: number;
  public listIds: number[];
  public idtiers: number;
  public idstatus: number;
  public idtype: string;
  public groupbytiers: number;
  public reportName: string;
  public reportType: string;
  public reportparameters: any;

  constructor(_Id: number,  _reportName: string, _reportType?: string, _printCopies?: number,
    _Code?: string , _startdate?: Date, _enddate?: Date, _printType?: number,
     _isFromBl?: number, _idwarehouse?: number, _listIds?: number[],
     _idtiers?: number, _idstatus?: number, _idtype?: string, _groupbytiers?: number, _reportparameters?: any) {
    this.id = _Id;
    this.code = _Code;

    this.startdate = _startdate;
    this.enddate = _enddate;
    this.PrintType = _printType;
    this.isFromBl = _isFromBl;
    this.idwarehouse = _idwarehouse;
    this.listIds = _listIds;
    this.idtiers = _idtiers;
    this.idstatus = _idstatus;
    this.idtype = _idtype;
    this.groupbytiers = _groupbytiers;
    this.reportName = _reportName;
    this.reportType = _reportType;
    this.reportparameters = _reportparameters;
    this.printCopies = _printCopies;
  }
}
