import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet } from 'react-native';

const CustomSelect = ({ options, onValueChange, selectedValue, placeholder }) => {
  return (
    <RNPickerSelect
      onValueChange={onValueChange}
      items={options}
      style={pickerSelectStyles}
      value={selectedValue}
      placeholder={placeholder || { label: 'Select an option...', value: null }}
    />
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  inputAndroid: {
    width: '40%',
    borderColor: 'gray',
    color: 'black',
    marginLeft: 15,
    marginTop: 0,
    backgroundColor: 'white',
    zIndex: 2,
  },
  viewContainer: {
    display: 'flex',
    alignItems: 'flex-start',
  },
});

export default CustomSelect;