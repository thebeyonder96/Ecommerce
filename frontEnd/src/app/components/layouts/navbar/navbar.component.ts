import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {


  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  isTrue: boolean = false
  tru: boolean = false
  accessToken: any = localStorage.getItem('accessToken')
  userId: any = localStorage.getItem('userId')
  allCart: any[] = []
  allProduct: any[] = []
  length: number = 0
  allFeatures: any[] = []
  isProfile: boolean = false
  currentUser!: any



  ngOnInit(): void {
    this.oneProfile()
    this.everyCategory()
    this.gettingCart()
  }
  categories($event: Event) {
    this.tru = false
    this.isTrue = !this.isTrue
  }
  categoriesLeave($event: Event) {
    this.tru = true
    this.isTrue = !this.isTrue
  }

  everyCategory() {
    this.userService.allCategories(this.accessToken).subscribe({
      next: (res) => { this.allFeatures = res },
      error: (e) => { console.log(e) },
      complete: () => { console.log('finished the all category') }
    })
  }
  oneProfile() {
    this.userService.profileOne(this.userId, this.accessToken).subscribe({
      next: (res) => { this.currentUser = res },
      error: (e) => { console.log(e) },
      complete: () => { console.log('finished the profile') }
    })
  }
  gettingCart() {
    this.userService.getCart(this.accessToken, this.userId).subscribe({
      next: (res: any) => {
        this.allCart = res[0].products
        for (const products of this.allCart) {
          this.userService.findSingleProduct(products.productId).subscribe({
            next: (res) => {
              this.allProduct.push(res)
              this.userService.length.next(this.allProduct.length)
              this.userService.length.subscribe((res) => { this.length = res })
            }
          })
        }
      },
      error: (e: Error) => { console.log(e) },
      complete: () => { console.log('finished') }
    })
  }

  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userId')
    this.router.navigate(['/login'])
  }

}
