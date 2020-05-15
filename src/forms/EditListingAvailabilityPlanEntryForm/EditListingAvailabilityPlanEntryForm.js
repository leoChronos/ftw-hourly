import React, { useState } from 'react';
import { bool, string } from 'prop-types';
import { propTypes } from '../../util/types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import {
  Form,
  FieldTextInput,    
  PrimaryButton,
  FieldSelect,
  FieldCheckbox,
} from '../../components';
import { maxLength, required, composeValidators } from '../../util/validators';

import css from './EditListingAvailabilityPlanEntryForm.css';

const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const MAX_SPOTS = Array(10).fill();

const printHourStrings = h => (h > 9 ? `${h}:00` : `0${h}:00`);

const HOURS = Array(24).fill();
const ALL_START_HOURS = [...HOURS].map((v, i) => printHourStrings(i));

const createAvilableStartHours = () => {
    return [...ALL_START_HOURS].map(v => ({ "value": v, "available": true}));
} 

const filterStartHours = (values, currentEntry) => {
    const availableStartHours = createAvilableStartHours();
    
    if(!currentEntry) return availableStartHours;

    const entries = values.filter(v => v.dayOfWeek === currentEntry.dayOfWeek && v.startTime !== currentEntry.startTime);
    const hours = entries.map(x => x.startTime);    
  
    // There is no entries for this day return full available hours
    if (entries.lenght === 0) {
      return availableStartHours;
    }  
    
    availableStartHours.forEach(element => {
        element.available = !hours.includes(element.value);
    });

    return availableStartHours;
};

const setEntryKey = (entry) => {
    entry.extendedData.key = `${entry.dayOfWeek}_${entry.startTime}`;
}

const setEndTime = (entry) => {
    const aStart = Number.parseInt(entry.startTime.split(':')[0]);
    entry.endTime = printHourStrings(aStart + 1);
}

