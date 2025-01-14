// Helper styles for demo
import './helper.css';

import React from 'react';
import { render } from 'react-dom';
import { Formik } from 'formik';
import { formValidation } from './form-validation';

const App = () => (
  <div className="app">
    <h1>
      Async Validator{' '}
      <a
        href="https://github.com/jaredpalmer/formik"
        target="_blank"
        rel="noopener"
      >
        Fonk-Formik
      </a>{' '}
      Demo
    </h1>
    <span>
      Triggering and async validation: User is valid if it does NOT exists as a
      Github user (hits Github API). Initially you will have to loose focus on
      the component to see the validation result.
    </span>
    <Formik
      initialValues={{ user: '' }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 500);
      }}
      validate={values => formValidation.validateForm(values)}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;
        return (
          <form onSubmit={handleSubmit}>
            <label htmlFor="user" style={{ display: 'block' }}>
              User
            </label>
            <input
              id="user"
              placeholder="Enter your user id (must be a brand new Github user)"
              type="text"
              value={values.user}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.user && touched.user ? 'text-input error' : 'text-input'
              }
            />
            {errors.user && touched.user && (
              <div className="input-feedback">{errors.user}</div>
            )}
            <button
              type="button"
              className="outline"
              onClick={handleReset}
              disabled={!dirty || isSubmitting}
            >
              Reset
            </button>

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </form>
        );
      }}
    </Formik>
  </div>
);

render(<App />, document.getElementById('root'));
