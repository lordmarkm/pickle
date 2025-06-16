import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-errorcard',
  imports: [ MatCardModule, CommonModule ],
  templateUrl: './errorcard.component.html',
  styleUrl: './errorcard.component.scss'
})
export class ErrorcardComponent {

  @Input() error: string | null = null;
  @Input() message: string | null = null;

}
