import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ProductService } from '../../../services/insurance-product';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct implements OnInit {

  addProductForm!: FormGroup;

  productTypes = [
    { value: 0, name: 'Health' },
    { value: 1, name: 'Motor' },
    { value: 2, name: 'Life' },
    { value: 3, name: 'Travel' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

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

      this.toastr.warning('Please fill all required fields.');

      return;

    }

    const request = {

      productName: this.addProductForm.value.productName,

      productType: Number(this.addProductForm.value.productType),

      description: this.addProductForm.value.description,

      isActive: true

    };

    this.productService.createProduct(request).subscribe({

      next: () => {

        this.toastr.success('Product added successfully.');

        this.router.navigate(['/products']);

      },

      error: (error) => {

        console.error(error);

        this.toastr.error('Unable to add product.');

      }

    });

  }

}