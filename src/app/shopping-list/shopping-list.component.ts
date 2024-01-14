import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs-compat';
import { saveAs } from 'file-saver';
import { Ingredient } from './../shared/ingredient.modal';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  public ingredients: Ingredient[];
  private isChangeSub: Subscription;
  duplicateNameSubscription: Subscription;
  duplicateName: string;

  constructor(private slService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredients = this.slService.getIngredients();
    this.isChangeSub = this.slService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );

    this.duplicateNameSubscription = this.slService.duplicateName$.subscribe(
      (name: string) => {
        this.duplicateName = name;
      }
    );
  }

  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }

  onExportToTextFile() {
    const textContent = this.ingredients
      .map((ingredient) => `${ingredient.name}: ${ingredient.amount}`)
      .join('\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    saveAs(blob, 'shopping-list.txt');
  }

  ngOnDestroy(): void {
    this.isChangeSub.unsubscribe();
    this.duplicateNameSubscription.unsubscribe();
  }
}
