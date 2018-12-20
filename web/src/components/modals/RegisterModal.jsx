import React from 'react';
import { Box, Button, Divider, Modal, Heading } from 'gestalt';
import SignUpTab from '../nav/Menu/SignUpTab';

const RegisterModal = ({ handleToggleModal }) => (
  <div>
    <Modal
      accessibilityCloseLabel="close"
      accessibilityModalLabel="View default padding and styling"
      heading="Sign Up"
      onDismiss={handleToggleModal}
      footer={<Heading size="sm">Footer</Heading>}
      size="md"
    >
      <Box padding={2}>
        <SignUpTab />
      </Box>
    </Modal>
  </div>
);

export default RegisterModal;
