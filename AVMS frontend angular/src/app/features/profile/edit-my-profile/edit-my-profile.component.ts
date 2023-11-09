import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { result } from 'lodash';
import { catchError, timer } from 'rxjs';
import { ApiError } from 'src/app/models/api-error';
import { ErrorDialogComponent } from 'src/app/shared/components/dialogs/error-dialog/error-dialog.component';
import { ErrorDialogData } from 'src/app/shared/components/dialogs/models/error-dialog-data';
import { ModalDialogData } from 'src/app/shared/components/dialogs/models/modal-dialog-data';
import { ModalDialogResponseOptions } from 'src/app/shared/components/dialogs/models/modal-dialog-reponse-options';
import { PreviewDialogData } from 'src/app/shared/components/dialogs/models/preview-dialog-data';
import { PreviewDialogComponent } from 'src/app/shared/components/dialogs/preview-dialog/preview-dialog.component';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { Timezone } from 'src/app/shared/models/timezone';
import { CatalogHttpService } from 'src/app/shared/services/catalog-http.service';
import { CountryHttpService } from 'src/app/shared/services/country-http.service';
import { NotifierService } from 'src/app/shared/services/notifier.service';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-my-profile',
  templateUrl: './edit-my-profile.component.html',
  styleUrls: ['./edit-my-profile.component.scss']
})
export class EditMyProfileComponent implements OnInit {
  reactiveForm!: FormGroup;
  
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'My Profile', url: '' },
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
    isMyUser: true,
    teams: [],
    avatar: ""
  };

  timezoneOptions = [
    { id: '0', description: 'Select a timezone' }
  ];

  countryOptions = [
    { id: '0', description: 'Argentina' },
    { id: '1', description: 'Brazil' },
    { id: '2', description: 'Ireland' },
    { id: '3', description: 'United States of America' },
  ];

  selectedCountry: string = "";
  selectedTimezone: string = "";

  constructor(
    private dialog: Dialog,
    private userService: UserService, 
    private router: Router,
    private catalogHttpService: CatalogHttpService,
    private countryHttpService: CountryHttpService,
    private toaster: NotifierService
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
          this.myProfile.avatar = 'data:image/jpeg;base64,' + result.data.avatar;
          this.userService.myProfile = this.myProfile;

          //this.myProfile = this.userService.myProfile;
          this.timezoneOptions = this.userService.timezoneOptions.map(function (timezone, index, array) {
            return { id: String(timezone.timezone), description: timezone.timezone_name }; 
          });
          this.countryOptions = this.userService.countryOptions.map(function (country, index, array) {
            return { id: String(country.country), description: country.country_name }; 
          });

          this.selectedCountry = String(this.myProfile.country);
          this.selectedTimezone = String(this.myProfile.timezone);
        });
      });
    });
  }

  toggleToView(): void {
    this.router.navigate([`/home`]);
  }

  saveProfile(): void {
    this.userService.editMyProfile().pipe(
      catchError(err => {
        const error = err.error as ApiError;
        this.toaster.showError('error', error.message.join('\n'));
        throw err;
      })
    ).subscribe(res => {
      window.location.reload();
      this.toaster.showSuccess('Well done!', 'User was successfully saved.');
        timer(1000).subscribe(); 
    });
  }

  updateAvatar(event: any): void {
    let file = event.target.files[0];
    let split_ext = file.name.split('.');
    let ext = split_ext[split_ext.length - 1];
    let size = file.size;
    let allow_ext = ['jpg', 'jpeg', 'png'];
    let width = 0;
    let height = 0;
    let img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      width = img.width;
      height = img.height;

      let error_msg = '';
      if(!allow_ext.includes(ext)){
        error_msg = 'Only image files (jpg, png) are allowed.';
      }
      else {
        if(size > 2097152){
          error_msg = 'File size must be less than 2MB.';
        }
        if (width < 400 || width > 1024 || height < 400 || height > 1024){
          if(error_msg != ''){
            error_msg += '<br/>'
          }
          error_msg += 'Image width and height must be between 400 and 1024 pixels.';
        }
      }

      if(error_msg != ''){
        const data: ErrorDialogData = {
           title: 'Error',
           buttonText: 'Close',
           errorMessage: error_msg
        };
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
          width: '750px',
          data: data,
        });
      }
      else{
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img = reader.result!.toString().replace(/^data:image\/[a-z]+;base64,/, "");
          this.userService.updateAvatar(img).subscribe(result => {
            this.userService.getAvatar().subscribe(res => {
              this.myProfile.avatar = res.data;
            })
          });
        };
        reader.onerror = function (error) {
        };
      }
    }
  }
   
  removeAvatar(): void {
    this.userService.removeAvatar().subscribe(result => {
      this.userService.getAvatar().subscribe(res => {
        this.myProfile.avatar = res.data;
      })
    });
  }

  timezoneChanged(timezone: string): void {
    this.userService.myProfile.timezone = Number(timezone);
    this.userService.myProfile.timezone_name = this.timezoneOptions.find(p => p.id === timezone)?.description;
  }

  countryChanged(country: string): void {
    this.userService.myProfile.country = Number(country);
    this.userService.myProfile.country_name = this.countryOptions.find(p => p.id === country)?.description;
  }

  previewAvatar(): void {
    const data: PreviewDialogData = {
      title: 'Avatar Preview',
      imgSrc: this.myProfile.avatar
    };
    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      width: '750px',
      data: data
    });
  }
}
