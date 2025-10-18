import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-favourites-list',
  imports: [],
  templateUrl: './favourites-list.html',
  styleUrl: './favourites-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavouritesList {

}
