import React, { useState } from 'react';
import { array, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';

import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import {
  getSharpHours,
  getStartHours,
  getEndHours,
  isDayMomentInsideRange,
  isInRange,
  isSameDate,
  isSameDay,
  resetToStartOfDay,
  timeOfDayFromLocalToTimeZone,
  timeOfDayFromTimeZoneToLocal,
  dateIsAfter,
  findNextBoundary,
  timestampToDate,  
  monthIdStringInTimeZone,
  getMonthStartInTimeZone,
  nextMonthFn,
  prevMonthFn,
} from '../../util/dates';
import { bookingDateRequired, maxLength, required, composeValidators } from '../../util/validators';
import {
  FieldDateInput,
  FieldCheckbox,
  FieldSelect,
  FieldTextInput,
  Form,
  IconArrowHead,
  PrimaryButton,
} from '../../components';

import css from './EditListingAvailabilityOneOfExceptionForm.css';

const TODAY = new Date();
const MAX_AVAILABILITY_EXCEPTIONS_RANGE = 365;
const MAX_SPOTS = Array(10).fill();

// Date formatting used for placeholder texts:
const dateFormattingOptions = { month: 'short', day: 'numeric', weekday: 'short' };

// React-dates returns wrapped date objects
const extractDateFromFieldDateInput = dateValue =>
  dateValue && dateValue.date ? dateValue.date : null;

const endOfAvailabilityExceptionRange = (timeZone, date) => {
  return resetToStartOfDay(date, timeZone, MAX_AVAILABILITY_EXCEPTIONS_RANGE - 1);
};

// Ensure that AvailabilityExceptions are in sensible order.
// NOTE: this sorting can only be used for non-paginated list of exceptions (page size is max 100)
const sortExceptionsByStartTime = (a, b) => {
  return a.attributes.start.getTime() - b.attributes.start.getTime();
};

// Convert exceptions list to inverted array of time-ranges that are available for new exceptions.
const getAvailableTimeRangesForExceptions = (exceptions, timeZone) => {  
  const nextBoundary = findNextBoundary(timeZone, TODAY);
  const lastBoundary = endOfAvailabilityExceptionRange(timeZone, TODAY);

  // If no exceptions, return full time range as free of exceptions.
  if (!exceptions || exceptions.length < 1) {
    return [{ start: nextBoundary, end: lastBoundary }];
  }

  const sortedExceptions = exceptions.sort(sortExceptionsByStartTime);
  const endOfLastException = sortedExceptions[sortedExceptions.length - 1].attributes.end;

  const initialRangeCollection = dateIsAfter(nextBoundary, sortedExceptions[0].attributes.start)
    ? { prevEnd: null, ranges: [] }
    : { prevEnd: nextBoundary, ranges: [] };

  const invertedExceptionList = sortedExceptions.reduce((collection, ex) => {
    if (collection.prevEnd) {
      // If previous exception end was the same moment as the current exceptions' start,
      // there's no time-range available.
      if (isSameDate(collection.prevEnd, ex.attributes.start)) {
        // Update prevEnd
        return { prevEnd: ex.attributes.end, ranges: collection.ranges };
      }

      const nextRange = { start: collection.prevEnd, end: ex.attributes.start };
      return { prevEnd: ex.attributes.end, ranges: [...collection.ranges, nextRange] };
    } else {
      return { prevEnd: ex.attributes.end, ranges: [] };
    }
  }, initialRangeCollection).ranges;

  // Return inverted exceptions list as available times for new exception.
  // In addition, if there is time between last exception's end time and last boundary,
  // add that as a available time range
  return dateIsAfter(endOfLastException, lastBoundary)
    ? invertedExceptionList
    : [...invertedExceptionList, { start: endOfLastException, end: lastBoundary }];
};

// Get available start times for new exceptions on given date.
const getAvailableStartTimes = (date, timeRangesOnSelectedDate, intl, timeZone) => {
  if (timeRangesOnSelectedDate.length === 0 || !timeRangesOnSelectedDate[0] || !date) {
    return [];
  }

  // Ensure 00:00 on correct time zone
  const startOfDate = resetToStartOfDay(date, timeZone);
  const nextDay = resetToStartOfDay(startOfDate, timeZone, 1);

  const allHours = timeRangesOnSelectedDate.reduce((availableHours, t) => {
    // time-range: start and end
    const { start, end } = t;

    // If the date is after start, use the date.
    // Otherwise use the start time.
    const startLimit = dateIsAfter(startOfDate, start) ? startOfDate : start;

    // If the end date is after "the next day", use the next date to get the hours of full day.
    // Otherwise use the end of the timeslot.
    const endLimit = dateIsAfter(end, nextDay) ? nextDay : end;

    const hours = getStartHours(intl, timeZone, startLimit, endLimit);
    return availableHours.concat(hours);
  }, []);
  return allHours;
};

// Return exception's start time, if it happens after the beginning of last day of the time-range
//
// Selected end date: today, startOfSelectedEndDay: 00:00
// Time range starts: 10:00 (today)
// => 10:00 (today)
//
// Selected end date: today, startOfSelectedEndDay: 00:00
// Time range starts: 11:00 (yesterday)
// => 00:00 (today)
const startTimeOrStartOfSelectedEndDay = (selectedStartTimeAsDate, startOfSelectedEndDay) =>
  dateIsAfter(selectedStartTimeAsDate, startOfSelectedEndDay)
    ? selectedStartTimeAsDate
    : startOfSelectedEndDay;

// Return time-range's end, if it becomes before selected end date changes (next 00:00)
//
// Selected end date: today. dayAfterSelectedEnd: 00:00 (tomorrow)
// Time range ends: 12:00 (today)
// => 12:00 (today)
//
// Selected end date: today. dayAfterSelectedEnd: 00:00 (tomorrow)
// Time range ends: 14:00 (tomorrow)
// => 00:00 (tomorrow)
const timeRangeEndOrNextMidnight = (timeRangeEnd, dayAfterSelectedEnd) =>
  dateIsAfter(dayAfterSelectedEnd, timeRangeEnd) ? timeRangeEnd : dayAfterSelectedEnd;

// Get available end times for new exceptions on selected time range.
const getAvailableEndTimes = (
  selectedStartTime,
  selectedEndDate,
  selectedTimeRange,
  intl,
  timeZone
) => {
  if (!selectedTimeRange || !selectedEndDate || !selectedStartTime) {
    return [];
  }

  const timeRangeEnd = selectedTimeRange.end;
  const selectedStartTimeAsDate = timestampToDate(selectedStartTime);
  const isSingleDayRange = isSameDay(selectedStartTimeAsDate, selectedEndDate, timeZone);

  // Midnight of selectedEndDate
  const startOfSelectedEndDate = resetToStartOfDay(selectedEndDate, timeZone);
  // Next midnight after selectedEndDate
  const dayAfterSelectedEndDate = resetToStartOfDay(selectedEndDate, timeZone, 1);

  const limitStart = startTimeOrStartOfSelectedEndDay(
    selectedStartTimeAsDate,
    startOfSelectedEndDate
  );
  const limitEnd = timeRangeEndOrNextMidnight(timeRangeEnd, dayAfterSelectedEndDate);

  return isSingleDayRange
    ? getEndHours(intl, timeZone, limitStart, limitEnd)
    : getSharpHours(intl, timeZone, limitStart, limitEnd);
};

// Get time-ranges on given date.
const getTimeRanges = (timeRanges, date, timeZone) => {
  return timeRanges && timeRanges[0] && date
    ? timeRanges.filter(t => isInRange(date, t.start, t.end, 'day', timeZone))
    : [];
};

// Use start date to calculate the first possible start time or times, end date and end time or times.
// If the selected value is passed to function it will be used instead of calculated value.
const getAllTimeValues = (
  intl,
  timeZone,
  timeRanges,
  selectedStartDate,
  selectedStartTime,
  selectedEndDate
) => {
  const startTimes = selectedStartTime
    ? []
    : getAvailableStartTimes(
        selectedStartDate,
        getTimeRanges(timeRanges, selectedStartDate, timeZone),
        intl,
        timeZone
      );

  const startTime = selectedStartTime
    ? selectedStartTime
    : startTimes.length > 0 && startTimes[0] && startTimes[0].timestamp
    ? startTimes[0].timestamp
    : null;

  const startTimeAsDate = startTime ? timestampToDate(startTime) : null;

  // Note: We need to remove 1ms from the calculated endDate so that if the end
  // date would be the next day at 00:00 the day in the form is still correct.
  // Because we are only using the date and not the exact time we can remove the
  // 1ms.
  const endDate = selectedEndDate
    ? selectedEndDate
    : startTimeAsDate
    ? new Date(findNextBoundary(timeZone, startTimeAsDate).getTime() - 1)
    : null;

  const selectedTimeRange = timeRanges.find(t => isInRange(startTimeAsDate, t.start, t.end));

  const endTimes = getAvailableEndTimes(startTime, endDate, selectedTimeRange, intl, timeZone);
  const endTime =
    endTimes.length > 0 && endTimes[0] && endTimes[0].timestamp ? endTimes[0].timestamp : null;

  return { startTime, endDate, endTime, selectedTimeRange };
};

// Update current month and call callback function.
const onMonthClick = (currentMonth, setCurrentMonth, timeZone, onMonthChanged) => monthFn => {
  const updatedMonth = monthFn(currentMonth, timeZone);
  setCurrentMonth(updatedMonth);

  if (onMonthChanged) {
    const monthId = monthIdStringInTimeZone(updatedMonth, timeZone);
    onMonthChanged(monthId);
  }
};

// Format form's value for the react-dates input: convert timeOfDay to the local time
const formatFieldDateInput = timeZone => v =>
  v && v.date ? { date: timeOfDayFromTimeZoneToLocal(v.date, timeZone) } : { date: v };

// Parse react-dates input's value: convert timeOfDay to the given time zone
const parseFieldDateInput = timeZone => v =>
  v && v.date ? { date: timeOfDayFromLocalToTimeZone(v.date, timeZone) } : v;

// React Dates calendar needs isDayBlocked function as props
// We check if the day belongs to one of the available time ranges
const isDayBlocked = (availableTimeRanges, timeZone) =>
  availableTimeRanges
    ? day =>
        !availableTimeRanges.find(timeRange =>
          isDayMomentInsideRange(day, timeRange.start, timeRange.end, timeZone)
        )
    : () => false;

// Helper function, which changes form's state when exceptionStartDate input has been changed
const onExceptionStartDateChange = (value, timeRanges, props) => {
  const { timeZone, intl, form } = props;

  if (!value || !value.date) {
    form.batch(() => {
      form.change('exceptionStartTime', null);
      form.change('exceptionEndDate', { date: null });
      form.change('exceptionEndTime', null);
    });
    return;
  }

  // This callback function (onExceptionStartDateChange) is called from react-dates component.
  // It gets raw value as a param - browser's local time instead of time in listing's timezone.
  const startDate = timeOfDayFromLocalToTimeZone(value.date, timeZone);
  const timeRangesOnSelectedDate = getTimeRanges(timeRanges, startDate, timeZone);

  const { startTime, endDate, endTime } = getAllTimeValues(
    intl,
    timeZone,
    timeRangesOnSelectedDate,
    startDate
  );

  form.batch(() => {
    form.change('exceptionStartTime', startTime);
    form.change('exceptionEndDate', { date: endDate });
    form.change('exceptionEndTime', endTime);
  });
};

// Helper function, which changes form's state when exceptionStartTime select has been changed
const onExceptionStartTimeChange = (value, timeRangesOnSelectedDate, props) => {
  const { timeZone, intl, form, values } = props;
  const startDate = values.exceptionStartDate.date;

  const { endDate, endTime } = getAllTimeValues(
    intl,
    timeZone,
    timeRangesOnSelectedDate,
    startDate,
    value
  );

  form.batch(() => {
    form.change('exceptionEndDate', { date: endDate });
    form.change('exceptionEndTime', endTime);
  });
};

/////////////////
// Next & Prev //
/////////////////

// Components for the react-dates calendar
const Next = props => {
  const { currentMonth, timeZone } = props;
  const nextMonthDate = nextMonthFn(currentMonth, timeZone);

  return dateIsAfter(nextMonthDate, endOfAvailabilityExceptionRange(timeZone, TODAY)) ? null : (
    <IconArrowHead direction="right" size="small" />
  );
};
const Prev = props => {
  const { currentMonth, timeZone } = props;
  const prevMonthDate = prevMonthFn(currentMonth, timeZone);
  const currentMonthDate = getMonthStartInTimeZone(TODAY, timeZone);

  return dateIsAfter(prevMonthDate, currentMonthDate) ? (
    <IconArrowHead direction="left" size="small" />
  ) : null;
};

//////////////////////////////////////////
// EditListingAvailabilityOneOfExceptionForm //
//////////////////////////////////////////
const EditListingAvailabilityOneOfExceptionForm = props => {
  // Hooks
  const [isTermEndCondAccepted, setTermEndCondAccepted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(getMonthStartInTimeZone(TODAY, props.timeZone));

  const isInsert = props.initialValues === undefined || props.initialValues === {};

  return (
    <FinalForm
      {...props}
      render={formRenderProps => {
        const {
          className,
          rootClassName,
          form,
          formId,
          disabled,
          handleSubmit,
          intl,
          invalid,
          onMonthChanged,
          pristine,
          availabilityExceptions,
          timeZone,
          updateInProgress,
          fetchErrors,
          values,
          submitSucceeded,          
          errorLocation,
          updated,
          ready
        } = formRenderProps;

        const insertFormId = 'InsertListingAvailabilityOneOfExceptionForm'

        const idPrefix = `${formId}` || insertFormId;

        if(submitSucceeded && !updateInProgress && isInsert && (!fetchErrors || !fetchErrors.addExceptionError)){
          setTermEndCondAccepted(false);
          form.reset();
        }

        const {          
          exceptionStartDate,          
        } = values;

        const exceptionStartDay = extractDateFromFieldDateInput(exceptionStartDate);        

        const startTimeDisabled = !exceptionStartDate;        

        // Get all the available time-ranges for creating new AvailabilityExceptions
        const availableTimeRanges = getAvailableTimeRangesForExceptions(
          availabilityExceptions,
          timeZone
        );

        const timeRangesOnSelectedDate = getTimeRanges(
          availableTimeRanges,
          exceptionStartDay,
          timeZone
        );

        const availableStartTimes = getAvailableStartTimes(
          exceptionStartDay,
          timeRangesOnSelectedDate,
          intl,
          timeZone
        );        

        // Returns a function that changes the current month
        // Currently, used for hiding next&prev month arrow icons.
        const handleMonthClick = onMonthClick(
          currentMonth,
          setCurrentMonth,
          timeZone,
          onMonthChanged
        );

        const { addExceptionError } = fetchErrors || {};

        const insertError = isInsert && errorLocation && errorLocation.isInsertOneOffError && addExceptionError;

        const editError = isInsert && errorLocation && errorLocation.isEditOneOffError && addExceptionError;

        const submitReady = (updated && pristine) || ready;
        const submitInProgress = updateInProgress;            
        const submitDisabled = invalid || disabled || submitInProgress || !isTermEndCondAccepted;

        const formTitle = idPrefix === insertFormId 
          ? intl.formatMessage({ id: 'EditListingAvailabilityOneOfExceptionForm.create' })
          : intl.formatMessage({ id: 'EditListingAvailabilityOneOfExceptionForm.edit' });

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

        const termsLink = (
          <span
            key={`${idPrefix}.termsLink`}
            className={css.termsLink}
            //onClick={onOpenTermsOfService}
            role="button"
            tabIndex="0"
            //onKeyUp={handleTermsKeyUp}
          >
            <FormattedMessage id="EditListingAvailabilityOneOfExceptionForm.agreeTermsMessageTermsLink" />
          </span>
        );

        return (
          <Form
            className={classes}
            onSubmit={e => {
              handleSubmit(e).then(() => {
                form.reset();
              });
            }}
          >
            <h2 className={css.heading}>
              {formTitle}
            </h2>

            
            <FieldSelect             
                id={`${idPrefix}.extendedData.discount`}
                name="extendedData.discount" 
                className={css.selectField} 
                label={intl.formatMessage({ id: 'EditListingAvailabilityOneOfExceptionForm.discountLabel' })}
                validate={required("Required")}
                >
                <option disabled value="">
                    {intl.formatMessage({ id: 'EditListingAvailabilityOneOfExceptionForm.discountPlaceHolder' })}
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
                label={intl.formatMessage({ id: 'EditListingAvailabilityOneOfExceptionForm.detailsLabel' })}
                placeholder={intl.formatMessage({ id: 'EditListingAvailabilityOneOfExceptionForm.detailsPlaceHolder' })}
                validate={composeValidators(required("Required"), maxLength("Max", 60))}                    
            />

            
            <FieldDateInput
              className={css.fieldDateInput}
              name="exceptionStartDate"
              id={`${idPrefix}.exceptionStartDate`}
              label={intl.formatMessage({
                id: 'EditListingAvailabilityOneOfExceptionForm.dateLabel',
              })}
              placeholderText={intl.formatDate(TODAY, dateFormattingOptions)}
              format={formatFieldDateInput(timeZone)}
              parse={parseFieldDateInput(timeZone)}
              isDayBlocked={isDayBlocked(availableTimeRanges, timeZone)}
              onChange={value =>
                onExceptionStartDateChange(value, availableTimeRanges, formRenderProps)
              }
              onPrevMonthClick={() => handleMonthClick(prevMonthFn)}
              onNextMonthClick={() => handleMonthClick(nextMonthFn)}
              navNext={<Next currentMonth={currentMonth} timeZone={timeZone} />}
              navPrev={<Prev currentMonth={currentMonth} timeZone={timeZone} />}
              useMobileMargins={false}
              showErrorMessage={false}
              validate={bookingDateRequired('Required')}
            />
         
            <FieldSelect
              name="exceptionStartTime"
              id={`${idPrefix}.exceptionStartTime`}
              label={intl.formatMessage({
                id: 'EditListingAvailabilityOneOfExceptionForm.startTimeLabel',
              })}
              className={css.selectField}
              selectClassName={exceptionStartDate ? css.select : css.selectDisabled}
              disabled={startTimeDisabled}
              onChange={value =>
                onExceptionStartTimeChange(value, timeRangesOnSelectedDate, formRenderProps)
              }
            >
              <option disabled value="">
                  {intl.formatMessage({ id: 'EditListingAvailabilityOneOfExceptionForm.startTimePlaceHolder' })}
              </option>
              {exceptionStartDay ? (
                availableStartTimes.map(p => (
                  <option key={p.timestamp} value={p.timestamp}>
                    {p.formatedDate.time}
                  </option>
                ))
              ) : (
                null
              )}
            </FieldSelect>
         
            <FieldSelect
                id={`${idPrefix}.seats`}
                name="seats"
                className={css.selectField}
                label={intl.formatMessage({ id: 'EditListingAvailabilityOneOfExceptionForm.numberSpotsLabel' })}
                validate={required("Required")}
                >
                <option disabled value="">
                    {intl.formatMessage({ id: 'EditListingAvailabilityOneOfExceptionForm.numberSpotsPlaceHolder' })}
                </option>
                {MAX_SPOTS.map((v, i) => {
                    return <option value={i+1} key={i}>{i+1}</option>
                })}                          
            </FieldSelect>
          
            <label htmlFor="termsAndConditions">
                {intl.formatMessage({ id: 'EditListingAvailabilityOneOfExceptionForm.agreeTermsLabel' })}
            </label>

            {
                isInsert ? (
                    <FieldCheckbox
                        id={`${idPrefix}.termsAndConditions.insert`}
                        name="termsAndConditions"
                        className={css.textField}
                        value=""
                        label={intl.formatMessage({ id: 'EditListingAvailabilityOneOfExceptionForm.agreeTermsMessage'}, { termsLink : termsLink})}
                        useSuccessColor
                        onClick={handleTermAndCondChange}
                    >
                    </FieldCheckbox>        
                ) :
                (
                    <FieldCheckbox
                        id={`${idPrefix}.termsAndConditions.edit.${values.extendedData.key}`}
                        name="termsAndConditions"
                        className={css.textField}
                        value=""
                        label={intl.formatMessage({ id: 'EditListingAvailabilityOneOfExceptionForm.agreeTermsMessage'}, { termsLink : termsLink})}
                        useSuccessColor
                        onClick={handleTermAndCondChange}
                    >
                    </FieldCheckbox>        
                )
            }

            { insertError || editError ? (
                <p className={css.error}>
                    <FormattedMessage id="EditListingAvailabilityOneOfExceptionForm.updateFailed" />
                </p>
            ) : null}
            <PrimaryButton
                type="submit" 
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={submitReady}
                >
                <FormattedMessage id="EditListingAvailabilityOneOfExceptionForm.saveSpot" />
            </PrimaryButton>
          </Form>
        );
      }}
    />
  );
};

EditListingAvailabilityOneOfExceptionForm.defaultProps = {
  className: null,
  rootClassName: null,
  fetchErrors: null,
  formId: null,
  availabilityExceptions: [],
};

EditListingAvailabilityOneOfExceptionForm.propTypes = {
  className: string,
  rootClassName: string,
  formId: string,
  availabilityExceptions: array,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  timeZone: string.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingAvailabilityOneOfExceptionForm);
