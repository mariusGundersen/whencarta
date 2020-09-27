module "geojson-extent" {
  export default function extent(
    geojson: GeoJSON.GeoJSON
  ): [number, number, number, number];
}
