import React, { Component } from 'react';
import { bool, func, object, string, array } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { timestampToDate, formatDateToText } from '../../util/dates';
import { propTypes } from '../../util/types';
import config from '../../config';
import { Form, PrimaryButton, FieldCheckbox } from '../../components';
import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe';
import FieldDateAndTimeInput from './FieldDateAndTimeInput';

import css from './BookingTimeForm.css';

const getDiscountData = (startDate, oneOffExtendedData, reocurringExtendedData, intl, timeZone) => {
  const formatedDate = formatDateToText(intl, startDate, timeZone);     

  return oneOffExtendedData.find(x => x.key === startDate.getTime()) 
    || reocurringExtendedData.find(x => x.key === `${formatedDate.weekday.toLowerCase()}_${formatedDate.time24}`);

}

export class BookingTimeFormComponent extends Component {
  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(e) {
    this.props.onSubmit(e);
  }

  render() {
    const { rootClassName, className, price: unitPrice, ...rest } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    if (!unitPrice) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingTimeForm.listingPriceMissing" />
          </p>
        </div>
      );
    }
    if (unitPrice.currency !== config.currency) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingTimeForm.listingCurrencyInvalid" />
          </p>
        </div>
      );
    }

    return (
      <FinalForm
        {...rest}
        unitPrice={unitPrice}
        onSubmit={this.handleFormSubmit}
        render={fieldRenderProps => {
          const {
            endDatePlaceholder,
            startDatePlaceholder,
            form,
            pristine,
            handleSubmit,
            intl,            
            listingId,
            submitButtonWrapperClassName,
            unitPrice,
            unitType,
            values,
            monthlyTimeSlots,
            oneOffExtendedData,
            reocurringExtendedData,
            onFetchTimeSlots,
            timeZone,
          } = fieldRenderProps;

          const startTime = values && values.bookingStartTime ? values.bookingStartTime : null;
          const endTime = values && values.bookingEndTime ? values.bookingEndTime : null;

          const bookingStartLabel = intl.formatMessage({
            id: 'BookingTimeForm.bookingStartTitle',
          });
          const bookingEndLabel = intl.formatMessage({ id: 'BookingTimeForm.bookingEndTitle' });

          const startDate = startTime ? timestampToDate(startTime) : null;
          const endDate = endTime ? timestampToDate(endTime) : null;          

          if(values && values.bookingStartTime){
            values.discountData = startDate ? getDiscountData(startDate, oneOffExtendedData, reocurringExtendedData, intl, timeZone) : {};
          }

          const discountData = values && values.discountData ? values.discountData : {};

          // This is the place to collect breakdown estimation data. See the
          // EstimatedBreakdownMaybe component to change the calculations
          // for customized payment processes.
          const bookingData =
            startDate && endDate
              ? {
                  unitType,
                  unitPrice,
                  startDate,
                  endDate,

                  // Calculate the quantity as hours between the booking start and booking end
                  //quantity: calculateQuantityFromHours(startDate, endDate),
                  // Update if number of spots can be selected
                  quantity: 1,
                  timeZone,
                  discountData,
                }
              : null;
          const bookingInfo = bookingData ? (
            <div className={css.priceBreakdownContainer}>
              {/* <h3 className={css.priceBreakdownTitle}>
                <FormattedMessage id="BookingTimeForm.priceBreakdownTitle" />
              </h3> */}
              <EstimatedBreakdownMaybe bookingData={bookingData} />
            </div>
          ) : null;

          const submitButtonClasses = classNames(
            submitButtonWrapperClassName || css.submitButtonWrapper
          );

          const startDateInputProps = {
            label: bookingStartLabel,
            placeholderText: startDatePlaceholder,
          };
          const endDateInputProps = {
            label: bookingEndLabel,
            placeholderText: endDatePlaceholder,
          };

          const dateInputProps = {
            startDateInputProps,
            endDateInputProps,
          };

          const isSpotDateSelected = (values && values.bookingStartDate);
          const isSpotSelected = (values && values.bookingStartTime && values.discountData);
          const submitDisabled = !isSpotSelected || !values.termsAndConditions || values.termsAndConditions.length === 0;

          return (
            <Form onSubmit={handleSubmit} className={classes}>
              {monthlyTimeSlots && timeZone ? (
                <FieldDateAndTimeInput
                  {...dateInputProps}
                  className={css.bookingDates}
                  listingId={listingId}
                  bookingStartLabel={bookingStartLabel}
                  onFetchTimeSlots={onFetchTimeSlots}
                  oneOffExtendedData={oneOffExtendedData}
                  reocurringExtendedData={reocurringExtendedData}
                  monthlyTimeSlots={monthlyTimeSlots}
                  values={values}
                  intl={intl}
                  form={form}
                  pristine={pristine}
                  timeZone={timeZone}                  
                />
              ) : null}
              {isSpotSelected ? (<hr className={css.secureSpotDivider} />) : (null)}
              {isSpotDateSelected ? (<p className={css.secureSpotTitle}>Secure your spot</p>) : (null)}
              {bookingInfo}              
              {!isSpotSelected ? 
              (
                <>                  
                  <p className={css.secureSpotSubTitle}>Please select an option to continue.</p>
                  <hr className={css.secureSpotDivider} />
                </>
              ) : (
              //   <p className={css.smallPrint}>
              //   <FormattedMessage
              //     id={
              //       isOwnListing
              //         ? 'BookingTimeForm.ownListing'
              //         : 'BookingTimeForm.youWontBeChargedInfo'
              //     }
              //   />
              // </p>
                <FieldCheckbox
                  id={`BookingTimeForm.termsAndConditions`}
                  name="termsAndConditions"
                  textClassName={css.termsAndConditionsText}
                  className={css.termsAndConditions}
                  value="accept"
                  label="I understand and have read the terms and conditions"
                  useSuccessColor
                  // onClick={handleTermAndCondChange}
                >
                </FieldCheckbox>                      
              )}
              <div className={submitButtonClasses}>
                <PrimaryButton type="submit"disabled={submitDisabled}>
                  <FormattedMessage id="BookingTimeForm.requestToBook" />
                </PrimaryButton>
              </div>
              {isSpotDateSelected ?
              (
                <div className={css.footerMessage}>
                  <span>You'll get your deposit back with your purchase.</span>
                  <span>Please remember your deposit is non refundable if you decide to change your mind or you don't turn up.</span>
                </div>
              )
              : (null)}
            </Form>
          );
        }}
      />
    );
  }
}

BookingTimeFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  price: null,
  isOwnListing: false,
  listingId: null,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  monthlyTimeSlots: null,
  oneOffExtendedData: null,
  reocurringExtendedData: null,
};

BookingTimeFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  unitType: propTypes.bookingUnitType.isRequired,
  price: propTypes.money,
  isOwnListing: bool,
  listingId: propTypes.uuid,
  monthlyTimeSlots: object,
  onFetchTimeSlots: func.isRequired,

  oneOffExtendedData: array.isRequired,
  reocurringExtendedData: array.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  startDatePlaceholder: string,
  endDatePlaceholder: string,
};

const BookingTimeForm = compose(injectIntl)(BookingTimeFormComponent);
BookingTimeForm.displayName = 'BookingTimeForm';

export default BookingTimeForm;
