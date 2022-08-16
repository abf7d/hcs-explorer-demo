import {Injectable, NgZone} from '@angular/core';
import {Store} from '@ngrx/store';
import {setImageSource, setDefaultConfig, setLayers} from '@labshare/polus-render-library';
import {DefaultConfig} from '@labshare/polus-render-library';

@Injectable({
  providedIn: 'root'
})
export class ImageViewerService {
  constructor(private store: Store, private ngZone: NgZone) {}

  setSource(imageUrl, images) {
    this.ngZone.run(() => {
      this.store.dispatch(
        setImageSource({
          imageSource: {
            source: imageUrl,
            images
          }
        })
      );
    });
  }

  setDefaultConfig(defaultConfig) {
    const config: DefaultConfig = {defaultChannelConfigs: []};
    config.defaultChannelConfigs = defaultConfig.map(val => {
      let slidersCopy = null;
      let colorsCopy = null;

      if (val.sliders) {
        slidersCopy = [...val.sliders];
      }
      if (val.colors) {
        colorsCopy = [...val.colors];
      }
      return {url: val.url, sliders: slidersCopy, colors: colorsCopy};
    });
    this.ngZone.run(() => {
      this.store.dispatch(setDefaultConfig({config}));
    });
  }

  setLayers(imageOverlayLayers) {
    for (const layer of imageOverlayLayers) {
      this.ngZone.run(() => {
        const imageUrl = layer.url;
        const layers = [...layer.overlayLayers];
        this.store.dispatch(setLayers({imageUrl, layers}));
      });
    }
  }
}
