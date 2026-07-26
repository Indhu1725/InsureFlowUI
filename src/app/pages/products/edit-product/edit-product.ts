import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ProductService } from '../../../services/insurance-product';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit {

  // Signal
  productId = signal(0);

  // Reactive Form
  productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    this.productForm = this.fb.group({

      productName: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      productType: [
        '',
        Validators.required
      ],

      description: [
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

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id <= 0) {

      this.toastr.error('Invalid product ID.');

      this.router.navigate(['/products']);

      return;

    }

    this.productId.set(id);

    this.loadProduct();

  }

  loadProduct(): void {

    this.productService
      .getProductById(this.productId())
      .subscribe({

        next: (response) => {

          this.productForm.patchValue({

            productName: response.data.productName,
            productType: response.data.productType,
            description: response.data.description,
            isActive: response.data.isActive

          });

        },

        error: () => {

          this.toastr.error('Unable to load product.');

          this.router.navigate(['/products']);

        }

      });

  }

  updateProduct(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      this.toastr.warning('Please fill all required fields.');

      return;

    }

    this.productService
      .updateProduct(
        this.productId(),
        this.productForm.value
      )
      .subscribe({

        next: () => {

          this.toastr.success('Product updated successfully.');

          this.router.navigate(['/products']);

        },

        error: (error) => {

          console.error(error);

          this.toastr.error('Unable to update product.');

        }

      });

  }

}