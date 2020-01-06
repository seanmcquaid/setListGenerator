import React, {useState} from "react";
import Text from "components/Text/Text";
import {Link, Redirect} from "react-router-dom";
import styles from "./BandLeaderLoginPage.module.css";
import Input from "components/Input/Input";
import Button from "components/Button/Button";
import {connect} from "react-redux";
import { loginAction } from "actions/authActions/authActions";


const BandLeaderLoginPage = props => {

    const [username, setUsername] = useState("");
    const [password, setPassword] =  useState("");
    
    const usernameOnChangeHandler = event => {
        setUsername(event.target.value);
    };

    const passwordChangeHandler = event => {
        setPassword(event.target.value);
    };

    const bandLeaderLoginSubmitHandler = event => {
        event.preventDefault();
        props.loginAction(username, password);
    };
    
    if(props.auth.isAuthenticated){
        return <Redirect to="/bandLeaderHome"/>
    }


    return(
        <div className={styles.bandLeaderLoginContainer}>
            <div className={styles.textContainer}>
                <Text headerText={true}>Band Leader Login</Text>
                <Text>
                    Don't have an account? Register <Link className={styles.registerLink} to="/bandLeaderRegister">Here</Link>
                </Text>
            </div>
            <form className={styles.loginForm} onSubmit={bandLeaderLoginSubmitHandler}>
                <Input 
                    name="username"
                    title="Username"
                    type="text"
                    value={username}
                    onChangeHandler={usernameOnChangeHandler}
                    placeholder="Enter your username here"
                />
                <Input 
                    name="password"
                    title="Password"
                    type="password"
                    value={password}
                    onChangeHandler={passwordChangeHandler}
                    placeholder="Enter your password here"
                />
                <Button title="Login" type="submit"/>
            </form>
        </div>
    )
};

const mapStateToProps = state => ({
    auth : state.auth,
});

const mapDispatchToProps = dispatch => ({
    loginAction : (username, password) => dispatch(loginAction(username, password))
});

export default connect(mapStateToProps, mapDispatchToProps)(BandLeaderLoginPage);