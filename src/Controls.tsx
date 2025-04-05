import { useState } from 'react'
import NumberBox from '@lokua/number-box'
import { DisplayMode } from './App'

const initialValues = Array(128).fill(0)
const itemsPerPage = 32

function toDisplayValue(
  value: number,
  max: number,
  displayMode: DisplayMode
): number {
  switch (displayMode) {
    case '0-1': {
      return Number((value / max).toFixed(max > 127 ? 4 : 2))
    }
    case '0-100': {
      return Number(((value / max) * 100).toFixed(max > 127 ? 2 : 0))
    }
    case '0-127':
    default: {
      return value
    }
  }
}

function fromDisplayValue(
  displayValue: number,
  max: number,
  displayMode: DisplayMode
): number {
  switch (displayMode) {
    case '0-1': {
      return Math.round(displayValue * max)
    }
    case '0-100': {
      return Math.round((displayValue / 100) * max)
    }
    case '0-127':
    default: {
      return displayValue
    }
  }
}

type Props = {
  displayMode: DisplayMode
  hrcc: boolean
  page: number
  onChange: (cc: number, value: number) => void
}

export default function Controls({
  displayMode,
  hrcc,
  page,
  onChange: parentOnChange,
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
        const internalMax = hrcc && cc < 32 ? 16_383 : 127
        const internalValue = Math.min(originalValue, internalMax)

        let displayMin = 0
        let displayMax: number
        let displayStep: number

        switch (displayMode) {
          case '0-1': {
            displayMin = 0
            displayMax = 1
            displayStep = hrcc && cc < 32 ? 0.0001 : 0.01
            break
          }
          case '0-100': {
            displayMin = 0
            displayMax = 100
            displayStep = hrcc && cc < 32 ? 0.01 : 1
            break
          }
          case '0-127':
          default: {
            displayMin = 0
            displayMax = internalMax
            displayStep = 1
            break
          }
        }

        const displayValue = toDisplayValue(
          internalValue,
          internalMax,
          displayMode
        )

        return (
          <fieldset key={cc}>
            <label htmlFor={`control-${cc}`}>{cc}</label>
            <input
              id={`control-${cc}`}
              type="range"
              value={displayValue.toString()}
              min={displayMin}
              max={displayMax}
              step={displayStep}
              onChange={(e) => {
                const newDisplayValue = e.currentTarget.valueAsNumber
                const newInternalValue = fromDisplayValue(
                  newDisplayValue,
                  internalMax,
                  displayMode
                )
                onChange(cc, newInternalValue)
              }}
            />
            <NumberBox
              className="number-box"
              value={displayValue}
              min={displayMin}
              max={displayMax}
              step={displayStep}
              onChange={(newDisplayValue) => {
                const newInternalValue = fromDisplayValue(
                  newDisplayValue,
                  internalMax,
                  displayMode
                )
                onChange(cc, newInternalValue)
              }}
            />
          </fieldset>
        )
      })}
    </main>
  )
}
