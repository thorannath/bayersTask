import './Inputs.css';
import React, { useRef } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import ReactSelect from 'react-select';

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid grey',
        color: state.selectProps.menuColor,
        width: '50%',
    }),
    option: (provided, state) => ({
        ...provided,
        padding: 8,
        fontSize: 'small',
    }),
    control: (control) => ({
        ...control,
        fontSize: 'small'
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        return { ...provided, opacity, transition };
    },
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: '#ffae42',
            color: 'whitesmoke',
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.color,
        ':hover': {
            backgroundColor: data.color,
            color: 'white',
        },
    }),
}

const MultipleSelect = (props) => {

    // isOptionSelected sees previous props.value after onChange
    const valueRef = useRef(props.value);
    valueRef.current = props.value ||[];

    const selectAllOption = {
        value: "<SELECT_ALL>",
        label: `All ${props.name}`
    };

    const moreOption = (count) => ({
        value: "<MORE>",
        label: `And ${count} more`
    })

    const isSelectAllSelected = () =>{
        return valueRef.current.length === props.options.length;
    }

    const isOptionSelected = option =>
        valueRef.current.some(({ value }) => value === option.value) ||
        isSelectAllSelected();

    const getOptions = () => [selectAllOption, ...props.options];

    const getValue = () =>{
        if(isSelectAllSelected()){
            return [selectAllOption]; 
        }

        if(props.value && props.value.length>5){
            return [ ...props.value.slice(0,5), moreOption(props.value.length-5)];
        }
        return props.value || ''
    }

    const onChange = (newValue, actionMeta) => {
        const { action, option, removedValue } = actionMeta;

        if (action === "select-option" && option.value === selectAllOption.value) {
            props.onChange(props.options, actionMeta);
        } else if (
            (action === "deselect-option" &&
                option.value === selectAllOption.value) ||
            (action === "remove-value" &&
                removedValue.value === selectAllOption.value)
        ) {
            props.onChange([], actionMeta);
        } else if (
            actionMeta.action === "deselect-option" &&
            isSelectAllSelected()
        ) {
            props.onChange(
                props.options.filter(({ value }) => value !== option.value),
                actionMeta
            );
        } else {
            props.onChange(newValue || [], actionMeta);
        }
    };

    return (
        <FormGroup className="formGroup">
            <FormLabel className="formLabel">{props.label}</FormLabel>
            <ReactSelect
                isOptionSelected={isOptionSelected}
                options={getOptions()}
                value={getValue()}
                onChange={onChange}
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                isMulti
                styles={customStyles}
            />
        </FormGroup>
    )
}

export default React.memo(MultipleSelect)
