import "leaflet/dist/leaflet.css";
import React, { useCallback } from "react";
import { Map as LeafletMap, TileLayer, Viewport } from "react-leaflet";

export interface Pos {
  readonly lat: number;
  readonly lng: number;
  readonly zoom: number;
}

export interface Props {
  readonly pos: Pos;
  onChange(p: Pos): void;
}

export function Map({ pos, onChange }: Props) {
  const onViewportChanged = useCallback(
    (v: Viewport) => {
      if (v.zoom != undefined && v.center != undefined) {
        onChange({ lat: v.center[0], lng: v.center[1], zoom: v.zoom });
      }
    },
    [onChange]
  );
  return (
    <LeafletMap
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
