import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface colorPersonalizado {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999;
      }

      .mapa-container {
        height: 100%;
        width: 100%;
      }

      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MarcadoresComponent implements AfterViewInit {
  // Hace referencia local que esta del lado del Html
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-76.20069807737397, 4.090442388172531];

  // Arreglo de marcador
  marcadores: colorPersonalizado[] = [];

  constructor() { }
  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      // acercamiento predeterminado a la coordenada indicada en el center
      zoom: this.zoomLevel,
    });

    this.leerLocalStorage();

    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola Mundo';
    // new mapboxgl.Marker({
    //   element: markerHtml
    // })
    //   .setLngLat(this.center)
    //   .addTo(this.mapa);
  }

  agregarMarcador() {

    const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    console.log(color);

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    }
    )
      .setLngLat(this.center)
      .addTo(this.mapa);
    this.marcadores.push({
      color,
      marker: nuevoMarcador
    });
    this.guardarLocalStorage();
    nuevoMarcador.on('dragend', () => {
      this.guardarLocalStorage();
    })
  }

  irMarcador(marker: mapboxgl.Marker) {
    this.mapa.flyTo({
      center: marker.getLngLat()
    })
  }

  guardarLocalStorage() {

    const coordenadas: colorPersonalizado[] = [];

    this.marcadores.forEach(m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      coordenadas.push({
        color: color,
        centro: [lng, lat]
      })
    })
    localStorage.setItem('marcadores', JSON.stringify(coordenadas));
  }

  leerLocalStorage() {
    if (!localStorage.getItem('marcadores')) {
      return;
    }
    const coordenadas: colorPersonalizado[] = JSON.parse(localStorage.getItem('marcadores')!);

    coordenadas.forEach(element => {
      const newMarker = new mapboxgl.Marker({
        color: element.color,
        draggable: true,
      })
        .setLngLat(element.centro!)
        .addTo(this.mapa)
      this.marcadores.push({
        marker: newMarker,
        color: element.color
      });
      newMarker.on('dragend', () => {
        this.guardarLocalStorage();
      })
    });
  }

  borrarMarcador(i: number) {
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1);
    this.guardarLocalStorage();
  }
}
