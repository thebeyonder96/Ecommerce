import { Component } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {


  isLoading!: boolean

  constructor(private loadingService: LoadingService) {
    this.loadingService.isLoading.subscribe((isloading) => {
      this.isLoading = isloading
    })
  }

}
