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
