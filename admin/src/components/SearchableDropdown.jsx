import React, { useState, useRef, useEffect } from 'react';

const SearchableDropdown = ({ label, items = [], selectedId, selectedName, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(selectedName || '');
  const dropdownRef = useRef(null);

  // Safe filter
  const filteredItems = items.filter(item =>
    item?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id, name) => {
    onSelect(id, name);
    setSearch(name);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col w-full relative" ref={dropdownRef}>
      <label className="mb-1 font-semibold text-gray-700">{label}</label>
      <input
        type="text"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
        onClick={() => setIsOpen(true)}
        placeholder={`Search or select ${label.toLowerCase()}`}
        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      
      {/* Dropdown results below the input */}
      {isOpen && (
        <div className="relative">
          <ul className="absolute z-50 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-lg mt-1 shadow-md">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <li
                  key={item._id}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-100 transition"
                  onClick={() => handleSelect(item._id, item.name)}
                >
                  {item.name || "Unnamed"}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
