import React, { useState } from 'react';
import { arrayOf, bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { getDefaultTimeZoneOnBrowser, timestampToDate } from '../../util/dates';
import { LISTING_STATE_DRAFT, DATE_TYPE_DATETIME, propTypes } from '../../util/types';
import {
  Button,
  IconClose,  
  IconAdd,
  IconSpinner,
  InlineTextButton,
  ListingLink,
  Modal,
  TimeRange,
} from '../../components';
import { EditListingAvailabilityPlanEntryForm, EditListingAvailabilityExceptionForm } from '../../forms';

import css from './EditListingAvailabilityPanel.css';

const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// We want to sort exceptions on the client-side, maximum pagination page size is 100,
// so we need to restrict the amount of exceptions to that.
const MAX_EXCEPTIONS_COUNT = 100;

const defaultTimeZone = () =>
  typeof window !== 'undefined' ? getDefaultTimeZoneOnBrowser() : 'Etc/UTC';

///////////
// Entry //
///////////  

const Entry = props => {
  const { entry, initialValues, dayOfWeek, onManageDisableScrolling, onSubmit, updateInProgress, fetchErrors } = props;
  // Hooks
  const [isEditEntryModalOpen, setIsEditEntryModalOpen] = useState(false);

  return (
    <div className={css.weekDay}>
      <div className={css.dayOfWeek}>
        <FormattedMessage id={`EditListingAvailabilityPanel.dayOfWeek.${dayOfWeek}`} />
      </div>
      <div className={css.entries} >
        <span className={css.entry}>
          {`${entry.startTime}, ${entry.extendedData.discount}% discount`}
        </span>
        <span className={css.entry}>
          {`${entry.seats} spots`}
        </span>
      </div>
      <div className={css.entryEditButton}>
        <InlineTextButton
          className={css.editPlanButton}
          onClick={() => setIsEditEntryModalOpen(true)}
          >          
          <FormattedMessage id="EditListingAvailabilityPanel.edit" />
        </InlineTextButton>
        <InlineTextButton
          className={css.editPlanButton}
          onClick={() => alert('Remove')}
          >          
          <FormattedMessage id="EditListingAvailabilityPanel.remove" />
        </InlineTextButton>
      </div>
      {onManageDisableScrolling ? (
        <Modal
          id="EditAvailabilityPlanEntry"
          isOpen={isEditEntryModalOpen}
          onClose={() => setIsEditEntryModalOpen(false)}
          onManageDisableScrolling={onManageDisableScrolling}
          containerClassName={css.modalContainer}
          usePortal
        >
          <EditListingAvailabilityPlanEntryForm
            formId="EditAvailabilityPlanEntryForm"            
            initialValues={entry}            
            availabilityPlan={initialValues}
            onSubmit={onSubmit}
            updateInProgress={updateInProgress}
            fetchErrors={fetchErrors}            
          />
        </Modal>
  ) : null}
    </div>
  );
};

/////////////
// Weekday //
/////////////
const findEntry = (availabilityPlan, dayOfWeek) =>
  availabilityPlan.entries.find(d => d.dayOfWeek === dayOfWeek);

const getEntries = (availabilityPlan, dayOfWeek) =>
  availabilityPlan.entries.filter(d => d.dayOfWeek === dayOfWeek);

const Weekday = props => {
  const { initialValues, dayOfWeek, onManageDisableScrolling, onSubmit, updateInProgress, fetchErrors } = props;
  const hasEntry = findEntry(initialValues, dayOfWeek);  

  if (!initialValues && !hasEntry)
    return (null);  

  return (
    getEntries(initialValues, dayOfWeek).map(e => {    
      return (
        <Entry
          key={`${e.dayOfWeek}${e.startTime}`}          
          initialValues={initialValues}
          dayOfWeek={dayOfWeek}
          entry={e}
          onManageDisableScrolling={onManageDisableScrolling}
          updateInProgress={updateInProgress}
          onSubmit={onSubmit}
          fetchErrors={fetchErrors}
        />
      );
    })              
  );
};

///////////////////////////////////////////////////
// EditListingAvailabilityExceptionPanel - utils //
///////////////////////////////////////////////////

// Create initial values
const createInitialValues = (availabilityPlan, reocurringExtendedData) => {
  const reocurringPlan = {
    type: availabilityPlan.type,
    timezone: availabilityPlan.timezone,
    entries: [...availabilityPlan.entries]
  };

  reocurringPlan.entries.forEach(element => {    
    element.extendedData = getAvailabilityPlanExtendedData(reocurringExtendedData, element);
  });

  return reocurringPlan;
};

const getAvailabilityPlanExtendedData = (reocurringExtendedData, element) => {
  return reocurringExtendedData.length > 0
    ? reocurringExtendedData.find(x => x.key === `${element.dayOfWeek}_${element.startTime}`) || {}
    : {};
}

// Create reocuring plan with extended data
const createReocurringPlan = (values) => {
  const updatedValues = {    
    availabilityPlan: {
      entries: [],
      timezone: values.timezone,
      type: values.type
    },
    publicData: { reocurringExtendedData: [] }
  };

  values.entries.forEach(element => {
    updatedValues.availabilityPlan.entries.push({
        dayOfWeek: element.dayOfWeek,
        startTime: element.startTime,
        endTime: element.endTime,
        seats: Number.parseInt(element.seats)
      });

      updatedValues.publicData.reocurringExtendedData.push(element.extendedData);
  });  

  return updatedValues;
};

// Ensure that the AvailabilityExceptions are in sensible order.
//
// Note: if you allow fetching more than 100 exception,
// pagination kicks in and that makes client-side sorting impossible.
const sortExceptionsByStartTime = (a, b) => {
  return a.attributes.start.getTime() - b.attributes.start.getTime();
};

//////////////////////////////////
// EditListingAvailabilityPanel //
//////////////////////////////////
const EditListingAvailabilityPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    availabilityExceptions,
    fetchExceptionsInProgress,
    onAddAvailabilityException,
    onDeleteAvailabilityException,
    disabled,
    ready,
    onSubmit,
    onManageDisableScrolling,
    onNextTab,
    submitButtonText,
    updateInProgress,
    errors,
  } = props;
  // Hooks
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [isEditExceptionsModalOpen, setIsEditExceptionsModalOpen] = useState(false);
  const [valuesFromLastSubmit, setValuesFromLastSubmit] = useState(null);  

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const isNextButtonDisabled = !currentListing.attributes.availabilityPlan;
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const defaultAvailabilityPlan = {
    type: 'availability-plan/time',
    timezone: defaultTimeZone(),
    entries: [
      // { dayOfWeek: 'mon', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'tue', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'wed', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'thu', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'fri', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'sat', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'sun', startTime: '09:00', endTime: '17:00', seats: 1 },
    ],
  };
  const availabilityPlan = currentListing.attributes.availabilityPlan || defaultAvailabilityPlan;
  const publicData = currentListing.attributes.publicData || {};
  const reocurringExtendedData = publicData.reocurringExtendedData || [];

  const initialValues = valuesFromLastSubmit
    ? valuesFromLastSubmit
    : createInitialValues(availabilityPlan, reocurringExtendedData);

  const handleSubmit = values => {
    // Final Form can wait for Promises to return.
    return onSubmit(createReocurringPlan(values))
      .then(() => {
        setValuesFromLastSubmit(values);
        setIsEditPlanModalOpen(false);
      })
      .catch(e => {
        // Don't close modal if there was an error
      });
  };

  const exceptionCount = availabilityExceptions ? availabilityExceptions.length : 0;
  const sortedAvailabilityExceptions = availabilityExceptions.sort(sortExceptionsByStartTime);

  // Save exception click handler
  const saveException = values => {
    const { availability, exceptionStartTime, exceptionEndTime } = values;

    // TODO: add proper seat handling
    const seats = availability === 'available' ? 1 : 0;

    return onAddAvailabilityException({
      listingId: listing.id,
      seats,
      start: timestampToDate(exceptionStartTime),
      end: timestampToDate(exceptionEndTime),
    })
      .then(() => {
        setIsEditExceptionsModalOpen(false);
      })
      .catch(e => {
        // Don't close modal if there was an error
      });
  }; 

  return (
    <main className={classes}>
      <h1 className={css.title}>
        {isPublished ? (
          <FormattedMessage
            id="EditListingAvailabilityPanel.title"
            values={{
              listingTitle: (
                <ListingLink listing={listing}>
                  <FormattedMessage id="EditListingAvailabilityPanel.listingTitle" />
                </ListingLink>
              ),
            }}
          />
        ) : (
          <FormattedMessage id="EditListingAvailabilityPanel.createListingTitle" />
        )}
      </h1>

      <section className={css.section}>
        <header className={css.sectionHeader}>
          <h2 className={css.sectionTitle}>
            <FormattedMessage id="EditListingAvailabilityPanel.defaultScheduleTitle" />
          </h2>
          <InlineTextButton
            className={css.editPlanButton}
            onClick={() => setIsEditPlanModalOpen(true)}
          >
            <IconAdd className={css.editPlanIcon} />{' '}
            <FormattedMessage id="EditListingAvailabilityPanel.add" />
          </InlineTextButton>          
        </header>
        <div className={css.week}>
          {WEEKDAYS.map(w => (
            <Weekday
              dayOfWeek={w}
              key={w}              
              initialValues={initialValues}
              onManageDisableScrolling={onManageDisableScrolling}
              updateInProgress={updateInProgress}
              onSubmit={handleSubmit}
              fetchErrors={errors}
            />
          ))}
        </div>
      </section>
      <section className={css.section}>
        <header className={css.sectionHeader}>
          <h2 className={css.sectionTitle}>
            {fetchExceptionsInProgress ? (
              <FormattedMessage id="EditListingAvailabilityPanel.availabilityExceptionsTitleNoCount" />
            ) : (
              <FormattedMessage
                id="EditListingAvailabilityPanel.availabilityExceptionsTitle"
                values={{ count: exceptionCount }}
              />
            )}
          </h2>
        </header>
        {fetchExceptionsInProgress ? (
          <div className={css.exceptionsLoading}>
            <IconSpinner />
          </div>
        ) : exceptionCount === 0 ? (
          <div className={css.noExceptions}>
            <FormattedMessage id="EditListingAvailabilityPanel.noExceptions" />
          </div>
        ) : (
          <div className={css.exceptions}>
            {sortedAvailabilityExceptions.map(availabilityException => {
              const { start, end, seats } = availabilityException.attributes;
              return (
                <div key={availabilityException.id.uuid} className={css.exception}>
                  <div className={css.exceptionHeader}>
                    <div className={css.exceptionAvailability}>
                      <div
                        className={classNames(css.exceptionAvailabilityDot, {
                          [css.isAvailable]: seats > 0,
                        })}
                      />
                      <div className={css.exceptionAvailabilityStatus}>
                        {seats > 0 ? (
                          <FormattedMessage id="EditListingAvailabilityPanel.exceptionAvailable" />
                        ) : (
                          <FormattedMessage id="EditListingAvailabilityPanel.exceptionNotAvailable" />
                        )}
                      </div>
                    </div>
                    <button
                      className={css.removeExceptionButton}
                      onClick={() =>
                        onDeleteAvailabilityException({ id: availabilityException.id })
                      }
                    >
                      <IconClose size="normal" className={css.removeIcon} />
                    </button>
                  </div>
                  <TimeRange
                    className={css.timeRange}
                    startDate={start}
                    endDate={end}
                    dateType={DATE_TYPE_DATETIME}
                    timeZone={availabilityPlan.timezone}
                  />
                </div>
              );
            })}
          </div>
        )}
        {exceptionCount <= MAX_EXCEPTIONS_COUNT ? (
          <InlineTextButton
            className={css.addExceptionButton}
            onClick={() => setIsEditExceptionsModalOpen(true)}
            disabled={disabled}
            ready={ready}
          >
            <FormattedMessage id="EditListingAvailabilityPanel.addException" />
          </InlineTextButton>
        ) : null}
      </section>

      {errors.showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingAvailabilityPanel.showListingFailed" />
        </p>
      ) : null}

      {!isPublished ? (
        <Button
          className={css.goToNextTabButton}
          onClick={onNextTab}
          disabled={isNextButtonDisabled}
        >
          {submitButtonText}
        </Button>
      ) : null}    
      {onManageDisableScrolling ? (
        <Modal
          id="EditAvailabilityPlanEntry"
          isOpen={isEditPlanModalOpen}
          onClose={() => setIsEditPlanModalOpen(false)}
          onManageDisableScrolling={onManageDisableScrolling}
          containerClassName={css.modalContainer}
          usePortal
        >
          <EditListingAvailabilityPlanEntryForm
            formId="InsertAvailabilityPlanEntryForm"
            availabilityPlan={initialValues}
            onSubmit={handleSubmit}
            updateInProgress={updateInProgress}
            fetchErrors={errors}            
          />
        </Modal>
      ) : null}
      {onManageDisableScrolling ? (
        <Modal
          id="EditAvailabilityExceptions"
          isOpen={isEditExceptionsModalOpen}
          onClose={() => setIsEditExceptionsModalOpen(false)}
          onManageDisableScrolling={onManageDisableScrolling}
          containerClassName={css.modalContainer}
          usePortal
        >
          <EditListingAvailabilityExceptionForm
            formId="EditListingAvailabilityExceptionForm"
            onSubmit={saveException}
            timeZone={availabilityPlan.timezone}
            availabilityExceptions={sortedAvailabilityExceptions}
            updateInProgress={updateInProgress}
            fetchErrors={errors}
          />
        </Modal>
      ) : null}
    </main>
  );
};

EditListingAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
  availabilityExceptions: [],
};

EditListingAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  availabilityExceptions: arrayOf(propTypes.availabilityException),
  fetchExceptionsInProgress: bool.isRequired,
  onAddAvailabilityException: func.isRequired,
  onDeleteAvailabilityException: func.isRequired,
  onSubmit: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  onNextTab: func.isRequired,
  submitButtonText: string.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingAvailabilityPanel;
