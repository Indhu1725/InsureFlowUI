import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import { ActivatedRoute, Router,RouterModule} from '@angular/router';

import { ProductService } from '../../../services/insurance-product';
import { Product } from '../../../models/product';

@Component({

  selector: 'app-edit-product',

  standalone: true,

  imports: [CommonModule,ReactiveFormsModule,RouterModule,],

  templateUrl: './edit-product.html',

  styleUrl: './edit-product.css'

})

export class EditProduct implements OnInit {

  productId!: number;

  productForm!: FormGroup;

  constructor(

    private fb: FormBuilder,

    private route: ActivatedRoute,

    private router: Router,

    private productService: ProductService

  ) { }

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

    this.productId = Number(

      this.route.snapshot.paramMap.get('id')

    );

    this.loadProduct();

  }

  loadProduct(): void {

    this.productService

      .getProductById(this.productId)

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

          alert('Unable to load product.');

        }

      });

  }

  updateProduct(): void {

  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

  console.log("Product Id:", this.productId);
  console.log("Request Body:", this.productForm.value);

  this.productService.updateProduct(
    this.productId,
    this.productForm.value
  ).subscribe({
    next: (res) => {
      console.log(res);
      alert('Product updated successfully.');
      this.router.navigate(['/products']);
    },
    error: (err) => {
      console.log(err);
      console.log(err.error);
      alert('Unable to update product.');
    }
  });
}

}