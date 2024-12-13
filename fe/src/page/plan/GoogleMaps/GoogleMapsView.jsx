import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import "./GoogleMaps.css";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const libraries = ["places"];

export function GoogleMapsView({ placeIds }) {
  const [placesDetails, setPlacesDetails] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const mapInstanceRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    version: "weekly",
  });

  useEffect(() => {
    if (placeIds && isLoaded && mapInstanceRef.current) {
      const service = new google.maps.places.PlacesService(
        mapInstanceRef.current,
      );

      const promises = placeIds.map(
        (id) =>
          new Promise((resolve) => {
            service.getDetails({ placeId: id }, (result, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                resolve(result);
              } else {
                resolve(null);
              }
            });
          }),
      );

      Promise.all(promises).then((details) => {
        setPlacesDetails(details.filter(Boolean));
      });
    }
  }, [placeIds, isLoaded]); // placeIds 또는 isLoaded가 변경될 때마다 다시 실행

  const handleMapLoad = (map) => {
    mapInstanceRef.current = map;
  };

  if (!isLoaded) return <Spinner />;

  const center =
    placesDetails.length > 0
      ? {
          lat: placesDetails[0].geometry.location.lat(),
          lng: placesDetails[0].geometry.location.lng(),
        }
      : { lat: 37.5665, lng: 126.978 };

  return (
    <div>
      <GoogleMap
        zoom={15}
        center={center}
        mapContainerClassName="map-view-container"
        onLoad={handleMapLoad}
      >
        {placesDetails.map((place, index) => {
          const position = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          return (
            <Marker
              key={index}
              position={position}
              onClick={() => {
                setSelectedPlaceId(place.place_id);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.panTo(position);
                }
              }}
            />
          );
        })}

        {selectedPlaceId && (
          <InfoWindow
            position={{
              lat: placesDetails
                .find((place) => place.place_id === selectedPlaceId)
                .geometry.location.lat(),
              lng: placesDetails
                .find((place) => place.place_id === selectedPlaceId)
                .geometry.location.lng(),
            }}
            onCloseClick={() => setSelectedPlaceId(null)}
            options={{
              maxWidth: 300,
              disableAutoPan: false,
              pixelOffset: new google.maps.Size(0, -30), // 창을 약간 위로 이동
            }}
          >
            <div style={{ padding: "10px" }}>
              <h3 style={{ margin: "0", fontWeight: "bold" }}>
                {
                  placesDetails.find(
                    (place) => place.place_id === selectedPlaceId,
                  )?.name
                }
              </h3>
              <p style={{ margin: "5px 0", color: "#757575" }}>
                {
                  placesDetails.find(
                    (place) => place.place_id === selectedPlaceId,
                  )?.formatted_address
                }
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
