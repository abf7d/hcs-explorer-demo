import {Inject, Injectable} from '@angular/core';
import * as KEYS from '../constants/keys';
import { Theme } from '../models/theme';
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(@Inject(KEYS.THEME_TOKEN) private themes: Array<Theme>) {}

  public setAttribute(name: string, value: string) {
    const propVarName = `--${name}`;
    document.documentElement.style.setProperty(propVarName, value);
  }

  private setThemeProps(props: any, theme: Theme) {
    if (theme !== undefined) {
      // child properties get set first because parent properties should over override them
      if (theme.extend) {
        const childTheme = this.themes.find((theme) => theme.name === theme.extend);
        if (childTheme) this.setThemeProps(props, childTheme);
      }
      for (const prop of Object.keys(theme.properties)) {
        props[prop] = theme.properties[prop];
      }
    }
  }

  public setActiveTheme(name: string): void {
    const activeTheme = this.themes.find((theme) => theme.name === name);
    if (!activeTheme) {
      throw new Error(`Theme with name ${name} was not found`);
    }

    const props = {};
    this.setThemeProps(props, activeTheme);
    activeTheme.properties = props;

    for (const prop of Object.keys(activeTheme.properties)) {
      const propVarName = `--${prop}`;
      document.documentElement.style.setProperty(propVarName, activeTheme.properties[prop]);
    }
  }
}
