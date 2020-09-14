import "leaflet/dist/leaflet.css";
import React, { useCallback, useRef } from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";

export interface Pos {
  readonly lat: number;
  readonly lng: number;
  readonly zoom: number;
}

export interface Props {
  readonly pos: Pos;
  onChange(p: Pos): void;
  onBoundsChange?: (bounds: {
    north: number;
    east: number;
    south: number;
    west: number;
  }) => void;
}

export function Map({ pos, onBoundsChange }: Props) {
  const ref = useRef<LeafletMap>(null);
  const onViewportChanged = useCallback(() => {
    const bounds = ref.current?.leafletElement.getBounds();
    if (bounds) {
      onBoundsChange?.({
        north: bounds.getNorth(),
        east: bounds.getEast(),
        south: bounds.getSouth(),
        west: bounds.getWest(),
      });
    }
  }, [onBoundsChange]);
  return (
    <LeafletMap
      ref={ref}
      className="map"
      zoom={pos.zoom}
      center={pos}
      zoomControl={false}
      onViewportChanged={onViewportChanged}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </LeafletMap>
  );
}
