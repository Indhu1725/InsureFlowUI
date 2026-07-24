import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';
import { SidebarService } from '../../services/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ RouterOutlet, Sidebar,Navbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent {

  constructor(public sidebarService: SidebarService) { }

}