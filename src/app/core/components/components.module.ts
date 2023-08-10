import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeDirective } from '@pdfgroup/core/components/badge/badge.directive';

@NgModule({
    imports: [CommonModule],
    providers: [],
    declarations: [BadgeDirective],
    exports: [BadgeDirective],
})
export class ComponentsModule {}
