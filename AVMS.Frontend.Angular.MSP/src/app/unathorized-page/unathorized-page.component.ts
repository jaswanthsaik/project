import { Component, OnInit } from '@angular/core';
import { LoginService } from '../features/authentication/login.service';

@Component({
  selector: 'app-unathorized-page',
  templateUrl: './unathorized-page.component.html',
  styleUrls: ['./unathorized-page.component.scss']
})
export class UnathorizedPageComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  goToLogin() {
    this.loginService.logout();
  }
}
