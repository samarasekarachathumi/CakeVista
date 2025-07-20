import React, { useState, useEffect } from 'react';

const Customization = ({ onSave, initialOptions }) => {
  // Default options if none provided
  const defaultOptions = {
    color: { enabled: false, options: ['Chocolate', 'Vanilla', 'Red Velvet', 'Pink', 'Blue'] },
    size: { enabled: false, options: ['500g', '1kg', '1.5kg', '2kg'] },
    flavor: { enabled: false, options: ['Chocolate', 'Vanilla', 'Strawberry', 'Butterscotch', 'Mango'] },
    text: { enabled: false, maxLength: 50, allowCustom: true },
    shape: { enabled: false, options: ['Heart', 'Round', 'Square', 'Rectangle', 'Custom'] },
    cupcakes: { enabled: false, options: ['None', '6 pieces', '12 pieces', '24 pieces'] },
    birthdayTopper: { enabled: false, options: ['Yes', 'No'] }
  };

  // Set state with either initial options or defaults
  const [options, setOptions] = useState(initialOptions || defaultOptions);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editingOption, setEditingOption] = useState(null);
  const [newOption, setNewOption] = useState('');

  // Handle toggle changes for each option
  const handleToggle = (optionKey) => {
    setOptions({
      ...options,
      [optionKey]: {
        ...options[optionKey],
        enabled: !options[optionKey].enabled
      }
    });
  };

  // Add a new option to a customization type
  const handleAddOption = (optionKey) => {
    if (!newOption.trim()) return;
    
    setOptions({
      ...options,
      [optionKey]: {
        ...options[optionKey],
        options: [...options[optionKey].options, newOption.trim()]
      }
    });
    
    setNewOption('');
    setEditingOption(null);
  };

  // Remove an option from a customization type
  const handleRemoveOption = (optionKey, index) => {
    const updatedOptions = [...options[optionKey].options];
    updatedOptions.splice(index, 1);
    
    setOptions({
      ...options,
      [optionKey]: {
        ...options[optionKey],
        options: updatedOptions
      }
    });
  };

  // Toggle custom text option
  const handleToggleCustomText = () => {
    setOptions({
      ...options,
      text: {
        ...options.text,
        allowCustom: !options.text.allowCustom
      }
    });
  };

  // Update text max length
  const handleTextLengthChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setOptions({
      ...options,
      text: {
        ...options.text,
        maxLength: value
      }
    });
  };

  // Save options to database/backend
  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Call the passed onSave function with current options
      await onSave(options);
      setSaveMessage('Options saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving options. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Display available options for a given customization type
  const renderOptionsEditor = (optionKey) => {
    if (!options[optionKey].options) return null;
    
    return (
      <div className="mt-2 ml-6 p-3 bg-gray-50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Available Options:</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {options[optionKey].options.map((opt, index) => (
            <div key={index} className="flex items-center bg-white px-2 py-1 rounded border">
              <span className="text-sm">{opt}</span>
              <button 
                onClick={() => handleRemoveOption(optionKey, index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        {editingOption === optionKey ? (
          <div className="flex items-center">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="flex-1 p-2 border rounded-l text-sm"
              placeholder="Add new option..."
            />
            <button
              onClick={() => handleAddOption(optionKey)}
              className="bg-[#E6A4B4] text-white px-3 py-2 rounded-r text-sm hover:bg-opacity-90"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingOption(optionKey)}
            className="text-sm text-[#E6A4B4] hover:underline"
          >
            + Add Option
          </button>
        )}
      </div>
    );
  };

  // Render text options if text customization is enabled
  const renderTextOptions = () => {
    return (
      <div className="mt-2 ml-6 p-3 bg-gray-50 rounded-md">
        <div className="flex items-center mb-3">
          <label className="text-sm font-medium mr-2">Maximum Characters:</label>
          <input
            type="number"
            min="1"
            max="200"
            value={options.text.maxLength}
            onChange={handleTextLengthChange}
            className="w-20 p-1 border rounded text-sm"
          />
        </div>
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={options.text.allowCustom}
              onChange={handleToggleCustomText}
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E6A4B4]"></div>
            <span className="ml-2 text-sm font-medium">
              Allow customers to type custom text
            </span>
          </label>
        </div>
      </div>
    );
  };

  // Custom rendering for simple yes/no options
  const renderSimpleOptions = (optionKey) => {
    return (
      <div className="mt-2 ml-6 p-3 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600 mb-2">
          When enabled, customers will be asked if they want this option.
        </p>
      </div>
    );
  };

  // Determine which renderer to use for each option type
  const getOptionRenderer = (optionKey) => {
    if (optionKey === 'text') return renderTextOptions();
    if (optionKey === 'birthdayTopper') return renderSimpleOptions(optionKey);
    return renderOptionsEditor(optionKey);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Cake Customization Settings</h2>
      <p className="mb-4 text-gray-600">
        Configure which customization options you want to offer your customers.
      </p>

      <div className="space-y-4">
        {Object.keys(options).map((optionKey) => (
          <div key={optionKey} className="border rounded p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium capitalize">{optionKey === 'birthdayTopper' ? 'Birthday Topper' : optionKey}</h3>
                <p className="text-sm text-gray-500">
                  {optionKey === 'cupcakes' 
                    ? 'Allow customers to add cupcakes to their order' 
                    : optionKey === 'birthdayTopper'
                      ? 'Allow customers to add a birthday topper to their cake'
                      : `Allow customers to customize cake ${optionKey}`}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={options[optionKey].enabled}
                  onChange={() => handleToggle(optionKey)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E6A4B4]"></div>
                <span className="ml-2 text-sm font-medium">
                  {options[optionKey].enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
            
            {options[optionKey].enabled && getOptionRenderer(optionKey)}
          </div>
        ))}
      </div>

      {saveMessage && (
        <div className={`mt-4 p-2 rounded ${saveMessage.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {saveMessage}
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Tip: Offering 3-5 customization options provides the best customer experience
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-[#E6A4B4] text-white rounded hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default Customization;