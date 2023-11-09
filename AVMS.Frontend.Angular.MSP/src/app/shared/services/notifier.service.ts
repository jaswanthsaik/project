import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotifierService {
  constructor(private toastr: ToastrService) { }

  showSuccess(message: any, title: any,) {
    this.toastr.success(title, message)
  }

  showError(message: any, title: any) {
    this.toastr.error(title, message)
  }

  showInfo(message: any, title: any) {
    this.toastr.info(message, title)
  }

  showWarning(message: any, title: any) {
    this.toastr.warning(message, title)
  }
}
