import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const MyMapComponent = () => {
  return (
<LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
<GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} zoom={10} center={{ lat: 12.9716, lng: 77.5946 }}>
        <Marker position={{ lat: 12.9716, lng: 77.5946 }} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MyMapComponent;
