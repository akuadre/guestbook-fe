// src/components-guestbook/InputField.jsx
import React from 'react';
import ReactSelect from 'react-select';

// Komponen Input Biasa
export const InputField = ({
  label,
  id,
  icon: Icon,
  type = 'text',
  placeholder,
  name,
  value,
  onChange,
  required = false,
  ...props
}) => {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        )}
        {type === 'textarea' ? (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder-gray-400 text-base"
            rows={3}
            {...props}
          />
        ) : (
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder-gray-400 text-base"
            {...props}
          />
        )}
      </div>
    </div>
  );
};

// Komponen Select (Dropdown) - dengan loading support tapi warna tetap
export const SelectField = ({
  label,
  icon: Icon,
  options = [],
  value,
  onChange,
  placeholder = "Pilih...",
  isSearchable = false,
  required = false,
  formatOptionLabel,
  isLoading = false,
  loadingMessage = "Memuat...",
  ...props
}) => {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'white',
      borderColor: state.isFocused ? '#0ea5e9' : '#d1d5db',
      borderRadius: '0.5rem',
      paddingLeft: '2.5rem',
      paddingTop: '0.25rem',
      paddingBottom: '0.25rem',
      minHeight: '48px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(14, 165, 233, 0.2)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#0ea5e9' : '#9ca3af'
      },
      fontSize: '1rem'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af',
      fontSize: '1rem',
      fontWeight: 'normal'
    }),
    input: (base) => ({
      ...base,
      color: '#374151',
      fontSize: '1rem',
      padding: '0',
      margin: '0'
    }),
    singleValue: (base) => ({
      ...base,
      color: '#374151',
      fontSize: '1rem'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#0ea5e9' : state.isFocused ? '#f0f9ff' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontSize: '1rem',
      padding: '0.75rem 1rem',
      '&:hover': {
        backgroundColor: '#f0f9ff'
      }
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 20
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#6b7280',
      '&:hover': {
        color: '#374151'
      }
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: '#d1d5db'
    }),
    loadingIndicator: (base) => ({
      ...base,
      color: '#6b7280'
    }),
    loadingMessage: (base) => ({
      ...base,
      color: '#6b7280',
      fontSize: '0.875rem'
    })
  };

  return (
    <div>
      <label className="block font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
        {isLoading && (
          <span className="ml-2 text-sm text-gray-500 font-normal">
            (memuat...)
          </span>
        )}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
        )}
        <ReactSelect
          options={options}
          value={value}
          onChange={onChange}
          placeholder={isLoading ? loadingMessage : placeholder}
          isSearchable={isSearchable}
          styles={customStyles}
          formatOptionLabel={formatOptionLabel}
          required={required}
          isLoading={isLoading}
          loadingMessage={() => loadingMessage}
          noOptionsMessage={() => isLoading ? loadingMessage : "Tidak ada opsi"}
          className="text-base"
          {...props}
        />
      </div>
    </div>
  );
};