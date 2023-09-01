/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { akitaConfig } from '@datorama/akita';
import { produce } from 'immer';

import { AppModule } from './app/app.module';

// Initialize the pdf.js worker via the appropriate CDN endpoint.
import('pdfjs-dist/build/pdf').then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
});

akitaConfig({
    resettable: true,
    producerFn: produce,
});

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
