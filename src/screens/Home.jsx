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
  const [prevWeek, setPrevWeek] = useState('')
  const [month, setMonth] = useState('')
  const [prevMonth, setPrevMonth] = useState('')
  const [yesterday, setyesterday] = useState('')
  const [peakHourData, setpeakHourData] = useState([])

  useEffect(() => {
    setEnd(moment().format('DD-MM-YYYY'));
    setStart(moment().subtract(1, 'day').format('DD-MM-YYYY'));
  }, []);
  console.log('ppppppp',start,end);
  
  useEffect(() => {
      const fetchData = async () => {
          await oldandkid();
          await getmaleandwomendata();
          await allGender();
          await allGenderVisitor();
      };
      fetchData();
  }, [kidandold, females, childs, seriesData, males,dates]);
  
  useEffect(() => {
      const fetchVisits = async () => {
          await DailyVisit();
          await weekVisit();
          await monthVisit();
          await yesterdayVisit();
          await prevMonthVisit();
          await prevWeekVisit();
          await peakHour();
      };
      fetchVisits();
  }, [daily, week, month, yesterday]);
  
  const getmaleandwomendata = async () => {
      // const startdate = start.toString();
      // const endDate = end.toString();
      console.log('sdsdsdssdsdsdsdsdsd',dates);
      const params = {
          api_name: 'gender_count',
          branch_id: 3,
          start_date: dates[0],
          end_date: dates[1],
      };
  
      try {
          const response = await axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params });
          setFemales(response.data[0].count);
          setMales(response.data[1].count);
          console.log('sds',response.data);
      } catch (error) {
          console.error('Error:', error);
      }
  };
  
  const allGender = async () => {
      // const startdate = start.toString();
      // const endDate = end.toString();
      const params = {
          api_name: 'age_group_count',
          branch_id: 3,
          start_date: dates[0],
          end_date: dates[1],
      };
  
      try {
          const response = await axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params });
          setchilds(response.data[3].count);
          setMans(response.data[0].count);
          setolds(response.data[1].count);
          setelders(response.data[2].count);
      } catch (error) {
          console.error('Error:', error);
      }
  };
  
  const allGenderVisitor = async () => {
      // const startdate = start.toString();
      // const endDate = end.toString();
      const params = {
          api_name: 'unique_head_count',
          branch_id: 3,
          start_date: dates[0],
          end_date: dates[1],
      };
  
      try {
          const response = await axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params });
          const newseriesData = new Array(30).fill(0);
  
          response.data.forEach(data => {
              const day = new Date(data.visitDate).getUTCDate();
              newseriesData[day - 1] += data.uniqueCount;
          });
          setSeriesData(newseriesData);
      } catch (error) {
          console.error('Error:', error);
      }
  };
  
  const oldandkid = async () => {
    console.log('love',start,end);
    console.log('lovellll',dates[1],dates[0]);
      const startdate = start.toString();
      const endDate = end.toString();
      const start_date = dates[0] || startdate;
    const end_date = dates[1] || endDate;
      const params = {
          api_name: 'adult_kids_count',
          branch_id: 3,
          start_date: start_date ,
          end_date: end_date  ,
      };
  
      try {
          const response = await axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params });
          setKidandold(response.data[1].count);
          setKidandold1(response.data[0].count);
      } catch (error) {
          console.error('Error:', error);
      }
  };
  
  const DailyVisit = async () => {
      const currentDate = new Date();
      const endDate = currentDate.toISOString().split('T')[0];
      const params = {
          api_name: 'unique_head_count',
          branch_id: 3,
          start_date: endDate,
          end_date: endDate,
      };
  
      try {
          const response = await axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params });
          const totalSum = response.data.reduce((accumulator, visit) => accumulator + visit.uniqueCount, 0);
          setDaily(totalSum.toString());
      } catch (error) {
          console.error('Error:', error);
      }
  };
  
  const weekVisit = async () => {
      const currentDate = new Date();
      const endDate = currentDate.toISOString().split('T')[0];
      const startDate = new Date(currentDate);
      const dayOfWeek = currentDate.getDay();
      const daysSinceMonday = (dayOfWeek + 6) % 7;
      startDate.setDate(currentDate.getDate() - daysSinceMonday);
      const formattedStartDate = startDate.toISOString().split('T')[0];
  
      const params = {
          api_name: 'unique_head_count',
          branch_id: 3,
          start_date: formattedStartDate,
          end_date: endDate,
      };
  
      try {
          const response = await axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params });
          const totalSum = response.data.reduce((accumulator, visit) => accumulator + visit.uniqueCount, 0);
          setWeek(totalSum.toString());
      } catch (error) {
          console.error('Error:', error);
      }
  };
  
  const monthVisit = async () => {
      const currentDate = new Date();
      const endDate = currentDate.toISOString().split('T')[0];
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const formattedStartDate = startDate.toISOString().split('T')[0];
  
      const params = {
          api_name: 'unique_head_count',
          branch_id: 3,
          start_date: formattedStartDate,
          end_date: endDate,
      };
  
      try {
          const response = await axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params });
          const totalSum = response.data.reduce((accumulator, visit) => accumulator + visit.uniqueCount, 0);
          setMonth(totalSum.toString());
          console.log('month',response.data);
      } catch (error) {
          console.error('Error:', error);
      }
  };
  
  const prevMonthVisit = async () => {
      const currentDate = new Date();
      const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth - 1);
      const endDate = lastDayOfPreviousMonth.toISOString().split('T')[0];
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const formattedStartDate = startDate.toISOString().split('T')[0];
  
      const params = {
          api_name: 'unique_head_count',
          branch_id: 3,
          start_date: formattedStartDate,
          end_date: endDate,
      };
  
      try {
          const response = await axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params });
          const totalSum = response.data.reduce((accumulator, visit) => accumulator + visit.uniqueCount, 0);
          setPrevMonth(totalSum.toString());
      } catch (error) {
          console.error('Error:', error);
      }
  };
  
  const prevWeekVisit = async () => {
      const currentDate = new Date();
      const dayOfWeek = currentDate.getDay();
      const daysSinceLastMonday = dayOfWeek + 6;
      const previousMonday = new Date(currentDate);
      previousMonday.setDate(currentDate.getDate() - daysSinceLastMonday);
      const previousSunday = new Date(previousMonday);
      previousSunday.setDate(previousMonday.getDate() + 6);
      const formattedStartDate = previousMonday.toISOString().split('T')[0];
      const formattedEndDate = previousSunday.toISOString().split('T')[0];
  
      const params = {
          api_name: 'unique_head_count',
          branch_id: 3,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
      };
  
      try {
          const response = await axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params });
          const totalSum = response.data.reduce((accumulator, visit) => accumulator + visit.uniqueCount, 0);
          setPrevWeek(totalSum.toString());
      } catch (error) {
          console.error('Error:', error);
      }
  };
  
  const yesterdayVisit = async () => {
      const currentDate = new Date();
      const endDate = currentDate.toISOString().split('T')[0];
      const startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 1);
      const formattedStartDate = startDate.toISOString().split('T')[0];
  
      const params = {
          api_name: 'unique_head_count',
          branch_id: 3,
          start_date: formattedStartDate,
          end_date: formattedStartDate,
      };
  
      try {
          const response = await axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params });
          const totalSum = response.data.reduce((accumulator, visit) => accumulator + visit.uniqueCount, 0);
          setyesterday(totalSum.toString());
      } catch (error) {
          console.error('Error:', error);
      }
  };
  
  const peakHour = async () => {
      const currentDate = new Date();
      const endDate = currentDate.toISOString().split('T')[0];
      const startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 1);
      const formattedStartDate = startDate.toISOString().split('T')[0];
  
      const params = {
          api_name: 'peak_hours',
          branch_id: 3,
          start_date: formattedStartDate,
          end_date: endDate,
      };
  
      try {
          const response = await axios.get('https://br42legudi.execute-api.ap-south-1.amazonaws.com/default/lambda-batch-process-dashboard', { params });
          const transformedData = response.data.map(item => ({
              visitHour: item.visitHour,
              totalUniqueCount: item.totalCount,
          }));
          setpeakHourData(transformedData);
      } catch (error) {
          console.error('Error:', error);
      }
  };
   const setAllDates=()=>{
    console.log('ttt',dates);
    
  }
  
