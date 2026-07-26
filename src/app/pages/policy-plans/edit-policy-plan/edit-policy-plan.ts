import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { PolicyPlanService } from '../../../services/policy-plan';
import { ProductService } from '../../../services/insurance-product';
import { Product } from '../../../models/product';
import { PolicyPlanRequest } from '../../../models/policy-plan-request';

@Component({
  selector: 'app-edit-policy-plan',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './edit-policy-plan.html',
  styleUrl: './edit-policy-plan.css'
})
export class EditPolicyPlan {

  planId = 0;

  products = signal<Product[]>([]);

  isLoading = signal(false);

  planForm: FormGroup;

  premiumTypes = [
    'OneTime',
    'Annual'
  ];

  constructor(
    private fb: FormBuilder,
    private planService: PolicyPlanService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {

    this.planForm = this.fb.group({

      productId: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      planName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern('^[a-zA-Z0-9 ]+$')
        ]
      ],

      coverageAmount: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      premiumAmount: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      premiumType: [
        '',
        Validators.required
      ],

      durationYears: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(100)
        ]
      ],

      termsAndConditions: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000)
        ]
      ],

      isActive: [
        true
      ]

    });

    this.planId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadProducts();

    this.loadPlan();

  }

  loadProducts(): void {

    this.productService.getActiveProducts().subscribe({

      next: (response) => {

        this.products.set(response.data);

      },

      error: () => {

        this.toastr.error('Unable to load products.','Error');

      }

    });

  }

  loadPlan(): void {

    this.isLoading.set(true);

    this.planService.getPlanById(this.planId).subscribe({

      next: (response) => {

        this.planForm.patchValue({

          productId: response.data.productId,
          planName: response.data.planName,
          coverageAmount: response.data.coverageAmount,
          premiumAmount: response.data.premiumAmount,
          premiumType: response.data.premiumType,
          durationYears: response.data.durationYears,
          termsAndConditions: response.data.termsAndConditions,
          isActive: response.data.isActive

        });

        this.isLoading.set(false);

      },

      error: () => {

        this.isLoading.set(false);

        this.toastr.error('Unable to load policy plan.','Error');

      }

    });

  }

  onSubmit(): void {

    if (this.planForm.invalid) {

      this.planForm.markAllAsTouched();

      this.toastr.warning('Please fill all required fields correctly.','Validation');

      return;

    }

    const request = this.planForm.value as PolicyPlanRequest;

    if (request.coverageAmount <= 0) {

      this.toastr.error('Coverage Amount must be greater than 0.','Validation');

      return;

    }

    if (request.premiumAmount <= 0) {

      this.toastr.error('Premium Amount must be greater than 0.','Validation');

      return;

    }

    if (request.durationYears <= 0) {

      this.toastr.error('Duration must be greater than 0.','Validation');

      return;

    }

    this.isLoading.set(true);

    this.planService.updatePlan(this.planId, request).subscribe({

      next: () => {

        this.isLoading.set(false);

        this.toastr.success('Policy Plan updated successfully.','Success');

        this.router.navigate(['/policy-plans']);

      },

      error: (err) => {

        this.isLoading.set(false);

        this.toastr.error(err.error?.message || 'Unable to update policy plan.','Error');

      }

    });

  }

}