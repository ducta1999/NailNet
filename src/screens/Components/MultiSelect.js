import React from 'react';
import {StyleSheet} from 'react-native';

import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function MultiSelect({
  items,
  selectedItems,
  setSelectedItems,
  placeHolder = 'Choose Item...',
  single = true,
}) {
  return (
    <SectionedMultiSelect
      backgroundColor="#1a759f"
      IconRenderer={MaterialIcons}
      items={items}
      uniqueKey="id"
      subKey="children"
      expandDropDowns={true}
      selectText={placeHolder}
      showDropDowns={true}
      readOnlyHeadings={true}
      onSelectedItemsChange={value => setSelectedItems(value)}
      selectedItems={selectedItems}
      single={single}
      selectToggleIconComponent={
        <Icon name="caret-down" color="#343a40" size={20} />
      }
      searchIconComponent={
        <Icon name="search" color="#fff" size={15} style={{marginRight: 12}} />
      }
      colors={color}
      styles={multiSelectStyles}
    />
  );
}

//multiselect style
const multiSelectStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  selectToggleText: {
    color: '#343a40',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
  },
  selectToggle: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 6,
    marginVertical: 9,
    borderWidth: 1.1,
    borderColor: 'rgba(108, 117, 125, 0.5)',
  },
  button: {backgroundColor: '#168aad'},
  confirmText: {fontFamily: 'Montserrat-Bold', fontSize: 18, padding: 5},
  searchBar: {backgroundColor: '#168aad', padding: 19},
  searchTextInput: {
    color: '#fff',
    fontFamily: 'Montserrat-Italic',
    fontSize: 14,
  },
  subItem: {
    backgroundColor: '#fff',
    marginVertical: 5,
    padding: 12,
    borderBottomWidth: 0.79,
    borderColor: '#d6d6d6',
    borderRadius: 12,
  },
  item: {backgroundColor: '#fff', padding: 9},
  itemText: {
    color: '#0d1321',
    fontFamily: 'Montserrat-SemiBoldItalic',
    fontSize: 18,
  },
  subItemText: {
    color: '#03071e',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
  },
  scrollView: {
    padding: 16,
  },
});
const color = {
  searchPlaceholderTextColor: '#fff',
};
