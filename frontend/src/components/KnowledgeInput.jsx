import React, { useEffect, useRef } from 'react';
import Select from 'react-select';

const KnowledgeInput = ({ label, options, selectedOptions, onSelect, onFocus, onBlur }) => {
  const selectRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && selectRef.current?.state.isFocused) {
        switch (event.key) {
          case 'a':
            event.preventDefault();
            handleSelectAll();
            break;
          case 'r':
            event.preventDefault();
            handleRemoveSelected();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedOptions, options]);

  const handleSelectAll = () => {
    const allOptions = options.map(option => ({ value: option, label: option }));
    onSelect(allOptions);
  };

  const handleRemoveSelected = () => {
    onSelect([]);
  };

  const handleChange = (selectedOptions) => {
    onSelect(selectedOptions || []);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Select
        ref={selectRef}
        isMulti
        options={options.map(option => ({ value: option, label: option }))}
        value={selectedOptions}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="mt-1"
      />
    </div>
  );
};

export default KnowledgeInput;
