import './App.css';
import LiveMap from './Components/LiveMap';
import Navbar from './Components/Navbar';
import Select from 'react-select';
// import { colourOptions } from '../data';

const options=[
  {
    "label":'IIT MAIN GATE',"value":'IIT MAIN GATE',
  },
  {
    "label":'VELACHERY GATE',"value":'VELACHERY GATE',
  },
  {
    "label":'TARAMANI GATE',"value":'TARAMANI GATE',
  }

]

function App() {
  return (
    <div className="App">
      <Navbar/>
      <LiveMap/>
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
        />
      <div className="py-4 mx-4 rounded-md">
        <button className='w-full rounded-md py-4 flex justify-center items-center bg-lime-400 text-white font-bold '>TRACKIIT</button>
      </div>
      </div>
    </div>
  );
}

export default App;
