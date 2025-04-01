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

enum StorageKeys {
  Channel = 'vmc.channel',
  Hrcc = 'vmc.hrcc',
  OutputPortName = 'vmc.outputPort',
}

function getStoredHrcc() {
  const stored = localStorage.getItem(StorageKeys.Hrcc)
  if (stored) {
    return Boolean(parseInt(stored, 10))
  }
  return false
}

function getStoredChannel() {
  const stored = localStorage.getItem(StorageKeys.Channel)
  if (stored) {
    return parseInt(stored)
  }
  return 0
}

function getStoredPort(outputPorts: MIDIOutput[]) {
  const stored = localStorage.getItem(StorageKeys.OutputPortName)
  if (stored) {
    const port = outputPorts.find((p) => p.name === stored)!
    return port
  }
  return outputPorts[0]
}

export default function App() {
  const [outputPort, setOutputPort] = useState<MIDIOutput | null>(null)
  const [outputPorts, setOutputPorts] = useState<MIDIOutput[]>([])
  const [channel, setChannel] = useState(getStoredChannel())
  const [hrcc, setHrcc] = useState(getStoredHrcc())
  const [page, setPage] = useState(0)

  useEffect(() => {
    ;(async () => {
      const { outputs } = await getPorts()
      setOutputPorts(outputs)
      setOutputPort(getStoredPort(outputs))
    })()
  }, [])

  function onChangeOutputPort(portName: string) {
    const port = outputPorts.find((p) => p.name === portName)!
    setOutputPort(port)
    localStorage.setItem(StorageKeys.OutputPortName, port.name as string)
  }

  function onChangeHrcc(checked: boolean) {
    setHrcc(checked)
    localStorage.setItem(StorageKeys.Hrcc, String(+checked))
  }

  function onChangeChannel(ch: number) {
    setChannel(ch)
    localStorage.setItem(StorageKeys.Channel, String(ch))
  }

  function send(cc: number, value: number) {
    const status = 0xb0 | channel
    if (hrcc && cc < 32) {
      const valueMsb = value >> 7
      const valueLsb = value & 0x7f
      outputPort?.send([status, cc, valueMsb])
      outputPort?.send([status, cc + 32, valueLsb])
    } else {
      outputPort?.send([status, cc, value])
    }
  }

  return (
    <div id="app">
      <Header
        channel={channel}
        hrcc={hrcc}
        outputPort={outputPort}
        outputPorts={outputPorts}
        page={page}
        onChangeChannel={onChangeChannel}
        onChangeHrcc={onChangeHrcc}
        onChangeOutputPort={onChangeOutputPort}
        onChangePage={setPage}
      />
      <Controls page={page} onChange={send} hrcc={hrcc} />
    </div>
  )
}
