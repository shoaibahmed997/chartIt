import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

export default function ChartTwo({Data,data}) {
  // if (data?.length ==0) {
  if (Data?._elements?.length ==0) {
    return <h1>No Data in Channel-2</h1>
  }

  return (
    <LineChart  width={800}
    height={400}
    // data={data}
    data={Data.toArray()}
    margin={{
      top: 5,
      // right: 30,
      // left: 20,
      bottom: 5,
    }}>
       <CartesianGrid strokeDasharray="3 3" />
          {/* <XAxis dataKey="timePoint" /> */}
          <YAxis domain={[-200,300]} tickCount="30" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="dataPoint" stroke="#82ca9d" dot={false} />


    </LineChart>
  )
}

