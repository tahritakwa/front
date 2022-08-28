export class ReportTemplateDefaultParameters{
  companyName:string;
  companyAdressInfo:string;
  provisionalEdition:boolean;
  generationDate:string;

  constructor(companyName: string, companyAdressInfo: string, provisionalEdition: boolean, generationDate:string,
    ) {
    this.companyName = companyName;
    this.companyAdressInfo = companyAdressInfo;
    this.provisionalEdition = provisionalEdition;
    this.generationDate = generationDate;
  }
}
