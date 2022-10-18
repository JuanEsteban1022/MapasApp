import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [`
  #mapa {
    width: 100%;
    height: 100%;
  }
  `]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    var map = new mapboxgl.Map({
      // id del lado del html "mapa"
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      // Centrar un lugar en especifico, longitud y laptitud
      center: [-76.20069807737397, 4.090442388172531],
      // acercamiento predeterminado a la coordenada indicada en el center
      zoom: 15
    });

  }

}
