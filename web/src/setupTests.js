// @flow

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Set the default serializer for Jest to be the from enzyme-to-json
// This produces an easier to read (for humans) serialized format
// expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));

// Make the tests fail whenever the PropTypes throw warning or error
global.console.warn = message => {
  throw message;
};

global.console.error = message => {
  throw message;
};

configure({ adapter: new Adapter() });
