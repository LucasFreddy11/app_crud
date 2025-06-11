import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false
})
export class DetailsPage implements OnInit {
  item: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const itemId = +this.route.snapshot.params['id'];
    this.loadItem(itemId);
  }

  loadItem(id: number) {
    this.apiService.getItem(id).subscribe(
      (data) => {
        this.item = data;
      },
      (error) => {
        console.error('Error loading item details:', error);
      }
    );
  }

  editItem() {
    this.router.navigate(['/items/edit', this.item.id]);
  }
}