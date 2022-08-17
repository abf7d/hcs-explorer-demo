import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ImageViewerComponent} from './components/image-viewer/image-viewer.component';

const routes: Routes = [
  {path: '', redirectTo: '/viewer', pathMatch: 'full'},
  {
    path: 'viewer',
    component: ImageViewerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
