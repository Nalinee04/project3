"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getAddress } from "./hook/api";
import Image from "next/image";
import { WeatherReport } from "@/app/api/weatherreport/route";

interface Address {
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  additional: string;
}

interface MapComponentProps {
  onPinAddress: (address: string, addressDetails: Address) => void;
  onWeatherCheck: (isRain: boolean) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onPinAddress, onWeatherCheck }) => {
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);
  const [map, setMap] = useState<any>(null);
  const [addressData, setAddressData] = useState<Address>({
    postalCode: "",
    province: "",
    district: "",
    subDistrict: "",
    additional: "",
  });
  const [isRain, setIsRain] = useState<boolean>(false);
  const [showAddress, setShowAddress] = useState<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  useEffect(() => {
  const initMap = () => {
  if (!window.longdo || isMapLoaded) return;

  const mapInstance = new window.longdo.Map({
    placeholder: document.getElementById("map"),
  });

  // ตั้งค่าพิกัดเริ่มต้นและระดับซูม
  const initialLocation = { lon: 99.66846743978545, lat: 11.639530868099945 };
  mapInstance.location(initialLocation);
  mapInstance.zoom(15); // ตั้งค่า zoom level ที่ต้องการที่นี่ (สูง = ซูมเข้า)

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      mapInstance.location({ lon: longitude, lat: latitude });
      setLat(latitude);
      setLon(longitude);
    },
    () => {
      // ถ้าไม่สามารถหาตำแหน่งได้ จะใช้พิกัดเริ่มต้นแทน
      mapInstance.location(initialLocation);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );

  // Hide unnecessary UI elements
  mapInstance.Ui.DPad.visible(false);
  mapInstance.Ui.Zoombar.visible(false);
  mapInstance.Ui.Geolocation.visible(false);
  mapInstance.Ui.Toolbar.visible(false);
  mapInstance.Ui.LayerSelector.visible(false);
  mapInstance.Ui.Fullscreen.visible(false);
  mapInstance.Ui.Scale.visible(false);

  setMap(mapInstance);
  setIsMapLoaded(true); // ตั้งค่าว่าแผนที่ได้โหลดแล้ว
};

    if (typeof window !== "undefined" && window.longdo) {
      initMap();
    }

    if (typeof window !== "undefined") {
      window.initMap = initMap;
    }
  }, [isMapLoaded]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (lat !== 0 && lon !== 0) {
        const rainStatus = await WeatherReport({
          latitude: lat,
          longitude: lon,
        });
        setIsRain(rainStatus);
        onWeatherCheck(rainStatus);
      }
    };

    fetchWeather();
  }, [lat, lon, onWeatherCheck]);

  const addMarker = async () => {
    if (map) {
      map.Overlays.clear();
      const location = map.location();
      const marker = new window.longdo.Marker(location);
      map.Overlays.add(marker);

      const data = await getAddress(location.lon, location.lat);
      setAddressData({
        postalCode: data.postcode || "",
        province: data.province || "จังหวัดไม่ระบุ",
        district: data.district || "อำเภอไม่ระบุ",
        subDistrict: data.subdistrict || "ตำบลไม่ระบุ",
        additional: "",
      });
      setLat(location.lat);
      setLon(location.lon);
      setShowAddress(true);

      const address = `${data.province || "จังหวัดไม่ระบุ"} ${data.district || "อำเภอไม่ระบุ"} ${data.subdistrict || "ตำบลไม่ระบุ"} ${data.postcode || "รหัสไปรษณีย์ไม่ระบุ"}`;
      if (address.trim()) {
        onPinAddress(address, {
          province: data.province || "จังหวัดไม่ระบุ",
          district: data.district || "อำเภอไม่ระบุ",
          subDistrict: data.subdistrict || "ตำบลไม่ระบุ",
          postalCode: data.postcode || "รหัสไปรษณีย์ไม่ระบุ",
          additional: "",
        });
      } else {
        console.error("ไม่สามารถดึงที่อยู่ได้");
      }
    }
  };

  const addMarkerMe = async () => {
    if (map) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          map.Overlays.clear();
          map.location({ lon: longitude, lat: latitude }, true);
          map.Overlays.add(new window.longdo.Marker({ lon: longitude, lat: latitude }));

          const data = await getAddress(longitude, latitude);
          setAddressData({
            postalCode: data.postcode || "",
            province: data.province || "จังหวัดไม่ระบุ",
            district: data.district || "อำเภอไม่ระบุ",
            subDistrict: data.subdistrict || "ตำบลไม่ระบุ",
            additional: "",
          });
          setLat(latitude);
          setLon(longitude);
          setShowAddress(true);

          const address = `${data.province || "จังหวัดไม่ระบุ"} ${data.district || "อำเภอไม่ระบุ"} ${data.subdistrict || "ตำบลไม่ระบุ"} ${data.postcode || "รหัสไปรษณีย์ไม่ระบุ"}`;
          if (address.trim()) {
            onPinAddress(address, {
              province: data.province || "จังหวัดไม่ระบุ",
              district: data.district || "อำเภอไม่ระบุ",
              subDistrict: data.subdistrict || "ตำบลไม่ระบุ",
              postalCode: data.postcode || "รหัสไปรษณีย์ไม่ระบุ",
              additional: "",
            });
          } else {
            console.error("ไม่สามารถดึงที่อยู่ได้");
          }
        },
        () => {
          console.error("Unable to retrieve location");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  return (
    <div className="w-full">
      <Script
        src="https://api.longdo.com/map/?key=656778451a899cd222b329f19179eb69"
        strategy="lazyOnload"
        onLoad={() => {
          if (window.initMap) {
            window.initMap();
          }
        }}
      />
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="border-b pb-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-lg font-semibold mb-2">เลือกที่อยู่จัดส่ง</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                className="bg-gray-100 text-black px-4 py-2 text-sm rounded-md"
                onClick={addMarker}
              >
                ปักหมุด
              </button>
              <button
                className="bg-gray-100 text-black px-4 py-2 text-sm rounded-md"
                onClick={addMarkerMe}
              >
                ปักหมุดตำแหน่งปัจจุบัน
              </button>
            </div>
          </div>

          {showAddress && (
            <div className="flex flex-col sm:flex-row items-center mt-4">
              <Image
                src="/images/map.png"
                alt="Address"
                width={50}
                height={50}
                className="rounded-md"
              />
              <div className="ml-4 text-center sm:text-left">
                <p className="text-gray-600">
                  {`${addressData.province} ${addressData.district} ${addressData.subDistrict} ${addressData.postalCode}`.trim() || "กรุณาเลือกที่อยู่จัดส่ง"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isRain && (
        <div className="p-4 bg-yellow-200 text-yellow-800 rounded-md mt-4">
          ฝนกำลังจะตกในพื้นที่ของคุณ! อาจมีการล่าช้าในการจัดส่ง
        </div>
      )}

      <div id="map" className="w-full h-96 rounded-lg" />
    </div>
  );
};

export default MapComponent;
