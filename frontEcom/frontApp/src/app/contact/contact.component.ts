import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  map: maplibregl.Map | undefined;

  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.contactForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      descr: ['', Validators.required]
    });

    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initializeMap();
    }
  }

  initializeMap(): void {
    const locationCoords: [number, number] = [-7.5898, 33.5731]; // Longitude, Latitude for Casablanca, Morocco

    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json', // Use Maplibre style as a workaround for non-authenticated Mapbox GL JS usage
      center: locationCoords,
      zoom: 7
    });

    new maplibregl.Marker()
      .setLngLat(locationCoords)
      .addTo(this.map);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      // Handle form submission
      console.log('Form Submitted', this.contactForm.value);
    }
  }
}
