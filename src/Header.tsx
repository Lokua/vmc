import { DisplayMode } from './App'
import Select from './Select'

const channelOptions = Array(16)
  .fill(0)
  .map((_, i) => i + 1)

const pages = Array(4)
  .fill(0)
  .map((_, i) => i)

type Props = {
  channel: number
  displayMode: string
  hrcc: boolean
  outputPort: MIDIOutput | null
  outputPorts: MIDIOutput[]
  page: number
  onChangeChannel: (channel: number) => void
  onChangeDisplayMode: (displayMode: DisplayMode) => void
  onChangeHrcc: (hrcc: boolean) => void
  onChangeOutputPort: (port: string) => void
  onChangePage: (page: number) => void
}

export default function Header({
  channel,
  displayMode,
  hrcc,
  outputPort: outputPort,
  outputPorts,
  page,
  onChangeChannel,
  onChangeDisplayMode,
  onChangeHrcc,
  onChangeOutputPort,
  onChangePage,
}: Props) {
  return (
    <header id="settings">
      <section>
        <fieldset>
          <label htmlFor="output-port">Port</label>
          <Select
            id="output-port"
            value={outputPort?.name || ''}
            options={outputPorts.map((port) => port.name as string)}
            onChange={onChangeOutputPort}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="channel">Channel</label>
          <Select
            id="channel"
            value={((channel || 0) + 1).toString()}
            options={channelOptions}
            onChange={(value) => {
              onChangeChannel(parseInt(value, 10) - 1)
            }}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="hrcc">Hi-Res</label>
          <input
            id="hrcc"
            type="checkbox"
            checked={hrcc}
            onChange={(e) => {
              onChangeHrcc(e.currentTarget.checked)
            }}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="display-mode">Display Mode</label>
          <Select
            id="display-mode"
            value={displayMode}
            options={['0-127', '0-1', '0-100']}
            onChange={(value) => {
              onChangeDisplayMode(value as DisplayMode)
            }}
          />
        </fieldset>
      </section>
      <section>
        {pages.map((p) => (
          <button
            key={p}
            className={page === p ? 'on' : ''}
            onClick={() => {
              onChangePage(p)
            }}
          >
            {p + 1}
          </button>
        ))}
      </section>
    </header>
  )
}
