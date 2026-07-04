function SearchBar({ value, onChange }) {
  return (
    <label className="admin-field admin-field--wide">
      <span>Search Student Name</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Type a student name"
      />
    </label>
  );
}

export default SearchBar;
