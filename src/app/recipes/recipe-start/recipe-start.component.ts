import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { DataStorageService } from 'src/app/shared/data-starage.service';

@Component({
  selector: 'app-recipe-start',
  templateUrl: './recipe-start.component.html',
})
export class RecipeStartComponent implements OnInit {
  user: User;
  userName: string;

  constructor(
    private authService: AuthService,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((currentUser: User) => {
      this.user = currentUser;
      if (this.user && this.user.email) {
        this.userName = this.user.email.split('@')[0];
      } else {
        this.userName = 'User';
      }
    });
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
