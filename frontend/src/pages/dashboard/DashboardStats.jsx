import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import CircularProgress from "./Changing";


const DashboardStats = () => {
  const orderProgress = [{}]
  const monthlyOrdersData = [{}]

  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );

  const chartData = {
    labels: ["Pending", "Delivered", "Dispatched", "Cancelled"],
    datasets: [
      {
        label: "%",
        data: [
          orderProgress?.Pending || 0,
          orderProgress?.Delivered || 0,
          orderProgress?.Dispatched || 0,
          orderProgress?.Cancelled || 0,
        ],
        backgroundColor: [
          "rgb(205, 120, 3)",
          "rgb(74, 165, 123)",
          "rgb(63, 131, 248)",
          "rgb(242, 82, 82)",
        ],
        borderColor: [
          "rgb(205, 120, 3)",
          "rgb(74, 165, 123)",
          "rgb(63, 131, 248)",
          "rgb(242, 82, 82)",
        ],
        borderWidth: 1,
        borderRadius: 5,
        spacing: 5,
        cutout: 0,
      },
    ],
  };

  const barChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Orders",
        data: monthlyOrdersData ? Object.values(monthlyOrdersData) : [],
        backgroundColor: "#252525",
        borderColor: "rgb(97, 79, 201)",
        borderWidth: 1,
        borderRadius: 3,
      },
    ],
  };

  const citiesStats = [
    {
      id: 1,
      city: "Lahore",
      percent: "85%",
    },
    {
      id: 2,
      city: "Karachi",
      percent: "55%",
    },
    {
      id: 3,
      city: "Peshawar",
      percent: "55%",
    },
    {
      id: 4,
      city: "Kashmir",
      percent: "96%",
    },
    {
      id: 5,
      city: "Gujranwala",
      percent: "96%",
    },
    {
      id: 6,
      city: "Faisalabad",
      percent: "96%",
    },
    {
      id: 7,
      city: "Skardu",
      percent: "55%",
    },
  ];

  return (
    <>
      <section className="bg-white dark:bg-gray-900 mt-7 mb-0 mx-6 px-2 pt-6 pb-16 min-h-screen rounded-lg">
        {/* ------------ FIRST STATS BAR ------------*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-4 lg:gap-4">
          <div className="h-40 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-between items-center">
            <div className="stat_data">
              <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                Gross Sale
              </h3>
              <h2 className="text-gray-900 dark:text-gray-100 mt-1.5 text-2xl font-semibold">
                232,789
              </h2>
              <p className="text-gray-900 mt-1.5 bg-gray-200 px-3 py-1 w-16 rounded-lg">
                +1.5k
              </p>
            </div>

            <div>
              <CircularProgress
                identifier="development6"
                startValue={0}
                endValue={76}
                speed={20}
                circleColor="#434343"
              />
            </div>
          </div>
          <div className="h-40 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-between items-center">
            <div className="stat_data">
              <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                Gross Sale
              </h3>
              <h2 className="text-gray-900 dark:text-gray-100 mt-1.5 text-2xl font-semibold">
                232,789
              </h2>
              <p className="text-gray-900 mt-1.5 bg-gray-200 px-3 py-1 w-16 rounded-lg">
                +1.5k
              </p>
            </div>

            <div>
              <CircularProgress
                identifier="development6"
                startValue={0}
                endValue={88}
                speed={20}
                circleColor="#434343"
              />
            </div>
          </div>
          <div className="h-40 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-between items-center">
            <div className="stat_data">
              <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                Gross Sale
              </h3>
              <h2 className="text-gray-900 dark:text-gray-100 mt-1.5 text-2xl font-semibold">
                232,789
              </h2>
              <p className="text-gray-900 mt-1.5 bg-gray-200 px-3 py-1 w-16 rounded-lg">
                +1.5k
              </p>
            </div>

            <div>
              <CircularProgress
                identifier="development6"
                startValue={0}
                endValue={54}
                speed={20}
                circleColor="#434343"
              />
            </div>
          </div>
          <div className="h-40 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-between items-center">
            <div className="stat_data">
              <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                Gross Sale
              </h3>
              <h2 className="text-gray-900 dark:text-gray-100 mt-1.5 text-2xl font-semibold">
                232,789
              </h2>
              <p className="text-gray-900 mt-1.5 bg-gray-200 px-3 py-1 w-16 rounded-lg">
                +1.5k
              </p>
            </div>

            <div>
              <CircularProgress
                identifier="development6"
                startValue={0}
                endValue={35}
                speed={20}
                circleColor="#434343"
              />
            </div>
          </div>


        </div>

        {/* ------------ SECOND STATS BAR ------------*/}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4">
          <div className="rounded-lg md:col-span-1 lg:col-span-4 xl:col-span-3">
            {/* BAR CHARTS */}
            <div className="h-[22rem] rounded-lg text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-700 w-full p-4">
              <Bar
                data={barChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>

            {/* TOTAL SUITES && ACCOUNTS */}
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-4 rounded-lg">
              {/* TOTAL SUITE */}
              <div className="rounded-lg lg:col-span-3">
                <div className="min-h-72 px-6 py-5 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-400 dark:border-gray-700">
                  <h2 className="text-lg font-medium mb-3">Total Suite</h2>
                  <p className="w-full bg-gray-300 h-px my-2"></p>
                  {citiesStats?.map((data, index) => (
                    <div key={index} className="my-4 city flex justify-between items-center">
                      <span>{data.city}</span>
                      <span className="font-semibold">{data.percent}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACCOUNTS DETAILS */}
              <div className="lg:col-span-1">
                <div className="h-28 mb-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-start items-center">
                  <div className="stat_data pl-4">
                    <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-lg font-medium">
                      Total Bags
                    </h3>
                    <h3 className="mt-2 text-gray-900 dark:text-gray-100">
                      <span className="text-xl font-semibold mr-2">
                        298,823
                      </span>
                      <span className="bg-gray-200 text-gray-900 rounded-xl text-sm p-1.5">
                        +1.5k
                      </span>
                    </h3>
                  </div>
                </div>
                <div className="h-28 mb-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-start items-center">
                  <div className="stat_data pl-4">
                    <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-lg font-medium">
                      Total Bags
                    </h3>
                    <h3 className="mt-2 text-gray-900 dark:text-gray-100">
                      <span className="text-xl font-semibold mr-2">
                        298,823
                      </span>
                      <span className="bg-gray-200 text-gray-900 rounded-xl text-sm p-1.5">
                        +1.5k
                      </span>
                    </h3>
                  </div>
                </div>
                <div className="h-28 mb-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-start items-center">
                  <div className="stat_data pl-4">
                    <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-lg font-medium">
                      Total Bags
                    </h3>
                    <h3 className="mt-2 text-gray-900 dark:text-gray-100">
                      <span className="text-xl font-semibold mr-2">
                        298,823
                      </span>
                      <span className="bg-gray-200 text-gray-900 rounded-xl text-sm p-1.5">
                        +1.5k
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SALES BY LOCATION */}
          <div className="px-4 pt-5 lg:col-span-4 xl:col-span-1 pb-5 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-400 dark:border-gray-700">
            <h2 className="mb-3 font-medium text-lg">Sales By Locations</h2>
            {citiesStats?.map((data, index) => (
              <div key={index} className="my-4 city flex justify-between items-center">
                <span>{data.city}</span>
                <span className="font-semibold">{data.percent}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardStats;
