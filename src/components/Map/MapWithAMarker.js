// MapWithAMarker renders a Google Map with a single draggable marker.
// It receives the map center, marker coordinates, and a callback for drag events.
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const MapWithAMarker = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      zoom={props.camera.zoom}
      center={{ lat: props.camera.lat, lng: props.camera.lng }}
    >
      <Marker
        position={{ lat: props.lat, lng: props.lng }}
        draggable={true}
        onDragEnd={(coordinate) => props.onDragged(coordinate)}
      />
    </GoogleMap>
  ))
);
export default MapWithAMarker;
