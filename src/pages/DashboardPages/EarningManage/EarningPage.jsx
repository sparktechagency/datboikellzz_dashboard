import React from 'react';
import BookingChart from '../../../Components/charts/BookingChart';
import PageHeading from '../../../Components/Shared/PageHeading';
import TransactionTable from '../../../Components/tables/transactionTable/TransactionTable.jsx';
import EarningManage from '../../../Components/Earning/EarningManage';
import { useGetEarningsQuery } from '../../../Redux/services/dashboard apis/total-overview/earningsGrowthApis.js';
import Loader from '../../../Components/Shared/Loaders/Loader.jsx';

function EarningPage() {
  const { data, isLoading } = useGetEarningsQuery({
    role: 'ADMIN',
  });

  const total = data?.data?.totalRevenue.toFixed(2);
  return (
    <div>
      <PageHeading title={'Earnings'} />
      <div className="grid md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="col-span-2">
          {isLoading ? (
            <div className="w-full bg-white rounded-md shadow-md h-full flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <EarningManage total={total} />
          )}
        </div>
        <div className="col-span-3">
          <BookingChart />
        </div>
      </div>
      <div className="mt-12">
        <h1>Last Transections history</h1>
        <TransactionTable />
      </div>
    </div>
  );
}

export default EarningPage;
