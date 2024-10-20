// app/api/weatherreport/route.ts
interface WeatherReportProps {
  latitude: number;
  longitude: number;
}

export const WeatherReport = async ({
  latitude,
  longitude,
}: WeatherReportProps): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
    );

    // ตรวจสอบการตอบกลับจาก API
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();
    console.log("Weather data:", data); // เพิ่มการล็อกข้อมูลที่ได้รับจาก API

    // ตรวจสอบว่ามีข้อมูลสภาพอากาศหรือไม่
    if (!data.weather || data.weather.length === 0) {
      throw new Error("No weather information found");
    }

    const weatherMain = data.weather[0].main;
    const isRaining = ["Rain", "Thunderstorm"].includes(weatherMain);

    console.log("Weather condition:", weatherMain); // ล็อกสภาพอากาศที่ดึงมา
    console.log("Is it raining?:", isRaining); // เพิ่มการล็อกค่า isRaining

    return isRaining;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return false; // ในกรณีที่เกิดข้อผิดพลาด จะคืนค่าเป็น false เพื่อบอกว่าไม่มีฝน
  }
};
