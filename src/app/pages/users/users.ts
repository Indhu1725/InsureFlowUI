import { Component, OnInit,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../services/user';
import { UserResponse } from '../../models/user-response';
import { UserStatusUpdate } from '../../models/user-status-update';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {

  users = signal<UserResponse[]>([]);

  allUsers = signal<UserResponse[]>([]);

  selectedFilter = signal('all');

  selectedStatus = signal('all');

  isLoading = signal(false);

  pageNumber = signal(1);

  pageSize = signal(10);

  totalPages = signal(1);

  constructor(private userService: UserService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

  this.isLoading.set(true);

  this.userService.getUsers(
    this.pageNumber(),
    this.pageSize(),
    'createdDate',
    'desc'
  ).subscribe({

    next: response => {

      this.users.set(response.data.records);

      this.allUsers.set(response.data.records);

      this.totalPages.set(response.data.totalPages);

      this.pageNumber.set(response.data.currentPage);

      this.isLoading.set(false);

    },

    error: () => {

  this.isLoading.set(false);

  this.toastr.error('Unable to load users.','Error');

}

  });

}
 onFilterChange(filter: string): void {

  this.selectedFilter.set(filter);

  if (filter === 'all') {

    this.loadUsers();

  }

  else if (filter === 'active') {

    this.loadActiveUsers();

  }

  else if (filter === 'staff') {

    this.loadInternalStaff();

  }

  else if (filter === 'id') {

    this.users.set([]);

  }

}
  loadActiveUsers(): void {

  this.isLoading.set(true);

  this.userService.getActiveUsers().subscribe({

    next: response => {

      this.users.set(response.data);

      this.allUsers.set(response.data);

      this.isLoading.set(false);

    },

    error: () => {

  this.isLoading.set(false);

  this.toastr.error('Unable to load active users.','Error');

}

  });

}

  loadInternalStaff(): void {

  this.isLoading.set(true);

  this.userService.getInternalStaff().subscribe({

    next: response => {

      this.users.set(response.data);

      this.allUsers.set(response.data);

      this.isLoading.set(false);

    },

    error: () => {

  this.isLoading.set(false);

  this.toastr.error('Unable to load internal staff.','Error');

}

  });

}

 searchById(id: number): void {

  this.isLoading.set(true);

  this.userService.getUserById(id).subscribe({

    next: response => {

     this.users.set([response.data]);

    this.allUsers.set([response.data]);

      this.isLoading.set(false);
      this.toastr.success('User found successfully.','Success');

    },

    error: () => {

  this.users.set([]);
  this.isLoading.set(false);

  this.toastr.error(
    'User not found.',
    'Error'
  );

}

  });

}
  onStatusChange(status: string): void {

    this.selectedStatus.set(status);

    if (status === 'all') {

      this.users.set(this.allUsers());
    }

    else if (status === 'active') {

      this.users.set(
  this.allUsers().filter(user => user.isActive)
);

    }

    else if (status === 'inactive') {

     this.users.set(
  this.allUsers().filter(user => !user.isActive)
);

    }

  }

  changeStatus(user: UserResponse): void {

   const request: UserStatusUpdate = {

  isActive: !user.isActive

};

    this.userService.updateStatus(user.userId, request).subscribe({

      next: () => {

       this.toastr.success('User status updated successfully');

        this.loadUsers();

      },

      error: (error) => {

  console.error(error);

  this.toastr.error(
    'Failed to update user status.',
    'Error'
  );

}

    });

  }
  previousPage(): void {

  if (this.pageNumber() > 1) {

    this.pageNumber.update(value => value - 1);
    this.loadUsers();

  }

}
nextPage(): void {

  if (this.pageNumber() < this.totalPages()) {

    this.pageNumber.update(value => value + 1);
    this.loadUsers();

  }

}

}