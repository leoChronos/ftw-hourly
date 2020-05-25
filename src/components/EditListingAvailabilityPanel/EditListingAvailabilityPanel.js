import React, { useState } from 'react';
import { arrayOf, bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { getDefaultTimeZoneOnBrowser, timestampToDate, formatDateToText } from '../../util/dates';
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
import { EditListingAvailabilityPlanEntryForm, EditListingAvailabilityExceptionForm, EditListingAvailabilityOneOfExceptionForm } from '../../forms';

import css from './EditListingAvailabilityPanel.css';

const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// We want to sort exceptions on the client-side, maximum pagination page size is 100,
// so we need to restrict the amount of exceptions to that.
const MAX_EXCEPTIONS_COUNT = 100;

const defaultTimeZone = () =>
  typeof window !== 'undefined' ? getDefaultTimeZoneOnBrowser() : 'Etc/UTC';

///////////////////  
// One Off Entry //
///////////////////

const OneOffEntry = props => {
  const { entry, timeZone, onDeleteSubmit, intl } = props;
  //const { entry, timeZone, onDeleteSubmit, intl, onManageDisableScrolling, initialValues, onSubmit, updateInProgress, fetchErrors, errorLocation, updated } = props;
  // Hooks
  //const [isEditOneOffExceptionsModalOpen, setIsEditOneOffExceptionModalOpen] = useState(false);

  const start = formatDateToText(intl, entry.attributes.start, timeZone);

  return (
    <div className={css.weekDay}>
      <div className={css.dayOfWeek}>
        {start.date}
      </div>
      <div className={css.entries} >
        <span className={css.entry}>
          {`${start.time}, ${entry.extendedData.discount}% discount`}
        </span>
        <span className={css.entry}>
          {`${entry.attributes.seats} spots`}
        </span>
      </div>
      <div className={css.entryEditButton}>
        {/* <InlineTextButton
          className={css.editPlanButton}
          onClick={() => { 
            setIsEditOneOffExceptionModalOpen(true);
            fetchErrors.updateListingError = null;
            }}
          >          
          <FormattedMessage id="EditListingAvailabilityPanel.edit" />
        </InlineTextButton> */}
        <InlineTextButton
          className={css.editPlanButton}
          onClick={() => onDeleteSubmit(entry)}
          >          
          <FormattedMessage id="EditListingAvailabilityPanel.remove" />
        </InlineTextButton>
      </div>
        {/* {onManageDisableScrolling ? (
          <Modal
            id="EditListingAvailabilityOneOfException"
            isOpen={isEditOneOffExceptionsModalOpen}
            onClose={() => setIsEditOneOffExceptionModalOpen(false)}
            onManageDisableScrolling={onManageDisableScrolling}
            containerClassName={css.modalContainer}
            usePortal
          >
            <EditListingAvailabilityOneOfExceptionForm
              formId="EditListingAvailabilityOneOfExceptionForm"
              onSubmit={onSubmit}
              timeZone={timeZone}
              availabilityExceptions={initialValues}
              updateInProgress={updateInProgress}
              fetchErrors={fetchErrors}
              errorLocation={errorLocation}
              updated={updated}
            />
          </Modal>
        ) : null} */}
    </div>
  );
};

///////////
// Entry //
///////////  

const Entry = props => {
  const { entry, initialValues, dayOfWeek, onManageDisableScrolling, onSubmit, onDeleteSubmit, updateInProgress, fetchErrors, errorLocation, updated } = props;
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
          onClick={() => { 
            setIsEditEntryModalOpen(true);
            fetchErrors.updateListingError = null;
            }}
          >          
          <FormattedMessage id="EditListingAvailabilityPanel.edit" />
        </InlineTextButton>
        <InlineTextButton
          className={css.editPlanButton}
          onClick={() => onDeleteSubmit(initialValues, entry)}
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
            errorLocation={errorLocation}
            updated={updated}        
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
  const { initialValues, dayOfWeek, onManageDisableScrolling, onSubmit, onDeleteSubmit, updateInProgress, fetchErrors, errorLocation, updated } = props;
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
          onDeleteSubmit={onDeleteSubmit}
          fetchErrors={fetchErrors}
          errorLocation={errorLocation}
          updated={updated}
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

// Create one off initial values
const createOneOfInitialValues = (oneOffException, oneOffExtendedData) => {
  const oneOffPlan = [...oneOffException];

  oneOffPlan.forEach(element => {     
    element.extendedData = oneOffExtendedData.find(x => x.key === element.attributes.start.getTime()) || {};
  });

  return oneOffPlan;
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

// Create reocuring plan with extended after deleted entry
const createReocurringPlanToDelete = (values, entryToDelete) => {
  const updatedValues = {
      entries: [],
      timezone: values.timezone,
      type: values.type    
  };

  values.entries.filter(x => x.extendedData.key !== entryToDelete.extendedData.key)
    .forEach(element => { 
      updatedValues.entries.push(element);
    });  

  return updatedValues;
};

const createOneOffExtendedDataToSave = (values, extendedData) => {
  const updatedValues = {        
    publicData: { oneOffExtendedData: [] }
  };

  values.forEach(element => {
    if(element.extendedData)
      updatedValues.publicData.oneOffExtendedData.push(element.extendedData);
  });

  updatedValues.publicData.oneOffExtendedData.push(extendedData);

  return updatedValues;
}

const createOneOffExtendedDataToDelete = (values, extendedData) => {
  const updatedValues = {        
    publicData: { oneOffExtendedData: [] }
  };

  values.forEach(element => {
    if(element.extendedData && element.extendedData.key !== extendedData.key)
      updatedValues.publicData.oneOffExtendedData.push(element.extendedData);
  });  

  return updatedValues;
}

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
    panelUpdated,
    onSubmit,
    onManageDisableScrolling,
    onNextTab,
    submitButtonText,
    updateInProgress,
    errors,
    intl
  } = props;
  // Hooks
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [isEditOneOffExceptionsModalOpen, setIsEditOneOffExceptionsModalOpen] = useState(false);
  const [isEditExceptionsModalOpen, setIsEditExceptionsModalOpen] = useState(false);
  const [valuesFromLastSubmit, setValuesFromLastSubmit] = useState(null);
  const [errorLocationFormLastSubmit, setErrorLocationFromLastSubmit] = useState(null);

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
  const oneOffExtendedData = publicData.oneOffExtendedData || [];

  const initialValues = valuesFromLastSubmit
    ? valuesFromLastSubmit
    : createInitialValues(availabilityPlan, reocurringExtendedData);

  const errorLocation = errorLocationFormLastSubmit
    ? errorLocationFormLastSubmit
    : {
      isInsertReocurError: false,
      isEditReocurError: false,
      isDeleteReocurError: false,
      isInsertOneOffError: false,
      isEditOneOffError: false,
      isDeleteOneOffError: false
    };

  const handleSuccessSubmit = (values) =>{
    setValuesFromLastSubmit(values);
    setCleanErrorLocation();
    setIsEditPlanModalOpen(false);
  };   

  const handleSubmit = (values, isInsert) => {
    // Final Form can wait for Promises to return.
    return onSubmit(createReocurringPlan(values))
    //return onSubmit(values)
      .then(() => {
        handleSuccessSubmit(values);
      })
      .catch(e => {
        // Don't close modal if there was an error
        defineErrorLocation(isInsert ? 'isDeleteReocurError' : 'isEditReocurError');
      });
  };

  const handleDeleteSumit = (values, entryToDelete) => {    
    // Remove entry before submit
    const updatedValues = createReocurringPlanToDelete(values, entryToDelete);
    
    return onSubmit(createReocurringPlan(updatedValues))
    //return onSubmit(updatedValues)
      .then(() => {
        handleSuccessSubmit(updatedValues);
      })
      .catch(e => {
        defineErrorLocation('isDeleteReocurError');
      });
  };

  const setCleanErrorLocation = () => {
    setErrorLocationFromLastSubmit(getCleanErrorLocation());
  };

  const getCleanErrorLocation = () => {
    const cleanErrorLocation = {...errorLocation};
    
    // Set all locations to false
    for (var x in cleanErrorLocation){
      cleanErrorLocation[x] = false;
    }

    return cleanErrorLocation;
  }

  const defineErrorLocation = location =>{
    const updatedErrorLocation = getCleanErrorLocation();

    // Set correct location to true
    updatedErrorLocation[`${location}`] = true;

    setErrorLocationFromLastSubmit(updatedErrorLocation);
  };

  const exceptionCount = availabilityExceptions ? availabilityExceptions.length : 0;    
  const sortedAvailabilityExceptions = availabilityExceptions.sort(sortExceptionsByStartTime);

  const oneOffException = !availabilityExceptions ? [] : availabilityExceptions.filter(x => x.attributes.seats > 0);  
  const sortedAvailabilityOneOffExceptions = createOneOfInitialValues(oneOffException.sort(sortExceptionsByStartTime), oneOffExtendedData);

  const unAvailableExceptions = !availabilityExceptions ? [] : availabilityExceptions.filter(x => x.attributes.seats === 0);
  const sortedUnAvailableExceptions = unAvailableExceptions.sort(sortExceptionsByStartTime);

  // Save exception click handler
  const saveException = values => {    
    const { exceptionStartTime, exceptionEndTime } = values;

    const updatedException = {      
        listingId: listing.id,
        seats: 0,
        start: timestampToDate(exceptionStartTime),
        end: timestampToDate(exceptionEndTime)      
    };

    return onAddAvailabilityException(updatedException)
      .then(() => {
        setIsEditExceptionsModalOpen(false);        
      })
      .catch(e => {
        // Don't close modal if there was an error
      });
  };  

  const saveOneOffException = values => {
    const { seats, exceptionStartTime, extendedData} = values;
    
    // set key based for extendend data
    extendedData.key = Number.parseInt(exceptionStartTime);
    
    const start = timestampToDate(exceptionStartTime);
    const end = timestampToDate(exceptionStartTime);
    
    end.setHours(end.getHours() + 1);

    const updatedOneOffException = {      
        listingId: listing.id,
        seats,
        start,
        end      
    };

    return onAddAvailabilityException(updatedOneOffException)
    .then(() => {
      //setIsEditOneOffExceptionsModalOpen(false);
      onSubmit(createOneOffExtendedDataToSave(sortedAvailabilityOneOffExceptions, extendedData))
        .then(() => {
          setIsEditOneOffExceptionsModalOpen(false);
          window.location.reload(false);
        })
        .catch(e => {          
          // Don't close modal if there was an error
        });
    })
    .catch(e => {
      defineErrorLocation('isInsertOneOffError');
      // Don't close modal if there was an error
    });
  };

  const deleteOneOffException = values => {    
    return onDeleteAvailabilityException({ id: values.id })
      .then(() =>{
        onSubmit(createOneOffExtendedDataToDelete(sortedAvailabilityOneOffExceptions, values.extendedData))
        .then(() => {
          setIsEditOneOffExceptionsModalOpen(false);
          window.location.reload(false);
        });        
      }).catch(e => {        
        defineErrorLocation('isDeleteOneOffError');
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
        {errorLocation.isDeleteReocurError ? (
          <p className={css.error}>
            <FormattedMessage id="EditListingAvailabilityPanel.errorToDeletePlan" />
          </p>
        ) : null}
        <div className={css.week}>
          {WEEKDAYS.map(w => (
            <Weekday
              dayOfWeek={w}
              key={w}              
              initialValues={initialValues}
              onManageDisableScrolling={onManageDisableScrolling}
              updateInProgress={updateInProgress}
              onSubmit={handleSubmit}
              onDeleteSubmit={handleDeleteSumit}
              fetchErrors={errors}
              updated={panelUpdated}
              errorLocation={errorLocation}
            />
          ))}
        </div>
      </section>
      <section className={css.section}>
        <header className={css.sectionHeader}>
          <h2 className={css.sectionTitle}>
            <FormattedMessage id="EditListingAvailabilityPanel.oneOffScheduleTitle" />
          </h2>
          <InlineTextButton
            className={css.editPlanButton}
            onClick={() => setIsEditOneOffExceptionsModalOpen(true)}
          >
            <IconAdd className={css.editPlanIcon} />{' '}
            <FormattedMessage id="EditListingAvailabilityPanel.add" />
          </InlineTextButton>          
        </header>
        {errorLocation.isDeleteOneOffError ? (
          <p className={css.error}>
            <FormattedMessage id="EditListingAvailabilityPanel.errorToDeletePlan" />
          </p>
        ) : null}
        <div className={css.week}>
          {sortedAvailabilityOneOffExceptions.map(e => (            
            <OneOffEntry
              key={`${e.attributes.start}`}
              initialValues={sortedAvailabilityExceptions}
              timeZone={availabilityPlan.timezone}
              entry={e}
              onManageDisableScrolling={onManageDisableScrolling}
              updateInProgress={updateInProgress}
              onSubmit={saveOneOffException}
              onDeleteSubmit={deleteOneOffException}
              //fetchErrors={fetchErrors}
              errorLocation={errorLocation}
              updated={panelUpdated}
              intl={intl}
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
                values={{ count: sortedUnAvailableExceptions.length }}
              />
            )}
          </h2>
        </header>
        {fetchExceptionsInProgress ? (
          <div className={css.exceptionsLoading}>
            <IconSpinner />
          </div>
        ) : sortedUnAvailableExceptions.length === 0 ? (
          <div className={css.noExceptions}>
            <FormattedMessage id="EditListingAvailabilityPanel.noExceptions" />
          </div>
        ) : (
          <div className={css.exceptions}>
            {sortedUnAvailableExceptions.map(availabilityException => {
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
          id="InsertAvailabilityPlanEntry"
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
            id="InsertListingAvailabilityOneOfException"
            isOpen={isEditOneOffExceptionsModalOpen}
            onClose={() => setIsEditOneOffExceptionsModalOpen(false)}
            onManageDisableScrolling={onManageDisableScrolling}
            containerClassName={css.modalContainer}
            usePortal
          >
            <EditListingAvailabilityOneOfExceptionForm
              formId="InsertListingAvailabilityOneOfExceptionForm"
              onSubmit={saveOneOffException}
              timeZone={availabilityPlan.timezone}
              availabilityExceptions={sortedAvailabilityExceptions}
              updateInProgress={updateInProgress}
              fetchErrors={errors}
              errorLocation={errorLocation}
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

  // from injectIntl
  intl: intlShape.isRequired,
};

export default injectIntl(EditListingAvailabilityPanel);
