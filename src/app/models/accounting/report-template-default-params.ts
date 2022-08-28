export class ReportTemplateDefaultParams{
    companyName:string;
    logoDataBase64:string;
    companyAdressInfo:string;
    provisionalEdition:boolean;
    generationDate:string;
    commercialRegister:string;
    matriculeFisc:string;
    mail:string;
    webSite:string;
    tel:string;

    constructor(companyName: string,logoDataBase64:string, companyAdressInfo: string, provisionalEdition: boolean, generationDate:string,
      commercialRegister:string,matriculeFisc:string,mail:string,webSite:string,tel:string,
      ) {
      this.companyName = companyName;
      this.logoDataBase64 = logoDataBase64;
      this.companyAdressInfo = companyAdressInfo;
      this.provisionalEdition = provisionalEdition;
      this.generationDate = generationDate;
      this.commercialRegister = commercialRegister;
      this.matriculeFisc = matriculeFisc;
      this.mail = mail;
      this.webSite = webSite;
      this.tel = tel;
    }
  }
  