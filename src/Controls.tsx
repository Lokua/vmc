import { useState } from 'react'
import NumberBox from './NumberBox'

const initialValues = Array(128).fill(0)
const itemsPerPage = 32

type Props = {
  page: number
  onChange: (cc: number, value: number) => void
}

export default function App({ onChange: parentOnChange, page }: Props) {
  const [values, setValues] = useState(initialValues)

  function onChange(cc: number, value: number) {
    const nextValues = values.slice()
    nextValues[cc] = value
    setValues(nextValues)
    parentOnChange(cc, value)
  }

  const startIndex = page * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, values.length)
  const currentPageValues = values.slice(startIndex, endIndex)

  return (
    <main id="controls">
      {currentPageValues.map((value, index) => {
        const cc = startIndex + index

        return (
          <fieldset key={cc}>
            <label htmlFor={`control-${cc}`}>{cc}</label>
            <input
              id={`control-${cc}`}
              type="range"
              value={value.toString()}
              onChange={(e) => {
                onChange(cc, parseFloat(e.currentTarget.value))
              }}
            />
            <NumberBox
              value={value}
              min={0}
              max={127}
              decimals={0}
              step={1}
              onChange={(v) => {
                onChange(cc, v)
              }}
            />
          </fieldset>
        )
      })}
    </main>
  )
}
