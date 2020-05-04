import React from 'react';
import { FieldSelect } from '../../components';

import css from './EditListingDescriptionForm.css';

const CustomCertificateSelectFieldMaybe = props => {
  const { name, id, businessCategory, intl } = props;
  const certificateLabel = intl.formatMessage({
    id: 'EditListingDescriptionForm.certificateLabel',
  });

  return businessCategory ? (
    <FieldSelect className={css.certificate} name={name} id={id} label={certificateLabel}>
      {businessCategory.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default CustomCertificateSelectFieldMaybe;
