function TextInput({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder = " ",
  type = "text",
  as = "input",
  disabled = false,
}) {
  const InputTag = as;

  return (
    <label className={`field ${error ? "field--error" : ""}`}>
      <InputTag
        className="field__control"
        type={as === "input" ? type : undefined}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={as === "textarea" ? 4 : undefined}
      />
      <span className="field__label">{label}</span>
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}

export default TextInput;
