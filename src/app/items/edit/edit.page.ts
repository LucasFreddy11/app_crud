import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: false
})
export class EditPage implements OnInit {
  itemForm: FormGroup;
  itemId: number =0;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      // Añade más campos según necesites
    });
  }

  ngOnInit() {
    this.itemId = +this.route.snapshot.params['id'];
    this.loadItem();
  }

  loadItem() {
    this.apiService.getItem(this.itemId).subscribe(
      (data) => {
        this.itemForm.patchValue(data);
      },
      (error) => {
        console.error('Error loading item:', error);
      }
    );
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.apiService.updateItem(this.itemId, this.itemForm.value).subscribe(
        () => {
          this.router.navigate(['/items/list']);
        },
        (error) => {
          console.error('Error updating item:', error);
        }
      );
    }
  }
}