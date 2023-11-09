import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreviewDialogData } from 'src/app/shared/components/dialogs/models/preview-dialog-data';
import { PreviewDialogComponent } from 'src/app/shared/components/dialogs/preview-dialog/preview-dialog.component';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { CatalogHttpService } from 'src/app/shared/services/catalog-http.service';
import { CountryHttpService } from 'src/app/shared/services/country-http.service';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-view-my-profile',
  templateUrl: './view-my-profile.component.html',
  styleUrls: ['./view-my-profile.component.scss']
})
export class ViewMyProfileComponent implements OnInit {

  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: '', url: '' },
  ];

  myProfile: User = {
    user: 0,
    first_name: "",
    last_name: "",
    password: "",
    email: "",
    company_name: "",
    country_name: "",
    country: 0,
    timezone_name: "",
    timezone: 0,
    role_name: "",
    role_index: "",
    teams: [],
    isMyUser: true,
    avatar: ""
  };

  constructor(
    private dialog: Dialog,
    private userService: UserService,
    private router: Router,
    private catalogHttpService: CatalogHttpService,
    private countryHttpService: CountryHttpService
  ) { }

  ngOnInit(): void {
    this.catalogHttpService.getTimezones().subscribe(timezones => {
      this.userService.timezoneOptions = this.userService.timezoneOptions.concat(timezones.data);
      this.countryHttpService.getCountries().subscribe(countries => {
        this.userService.countryOptions = this.userService.countryOptions.concat(countries.data);
        this.userService.getMyProfile().subscribe(result => {
          const userDetails = result.data;
          this.myProfile.user = userDetails.user;
          this.myProfile.first_name = userDetails.first_name;
          this.myProfile.last_name = userDetails.last_name;
          this.myProfile.email = userDetails.email;
          this.myProfile.company_name = userDetails.company_name;
          this.myProfile.country_name = this.userService.countryOptions.find(p => p.country === userDetails.country)?.country_name;
          this.myProfile.country = userDetails.country;
          this.myProfile.timezone_name = this.userService.timezoneOptions.find(p => p.timezone === userDetails.timezone)?.timezone_name;
          this.myProfile.timezone = userDetails.timezone;
          this.myProfile.avatar = userDetails.avatar;
          this.userService.myProfile = this.myProfile;
        });
      });
    });
  }

  toggleToEdit(): void {
    this.router.navigate([`/profile/edit`]);
  }

  previewAvatar(): void {
    const data: PreviewDialogData = {
      title: 'Avatar Preview',
      imgSrc: 'data:image/jpeg;base64,' + this.myProfile.avatar
    };
    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      width: '750px',
      data: data
    });
  }
}
