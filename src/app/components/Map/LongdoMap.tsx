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
}

const MapComponent: React.FC<MapComponentProps> = ({ onPinAddress }) => {
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
  const [isFetchingWeather, setIsFetchingWeather] = useState<boolean>(false);
  const [isPinning, setIsPinning] = useState<boolean>(false); // เพิ่มสถานะการปักหมุด

  useEffect(() => {
    const initMap = () => {
      if (!window.longdo || isMapLoaded) return;

      const mapInstance = new window.longdo.Map({
        placeholder: document.getElementById("map"),
      });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapInstance.location({ lon: longitude, lat: latitude });
          setLat(latitude);
          setLon(longitude);
        },
        () => {
          mapInstance.location({ lon: 11.491665, lat: 99.622817 });
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
      if (lat !== 0 && lon !== 0 && !isFetchingWeather) {
        setIsFetchingWeather(true); // เริ่มการตรวจสอบสภาพอากาศ
        const rainStatus = await WeatherReport({
          latitude: lat,
          longitude: lon,
        });
        console.log('Rain Status:', rainStatus); // Debugging output
        setIsRain(rainStatus);
        setIsFetchingWeather(false); // สิ้นสุดการตรวจสอบสภาพอากาศ
      }
    };

    fetchWeather();
  }, [lat, lon]);

  useEffect(() => {
    // รีเซ็ต isRain เมื่อมีการเปลี่ยนที่อยู่
    setIsRain(false);
  }, [lat, lon]);

  const addMarker = async () => {
    if (map && !isPinning) {
      setIsPinning(true); // เริ่มการปักหมุด
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
  
      const address = `${data.province || "จังหวัดไม่ระบุ"} ${data.district || "อำเภอไม่ระบุ"} ${data.subdistrict || "ตำบลไม่ระบุ"} ${data.postcode || "รหัสไปรษณีย์ไม่ระบุ"}`.trim();
      if (address) {
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
  
      setIsPinning(false); // สิ้นสุดการปักหมุด
    }
  };
  
  // เพิ่มการรีเซ็ต addressData เมื่อ lat หรือ lon เปลี่ยนแปลง
  useEffect(() => {
    // รีเซ็ต addressData เมื่อมีการเปลี่ยนแปลง lat หรือ lon
    setAddressData({
      postalCode: "",
      province: "",
      district: "",
      subDistrict: "",
      additional: "",
    });
  }, [lat, lon]);
  

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
                className={`bg-gray-100 text-black px-4 py-2 text-sm rounded-md ${isPinning ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={addMarker}
                disabled={isPinning}
              >
                ปักหมุด
              </button>
              <button
                className={`bg-gray-100 text-black px-4 py-2 text-sm rounded-md ${isPinning ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={addMarker}
                disabled={isPinning}
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
              <div className="ml-3">
                <p className="text-sm">{`${addressData.subDistrict} ${addressData.district} ${addressData.province} ${addressData.postalCode}`}</p>
                <p className="text-sm">{addressData.additional}</p>
              </div>
            </div>
          )}
        </div>

        {/* เพิ่มข้อความเกี่ยวกับฝนที่นี่ */}
        {isRain && (
          <div className="p-4 bg-yellow-200 text-yellow-800 rounded-md mt-4">
            ขณะนี้มีฝนตกในพื้นที่ของคุณ กรุณาตรวจสอบสภาพอากาศก่อนทำการจัดส่ง
          </div>
        )}

        <div id="map" className="w-full h-[400px] rounded-lg"></div>
      </div>
    </div>
  );
};

export default MapComponent;
