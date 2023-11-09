import { ElementRef, Injectable } from '@angular/core';
import { ConnectedPosition, Overlay, OverlayConfig, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { Router } from '@angular/router';
import { menuState } from '../../models/menu-state';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {
  isOverlay = false; // true;
  isExpanded = true;
  expandedWithMouseOver = false;
  private menuExpandedNotifier$ = new BehaviorSubject<boolean>(true);
  menuExpandedNotifier = this.menuExpandedNotifier$.asObservable();

  isCloudExpanded = false;
  isReportsExpanded = false;
  isAuditExpanded = false;
  isProfileExpanded = false;
  showUserMenu = false;

  menuOverlayRef!: OverlayRef;

  constructor(
    private overlay: Overlay,
    private pb: OverlayPositionBuilder,
    private router: Router
  ) { }

  mouseOver(): void {
    this.expandedWithMouseOver = true;
    this.isExpanded = true;
  }

  mouseLeave(): void {
    if (this.expandedWithMouseOver) {
      this.expandedWithMouseOver = false;
      this.isExpanded = false;
    }
  }

  expandMenu(menuItem: string, origin: ElementRef): void {
    this.isExpanded = true;
    if (this.isOverlay) {
      this.menuExpandedNotifier$.next(false);
      const overlayConfig = new OverlayConfig();
      const scrollStrategy = this.overlay.scrollStrategies.block();
      this.menuOverlayRef = this.overlay.create({
        panelClass: 'menu-overlay',
        positionStrategy: this.pb.flexibleConnectedTo(origin).withPositions([{
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top'
        } as ConnectedPosition]),
        scrollStrategy,
        hasBackdrop: false,
        backdropClass: 'cdk-overlay-transparent-backdrop'
      });
      const componentPortal = new ComponentPortal(MainMenuComponent);
      this.menuOverlayRef.attach(componentPortal);
    } else {
      this.menuExpandedNotifier$.next(true);
    }
    if (menuItem) {
      this.openMenu(menuItem, true);
    }
  }

  closeMenu(): void {
    this.isExpanded = false;
    this.detachOverlay();
    this.menuExpandedNotifier$.next(false);
  }

  detachOverlay(): void {
    if (this.menuOverlayRef) {
      this.menuOverlayRef.detach();
    }
  }

  openMenu(menuItem: string, forceOpen = false): void {
    // Exapndable menu items
    if (menuItem === 'cloud') {
      this.isCloudExpanded = !this.isCloudExpanded;
      return;
    }
    if (menuItem === 'profile') {
      this.isProfileExpanded = !this.isProfileExpanded;
      return;
    }
    const menu = menuState.find(menu => menu.name === menuItem);
    if (forceOpen) {
      menu!.expanded = true;
    } else {
      menu!.expanded = !menu!.expanded;
    }

    if (menuItem === 'reports') {
      this.isReportsExpanded = !this.isReportsExpanded;
      return;
    }
    if (menuItem === 'audit') {
      this.isAuditExpanded = !this.isAuditExpanded;
      return;
    }

    // Non-expandable menu items
    /*if (menu!.navigatable) {
      this.navigateTo(menuItem);
    }*/
    /*
    if (menuItem === 'accounts') {
      this.navigateTo(menuItem);
      return;
    }
    alert(`Meunu item ${menuItem} is not implemented yet`);*/
  }

  navigateTo(menuItem: string, navigate = true): void {
    this.detachOverlay();
    if (navigate) {
      this.router.navigate([`/${menuItem}`]);
    }
    const menu = menuState.find(menu => menu.name === menuItem);
    if (!menu) {
    } else {
      this.unselecteAll();
      menu.selected = true;
      const parent = menuState.find(p => p.name === menu.parent);
      if (parent) {
        parent.expanded = true;
      }
    }
    this.isOverlay = false; //menuItem === '';
    if (!this.isOverlay) {
      this.menuExpandedNotifier$.next(true);
    }
    //this.closeMenu();
  }

  isMenuItemSelected(menuItem: string): boolean {
    const menu = menuState.find(menu => menu.name === menuItem);
    if (!menu) {
      return false;
    }
    return menu.selected;
  }

  isMenuItemExpanded(menuItem: string): boolean {
    const menu = menuState.find(menu => menu.name === menuItem);
    if (!menu) {
      return false;
    }
    return menu.expanded;
  }

  private unselecteAll(): void {
    menuState.forEach(menu => menu.selected = false);
  }

}
