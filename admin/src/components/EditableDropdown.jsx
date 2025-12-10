import React, { useState, useRef, useEffect } from "react";

const EditableDropdown = ({ label, items, selectedId, selectedName, onSelect, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer p-3 border rounded-xl bg-white flex justify-between items-center"
      >
        <span className={`text-gray-700 ${selectedName || search ? "font-medium" : "text-gray-400"}`}>
          {selectedName || search || placeholder || label}
        </span>
        <svg
          className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && (
        <div className="absolute z-50 w-full bg-white border rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto">
          <input
            type="text"
            placeholder={`Search ${label}`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full p-2 border-b focus:outline-none"
          />
          {filteredItems.map(item => (
            <div
              key={item.id || item._id}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                onSelect(item.id || item._id, item.name);
                setOpen(false);
                setSearch("");
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditableDropdown;
