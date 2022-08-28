import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../login/services/login.service';
import { Company } from '../../../../models/administration/company.model';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { Router } from '@angular/router';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../../COM/Growl/growl.service';
import { UserJavaService } from '../../../../administration/services/user/user.java.service';
import { Operation } from '../../../../../COM/Models/operations';
import { CompanyConstant } from '../../../../constant/Administration/company.constant';
import { LocalStorageService } from '../../../../login/Authentification/services/local-storage-service';
import { UserRequestDto } from '../../../../login/Authentification/models/user-request-dto';

@Component({
  selector: 'app-company-dropdown',
  templateUrl: './company-dropdown.component.html',
  styleUrls: ['./company-dropdown.component.scss']
})
export class CompanyDropdownComponent implements OnInit {

  public companiesFiltredDataSource: Company[];
  public companiesDataSource: Company[];
  public selectedCompany: string;
  public showDropDown: boolean;

  public bool: boolean;

  constructor(private growlService: GrowlService, private loginService: LoginService, private companyService: CompanyService,
    private changeDetector: ChangeDetectorRef, private router: Router, private translate: TranslateService, private userJavaService: UserJavaService,
    private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    this.getCompanyList();
  }


  public getCompanyList() {
    this.loginService.getCompanyList().subscribe(data => {
      if (data) {
        let userRequestDto = new UserRequestDto();
        userRequestDto.email = this.localStorageService.getEmail();
        this.companiesDataSource = data;
        this.userJavaService.getJavaGenericService().callService(Operation.POST, 'user-info', userRequestDto).subscribe((userInfo) => {
          if (userInfo) {
            this.localStorageService.addCompanyCode(userInfo.LastConnectedCompany);
            this.selectedCompany = this.companiesDataSource.filter(c => c.Code === this.localStorageService.getCompanyCode())[0].Name;
            this.companiesFiltredDataSource = this.companiesDataSource.filter(c => c.Code !== this.localStorageService.getCompanyCode());
            this.showDropDown = this.companiesFiltredDataSource.length > NumberConstant.ZERO;
            this.changeDetector.detectChanges();
          }
        });
      }
    });
  }

  public selectionChange(company: Company) {
    let userRequestDto = new UserRequestDto();
    userRequestDto.companyCode = company.Code;
    if (company) {
      this.loginService.changeCompany(company.Code).subscribe((data) => {
        this.selectedCompany = company.Name;
        this.router.navigateByUrl(CompanyConstant.DASHBOARD);
        this.localStorageService.addCompanyCode(company.Code);
        this.changeDetector.detectChanges();
        setTimeout(() => {
          window.location.reload();
        }, NumberConstant.TWO_THOUSAND);
        this.userJavaService.getJavaGenericService().callService(Operation.POST, 'switch-company', userRequestDto).subscribe(() => { });
      });

    } else {
      this.selectedCompany = '';
    }
  }
}
