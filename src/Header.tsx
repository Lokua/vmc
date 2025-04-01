import Select from './Select'

const channelOptions = Array(16)
  .fill(0)
  .map((_, i) => i + 1)

const pages = Array(4)
  .fill(0)
  .map((_, i) => i)

type Props = {
  channel: number
  outputPort: MIDIOutput | null
  outputPorts: MIDIOutput[]
  page: number
  onChangeChannel: (channel: number) => void
  onChangeOutputPort: (port: string) => void
  onChangePage: (page: number) => void
}

export default function Header({
  channel,
  outputPort: outputPort,
  outputPorts,
  page,
  onChangeChannel,
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
            onChange={(e) => {
              onChangeOutputPort(e.currentTarget.value)
            }}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="channel">Channel</label>
          <Select
            id="channel"
            value={((channel || 0) + 1).toString()}
            options={channelOptions}
            onChange={(e) => {
              onChangeChannel(parseInt(e.currentTarget.value, 10) - 1)
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
