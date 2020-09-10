import React from "react";
import Responsive from 'react-responsive';

const Desktop = props => <Responsive {...props} minWidth={984} orientation="landscape" />;
const Mobile  = props => <Responsive {...props} maxWidth={767} orientation="portrait" />;

export { Desktop, Mobile };
