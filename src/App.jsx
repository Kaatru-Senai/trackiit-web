import { useState , useEffect } from 'react';
import './App.css';
import LiveMap from './Components/LiveMap';
import Navbar from './Components/Navbar';
import Select from 'react-select';
import useWebSocket  from 'react-use-websocket';
// import { colourOptions } from '../data';

const options=[
  {
    "label":'IIT MAIN GATE',"value":'IIT MAIN GATE',
  },
  {
    "label":'VELACHERY GATE',"value":'VELACHERY GATE',
  },
  // {
  //   "label":'TARAMANI GATE',"value":'TARAMANI GATE',
  // }

]

function App() {
  const [liveTs,setLiveTs] = useState(0);
  const [socketUrl, setSocketUrl] = useState('wss://bw06.kaatru.org/realtime?devices=SG72');
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl,{
    onMessage:(e)=>{
      console.log(JSON.parse(e?.data))
      let data = JSON.parse(e.data)
      // if(data.dID === "SG72"){
        console.log(data.data.idata[0].data.dTS)
        setLiveTs(data.data.idata[0].data.dTS)
      // }
    }
  });
  // console.log(JSON.parse(lastMessage?.data))
  console.log(lastMessage?.data)
  // useEffect(()=>{
  //   if(lastMessage.dat)
  // },[lastMessage])
  const [value,setValue]=useState(options[0]);
  const [route,setRoute]=useState(0);
  console.log(route)
  return (
    <div className="App">
      <Navbar/>
      <h1 className='timestamp'>{liveTs}</h1>
      <LiveMap route={route}/>
      <div className="flex flex-col flex-auto justify-between">
        <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={options[0]}
          isClearable={true}
          isRtl={false}
          isSearchable={true}
          name="color"
          options={options}
          value={value}
          onChange={(e)=>{setValue(e)}}
        />
      <div className="py-4 mx-4 rounded-md">
        <button className='w-full rounded-md py-4 flex justify-center items-center bg-lime-400 text-white font-bold ' onClick={()=>{
          if(value.value==="IIT MAIN GATE"){setRoute(1);}else{setRoute(2);}
        }}>TRACKIIT</button>
      </div>
      </div>
    </div>
  );
}

export default App;
