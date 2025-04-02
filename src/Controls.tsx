import { useState } from 'react'
import NumberBox from './NumberBox'

const initialValues = Array(128).fill(0)
const itemsPerPage = 32

type Props = {
  hrcc: boolean
  page: number
  onChange: (cc: number, value: number) => void
}

export default function Controls({
  onChange: parentOnChange,
  page,
  hrcc,
}: Props) {
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
      {currentPageValues.map((originalValue, index) => {
        const cc = startIndex + index
        const max = hrcc && cc < 32 ? 16_383 : 127
        const value = Math.min(originalValue, max)

        return (
          <fieldset key={cc}>
            <label htmlFor={`control-${cc}`}>{cc}</label>
            <input
              id={`control-${cc}`}
              type="range"
              min={0}
              max={max}
              step={1}
              value={value.toString()}
              onChange={(e) => {
                onChange(cc, e.currentTarget.valueAsNumber)
              }}
            />
            <NumberBox
              className="number-box"
              value={value}
              min={0}
              max={max}
              step={1}
              onChange={(value) => {
                onChange(cc, value)
              }}
            />
          </fieldset>
        )
      })}
    </main>
  )
}
