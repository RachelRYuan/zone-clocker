import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type MapComponentProps = {
  radius: number;
  setSelectedCoordinates: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
};

const MapComponent: React.FC<MapComponentProps> = ({
  radius,
  setSelectedCoordinates,
}) => {
  useEffect(() => {
    // Check if the map is already initialized
    const container = L.DomUtil.get("map");
    if (container != null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (container as any)._leaflet_id = null;
    }

    const map = L.map("map").setView([51.505, -0.09], 13);
    let circle: L.Circle | null = null;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const onMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setSelectedCoordinates({ lat, lng });

      if (circle) {
        map.removeLayer(circle);
      }

      circle = L.circle([lat, lng], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: radius || 200,
      }).addTo(map);
    };

    map.on("click", onMapClick);

    return () => {
      map.off("click", onMapClick);
      map.remove();
    };
  }, [radius, setSelectedCoordinates]);

  return <div id="map" className="h-[200px] sm:h-[300px] w-full" />;
};

export default MapComponent;
