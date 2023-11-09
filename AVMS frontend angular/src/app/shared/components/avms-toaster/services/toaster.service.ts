import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { Toast } from '../models/toast';
import { ToastType } from '../models/toast-type';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  subject = new BehaviorSubject<Toast | null>(null);
  toast$ = this.subject.asObservable().pipe(filter(toast => toast !== null));

  constructor() {}

  show(type: ToastType, title = '', body = '', delay = 5000) {
    this.subject.next({ type, title, body, delay });
  }
}
