import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { Form, IconSearch } from '../../components';

import css from './TopbarSearchKeyWordForm.css';

class TopbarSearchKeyWordFormComponent extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(keywords) {
    if (keywords) {      
      console.log(keywords);
      this.props.onSubmit({ keywords: keywords });      
    }
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        render={formRenderProps => {
          const { rootClassName, className, desktopInputRoot, isMobile } = formRenderProps;

          const classes = classNames(rootClassName, className);
          const desktopInputRootClass = desktopInputRoot || css.desktopInputRoot;

          // Allow form submit only when the place has changed
          const preventFormSubmit = e => {
              e.preventDefault();
              this.onChange(e.target.elements[0].value);
          };

          return (
            <Form className={classes} onSubmit={preventFormSubmit}>
                <div className={isMobile ? css.mobileInputRoot : desktopInputRootClass}>                    
                    <IconSearch/>
                    <input
                        id="top-search-keywords"
                        name="keywords"
                        placeholder="Search for keyword"
                        type="text"
                        autoComplete="off"
                        className={isMobile ? css.mobileInput : css.desktopInput}
                    />
                </div>              
            </Form>
          );
        }}
      />
    );
  }
}

const { func, string, bool } = PropTypes;

TopbarSearchKeyWordFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  desktopInputRoot: null,
  isMobile: false,
};

TopbarSearchKeyWordFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  desktopInputRoot: string,
  onSubmit: func.isRequired,
  isMobile: bool,

  // from injectIntl
  intl: intlShape.isRequired,
};

const TopbarSearchKeyWordForm = injectIntl(TopbarSearchKeyWordFormComponent);

export default TopbarSearchKeyWordForm;
