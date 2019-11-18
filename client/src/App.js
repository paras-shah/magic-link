import React, { Component } from "react";
import Nav from "./components/Nav";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import queryString from "query-string";
import "./App.css";
import {CHECK_SESSION_API, GET_AUTH_TOKEN, VERIFY_MAGIC_LINK, VERIFY_TOKEN, REGISTRATION_API} from "./config";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayed_form: "",
            logged_in: localStorage.getItem("token") ? true : false,
            username: ""
        };
    }

    logoutUser(){
        localStorage.removeItem("token");

        this.setState({ 
            displayed_form: "",
            logged_in: false,
            username: ""
        });
    }

    componentDidMount() {
        if (this.state.logged_in) {
            fetch(CHECK_SESSION_API, {
                headers: {
                    Authorization: `BEARER ${localStorage.getItem("token")}`
                }
            })
                .then(res => {
                    return res.json()
                })
                .then(json => {
                    console.log('aaa sdfsfs f',json);
                    this.setState({ username: json.username });
                }).catch(error => {
                    console.log('error in refrewshing page', error);
                    this.logoutUser();
                });
        } else {
            // on verifyAuth page get token from url
            const values = queryString.parse(this.props.location.search);
            const token = values.token_url;
            if (token && token !== "") {
                fetch(GET_AUTH_TOKEN, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token: token
                    })
                })
                    .then(res => res.json())
                    .then(json => {
                        /* Hit this url  and generate token */
                        console.log('Reponse', json)
                        localStorage.setItem("token", json.token);
                        this.setState({
                            logged_in: true,
                            displayed_form: "",
                            username: json.user.username
                        });
                    }).catch(error => {
                        console.log(error);
                        this.logoutUser();
                    });
            }
        }
    }

    handle_magic_login = (e, emailData) => {
        e.preventDefault();
        fetch(VERIFY_MAGIC_LINK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailData
            })
        })
            .then(res => res.json())
            .then(json => {
                /* Hit this url  and generate token */
                console.log("Reponse", json);
            });
    };

    handle_login = (e, data) => {
        e.preventDefault();
        fetch(VERIFY_TOKEN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(json => {
                localStorage.setItem("token", json.token);
                this.setState({
                    logged_in: true,
                    displayed_form: "",
                    username: json.user.username
                });
            });
    };

    handle_signup = (e, data) => {
        e.preventDefault();
        fetch(REGISTRATION_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(json => {
                localStorage.setItem("token", json.token);
                this.setState({
                    logged_in: true,
                    displayed_form: "",
                    username: json.username
                });
            });
    };

    handle_logout = () => {
        localStorage.removeItem("token");
        this.setState({ logged_in: false, username: "" });
    };

    display_form = form => {
        this.setState({
            displayed_form: form
        });
    };

    render() {
        let form;
        switch (this.state.displayed_form) {
            case "login":
                form = (
                    <LoginForm
                        handle_login={this.handle_login}
                        handle_magic_login={this.handle_magic_login}
                    />
                );
                break;
            case "signup":
                form = <SignupForm handle_signup={this.handle_signup} />;
                break;
            default:
                form = null;
        }

        return (
            <div className="App">
                <div className="container">
                    <div className="row">
                        <div className="col-sm">
                            <Nav
                                logged_in={this.state.logged_in}
                                display_form={this.display_form}
                                handle_logout={this.handle_logout}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-8">{form}</div>

                        <div className="col-sm-4">
                            <h3>
                                {this.state.logged_in
                                    ? `Hello, ${this.state.username}`
                                    : "Please Log In"}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
