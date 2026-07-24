import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map } from 'rxjs';

import { PolicyPlanService } from '../../../services/policy-plan';
import { ProductService } from '../../../services/insurance-product';

import { Product } from '../../../models/product';
import { PolicyPlanRequest } from '../../../models/policy-plan-request';

@Component({
  selector: 'app-edit-policy-plan',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './edit-policy-plan.html',
  styleUrl: './edit-policy-plan.css'
})
export class EditPolicyPlan {

  planId = 0;

  products: Product[] = [];

  planForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private planService: PolicyPlanService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.planForm = this.fb.group({

      productId: [
        '',
        Validators.required
      ],

      planName: [
        '',
        Validators.required
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
        0,
        Validators.required
      ],

      durationYears: [
        '',
        Validators.required
      ],

      termsAndConditions: [
        '',
        Validators.required
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

    this.productService
      .getActiveProducts()
      .pipe(
        map(response => response.data)
      )
      .subscribe({

        next: (data) => {

          this.products = data;

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  loadPlan(): void {

    this.planService
      .getPlanById(this.planId)
      .subscribe({

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

        },

        error: (err) => {

          console.log(err);
          alert('Unable to load policy plan.');

        }

      });

  }

  onSubmit(): void {

    if (this.planForm.invalid) {

      this.planForm.markAllAsTouched();

      return;

    }

    const request: PolicyPlanRequest = this.planForm.value;

    this.planService
      .updatePlan(this.planId, request)
      .subscribe({

        next: () => {

          alert('Policy Plan updated successfully.');

          this.router.navigate(['/policy-plans']);

        },

        error: (err) => {

          console.log(err);

          alert(err.error?.message ?? 'Unable to update policy plan.');

        }

      });

  }

}