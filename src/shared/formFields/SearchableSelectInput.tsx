import { type FC } from 'react'
import { X } from 'react-feather'
import Select, { type MultiValueGenericProps, type MultiValueRemoveProps } from 'react-select'
import type { OptionType, SearchableSelectProps } from '../../types/shared'

const SearchableSelect: FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  isClearable = true,
  isMulti = false,
  ...rest
}) => {
  const MultiValueRemove = (props: MultiValueRemoveProps<OptionType>) => {
    return (
      <div {...props.innerProps} className="multi-value-remove">
        <X size={14} />
      </div>
    )
  }

  const MultiValueContainer = (props: MultiValueGenericProps<OptionType>) => {
    return <div className="multi-value-container d-flex">{props.children}</div>
  }

  return (
    <div className="searchable-select-container">
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isClearable={isClearable}
        isSearchable
        isMulti={isMulti}
        components={{
          ...(isMulti && {
            MultiValueRemove,
            MultiValueContainer,
          }),
        }}
        classNamePrefix="react-select"
        {...rest}
      />
    </div>
  )
}

export default SearchableSelect