console.log('dateee',dates);
  // const weekData = [
  //   { day: "Monday", progress: [10, 20, 30, 0, 50, 10, 15, 20, 25, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  //   { day: "Tuesday", progress: [20, 30, 10, 40, 50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5, 0, 0, 0, 0] },
  //   { day: "Wednesday", progress: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40, 30, 20] },
  //   { day: "Thursday", progress: [10, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  //   { day: "Friday", progress: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50] },
  //   { day: "Saturday", progress: [30, 40, 20, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  //   { day: "Sunday", progress: [15, 25, 35, 45, 55, 65, 75, 85, 95, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5, 0, 0, 0, 0] },
  // ];

  const handleDateChange = (values) => {
    
  
    const date1 = new Date(values[0]);
const date2 = new Date(values[1]);

// Format the dates
const formattedDate1 = moment(date1).format('DD-MM-YYYY');
const formattedDate2 = moment(date2).format('DD-MM-YYYY');
setDates([formattedDate1, formattedDate2]);
setStart(dates[0])
  };

 
  return (
    <div>
      {/* filter section */}
      <div className="relative app-container flex flex-col p-4 gap-4 w-[95%] mx-auto h-[auto] max-h-[80vh] bg-white mt-5 rounded-md shadow-lg transform transition-transform ">
        <div className="top-2 left-4 text-lg font-semibold text-gray-800">
          Filter
        </div>
        <RangePicker
          onChange={handleDateChange}
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
            <TrafficSection trafficNumber={prevWeek} percentChange="2.3" name='Weekly' />
          </div>
          <div className="flex-1">
            <TrafficSection trafficNumber={prevMonth} percentChange="-10.0" name='Monthly' />
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
