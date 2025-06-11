import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false
})
export class CreatePage {
  itemForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      // Añade más campos según necesites
    });
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.apiService.createItem(this.itemForm.value).subscribe(
        () => {
          this.router.navigate(['/items/list']);
        },
        (error) => {
          console.error('Error creating item:', error);
        }
      );
    }
  }
}