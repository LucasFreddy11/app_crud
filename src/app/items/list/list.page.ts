import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false
})
export class ListPage implements OnInit {
  items: any[] = [];

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.apiService.getItems().subscribe(
      (data) => {
        this.items = data;
      },
      (error) => {
        console.error('Error loading items:', error);
      }
    );
  }

  viewItemDetails(id: number) {
    this.router.navigate(['/items/details', id]);
  }

  editItem(id: number) {
    this.router.navigate(['/items/edit', id]);
  }

  deleteItem(id: number) {
    if (confirm('¿Estás seguro de eliminar este item?')) {
      this.apiService.deleteItem(id).subscribe(
        () => {
          this.loadItems(); // Recargar la lista después de eliminar
        },
        (error) => {
          console.error('Error deleting item:', error);
        }
      );
    }
  }

  goToCreate() {
    this.router.navigate(['/items/create']);
  }
}