import { AfterViewInit, Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

import { CustomerService } from '../../services/customer';
import { PolicyService } from '../../services/policy';
import { PolicyPlanService } from '../../services/policy-plan';
import { ClaimService } from '../../services/claim';
import { PremiumPaymentService } from '../../services/premium-payment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  totalCustomers = 0;
  totalPolicies = 0;
  totalClaims = 0;
  totalPlans = 0;
  approvedClaims = 0;
  pendingClaims = 0;
  rejectedClaims = 0;
  recentClaims: any[] = [];
  topPlans: any[] = [];
  premiumChartData: number[] = [0, 0, 0, 0, 0, 0, 0];

  role = localStorage.getItem('role');

  constructor(
    private customerService: CustomerService,
    private policyService: PolicyService,
    private policyPlanService: PolicyPlanService,
    private claimService: ClaimService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

  if (this.role === 'Admin') {

    this.loadAdminDashboard();

  }

  else if (this.role === 'InternalStaff') {

    this.loadStaffDashboard();

  }

  else {

    this.loadCustomerDashboard();

  }

}

  loadAdminDashboard(): void {
     console.log('loadDashboardCounts called');

  // Customers
  this.customerService.getCustomers(1, 100).subscribe({
  next: (response: any) => {

    this.totalCustomers = response.data.totalRecords;

    console.log(this.totalCustomers);

    this.cdr.detectChanges();

  },
  error: err => console.log(err)
});

  // Policies
  this.policyService.getPolicies().subscribe({
  next: (response: any) => {

    this.totalPolicies = response.data.totalRecords;

    const policies = response.data.records;

    this.calculatePremiumChart(policies);

    this.cdr.detectChanges();

  },
  error: err => console.log(err)
});
  // Claims
this.claimService.getAllClaims().subscribe({
  next: (response: any) => {

    this.totalClaims = response.data.length;

    this.calculateClaimChart(response.data);

    this.recentClaims = response.data
      .sort((a: any, b: any) =>
        new Date(b.createdDate).getTime() -
        new Date(a.createdDate).getTime())
      .slice(0, 5);

    this.cdr.detectChanges();

  },
  error: err => console.log(err)
});
  // Policy Plans
  this.policyPlanService.getPlans({
  pageNumber: 1,
  pageSize: 100,
  sortField: 'planName',
  sortDirection: 'asc'
}).subscribe({
  next: (response: any) => {

   this.totalPlans = response.data.totalRecords;

this.topPlans = response.data.records.slice(0, 5);

this.cdr.detectChanges();

  },
  error: err => console.log(err)
});

}
loadStaffDashboard(): void {

  this.loadAdminDashboard();

}
loadCustomerDashboard(): void {

  // My Policies
  this.policyService.getMyPolicies().subscribe({

    next: (response: any) => {

      this.totalPolicies = response.data.length;

      this.calculatePremiumChart(response.data);

      this.cdr.detectChanges();

    },

    error: err => console.log(err)

  });

  // My Claims
  this.claimService.getMyClaims().subscribe({

    next: (response: any) => {

      this.totalClaims = response.data.length;

      this.calculateClaimChart(response.data);

      this.recentClaims = response.data
        .sort((a: any, b: any) =>
          new Date(b.createdDate).getTime() -
          new Date(a.createdDate).getTime())
        .slice(0, 5);

      this.cdr.detectChanges();

    },

    error: err => console.log(err)

  });

  // Policy Plans
  this.policyPlanService.getPlans({

    pageNumber: 1,
    pageSize: 100,
    sortField: 'planName',
    sortDirection: 'asc'

  }).subscribe({

    next: (response: any) => {

      this.totalPlans = response.data.totalRecords;

      this.topPlans = response.data.records.slice(0, 5);

      this.cdr.detectChanges();

    },

    error: err => console.log(err)

  });

}
calculatePremiumChart(policies: any[]): void {
  console.log('Policies:', policies);

  const monthlyPremium = [0, 0, 0, 0, 0, 0, 0];

  policies.forEach(policy => {

    const month = new Date(policy.startDate).getMonth();

    if (month >= 0 && month < 7) {

      monthlyPremium[month] += policy.premiumAmount;

    }

  });

  this.premiumChartData = monthlyPremium;

  setTimeout(() => {
  this.createLineChart();
}, 0);

}
  createLineChart(): void {
    console.log('Creating Premium Chart');

    const existingChart = Chart.getChart('premiumChart');
    if (existingChart) {
      existingChart.destroy();
    }
    const premiumCanvas = document.getElementById('premiumChart');

console.log('Premium Canvas:', premiumCanvas);

if (!premiumCanvas) {
  return;
}

    new Chart('premiumChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Premium',
            data: this.premiumChartData,
            borderColor: '#6f42c1',
            backgroundColor: 'rgba(111,66,193,0.15)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#6f42c1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

  }
  calculateClaimChart(claims: any[]): void {

    console.log('Claims:', claims);

  this.approvedClaims = 0;
  this.pendingClaims = 0;
  this.rejectedClaims = 0;

  claims.forEach(claim => {

    switch (claim.claimStatus) {

      case 4:
        this.approvedClaims++;
        break;

      case 5:
        this.rejectedClaims++;
        break;

      default:
        this.pendingClaims++;
        break;

    }

  });

  setTimeout(() => {
  this.createDoughnutChart();
}, 0);

}

  createDoughnutChart(): void {

    console.log('Creating Claims Chart');

    const existingChart = Chart.getChart('claimChart');
    if (existingChart) {
      existingChart.destroy();
    }
    const claimCanvas = document.getElementById('claimChart');

console.log('Claim Canvas:', claimCanvas);

if (!claimCanvas) {
  return;
}

    new Chart('claimChart', {
      type: 'doughnut',
      data: {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [
          {
            data: [
  this.approvedClaims,
  this.pendingClaims,
  this.rejectedClaims
],
            backgroundColor: [
              '#28a745',
              '#ffc107',
              '#dc3545'
            ],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%'
      }
    });

  }
  

}