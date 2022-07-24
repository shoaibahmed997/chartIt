import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
const {ipcRenderer} = require('electron')
import Chart from './../components/ChartComponent';
import ChartTwo from './../components/ChartTwo'
import { Queue } from '@datastructures-js/queue';
import { useQueueState } from "rooks";

function Next() {
  const [isActive, setActive] = useState(true);
  const [buttonText, setButtonText] = useState('Fetch Data Stream');
  const [listenerCount, setCount] = useState(0);
  const [data,setdata] = useState([])
  const DataQueue = useRef(new Queue)
  const DataQueue2 = useRef(new Queue)
  const mycount = useRef(0)

  const helper = packets=>{
    for(let i=0;i<packets.length;i++){
        DataQueue.current.enqueue({
          name:"channel - 1",
          dataPoint:packets[i][0],
          timePoint:packets[i][8]
        })
        DataQueue2.current.enqueue({
          name:"channel - 2",
          dataPoint:packets[i][1],
          timePoint:packets[i][8]
        })
        mycount.current++
    // =================>
      setdata(prev=>([{
        name:"channel -1",
        dataPoint:packets[i][0],
        timePoint:packets[i][8]
    }]))
    // =================>
      if(mycount.current>100){
        Remover()
      }
    }
  }

  const Remover = ()=>{
    // for(let i =0;i<DataQueue.current.size();i++){
    //   DataQueue.current.dequeue()
    // }
      DataQueue.current.dequeue()
      DataQueue2.current.dequeue()
  }

  const getData = () => {
    ipcRenderer.on("device-data",(event,packets)=>{
      console.log(packets)
      helper(packets)
      setCount(listenerCount+1)

    })

    ipcRenderer.on("fetch-data",(event,message)=>{
      if(message=='completed'){
        setActive(true)
        setButtonText('Fetch Data Stream')
      }
    }) 
  }

  const fetchData = () => {
    setActive(false);
    ipcRenderer.invoke('fetch-data').then(() => {
      setButtonText('Fetching In Progress')
    })
    if(listenerCount==0) getData();
  };


  return (
    <React.Fragment>
      <Head>
        <title>Neuphony - Chart It</title>
      </Head>
      <div className='grid grid-col-1 text-2xl w-full text-center'>
        <img className='ml-auto mr-auto' src='/images/logo.png' />
        <span>⚡ Render the Graph on this Page ⚡</span>
      </div>

      <div className='mt-4 w-full flex-wrap flex justify-center'>
      <button className={isActive ? 'btn-blue': 
      'bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed'} 
      onClick={fetchData}>{buttonText}</button>
      </div>

      <div id="chartIt"> 
      <span className='mt-4 w-full flex-wrap flex justify-center'>⚡  Channel-1 Chart ⚡</span> 
      <Chart Data={DataQueue.current} data={data} />
      </div> 

      <div id="chartIt"> 
      <span className='mt-4 w-full flex-wrap flex justify-center'>⚡  Channel-2 Chart ⚡</span> 
      <ChartTwo Data={DataQueue2.current} data={data} />
      </div> 

      <div className='mt-10 w-full flex-wrap flex justify-center'>
        <Link href='/home'>
          <a className='btn-blue'>Go to home page</a>
        </Link>
      </div>
    </React.Fragment>
  )
}

export default Next
