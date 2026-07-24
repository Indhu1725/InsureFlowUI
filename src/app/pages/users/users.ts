import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of, map } from 'rxjs';

import { UserService } from '../../services/user';
import { UserResponse } from '../../models/user-response';
import { UserStatusUpdate } from '../../models/user-status-update';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AsyncPipe
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {

  users$!: Observable<UserResponse[]>;

  allUsers: UserResponse[] = [];

  selectedFilter = 'all';
  selectedStatus = 'all';

  isLoading = false;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

  this.isLoading = true;

  this.users$ = this.userService
    .getUsers(
      this.pageNumber,
      this.pageSize,
      'createdDate',
      'desc'
    )
    .pipe(

      map(response => {

        this.allUsers = response.data.records;

        this.totalPages = response.data.totalPages;

        this.pageNumber = response.data.currentPage;

        this.isLoading = false;

        return response.data.records;

      })

    );

}

  onFilterChange(filter: string): void {

    this.selectedFilter = filter;

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

      this.users$ = of([]);

    }

  }

  loadActiveUsers(): void {

  this.isLoading = true;

  this.users$ = this.userService.getActiveUsers().pipe(

    map((response: any) => {

      this.allUsers = response.data;

      this.isLoading = false;

      return response.data;

    })

  );

}

  loadInternalStaff(): void {

  this.isLoading = true;

  this.users$ = this.userService.getInternalStaff().pipe(

    map((response: any) => {

      this.allUsers = response.data;

      this.isLoading = false;

      return response.data;

    })

  );

}

  searchById(id: number): void {

  this.isLoading = true;

  this.users$ = this.userService.getUserById(id).pipe(

    map((response: any) => {

      console.log(response);

      this.allUsers = [response.data];

      this.isLoading = false;

      return [response.data];

    })

  );

}

  onStatusChange(status: string): void {

    this.selectedStatus = status;

    if (status === 'all') {

      this.users$ = of(this.allUsers);

    }

    else if (status === 'active') {

      this.users$ = of(
        this.allUsers.filter(user => user.isActive)
      );

    }

    else if (status === 'inactive') {

      this.users$ = of(
        this.allUsers.filter(user => !user.isActive)
      );

    }

  }

  changeStatus(user: UserResponse): void {

   const request: UserStatusUpdate = {

  isActive: !user.isActive

};

    this.userService.updateStatus(user.userId, request).subscribe({

      next: () => {

        alert('User status updated successfully');

        this.loadUsers();

      },

      error: (error) => {

        console.log(error);

        alert('Failed to update user status');

      }

    });

  }
  previousPage(): void {

  if (this.pageNumber > 1) {

    this.pageNumber--;

    this.loadUsers();

  }

}
nextPage(): void {

  if (this.pageNumber < this.totalPages) {

    this.pageNumber++;

    this.loadUsers();

  }

}

}