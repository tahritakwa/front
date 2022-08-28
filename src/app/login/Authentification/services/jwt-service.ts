import {Injectable} from '@angular/core';
import jwt_decode from "jwt-decode";
@Injectable()
export class JwtService{

  decodeToken(token:string):any{
    return jwt_decode(token);
  }

  getTokenExpirationDate(token:string): Date{
    let decodedToken = this.decodeToken(token);

    if(typeof decodedToken.exp === "undefined") {
      return null;
    }
    let d = new Date(0); // The 0 here is the key, which sets the date to the epoch
    d.setUTCSeconds(decodedToken.exp);
    return d;
  }

  isTokenExpired(token:string , offsetSeconds:number): boolean{
    let d = this.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;
    if (d === null) {
      return false;
    }
    // Token expired?
    return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
  }

  isTokenExpiredNowOrAfterOneMinute(token:string , offsetSeconds:number): boolean{
    let d = this.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;
    if (d === null) {
      return false;
    }
    // Token expired?
    return !(d.valueOf() > (new Date().valueOf() + (( offsetSeconds + 60 ) * 1000)));
  }
}
