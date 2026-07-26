import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { ClaimService } from '../../services/claim';
import { CustomerService } from '../../services/customer';
import { UserService } from '../../services/user';
import { SidebarService } from '../../services/sidebar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  notifications: any[] = [];
  showNotifications = false;
  showProfileMenu = false;
  userEmail = localStorage.getItem('email') || '';
  userRole = localStorage.getItem('role') || '';

  searchText = signal('');

  constructor(
  private router: Router,
  private claimService: ClaimService,
  private customerService: CustomerService,
  private userService: UserService,
  private sidebarService: SidebarService,
  private toastr: ToastrService
) { }
ngOnInit(): void {

  this.loadNotifications();

}


  search(): void {

  const text = this.searchText().trim().toLowerCase();

  if (!text) {
    return;
  }

  if (text.includes('customer')) {
    this.router.navigate(['/customers']);
  }

  else if (text.includes('policy plan') || text.includes('plan')) {
    this.router.navigate(['/policy-plans']);
  }

  else if (text.includes('policy')) {
    this.router.navigate(['/policies']);
  }

  else if (text.includes('claim')) {
    this.router.navigate(['/claims']);
  }

  else if (text.includes('premium')) {
    this.router.navigate(['/premium-payments']);
  }

  else if (text.includes('product')) {
    this.router.navigate(['/products']);
  }

  else if (text.includes('user')) {
    this.router.navigate(['/users']);
  }

  else if (text.includes('dashboard')) {
    this.router.navigate(['/dashboard']);
  }

  else {
    this.toastr.warning('No matching page found.','Search');
  }
   this.searchText.set('');

}
loadNotifications(): void {

  this.notifications = [];

  // ================= Claims =================

  if (this.userRole === 'Admin') {

    this.claimService.getAllClaims().subscribe({

      next: (response: any) => {

        const claims = (response.data || []).slice(0, 3).map((claim: any) => ({
          icon: '📝',
          message: `New Claim #${claim.claimNumber ?? claim.claimId}`,
          date: claim.createdDate,
          route: `/claims/view/${claim.claimId}`
        }));

        this.notifications.push(...claims);
        this.sortNotifications();

      }

    });

  }

  else if (this.userRole === 'InternalStaff') {

    this.claimService.getReviewClaims().subscribe({

      next: (response: any) => {

        const claims = (response.data || []).slice(0, 3).map((claim: any) => ({
          icon: '📝',
          message: `Claim #${claim.claimNumber ?? claim.claimId} needs review`,
          date: claim.createdDate,
          route: `/claims/view/${claim.claimId}`
        }));

        this.notifications.push(...claims);
        this.sortNotifications();

      }

    });

  }

  // ================= Customers =================

  this.customerService.getCustomers().subscribe({

    next: (response: any) => {

      const customers = (response.data?.items || response.items || response.data?.records || []).slice(0, 3).map((customer: any) => ({
        icon: '👤',
        message: `New Customer ${customer.fullName ?? customer.customerName ?? customer.name}`,
        date: customer.createdDate,
        route: '/customers'
      }));

      this.notifications.push(...customers);
      this.sortNotifications();

    }

  });

  // ================= Users (Admin Only) =================

  if (this.userRole === 'Admin') {

    this.userService.getUsers().subscribe({

      next: (response: any) => {

        const users = (response.data?.records || response.data?.items || response.items || []).slice(0, 3).map((user: any) => ({
          icon: '👥',
          message: `New User ${user.fullName ?? user.userName ?? user.email}`,
          date: user.createdDate,
          route: '/users'
        }));

        this.notifications.push(...users);
        this.sortNotifications();

      }

    });

  }

}
sortNotifications(): void {

  this.notifications.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  this.notifications = this.notifications.slice(0, 10);

}
openNotification(notification: any): void {

  this.showNotifications = false;

  if (notification.route) {
    this.router.navigate([notification.route]);
  }

}
toggleProfileMenu(): void {

  this.showProfileMenu = !this.showProfileMenu;

}
goToProfile(): void {

  this.showProfileMenu = false;

  if (this.userRole === 'Customer') {
    this.router.navigate(['/customers/my-profile']);
  }
  else {
    this.router.navigate(['/dashboard']);
  }

}
toggleNotifications(): void {

  this.showNotifications = !this.showNotifications;
  this.toastr.success('Notifications updated.','Success');

}
  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
     this.toastr.success('Logged out successfully.','Success');

    this.router.navigate(['/login']);

  }
  toggleSidebar(): void {

  this.sidebarService.toggle();

}

}