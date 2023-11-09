import { ComponentPortal } from '@angular/cdk/portal';

export interface ModalDialogData {
    title: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    cancelButtonText: string;
    portal: ComponentPortal<any>;
    confirmTitle?: string;
    confirmMessage?: string;
    dialogType?: string;
}
