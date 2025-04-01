import { useEffect, useState } from 'react'
import Header from './Header'
import Controls from './Controls'

async function getPorts() {
  const { inputs, outputs } = await navigator.requestMIDIAccess()

  return {
    inputs: Array.from(inputs.values()),
    outputs: Array.from(outputs.values()),
  }
}

export default function App() {
  const [channel, setChannel] = useState(0)
  const [outputPort, setOutputPort] = useState<MIDIOutput | null>(null)
  const [outputPorts, setOutputPorts] = useState<MIDIOutput[]>([])
  const [page, setPage] = useState(0)

  useEffect(() => {
    ;(async () => {
      const { outputs } = await getPorts()
      setOutputPorts(outputs)

      if (!outputPort) {
        setOutputPort(outputs[0])
      }
    })()
  }, [])

  function onChangeOutputPort(portName: string) {
    const port = outputPorts.find((p) => p.name === portName)!
    setOutputPort(port)
  }

  return (
    <div id="app">
      <Header
        channel={channel}
        outputPort={outputPort}
        outputPorts={outputPorts}
        page={page}
        onChangeChannel={setChannel}
        onChangeOutputPort={onChangeOutputPort}
        onChangePage={setPage}
      />
      <Controls
        page={page}
        onChange={(cc, value) => {
          outputPort?.send([176 + channel, cc, value])
        }}
      />
    </div>
  )
}
