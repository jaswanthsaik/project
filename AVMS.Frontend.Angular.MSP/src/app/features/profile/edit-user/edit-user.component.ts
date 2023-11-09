import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Timezone } from 'src/app/shared/models/timezone';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  company: string | undefined = "";
  country: string = "";
  timezone: string = "";
  role: string = "";
  avatar: string = "";
  countryOptions = [
    { id: '0', description: 'Select a country' }
  ];

  timezoneOptions = [
    { id: '0', description: 'Select a timezone' }
  ];

  roleOptions = [
    { id: '0', description: 'Select a role' },
    { id: '1', description: 'Administrator' },
    { id: '2', description: 'Team Lead' },
    { id: '3', description: 'Team Member' },
    { id: '4', description: 'Financial' },
  ];

  constructor(private userService: UserService, private dialogRef: DialogRef) { }

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe(result => {
      this.userService.userProfile.company_name = result.data.company_name;
      this.company = result.data.company_name;
    })
    this.firstName = this.userService.userProfile.first_name;
    this.lastName = this.userService.userProfile.last_name;
    this.email = this.userService.userProfile.email;
    this.company = this.userService.userProfile.company_name;
    this.country = String(this.userService.userProfile.country);
    this.timezone = String(this.userService.userProfile.timezone);
    this.role = this.userService.userProfile.role_index;
    this.avatar = this.userService.userProfile.avatar;
    this.timezoneOptions = this.userService.timezoneOptions.map(function (timezone, index, array) {
      return { id: String(timezone.timezone), description: timezone.timezone_name }; 
    });
    this.countryOptions = this.userService.countryOptions.map(function (country, index, array) {
      return { id: String(country.country), description: country.country_name }; 
    });
  }

  countryChanged(country: string): void {
    this.userService.userProfile.country = Number(country);
    this.userService.userProfile.country_name = this.countryOptions.find(p => p.id === country)?.description;
  }

  timezoneChanged(timezone: string): void {
    this.userService.userProfile.timezone = Number(timezone);
    this.userService.userProfile.timezone_name = this.timezoneOptions.find(p => p.id === timezone)?.description;
  }

  roleChanged(role: string): void {
    this.userService.userProfile.role_index = role;
    this.userService.userProfile.role_name = this.roleOptions.find(p => p.id === role)?.description;
  }

  ngOnDestroy(): void {
    this.userService.userProfile.first_name = this.firstName;
    this.userService.userProfile.last_name = this.lastName;
    this.userService.userProfile.email = this.email;
    this.userService.userProfile.company_name = this.company;
  }
  dialogClose() {
    this.dialogRef.close();
  }
}
