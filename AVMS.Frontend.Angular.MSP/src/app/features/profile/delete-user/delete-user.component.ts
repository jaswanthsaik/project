import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  firstName: string = "";
  lastName: string = "";
  email: string = "";
  company: string | undefined = "";
  country: string | undefined = "";
  timezone: string | undefined = "";
  role: string | undefined = "";

  constructor(private userService: UserService,private dialogRef: DialogRef) { }

  ngOnInit(): void {
    this.firstName = this.userService.userProfile.first_name;
    this.lastName = this.userService.userProfile.last_name;
    this.email = this.userService.userProfile.email;
    this.company = this.userService.userProfile.company_name;
    this.country = this.userService.userProfile.country_name;
    this.timezone = this.userService.userProfile.timezone_name;
    this.role = this.userService.userProfile.role_name;
  }

  cancelDialog(): void {
    this.dialogRef.close(false);
  }
  primary(): void {
    this.dialogRef.close(true);
  }
}
