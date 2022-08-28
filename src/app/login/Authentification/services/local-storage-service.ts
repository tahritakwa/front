import {Injectable} from '@angular/core';
import * as  SecureLS from 'secure-ls';
import {LocalStorageUtilData} from '../models/local-storage-util-data';

const SECRET = 'stark-locale-storage-secret';
const ACCESS_TOKEN_KEY = window.btoa('access_token');
const REFRESH_TOKEN_KEY = window.btoa('refresh_token');
const LOCAL_STORAGE_UTIL_DATA = window.btoa('local_storage_util_data');

@Injectable()
export class LocalStorageService {

   secureLocalStorage:SecureLS = new SecureLS({
     isCompression : false,
     encodingType : 'aes',
     encryptionSecret : SECRET
   });

  public addAccessToken(accessToken:string) : void {
    this.secureLocalStorage.set(ACCESS_TOKEN_KEY,accessToken);
    localStorage.removeItem('_secure__ls__metadata');
  }

  public getAccessToken():string {
    if(this.secureLocalStorage.get(ACCESS_TOKEN_KEY)==''){
      return null;
    }
    return this.secureLocalStorage.get(ACCESS_TOKEN_KEY);
  }

  public addRefreshToken(refreshToken:string) : void {
    this.secureLocalStorage.set(REFRESH_TOKEN_KEY,refreshToken);
    localStorage.removeItem('_secure__ls__metadata');
  }

  public getRefreshToken() : string {
    if(this.secureLocalStorage.get(REFRESH_TOKEN_KEY)==''){
      return null;
    }
    return this.secureLocalStorage.get(REFRESH_TOKEN_KEY);
  }

  public addUtilData(utilData:LocalStorageUtilData) : void {
    this.secureLocalStorage.set(LOCAL_STORAGE_UTIL_DATA,utilData);
    localStorage.removeItem('_secure__ls__metadata');
  }

  public getUtilData() : LocalStorageUtilData{
    if(this.secureLocalStorage.get(LOCAL_STORAGE_UTIL_DATA)==''){
      return null;
    }
    return this.secureLocalStorage.get(LOCAL_STORAGE_UTIL_DATA) as LocalStorageUtilData;
  }

  public addLanguage(language:string) : void {
    let utilData = this.getUtilData();
    utilData.Language = language;
    this.addUtilData(utilData);
    localStorage.removeItem('_secure__ls__metadata');
  }

  public getLanguage() : string {
    let utilData = this.getUtilData();
    if (utilData && utilData.Language){
      return utilData.Language;
    }
    return null;
  }

  public addCompanyCode(companyCode:string) : void {
    let utilData = this.getUtilData();
    utilData.LastConnectedCompany = companyCode;
    this.addUtilData(utilData);
    localStorage.removeItem('_secure__ls__metadata');
  }

  public getCompanyCode() : string {
    let utilData = this.getUtilData();
    if(utilData){
      return utilData.LastConnectedCompany;
    }
    return null;
  }

  public addEmail(email:string) : void {
    let utilData = this.getUtilData();
    utilData.Email = email;
    this.addUtilData(utilData);
    localStorage.removeItem('_secure__ls__metadata');
  }

  public getEmail() : string {
    let utilData = this.getUtilData();
    if(utilData){
      return utilData.Email;
    }
    return null;
  }


  public addCompanyId(companyId:any) : void {
    let utilData = this.getUtilData();
    utilData.LastConnectedCompanyId = companyId;
    this.addUtilData(utilData);
    localStorage.removeItem('_secure__ls__metadata');
  }

  public getCompanyId() : any {
    let utilData = this.getUtilData();
    if(utilData){
      return utilData.LastConnectedCompanyId;
    }
    return null;
  }

  public getUserId() : any {
    let utilData = this.getUtilData();
    if(utilData){
      return utilData.IdUser;
    }
    return null;
  }


