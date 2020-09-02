import React from 'react';
import classNames from 'classnames';
import { StaticPage, TopbarContainer } from '../../containers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,  
} from '../../components';

import css from './HowItWorksPage.css';

const HowItWorksPage = () => {
  // prettier-ignore
  return (
    <StaticPage
      title="How it works"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'HowItWorksPage',
        description: 'How GoodSpot Works',
        name: 'How It Works page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <h1 className={css.pageTitle}>Here's how simple it is to claim discounted off-peak spots.</h1>
          <div className={css.pageSteps}>
            <div className={css.step}>
                <div className={css.image}></div>
                <div className={css.details}>
                    <h1>Explore and find discounted spots</h1>
                    <h2>Everyday hundreds of businesses upload discounted off-peak spots to (almost) anything for you to grab. From an early table at your local restaurant, to getting your nails done, to even getting your lawns mowed.</h2>
                </div>
            </div>
            <div className={classNames(css.step, css.stepInverted)}>                
                <div className={css.image}></div>
                <div className={css.details}>
                    <h1>Pick the date and time</h1>
                    <h2>Every business is different and manages their own GoodSpot discount calendar. They upload the off-peak times they are trying to fill, and if they match with your schedule - secure that spot!</h2>
                </div>                
            </div>
            <div className={css.step}>
                <div className={css.image}></div>
                <div className={css.details}>
                    <h1>Secure with a small deposit</h1>
                    <h2>Each spot is different and the amount discounted varies so you don’t pay until you get there. To secure your spot, we charge a small $10 deposit which you get back when you book and  pay for your appointment.</h2>
                </div>
            </div>
            <div className={classNames(css.step, css.stepInverted)}>                
                <div className={css.image}></div>
                <div className={css.details}>
                    <h1>Receive your discount code</h1>
                    <h2>All done! We’ve sent you a unique discount booking voucher. The business will be in touch with you to confirm your spot, give them the voucher code and claim your discount.</h2>
                </div>
            </div>
          </div>
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

export default HowItWorksPage;