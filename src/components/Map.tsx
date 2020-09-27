import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GeoJSON, Map as LeafletMap, TileLayer } from "react-leaflet";

export interface Feature {
  readonly id: string;
  readonly label: string;
  readonly geoJson: GeoJSON.GeoJSON;
}

export interface Pos {
  readonly lat: number;
  readonly lng: number;
  readonly zoom: number;
}

export interface Props {
  readonly initialPos: Pos;
  readonly features: Feature[];
  onBoundsChange?: (bounds: {
    north: number;
    east: number;
    south: number;
    west: number;
    zoom: number;
  }) => void;
}

export function Map({ initialPos, features, onBoundsChange }: Props) {
  const ref = useRef<LeafletMap>(null);
  const [pos] = useState(initialPos);

  const onViewportChanged = useCallback(() => {
    const bounds = ref.current?.leafletElement.getBounds();
    if (bounds) {
      const zoom = ref.current?.leafletElement.getZoom() ?? 0;
      onBoundsChange?.({
        north: bounds.getNorth(),
        east: bounds.getEast(),
        south: bounds.getSouth(),
        west: bounds.getWest(),
        zoom,
      });
    }
  }, [onBoundsChange]);

  useEffect(() => {
    onViewportChanged();
  }, [onViewportChanged]);

  return (
    <LeafletMap
      ref={ref}
      className="map"
      zoom={pos.zoom}
      center={pos}
      zoomControl={false}
      zoomSnap={0}
      onViewportChanged={onViewportChanged}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {features.map((feature) => (
        <GeoJSON key={feature.id} data={feature.geoJson} />
      ))}
    </LeafletMap>
  );
}