  public getTimeZoneDifference() : any {
    let utilData = this.getUtilData();
    if(utilData){
      return utilData.timeZoneDifference;
    }
    return null;
  }

  public addFormatDate(formatDate:string) : void {
    let utilData = this.getUtilData();
    utilData.format_date = formatDate;
    this.addUtilData(utilData);
    localStorage.removeItem('_secure__ls__metadata');
  }

  public getFormatDate() : string {
    let utilData = this.getUtilData();
    if(utilData){
      return utilData.format_date;
    }
    return null;
  }

  public addCurrencyDetails(currencyDetails : any) : void {
    let utilData = this.getUtilData();
    if(utilData && currencyDetails){
      utilData.IdCurrency = currencyDetails['IdCurrency'];
      utilData.CurrencyCode = currencyDetails['CurrencyCode'];
      utilData.CurrencyPrecision = currencyDetails['CurrencyPrecision'];
      utilData.CurrencySymbole = currencyDetails['CurrencySymbole'];
      utilData.CurrencyDescription = currencyDetails['CurrencyDescription'];
      utilData.ActivityArea = currencyDetails['ActivityArea'];
      this.addUtilData(utilData)
      localStorage.removeItem('_secure__ls__metadata');
    }
  }

  public getCurrencyId() : any {
    let utilData = this.getUtilData();
    if(utilData){
      return utilData.IdCurrency;
    }
    return null;
  }

  public getCurrencyCode() : string {
    let utilData = this.getUtilData();
    if(utilData){
      return utilData.CurrencyCode;
    }
    return null;
  }

  public getCurrencySymbol() : string {
    let utilData = this.getUtilData();
    if(utilData){
      return utilData.CurrencySymbole;
    }
    return null;
  }

  public getCurrencyPrecision() : any {
    let utilData = this.getUtilData();
    if(utilData){
      return utilData.CurrencyPrecision;
    }
    return null;
  }

  public getCurrencyDescription() : string {
    let utilData = this.getUtilData();
    if(utilData){
      return utilData.CurrencyDescription;
    }
    return null;
  }

  public getActivityArea() : any {
    let utilData = this.getUtilData();
    if(utilData){
      return utilData.ActivityArea;
    }
    return null;
  }

  public getUser() : any {
    let user : any = {};
    if(this.getUtilData()){
      user['IdUser'] = this.getUtilData().IdUser;
      user['FirstName'] = this.getUtilData().FirstName;
      user['LastName'] = this.getUtilData().LastName;
      user['Email'] = this.getUtilData().Email;
      user['Login'] = this.getUtilData().Login;
      user['LastConnectedCompany'] = this.getUtilData().LastConnectedCompany;
      user['LastConnectedCompanyId'] = this.getUtilData().LastConnectedCompanyId;
      user['Language'] = this.getUtilData().Language;
      return user;
    }
    return null;
  }

  public clearAll() : void {
    this.secureLocalStorage.remove(ACCESS_TOKEN_KEY);
    this.secureLocalStorage.remove(REFRESH_TOKEN_KEY);
    this.secureLocalStorage.remove(LOCAL_STORAGE_UTIL_DATA);
    this.secureLocalStorage.clear();
  }


  public static convertTokenAdditionalInfoToUtilData(tokenData : any , tokenCreateDate : any , language : any) : LocalStorageUtilData {
      let utilData = new LocalStorageUtilData();
      utilData.IdUser = tokenData['IdUser'];
      utilData.Email = tokenData['Email'];
      utilData.FirstName = tokenData['FirstName'];
      utilData.LastName = tokenData['LastName'];
      utilData.Login = tokenData['Login'];
      utilData.LastConnectedCompanyId = tokenData ['LastConnectedCompanyId'];
      utilData.LastConnectedCompany = tokenData['LastConnectedCompany'];
      utilData.Language = language;
      utilData.timeZoneDifference = (tokenCreateDate.valueOf() - (new Date()).valueOf())/1000;
      return  utilData;
  }
}
