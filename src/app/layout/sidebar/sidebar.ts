import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../services/sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {

  constructor(public sidebarService: SidebarService) { }

  role = localStorage.getItem('role') ?? '';
  email = localStorage.getItem('email') ?? '';

  get isAdmin(): boolean {
    return this.role === 'Admin';
  }

  get isStaff(): boolean {
    return this.role === 'InternalStaff';
  }

  get isCustomer(): boolean {
    return this.role === 'Customer';
  }

}