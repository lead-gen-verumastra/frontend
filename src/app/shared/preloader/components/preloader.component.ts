import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-preloader',
  templateUrl: '../templates/preloader.component.html',
  styleUrls: ['../styles/preloader.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class PreloaderComponent {
  @Input('size') size = '';
  @Input('changeColor') changeColor = false;
  @Input('isReportLoader') isReportLoader = false;
}
