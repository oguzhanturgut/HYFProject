import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';

import { confirmEmail } from '../../store/actions/auth';

const Confirm = ({ confirmEmail, isAuthenticated, match }) => {
  const { emailToken } = match.params;
  useEffect(() => {
    confirmEmail(emailToken);
  }, [confirmEmail, emailToken]);

  if (isAuthenticated) return <Redirect to='/dashboard' />;
  return <Spinner />;
};

Confirm.propTypes = {
  confirmEmail: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { confirmEmail })(Confirm);
