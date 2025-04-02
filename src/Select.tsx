type Override<T, U> = Omit<T, keyof U> & U

type Props = Override<
  React.HTMLAttributes<HTMLSelectElement>,
  {
    value: string
    options: string[] | number[]
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  }
>

export default function Select({ value, options, onChange, ...rest }: Props) {
  return (
    <span className="select-wrapper">
      <select value={value} onChange={onChange} {...rest}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </span>
  )
}
