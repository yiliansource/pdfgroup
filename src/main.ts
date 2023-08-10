import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { akitaConfig } from '@datorama/akita';
import { produce } from 'immer';

akitaConfig({
    resettable: true,
    producerFn: produce,
});

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
