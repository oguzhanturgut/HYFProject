import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { deleteEducation } from '../../store/actions/profile';

const Education = ({ education, deleteEducation }) => {
  const educations = education.map(education => (
    <tr key={education._id}>
      <td>{education.school}</td>
      <td className='hide-sm'>{education.degree}</td>
      <td>
        <Moment format='YYYY/MM/DD'>{education.from}</Moment> -
        {education.to === null ? 'Now' : <Moment format='YYYY/MM/DD'>{education.to}</Moment>}
      </td>
      <td>
        <button className='btn btn-danger' onClick={() => deleteEducation(education._id)}>
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className='my-2'>Education Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='hide-sm'>Degree</th>
            <th className='hide-sm'>Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(
  null,
  { deleteEducation },
)(Education);