const EditListingAvailabilityPlanEntryFormComponent = props => {    
    const { onSubmit, ...restOfprops } = props;
    // Hooks
    const [isTermEndCondAccepted, setTermEndCondAccepted] = useState(false);  

    const submit = (onSubmit, availabilityPlan, initialValues) => values => {    
        setEntryKey(values);
        setEndTime(values);
    
        // Remove initial values
        if(initialValues && initialValues.dayOfWeek !== '') {
            availabilityPlan.entries = availabilityPlan.entries.filter(x => x.dayOfWeek !== initialValues.dayOfWeek && x.startTime !== initialValues.startTime);        
        }    
    
        // add new/updated values
        const {seats, ...entry} = values;
        entry.seats = Number.parseInt(seats);
        availabilityPlan.entries.push(entry);
        
        onSubmit(availabilityPlan);
    };

    return (
      <FinalForm
        {...restOfprops}
        onSubmit={submit(onSubmit, props.availabilityPlan, props.initialValues)}
        render={formRenderProps => {
            const {                
                rootClassName,
                className,
                form,
                formId,
                handleSubmit,
                intl,
                invalid,
                pristine,   
                disabled,
                updated,
                ready,
                updateInProgress,
                fetchErrors,
                availabilityPlan,
                values,
                submitSucceeded
            } = formRenderProps;        
            
            const insertFormId = 'InsertAvailabilityPlanEntryForm'

            const idPrefix = `${formId}` || insertFormId;

            if(submitSucceeded && !updateInProgress && idPrefix === insertFormId && (!fetchErrors || !fetchErrors.updateListingError)){
                setTermEndCondAccepted(false);
                form.reset();
            }

            const classes = classNames(rootClassName || css.root, className);

            const handleTermAndCondChange = () => {                
                setTermEndCondAccepted(!isTermEndCondAccepted);
            }

            const getDiscountList = () => {
                const array = [];
                for (let index = 0; (index + 1) * 5 < 100; index++) {
                    array.push((index + 1) * 5);
                }  
                
                return array;
            };
            
            const getWeekDays = () => {    
                return WEEKDAYS.map(w => ({ "key": w, "value": intl.formatMessage({ id: `EditListingAvailabilityPanel.dayOfWeek.${w}`})}));
            }

            const { updateListingError } = fetchErrors || {};

            const submitReady = (updated && pristine) || ready;
            const submitInProgress = updateInProgress;            
            const submitDisabled = invalid || disabled || submitInProgress || !isTermEndCondAccepted;

            return (
                <Form id={idPrefix} className={classes} onSubmit={handleSubmit}>
                    <h2 className={css.heading}>Create/Edit Spot</h2>

                    <FieldSelect             
                        id={`${idPrefix}.extendedData.discount`}
                        name="extendedData.discount" 
                        className={css.selectField} 
                        label="Discount Amount"
                        validate={required("Required")}
                        >
                        <option disabled value="">
                            Choose your discounted amount
                        </option>
                        {getDiscountList().map(d => (
                            <option key={d} value={d}>
                                {`${d}%`}
                            </option>
                        ))}
                    </FieldSelect>

                    <FieldTextInput
                        id={`${idPrefix}.extendedData.spotDetails`}
                        name="extendedData.spotDetails"
                        className={css.textArea}
                        type="textarea"
                        label="Spot Details"
                        placeholder="What are the offer details your customer needs to know?"
                        validate={composeValidators(required("Required"), maxLength("Max", 60))}                    
                    />

                    <FieldSelect             
                        id={`${idPrefix}.dayOfWeek`}
                        name="dayOfWeek" 
                        className={css.selectField} 
                        label="Day"
                        validate={required("Required")}
                        >
                        <option disabled value="">
                            Choose the day this spot will reoccur on
                        </option>
                        {getWeekDays().map(wd => (                            
                            <option key={wd.key} value={wd.key}>
                                {wd.value}
                            </option>
                        ))}
                    </FieldSelect>                    

                    <FieldSelect
                        id={`${idPrefix}.startTime`}
                        name="startTime"
                        className={css.selectField}
                        label="Spot start time"
                        validate={required("Required")}
                        >                            
                        <option disabled value="">
                            Choose the time of the spot booking
                        </option>
                        {filterStartHours(availabilityPlan.entries, values).map(
                            s => (
                              <option value={s.value} key={s.value} disabled={!s.available}>
                                {s.value}
                              </option>
                            )
                        )}
                    </FieldSelect>

                    <FieldSelect
                        id={`${idPrefix}.seats`}
                        name="seats"
                        className={css.selectField}
                        label="Number of spots available to be claimed"
                        validate={required("Required")}
                        >
                        <option disabled value="">
                            Choose how many people can claim this spot
                        </option>
                        {MAX_SPOTS.map((v, i) => {
                            return <option value={i+1} key={i}>{i+1}</option>
                        })}                          
                    </FieldSelect>

                    <label htmlFor="termsAndConditions">
                        Please confirm
                    </label>

                    <FieldCheckbox
                        id={`${idPrefix}.termsAndConditions`}
                        name="termsAndConditions"
                        className={css.textField}
                        value=""
                        label="You have read and agree to the Good Spot terms of business"
                        useSuccessColor
                        onClick={handleTermAndCondChange}
                        >
                    </FieldCheckbox>

                    {updateListingError ? (
                        <p className={css.error}>
                            <FormattedMessage id="EditListingAvailabilityPlanForm.updateFailed" />
                        </p>
                    ) : null}

                    <PrimaryButton
                        type="submit" 
                        inProgress={submitInProgress}
                        disabled={submitDisabled}
                        ready={submitReady}                        
                        >
                        <FormattedMessage id="EditListingAvailabilityPlanForm.saveSchedule" />
                    </PrimaryButton>
                </Form>
            );
            }}
        />
    );
};

EditListingAvailabilityPlanEntryFormComponent.defaultProps = {
    rootClassName: null,
    className: null,
    submitButtonWrapperClassName: null,
    inProgress: false,
    availabilityPlan: null,
  };
  
  EditListingAvailabilityPlanEntryFormComponent.propTypes = {
    rootClassName: string,
    className: string,
    submitButtonWrapperClassName: string,
  
    inProgress: bool,
    //fetchErrors: object.isRequired,
  
    availabilityPlan: propTypes.availabilityPlan,
  
    // from injectIntl
    intl: intlShape.isRequired,
  };
  
  const EditListingAvailabilityPlanEntryForm = compose(injectIntl)(
    EditListingAvailabilityPlanEntryFormComponent
  );
  
  EditListingAvailabilityPlanEntryForm.displayName = 'EditListingAvailabilityPlanEntryForm';
  
  export default EditListingAvailabilityPlanEntryForm;
  