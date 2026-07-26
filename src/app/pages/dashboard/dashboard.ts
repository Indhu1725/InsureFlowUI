import { Component, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { ToastrService } from 'ngx-toastr';

import { CustomerService } from '../../services/customer';
import { PolicyService } from '../../services/policy';
import { PolicyPlanService } from '../../services/policy-plan';
import { ClaimService } from '../../services/claim';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  totalCustomers = signal(0);
  totalPolicies = signal(0);
  totalClaims = signal(0);
  totalPlans = signal(0);

  approvedClaims = signal(0);
  pendingClaims = signal(0);
  rejectedClaims = signal(0);

  recentClaims = signal<any[]>([]);
  topPlans = signal<any[]>([]);

  premiumChartData = signal<number[]>([0,0,0,0,0,0,0]);

  role = localStorage.getItem('role');

  constructor(
    private customerService: CustomerService,
    private policyService: PolicyService,
    private policyPlanService: PolicyPlanService,
    private claimService: ClaimService,
    private toastr: ToastrService
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

    this.totalCustomers.set(response.data.totalRecords);

    console.log(this.totalCustomers());

    

  },
 error: () => {

  this.toastr.error(
    'Unable to load customers.',
    'Dashboard Error'
  );

}
});

  // Policies
  this.policyService.getPolicies().subscribe({
  next: (response: any) => {

  this.totalPolicies.set(response.data.totalRecords);

    const policies = response.data.records;

    this.calculatePremiumChart(policies);

    

  },
  error: () => {

  this.toastr.error(
    'Unable to load policies.',
    'Dashboard Error'
  );

}
});
  // Claims
this.claimService.getAllClaims().subscribe({
  next: (response: any) => {

    this.totalClaims.set(response.data.length);

    this.calculateClaimChart(response.data);

    this.recentClaims.set(
  response.data
    .sort((a: any, b: any) =>
      new Date(b.createdDate).getTime() -
      new Date(a.createdDate).getTime())
    .slice(0, 5)
);
    

  },
  error: () => {

  this.toastr.error(
    'Unable to load claims.',
    'Dashboard Error'
  );

}
});
  // Policy Plans
  this.policyPlanService.getPlans({
  pageNumber: 1,
  pageSize: 100,
  sortField: 'planName',
  sortDirection: 'asc'
}).subscribe({
  next: (response: any) => {

   this.totalPlans.set(response.data.totalRecords);

this.topPlans.set(response.data.records.slice(0, 5));



  },
  error: () => {

  this.toastr.error(
    'Unable to load policy plans.',
    'Dashboard Error'
  );

}
});

}
loadStaffDashboard(): void {

  // Customers
  this.customerService.getCustomers(1, 100).subscribe({
    next: (response: any) => {
      this.totalCustomers.set(response.data.totalRecords);
    }
  });

  // Policies
  this.policyService.getPolicies().subscribe({
    next: (response: any) => {
      this.totalPolicies.set(response.data.totalRecords);
      this.calculatePremiumChart(response.data.records);
    }
  });

  // Claims for Review
  this.claimService.getReviewClaims().subscribe({
    next: (response: any) => {

      const claims = response.data;

      this.totalClaims.set(claims.length);

      this.calculateClaimChart(claims);

      this.recentClaims.set(claims.slice(0, 5));

    },
    error: () => {

      this.toastr.error(
        'Unable to load claims.',
        'Dashboard Error'
      );

    }
  });

  // Policy Plans
  this.policyPlanService.getPlans({
    pageNumber: 1,
    pageSize: 100,
    sortField: 'planName',
    sortDirection: 'asc'
  }).subscribe({
    next: (response: any) => {
      this.totalPlans.set(response.data.totalRecords);
      this.topPlans.set(response.data.records.slice(0,5));
    }
  });

}
loadCustomerDashboard(): void {

  // My Policies
  this.policyService.getMyPolicies().subscribe({

    next: (response: any) => {

      this.totalPolicies.set(response.data.length);

      this.calculatePremiumChart(response.data);


    },

   error: () => {

  this.toastr.error(
    'Unable to load My Policies.',
    'Dashboard Error'
  );

}

  });

  // My Claims
  this.claimService.getMyClaims().subscribe({

    next: (response: any) => {

      this.totalClaims.set(response.data.length);

      this.calculateClaimChart(response.data);

      this.recentClaims.set(
  response.data
    .sort((a:any,b:any)=>
      new Date(b.createdDate).getTime()-
      new Date(a.createdDate).getTime())
    .slice(0,5)
);


    },

    error: () => {

  this.toastr.error(
    'Unable to load My Claims.',
    'Dashboard Error'
  );

}

  });

  // Policy Plans
  this.policyPlanService.getPlans({

    pageNumber: 1,
    pageSize: 100,
    sortField: 'planName',
    sortDirection: 'asc'

  }).subscribe({

    next: (response: any) => {

      this.totalPlans.set(response.data.totalRecords);

      this.topPlans.set(response.data.records.slice(0,5));

    },

    error: () => {

  this.toastr.error(
    'Unable to load policy plans.',
    'Dashboard Error'
  );

}

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

  this.premiumChartData.set(monthlyPremium);

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
            data: this.premiumChartData(),
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

  this.approvedClaims.set(0);
  this.pendingClaims.set(0);
  this.rejectedClaims.set(0);

  claims.forEach(claim => {

    switch (claim.claimStatus) {

      case 4:
        this.approvedClaims.update(v=>v+1);
        break;

      case 5:
        this.rejectedClaims.update(v=>v+1);
        break;

      default:
        this.pendingClaims.update(v=>v+1);
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
              this.approvedClaims(),
              this.pendingClaims(),
              this.rejectedClaims()

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