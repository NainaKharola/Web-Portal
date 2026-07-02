function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = "Select",
}) {
  return (
    <label className={`field ${error ? "field--error" : ""}`}>
      <select
        className="field__control"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="field__label">{label}</span>
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}

export default SelectInput;
