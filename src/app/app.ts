import { Component, signal } from '@angular/core';
import { Sidebar } from './layout/sidebar/sidebar';
import { Navbar } from './layout/navbar/navbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Sidebar, Navbar, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('InsureFlowUI');
}
