import { useEffect, useState } from 'react'
import Header from './Header'
import Controls from './Controls'

export type DisplayMode = '0-127' | '0-1' | '0-100'

async function getPorts() {
  const { inputs, outputs } = await navigator.requestMIDIAccess()

  return {
    inputs: Array.from(inputs.values()),
    outputs: Array.from(outputs.values()),
  }
}

enum StorageKeys {
  Channel = 'vmc.channel',
  DisplayMode = 'vmc.displayMode',
  Hrcc = 'vmc.hrcc',
  OutputPortName = 'vmc.outputPort',
}

function getStoredChannel() {
  const stored = localStorage.getItem(StorageKeys.Channel)
  return stored ? parseInt(stored) : 0
}

function getStoredDisplayMode(): DisplayMode {
  const stored = localStorage.getItem(StorageKeys.DisplayMode)
  return stored ? (stored as DisplayMode) : '0-127'
}

function getStoredHrcc() {
  const stored = localStorage.getItem(StorageKeys.Hrcc)
  return stored ? Boolean(parseInt(stored, 10)) : false
}

function getStoredPort(outputPorts: MIDIOutput[]) {
  const stored = localStorage.getItem(StorageKeys.OutputPortName)
  return stored ? outputPorts.find((p) => p.name === stored)! : outputPorts[0]
}

export default function App() {
  const [channel, setChannel] = useState(getStoredChannel())
  const [displayMode, setDisplayMode] = useState(getStoredDisplayMode())
  const [hrcc, setHrcc] = useState(getStoredHrcc())
  const [outputPort, setOutputPort] = useState<MIDIOutput | null>(null)
  const [outputPorts, setOutputPorts] = useState<MIDIOutput[]>([])
  const [page, setPage] = useState(0)

  useEffect(() => {
    ;(async () => {
      const { outputs } = await getPorts()
      setOutputPorts(outputs)
      setOutputPort(getStoredPort(outputs))
    })()
  }, [])

  function onChangeChannel(ch: number) {
    setChannel(ch)
    localStorage.setItem(StorageKeys.Channel, String(ch))
  }

  function onChangeDisplayMode(mode: DisplayMode) {
    setDisplayMode(mode)
    localStorage.setItem(StorageKeys.DisplayMode, mode)
  }

  function onChangeHrcc(checked: boolean) {
    setHrcc(checked)
    localStorage.setItem(StorageKeys.Hrcc, String(+checked))
  }

  function onChangeOutputPort(portName: string) {
    const port = outputPorts.find((p) => p.name === portName)!
    setOutputPort(port)
    localStorage.setItem(StorageKeys.OutputPortName, port.name as string)
  }

  function send(cc: number, value: number) {
    const midiValue = value
    const status = 0xb0 | channel

    if (hrcc && cc < 32) {
      const valueMsb = midiValue >> 7
      const valueLsb = midiValue & 0x7f
      outputPort?.send([status, cc, valueMsb])
      outputPort?.send([status, cc + 32, valueLsb])
    } else {
      const normalizedValue = Math.min(127, Math.max(0, midiValue))
      outputPort?.send([status, cc, normalizedValue])
    }
  }

  return (
    <div id="app">
      <Header
        channel={channel}
        displayMode={displayMode}
        hrcc={hrcc}
        outputPort={outputPort}
        outputPorts={outputPorts}
        page={page}
        onChangeChannel={onChangeChannel}
        onChangeDisplayMode={onChangeDisplayMode}
        onChangeHrcc={onChangeHrcc}
        onChangeOutputPort={onChangeOutputPort}
        onChangePage={setPage}
      />
      <Controls
        hrcc={hrcc}
        displayMode={displayMode}
        page={page}
        onChange={send}
      />
    </div>
  )
}
