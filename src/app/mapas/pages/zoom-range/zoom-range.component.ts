import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container {
        width: 100%;
        height: 100%;
      }
      .row {
        background-color: white;
        border-radius: 5px;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        position: fixed;
        z-index: 999;
        width: 400px;
      }
    `,
  ],
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  // Hace referencia local que esta del lado del Html
  @ViewChild('mapa') divMapa!: ElementRef;

  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [-76.20069807737397, 4.090442388172531];

  constructor() { }
  ngOnDestroy(): void {
    this.mapa.off('zoom', () => { });
    this.mapa.off('zoomend', () => { });
    this.mapa.off('move', () => { });
  }
  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      // acercamiento predeterminado a la coordenada indicada en el center
      zoom: this.zoomLevel
    });

    this.mapa.on('zoom', () => {
      this.zoomLevel = this.mapa.getZoom();
    });

    this.mapa.on('zoomend', () => {
      if (this.mapa.getZoom() > 18) {
        this.mapa.zoomTo(18);
      }
    });
    // Coordenadas del mapa
    this.mapa.on('move', (ev) => {
      const target = ev.target;
      target.getCenter();
      const { lng, lat } = target.getCenter();
      this.center = [lng, lat];
    });
  }

  // ngOnInit(): void {
  // }

  zoomOut() {
    this.mapa.zoomOut();
  }
  zoomIn() {
    this.mapa.zoomIn();
  }

  zoomCambio(valor: string) {
    this.mapa.zoomTo(Number(valor));
  }
}
