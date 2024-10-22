// app/components/Chart.tsx
import React from 'react';
import { Bar as BarChart } from 'react-chartjs-2';
import { Chart as ChartJS, TooltipItem } from 'chart.js';

interface ChartProps {
  data: { month: string; revenue: number }[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  console.log("ข้อมูลที่รับเข้ามา:", data);

  // สร้างข้อมูลสำหรับกราฟ
  const chartData = {
    labels: [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
    ],
    datasets: [
      {
        label: 'รายได้ประจำเดือน',
        data: Array.from({ length: 12 }, (_, index) => {
          const monthData = data.find(item => item.month === (index + 1).toString());
          const revenue = monthData ? monthData.revenue : 0; 
          console.log(`เดือน ${index + 1}: รายได้ = ฿${revenue}`);
          return revenue;
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'รายได้ประจำเดือน',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: TooltipItem<'bar'>) {
            return `รายได้: ฿${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <BarChart data={chartData} options={options} />;
};

export default Chart;
