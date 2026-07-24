import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/insurance-product';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct {

  addProductForm: FormGroup;

  productTypes = [
  { value: 0, name: 'Health' },
  { value: 1, name: 'Motor' },
  { value: 2, name: 'Life' },
  { value: 3, name: 'Travel' }
];
  constructor(

    private fb: FormBuilder,

    private router: Router,

    private productService: ProductService

  ) {

    this.addProductForm = this.fb.group({

      productName: [

        '',

        Validators.required

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

      ]

    });

  }

  saveProduct(): void {

  if (this.addProductForm.invalid) {
    this.addProductForm.markAllAsTouched();
    return;
  }

  const request = {
    productName: this.addProductForm.value.productName,
    productType: Number(this.addProductForm.value.productType),
    description: this.addProductForm.value.description,
    isActive: true
  };

  console.log(request);

  this.productService.createProduct(request).subscribe({

    next: () => {
      alert('Product added successfully');
      this.router.navigate(['/products']);
    },

    error: (error) => {
      console.log(error);
      console.log(error.error);
      alert('Unable to add product');
    }

  });

}

}