import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import * as KEYS from './constants/keys';
import * as THEMES from './constants/themes/all-themes';
import {
  overviewReducer,
  sourceReducer,
  imageReducer,
  sideBySideReducer,
  lensReducer,
  defaultConfigReducer,
  overlayReducer,
  LayerMenuLibModule,
} from '@labshare/polus-render-library';

// import '@labshare/polus-viv-components';
// import '@labshare/polus-render-components';
  
  import {VivEngineLibModule,VivMenuLibModule } from '@labshare/polus-render-library';
// import '@labshare/polus-viv-components';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { APP_TYPE, initializeFromAppConf, NgxCoreServicesModule } from '@labshare/ngx-core-services';

import {
  AuthService,
  ConfigService,
  initializeFromUrl,
  AppType,
  BaseUIServicesModule,
  AuthInterceptor
} from '@labshare/base-ui-services';
import { CommonModule } from '@angular/common';

function initialize(http: HttpClient, config: ConfigService, auth: AuthService): () => Promise<any> {
  return async () => {
    navigator;
    return initializeFromUrl(http, config, auth, `./config/config.json`);
  };
}

let APP_CONF = {
  production: false,
  services: {
    auth: {
      storage: 'local'
    }
  }
};


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    VivEngineLibModule,
    HttpClientModule,
    LayerMenuLibModule,
    // PolusOverlayLibModule, 
    VivMenuLibModule,
    // NgxCoreServicesModule.forRoot({appConf: APP_CONF, appType: 'app', appBuildVersion: '123'}),
    BaseUIServicesModule.forRoot({appConf: APP_CONF, appType: AppType.Site, appBuildVersion: '123'}),
    StoreModule.forRoot({
      overview: overviewReducer,
      imageConfig: imageReducer,
      imageSource: sourceReducer,
      sideBySideConfig: sideBySideReducer,
      lensConfig: lensReducer,
      defaultConfig: defaultConfigReducer,
      overlay: overlayReducer
    }),
    StoreDevtoolsModule.instrument(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {provide: KEYS.THEME_TOKEN, useValue: THEMES.ALL},,
    {
      provide: APP_INITIALIZER,
      useFactory: initialize,
      deps: [HttpClient, ConfigService, AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
