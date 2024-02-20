import React from 'react'
import IITMLogo from '../assets/iitm_logo.png'
import KaatruLogo from '../assets/Frame 1s.png'

function Navbar() {
  return (
    <div className="w-[100vw] h-[10vh] border-b-2 border-gray-300 flex justify-between items-cent">
      <div className="ml-4">
        <img src={IITMLogo} alt="" className='w-[60px] h-[50px]'/>
      </div>
        <div className="w-full h-full flex justify-center items-center font-bold text-[5vmin]">
            TRACKIIT
        </div>
        <div className="mr-4">
          <img src={KaatruLogo} alt="" className='w-[150px] h-[50px]'/>
        </div>
    </div>
  )
}

export default Navbar