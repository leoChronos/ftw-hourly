import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconSocialWebsite.css';

const IconSocialWebsite = props => {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);
  return (
    <img
        className={classes}
        width="17"
        height="17" 
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA9UlEQVRIid2UPRKCMBCFP+0cOksPAMewlfEeeARLU3oAzuA1bKn1BoBegVILFiYTIgk/Fvpmdph9u3mb3YTAv2APlMBrJiuAWC9QzCjeWK4XaMi50OotRyxeT6poQWD4DyD9EOvouTpQQKYJhcAGuAmXSY4Ttg6UcCeNOwgXin8U/+zSMwmbOMAFeBqcrYhzRJV8Vwa/Ba4G1+RU9MA2InNnkfiJlqOwd+ockS5wpz7QRHIiiQUSUz4b9rmmKd35O6+pTwEdvj/Z6AK+6Nyi0ghMNagf0BYx876oObADWAxsW4fX2jGv6SD47MJ1+L0aX+/g9/EGq7+Wt5KTZV8AAAAASUVORK5CYII="/>
    // <svg
    //   className={classes}
    //   width="10"
    //   height="17"
    //   viewBox="0 0 10 17"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <path
    //     d="M8.65 1.108C8.413 1.072 7.59 1 6.633 1c-2 0-3.374 1.244-3.374 3.525V6.49H1v2.668h2.258v6.84h2.71V9.16h2.25l.345-2.668H5.968V4.786c0-.766.204-1.298 1.293-1.298h1.39v-2.38z"
    //     fillRule="evenodd"
    //   />
    // </svg>
  );
};

IconSocialWebsite.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

IconSocialWebsite.propTypes = { rootClassName: string, className: string };

export default IconSocialWebsite;
