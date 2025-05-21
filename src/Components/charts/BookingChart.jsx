import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import React, { useEffect, useMemo, useState } from 'react';
import { Select } from 'antd';
import { useGetEarningsQuery } from '../../Redux/services/dashboard apis/total-overview/earningsGrowthApis';
import Loader from '../Shared/Loaders/Loader';

const MONTHS_ORDER = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const mapMonthName = (month) => {
  return month;
};

const BookingChart = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [years, setYears] = useState([]);

  const { data, isLoading } = useGetEarningsQuery({
    year,
    role: 'ADMIN',
  });

  useEffect(() => {
    if (data?.data?.total_years?.length) {
      setYears(data?.data?.total_years);
      if (!data?.data?.total_years.includes(year)) {
        setYear(data?.data?.total_years[0]);
      }
    } else {
      setYears([currentYear]);
    }
  }, [data, year, currentYear]);

  const { monthlyData, maxUsers } = useMemo(() => {
    const defaultMonthMap = MONTHS_ORDER.reduce((acc, m) => {
      acc[m] = 0;
      return acc;
    }, {});

    const apiMonthlyRevenue = data?.data?.monthlyRevenue || {};
    Object.entries(apiMonthlyRevenue).forEach(([month, value]) => {
      if (month in defaultMonthMap) {
        defaultMonthMap[month] = value;
      }
    });

    const maxUsers = Math.max(...Object.values(defaultMonthMap), 0) * 1.1 || 10;

    const monthlyData = MONTHS_ORDER.map((month) => ({
      name: mapMonthName(month),
      totalEarning: defaultMonthMap[month],
    }));

    return { monthlyData, maxUsers };
  }, [data]);

  return (
    <div>
      {isLoading ? (
        <div className="w-full !h-[250px] bg-white rounded-md shadow-md flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: '250px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3
            style={{
              textAlign: 'left',
              marginBottom: '15px',
              color: '#333',
              fontWeight: 'bold',
              fontSize: '18px',
            }}
          >
            📈 Earning Growth Chart
          </h3>
          <Select
            className="min-w-32"
            value={year}
            placeholder="Select year"
            onChange={setYear}
            loading={isLoading}
            style={{
              marginBottom: '15px',
              width: '150px',
              fontWeight: '500',
            }}
            options={years.map((item) => ({ value: item, label: item }))}
          />
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14532D" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#14532D" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis
                dataKey="name"
                stroke="#333"
                tick={{ fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                stroke="#333"
                domain={[0, maxUsers]}
                tickCount={6}
                interval={0}
                tickFormatter={(value) => value.toLocaleString()}
                tick={{ fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '8px',
                }}
                cursor={{ fill: 'rgba(76, 175, 80, 0.1)' }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 'bold' }} />
              <Bar
                dataKey="totalEarning"
                fill="url(#colorUv)"
                barSize={30}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default BookingChart;
