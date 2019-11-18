import React from "react";
import PropTypes from "prop-types";

class LoginForm extends React.Component {
    state = {
        username: "",
        password: "",
        email:''
    };

    handle_change = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
            const newState = { ...prevstate };
            newState[name] = value;
            return newState;
        });
    };

    render() {
        return (
            <div className="row">
                <div className="col-sm-6">
                    <form
                        onSubmit={e => this.props.handle_login(e, this.state)}
                    >
                        <h4>Log In</h4>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={this.state.username}
                                onChange={this.handle_change}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handle_change}
                            />
                        </div>
                        <div className="form-group">
                            <input type="submit" />
                        </div>
                    </form>
                </div>
                <div className="col-sm-6">
                    <form
                        onSubmit={e => this.props.handle_magic_login(e,  this.state.email)}
                    >
                        <h4> Link </h4>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={this.state.email}
                                onChange={this.handle_change}
                            />
                        </div>
                        <div className="form-group">
                            <input type="submit" />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginForm;

LoginForm.propTypes = {
    handle_login: PropTypes.func.isRequired
};
