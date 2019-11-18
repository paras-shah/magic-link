import React from 'react';
import PropTypes from 'prop-types';

function Nav(props) {
  const logged_out_nav = (
    <ul className="navbar-nav mr-auto">
        <li className="nav-item active">
          <a className="nav-link" href="#" onClick={() => props.display_form('login')}>login <span className="sr-only">(current)</span></a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#" onClick={() => props.display_form('signup')}>signup </a>
        </li>
        </ul>
  );

  const logged_in_nav = (
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <a className="nav-link" href="#" onClick={props.handle_logout}>logout <span className="sr-only">(current)</span></a>
      </li>
    </ul>
  );
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Test</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {props.logged_in ? logged_in_nav : logged_out_nav}
        </div>
      </nav>
    </>);
}

export default Nav;

Nav.propTypes = {
  logged_in: PropTypes.bool.isRequired,
  display_form: PropTypes.func.isRequired,
  handle_logout: PropTypes.func.isRequired
};
