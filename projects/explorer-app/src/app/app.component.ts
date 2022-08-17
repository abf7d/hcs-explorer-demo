import {Component, OnInit} from '@angular/core';
import {ImageViewerService} from './image-viewer.service';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '@labshare/base-ui-services';
import {ThemeService} from './services/theme.service';
import * as KEYS from './constants/keys';
import urls from './urls.json';
import names from './names.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private config: ConfigService,
    public imageViewerService: ImageViewerService,
    private http: HttpClient,
    private themeService: ThemeService
  ) {}

  async ngOnInit() {
    this.themeService.setActiveTheme(KEYS.PAGE_THEME_DARK_NAME);
    const imageUrl = this.config.get('imageUrl');
    let images: any;
    let defaultConfig: any[];

    if (this.config.get('images')) {
      images = this.config.get('images');
      defaultConfig = this.config
        .get('images')
        .map((val: any) => ({url: imageUrl + val.name, sliders: val.sliders, colors: val.colors}));

      const imageOverlayLayers = this.config.get('images').map((image: any) => {
        let overlayLayers = [];
        if (image.overlay) {
          if (image.overlay.layers) {
            overlayLayers = image.overlay.layers;
            this.addUrlsToConfig(overlayLayers[0]);
          }
        }
        return {url: imageUrl + image.name, overlayLayers};
      });

      this.imageViewerService.setLayers(imageOverlayLayers);
      this.imageViewerService.setDefaultConfig(defaultConfig);
    } else {
      images = await this.http.get(imageUrl).toPromise();
    }
    const mappedImages = images.map((val: any) => ({name: val.name, url: imageUrl + val.name}));

    this.imageViewerService.setSource(mappedImages[0].url, mappedImages);
  }

  addUrlsToConfig(layer) {
    for (let i = 0; i < layer.data.length; i++) {
      layer.data[i].drugUrl = urls[i % 20];
      layer.data[i].drug_name = names[i % 20];
    }
  }

  // modifies layer configuration based on viewState
  configModifier = (viewState: any, oldLayerConfig: any) => {
    try {
      if (oldLayerConfig.id === 'grid-demo-layer') {
        const newLayerConfig = JSON.parse(JSON.stringify(oldLayerConfig));
        if (viewState != null && viewState.zoom != null) {
          // zoom -4
          if (viewState.zoom > -3) {
            newLayerConfig.text.global.size = 16;
            newLayerConfig.onHover.hide = true;
            newLayerConfig.onHover.color = [0, 0, 0, 0];
            newLayerConfig.text.fields.forEach(field => {
              if (field.field === 'well_location') {
                field.color = [255, 200, 200, 200];
              }
              field.hide = false;
            });
            if (newLayerConfig.images?.fields != null) {
              newLayerConfig.images.fields.forEach(field => {
                field.hide = false;
              });
            }
          }
          // zoom -5
          else if (viewState.zoom > -4) {
            newLayerConfig.text.global.size = 14;
            newLayerConfig.onHover.hide = true;
            newLayerConfig.onHover.color = [0, 0, 0, 0];
            newLayerConfig.text.fields.forEach(field => {
              if (field.field === 'well_location') {
                field.color = [255, 200, 200, 200];
              }
              field.hide = false;
            });
            if (newLayerConfig.images?.fields != null) {
              newLayerConfig.images.fields.forEach(field => {
                field.hide = false;
              });
            }
          }
          // zoom -6
          else if (viewState.zoom > -5) {
            newLayerConfig.text.global.size = 12;

            newLayerConfig.onHover.textFields = ['concentration', 'time_point'];
            newLayerConfig.text.fields.forEach(field => {
              field.hide = !(field.field === 'well_location' || field.field === 'drug_name');
            });
            if (newLayerConfig.images?.fields != null) {
              newLayerConfig.images.fields.forEach(field => {
                field.hide = true;
              });
            }
          }
          // zoom -7
          else if (viewState.zoom > -7) {
            newLayerConfig.onHover.textFields = ['drug_name', 'concentration', 'time_point'];
            newLayerConfig.text.fields.forEach(field => {
              field.hide = !(field.field === 'well_location');
            });
            if (newLayerConfig.images?.fields != null) {
              newLayerConfig.images.fields.forEach(field => {
                field.hide = true;
              });
            }
          } else {
            if (newLayerConfig.text?.fields != null) {
              newLayerConfig.text.fields.forEach(field => {
                field.hide = true;
              });
            }

            if (newLayerConfig.images?.fields != null) {
              newLayerConfig.images.fields.forEach(field => {
                field.hide = true;
              });
            }

            newLayerConfig.onHover.textFields = ['well_location', 'drug_name', 'concentration', 'time_point'];
          }
        }
        return newLayerConfig;
      } else {
        return oldLayerConfig;
      }
    } catch (err) {
      throw new Error('config modifier error');
      return oldLayerConfig;
    }
  };
}
