import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PdfModule } from './pdf/pdf.module';
import { EditorModule } from './editor/editor.module';
import { PreviewModule } from './preview/preview.module';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, EditorModule, PdfModule, PreviewModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
