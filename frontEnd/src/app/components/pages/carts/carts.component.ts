import { json } from 'express';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, forkJoin, map, observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.scss']
})
export class CartsComponent implements OnInit {

  constructor(
    private userService: UserService,
    private toaster: ToastrService,
    private router: Router
  ) { }

  allCart?: any
  allProduct: any[] = []
  num!: number
  universal!: any
  fullAmount: number = 0
  quantity: number = 0
  accessToken = localStorage.getItem('accessToken')
  userId: any = localStorage.getItem('userId')



  ngOnInit(): void {
    this.universal = this.userService.number;
    this.userService.getCart(this.accessToken, this.userId).subscribe({
      next: (res: any) => {
        this.allCart = res[0].products;
        const requests = this.allCart.map((product: any) =>
          this.userService.findSingleProduct(product.productId)
        );

        forkJoin(requests).subscribe({
          next: (res: any) => {
            this.allProduct = res;
            this.calculateSum();
          },
          error: (e: Error) => console.log(e),
          complete: () => console.log('finished')
        });
      },
      error: (e: Error) => console.log(e),
      complete: () => console.log('finished')
    });
  }


  fullDelete(): void {
    this.userService.deleteAllCart(this.userId, this.accessToken).subscribe(() => {
      this.getCart(this.accessToken, this.userId)
    })

  }
  deleteOne(productId: string) {
    this.userService.deleteOneCart(this.userId, productId, this.accessToken).subscribe(() => {
      this.getCart(this.accessToken, this.userId)
    })
  }

  add(productId: string, number: number) {
    number++
    this.userService.updatedQuantity(productId, this.userId, number, this.accessToken).subscribe(() => {
      this.getCart(this.accessToken, this.userId)
    })
  }

  minus(productId: string, number: number) {
    number--
    if (number > 0) {
      this.userService.updatedQuantity(productId, this.userId, number, this.accessToken).subscribe({
        next: (res) => { }
        , error: (e) => { console.log(e) }
        , complete: () => { this.getCart(this.accessToken, this.userId) }
      })
    } else {
      console.log('one product to buy is minimum for the user')
    }

  }


  getCart(accessToken: any, userId: string) {
    this.allProduct = []
    this.userService.getCart(accessToken, userId).subscribe({
      next: (res: any) => {
        this.allCart = res[0].products
        for (const products of this.allCart) {
          this.userService.findSingleProduct(products.productId).subscribe({
            next: (res) => { this.allProduct.push(res), this.calculateSum() }
          })
        }
      },
      error: (e) => { console.log(e) },
      complete: () => { }
    })
  }

  calculateSum() {
    this.fullAmount = this.allProduct.reduce((total, product) => {
      const productTotal = product.prize * product.quantity;
      return total + productTotal;
    }, 0);
    this.quantity = this.allProduct.reduce((total, product) => {
      const quantity = +product.quantity
      return total + quantity
    }, 0)
  }

  checkout() {
    this.userService.checkout(this.allProduct, this.fullAmount, this.quantity)
    this.router.navigate(['/address'])
  }

}
