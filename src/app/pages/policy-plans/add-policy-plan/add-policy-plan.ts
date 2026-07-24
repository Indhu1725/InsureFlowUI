import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';

import { PolicyPlanService } from '../../../services/policy-plan';
import { ProductService } from '../../../services/insurance-product';

import { Product } from '../../../models/product';
import { PolicyPlanRequest } from '../../../models/policy-plan-request';

@Component({
  selector: 'app-add-policy-plan',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './add-policy-plan.html',
  styleUrl: './add-policy-plan.css'
})
export class AddPolicyPlan {

  products$!: Observable<Product[]>;

  planForm: FormGroup;

  premiumTypes = [
    'OneTime',
    'Annual'
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private planService: PolicyPlanService,
    private router: Router
  ) {

    this.planForm = this.fb.group({

      productId: [
        '',
        Validators.required
      ],

      planName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],

      coverageAmount: [
        '',
        Validators.required
      ],

      premiumAmount: [
        '',
        Validators.required
      ],

      premiumType: [
        '',
        Validators.required
      ],

      durationYears: [
        '',
        Validators.required
      ],

      termsAndConditions: [
        '',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ],

      isActive: [
        true
      ]

    });

    this.loadProducts();

  }

  loadProducts(): void {

    this.products$ = this.productService
      .getActiveProducts()
      .pipe(
        map(response => response.data)
      );

  }

  savePlan(): void {

    if (this.planForm.invalid) {

      this.planForm.markAllAsTouched();
      return;

    }

    const request: PolicyPlanRequest = this.planForm.value;

    this.planService
      .addPlan(request)
      .subscribe({

        next: () => {

          alert('Policy Plan added successfully.');
          this.router.navigate(['/policy-plans']);

        },

        error: err => {

          console.log(err);
          alert(JSON.stringify(err.error));

        }

      });

  }

}