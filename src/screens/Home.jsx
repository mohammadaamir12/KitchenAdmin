import React, { useState, useEffect } from 'react'
import TrafficSection from '../components/TrafficSection'
import Chart from 'react-apexcharts'
import maleandfemale from '../assets/male&female.jpeg'
import child from '../assets/childs.jpg'
import elder from '../assets/elders.jpg'
import female from '../assets/manns.jpg'
import male from '../assets/mans.jpg'
import { DatePicker } from 'antd';
import moment from 'moment/moment'
import axios from 'axios'
import WeeklyProgressBarGraph from '../components/Weeklybar'
const { RangePicker } = DatePicker;


export default function Home() {
  const [dates, setDates] = useState([])
  const [start, setStart] = useState(moment().format('DD-MM-YYYY'))
  const [end, setEnd] = useState(moment().subtract(10, 'day').format('DD-MM-YYYY'))
  const [seriesData, setSeriesData] = useState(new Array(30).fill(0));
  const [kidandold, setKidandold] = useState('')
  const [kidandold1, setKidandold1] = useState('')
  const [childs, setchilds] = useState('')
  const [mans, setMans] = useState('')
  const [olds, setolds] = useState('')
  const [elders, setelders] = useState('')
  const [males, setMales] = useState('')
  const [females, setFemales] = useState('')
  const [daily, setDaily] = useState('')
  const [week, setWeek] = useState('')
  const [month, setMonth] = useState('')
  const [yesterday, setyesterday] = useState('')
  const [peakHourData,setpeakHourData]=useState([])

  useEffect(() => {
    setEnd(moment().format('DD-MM-YYYY'));
    setStart(moment().subtract(1, 'day').format('DD-MM-YYYY'));
  }, []);
  // console.log('ppppppp',start,end);
  useEffect(() => {
    oldandkid();
    getmaleandwomendata();
    allGender();
    allGenderVisitor();
  }, [kidandold, females, childs, seriesData, start, end]);

  useEffect(() => {
    DailyVisit();
    weekVisit();
    monthVisit();
    yesterdayVisit();
  }, [daily, week, month, yesterday]);
  const getmaleandwomendata = () => {
    const startdate = start.toString()
    const endDate = end.toString()
    const params = {

      api_name: 'gender_count',
      branch_id: 3,
      start_date: startdate,
      end_date: endDate
    };

    axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params })
      .then(response => {
        setFemales(response.data[0].count)
        setMales(response.data[1].count)
        // console.log('Data:', response.data);
      })
      .catch(error => {

        console.error('Error:', error);
      });
  }

  const allGender = () => {
    const startdate = start.toString()
    const endDate = end.toString()
    const params = {
      api_name: 'age_group_count',
      branch_id: 3,
      start_date: startdate,
      end_date: endDate
    };


    axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params })
      .then(response => {
        // console.log('Data:', response.data);
        setchilds(response.data[3].count)
        setMans(response.data[0].count)
        setolds(response.data[1].count)
        setelders(response.data[2].count)
      })
      .catch(error => {

        console.error('Error:', error);
      });
  }

  const allGenderVisitor = () => {
    const startdate = start.toString()
    const endDate = end.toString()
    const params = {
      api_name: 'unique_head_count',
      branch_id: 3,
      start_date: startdate,
      end_date: endDate
    };

    axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params })
      .then(response => {
        // console.log('Data:', response.data);
        const newseriesData = new Array(30).fill(0);


        response.data.forEach(data => {
          const day = new Date(data.visitDate).getUTCDate();
          newseriesData[day - 1] += data.totalCount;
        });
        setSeriesData(newseriesData)
      })
      .catch(error => {

        console.error('Error:', error);
      });
  }
  const oldandkid = () => {
    const startdate = start.toString()
    const endDate = end.toString()
    console.log('allll',startdate,endDate);
    const params = {
      api_name: 'adult_kids_count',
      branch_id: 3,
      start_date: startdate,
      end_date: endDate
    };


    axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params })
      .then(response => {
        console.log('Data:', response.data);
        setKidandold(response.data[1].count)
        setKidandold1(response.data[0].count)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const DailyVisit = () => {
    const currentDate = new Date();
    const endDate = currentDate.toISOString().split('T')[0];
    const mainDate = endDate.toString()
    // console.log('check',endDate); 
    const params = {
      api_name: 'unique_head_count',
      branch_id: 3,
      start_date: mainDate,
      end_date: mainDate
    };


    axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params })
      .then(response => {
        // console.log('Data:dffdf', response.data);
        const totalSum = response.data.reduce((accumulator, visit) => accumulator + visit.totalCount, 0);

        const num = totalSum.toString()

        setDaily(num)
      })
      .catch(error => {

        console.error('Error:', error);
      });
  }

  const weekVisit = () => {
    const currentDate = new Date();
    const endDate = currentDate.toISOString().split('T')[0];
    const mainEndDate = endDate.toString()

    // Get date one week before
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 7);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const mainStartDate = formattedStartDate.toString()
    const params = {
      api_name: 'unique_head_count',
      branch_id: 3,
      start_date: mainStartDate,
      end_date: mainEndDate
    };


    axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params })
      .then(response => {
        // console.log('Data:', response.data);
        const totalSum = response.data.reduce((accumulator, visit) => accumulator + visit.totalCount, 0);

        const num = totalSum.toString()

        setWeek(num)
      })
      .catch(error => {

        console.error('Error:', error);
      });
  }

  const monthVisit = () => {
    const currentDate = new Date();
    const endDate = currentDate.toISOString().split('T')[0];
    const mainEndDate = endDate.toString()

    // Get date one month before
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 30);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const mainStartDate = formattedStartDate.toString()
    const params = {
      api_name: 'unique_head_count',
      branch_id: 3,
      start_date: mainStartDate,
      end_date: mainEndDate
    };


    axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params })
      .then(response => {
        // console.log('Data:', response.data);
        const totalSum = response.data.reduce((accumulator, visit) => accumulator + visit.totalCount, 0);

        const num = totalSum.toString()

        setMonth(num)
      })
      .catch(error => {

        console.error('Error:', error);
      });
  }
  const yesterdayVisit = () => {
    const currentDate = new Date();
    const endDate = currentDate.toISOString().split('T')[0];
    const mainEndDate = endDate.toString()

    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 1);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const mainStartDate = formattedStartDate.toString()
    const params = {
      api_name: 'unique_head_count',
      branch_id: 3,
      start_date: mainStartDate,
      end_date: mainEndDate
    };


    axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params })
      .then(response => {
        // console.log('Data:', response.data);
        const totalSum = response.data.reduce((accumulator, visit) => accumulator + visit.totalCount, 0);
        const num = totalSum.toString();
        setyesterday(num)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  const peakHour = () => {
    const currentDate = new Date();
    const endDate = currentDate.toISOString().split('T')[0];
    const mainEndDate = endDate.toString()

    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 1);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const mainStartDate = formattedStartDate.toString()
    const params = {
      api_name: 'peak_hours',
      branch_id: 3,
      start_date: mainStartDate,
      end_date: mainEndDate
    };


    axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params })
      .then(response => {
        console.log('Data:', response.data);
        const transformedData =response.data.map(item => ({
          visitHour: item.visitHour,
          totalUniqueCount: item.totalCount + item.uniqueCount
      }));
      //   const transformedData = response.data.map((dayData, dayIndex) => ({
      //     day: dayData.day,
      //     progress: dayData.progress.map((value, hourIndex) => (
      //         hourIndex < totalCounts.length ? totalCounts[hourIndex] : 0
      //     )),
      // }));
      console.log('after',transformedData);
      setpeakHourData(transformedData)
  
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  peakHour()

  const weekData = [
    { day: "Monday", progress: [10, 20, 30, 0, 50, 10, 15, 20, 25, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { day: "Tuesday", progress: [20, 30, 10, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5, 0, 0, 0, 0] },
    { day: "Wednesday", progress: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20] },
    { day: "Thursday", progress: [10, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { day: "Friday", progress: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50] },
    { day: "Saturday", progress: [30, 40, 20, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { day: "Sunday", progress: [15, 25, 35, 45, 55, 65, 75, 85, 95, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5, 0, 0, 0, 0] },
  ];


  return (
    <div>
      {/* filter section */}
      <div className="relative app-container flex flex-col p-4 gap-4 w-[95%] mx-auto h-[auto] max-h-[80vh] bg-white mt-5 rounded-md shadow-lg transform transition-transform ">
        <div className="top-2 left-4 text-lg font-semibold text-gray-800">
          Filter
        </div>
        <RangePicker
          onChange={(value) => {
            if (value && value.length) {
              setDates(value.map(item => moment(item).format('DD-MM-YYYY')));
            } else {
              setDates([]);
            }
          }}
        />
      </div>

      {/* Current traffic section */}
      <div className="relative app-container flex flex-col p-4 gap-4 w-[95%] mx-auto h-[auto] max-h-[80vh] bg-white mt-5 rounded-md shadow-lg transform transition-transform ">
        {/* Top-left corner text inside the main div */}
        <div className="top-2 left-4 text-2xl font-bold text-gray-800 self-center">
          Visitors
        </div>

        {/* Traffic Sections */}
        <div className="flex flex-col md:flex-row w-full gap-4">
          <div className="flex-1">
            <TrafficSection trafficNumber={daily} percentChange="5.6" name='Daily' />
          </div>
          <div className="flex-1">
            <TrafficSection trafficNumber={week} percentChange="-2.3" name='Weekly' />
          </div>
          <div className="flex-1">
            <TrafficSection trafficNumber={month} percentChange="0.8" name='Monthly' />
          </div>
        </div>
      </div>

      {/* previous traffic section */}
      <div className="relative app-container flex flex-col p-4 gap-4 w-[95%] mx-auto h-[auto] max-h-[80vh] bg-white mt-5 rounded-md shadow-lg transform transition-transform ">


        {/* Traffic Sections */}
        <div className="flex flex-col md:flex-row w-full gap-4">
          <div className="flex-1">
            <TrafficSection trafficNumber={yesterday} percentChange="-0.6" name='Yesterday' />
          </div>
          <div className="flex-1">
            <TrafficSection trafficNumber={week} percentChange="2.3" name='Weekly' />
          </div>
          <div className="flex-1">
            <TrafficSection trafficNumber={month} percentChange="-10.0" name='Monthly' />
          </div>
        </div>
      </div>


      {/* visitor showing with line chart */}
      <div className="relative app-container flex flex-col p-4 gap-4 w-[95%] mx-auto h-[auto] max-h-[80vh] bg-white mt-5 rounded-md shadow-lg transform transition-transform ">
        <div className="top-2 left-4 text-lg font-semibold text-gray-800">
          Visitors
        </div>
        <div className="flex flex-col md:flex-row w-full gap-4">
          <div className="w-full">
            <Chart
              width="100%"
              height={320}
              type='line'
              series={[{
                name: 'Visitor',
                data: seriesData
              },

              ]}
              options={{

                xaxis: {
                  title: { text: 'Total Visitors' },
                  categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
                }
              }}
            />
          </div>
        </div>
      </div>


      {/* old and kids traffic */}
      <div className="relative app-container flex flex-col p-4 gap-4 w-[95%] mx-auto h-[auto] max-h-[90vh] md:max-h-[80vh] bg-white mt-5 rounded-md shadow-lg transform transition-transform">
        <div className="top-2 left-4 text-xl font-semibold text-gray-800">
          Kid & Adult Visitors
        </div>
        <div className="flex flex-col md:flex-row w-full gap-4">

          <div className="w-full md:w-1/2">
            <Chart
              width="100%"
              height={320}
              type='pie'
              series={[kidandold, kidandold1]}
              options={{
                chart: {
                  type: 'pie',
                  width: '100%',
                },
                colors: ['#188c3d', '#9b66d4'],
                labels: ['Kids', 'Adults'],
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: '100%',
                        height: 320,
                      },
                      legend: {
                        position: 'bottom',
                      },
                    },
                  },
                ],
              }}
            />
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex justify-center mt-4">
              <div className="flex flex-col items-center mx-4">
                <img
                  src={child}
                  alt="Kids"
                  className="w-[120px] h-[200px]"
                />
                <h1 className='font-semibold text-lg font-serif mt-2'>Kids: {kidandold}</h1>
              </div>
              <div className="flex flex-col items-center mx-4">
                <img
                  src={male}
                  alt="Adult"
                  className="w-[160px] h-[200px]"
                />
                <h1 className='font-semibold text-lg font-serif mt-2'>Adults: {kidandold1}</h1>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* male and female pie chart */}
      <div className="relative app-container flex flex-col p-4 gap-4 w-[95%] mx-auto h-[auto] max-h-[90vh] md:max-h-[80vh] bg-white mt-5 rounded-md shadow-lg transform transition-transform ">
        <div className="top-2 left-4 text-xl font-semibold text-gray-800">
          Gender Visitors
        </div>
        <div className="flex flex-col md:flex-row w-full gap-4">
          <div className="w-full md:w-1/2">
            <div className="image-container mt-4">
              <img
                src={maleandfemale}
                alt="Description of Image"
                className="w-[220px] h-[180px] mx-auto"
              />
            </div>
            <div className='flex flex-row items-center justify-center mt-10 gap-x-8'>
              <h1 className='font-semibold text-lg font-serif'>Male:- {males}</h1>
              <h1 className='font-semibold text-lg font-serif'>Female:-{females} </h1>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <Chart
              width="100%"
              height={320}
              type='pie'
              series={[males, females]}
              options={{
                chart: {
                  type: 'pie',
                },
                colors: ['#80a5ed', '#f7a8a8'],
                labels: ['Male', 'Female'],
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 320
                      },
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }
                ]
              }}
            />

          </div>
        </div>
      </div>


      {/* all gender traffic section */}
      <div className="relative app-container flex flex-col p-4 gap-4 w-[95%] mx-auto h-[auto] max-h-[80vh] bg-white mt-5 rounded-md shadow-lg transform transition-transform">
        <div className="top-2 left-4 text-xl font-semibold text-gray-800">
          All Gender Visitors
        </div>
        <div className="flex justify-between gap-4">
          <div className="flex flex-col items-center">
            <img src={child} alt="Image 1" className="w-32 h-32 object-cover rounded-md" />
            <p className="mt-2 font-lg font-semibold text-center font-serif">{childs}</p>
          </div>
          <div className="flex flex-col items-center">
            <img src={male} alt="Image 2" className="w-32 h-32 object-cover rounded-md" />
            <p className="mt-2 font-lg font-semibold text-center font-serif">{mans}</p>
          </div>
          <div className="flex flex-col items-center">
            <img src={female} alt="Image 3" className="w-32 h-32 object-cover rounded-md" />
            <p className="mt-2 font-semibold font-lg text-center font-serif">{olds}</p>
          </div>
          <div className="flex flex-col items-center">
            <img src={elder} alt="Image 4" className="w-32 h-32 object-cover rounded-md" />
            <p className="mt-2 font-semibold font-lg text-center font-serif">{elders}</p>
          </div>
        </div>
      </div>
      <div className="relative app-container flex flex-col p-4 gap-4 w-[95%] mx-auto h-[auto] max-h-[90vh] bg-white mt-5 rounded-md shadow-lg transform transition-transform">
        <WeeklyProgressBarGraph weekData={peakHourData} />
      </div>



    </div>






  )
}
