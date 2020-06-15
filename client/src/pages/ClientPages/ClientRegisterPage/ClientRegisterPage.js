import React, {useState, useEffect, useCallback} from "react";
import Text from "components/Text/Text";
import {Link, Redirect} from "react-router-dom";
import styles from "./ClientRegisterPage.module.css";
import Input from "components/Input/Input";
import Button from "components/Button/Button";
import {useSelector, useDispatch} from "react-redux";
import {registerAction} from "actions/authActions/authActions";
import axios from "axios";
import Dropdown from "components/Dropdown/Dropdown";
import {apiHost} from "config";
import { selectAuthState } from "selectors/authSelectors/authSelectors";
import { selectErrorState } from "selectors/errorSelectors/errorSelectors";

const ClientRegisterPage = () => {
    const {isAuthenticated} = useSelector(selectAuthState);
    const {errorMessage} = useSelector(selectErrorState);

    const dispatch = useDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] =  useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [bandleaders, setBandleaders] = useState([""]);
    const [newErrorMessage, setNewErrorMessage] = useState("");
    const [selectedBandleader, setSelectedBandleader] = useState("");

    useEffect(() => {
        axios.get(`${apiHost}/users/getBandleaders`)
            .then(response => {
                const bandLeadersArray = response.data.bandleaders.map(bandleader => bandleader.username);
                let initialArray = [""];
                const newArray = initialArray.concat(bandLeadersArray);
                setBandleaders(newArray);
            })
            .catch(err => console.log(err));
    },[])
    
    const usernameOnChangeHandler = useCallback(event => {
        setUsername(event.target.value);
    },[]);

    const passwordChangeHandler = useCallback(event => {
        setPassword(event.target.value);
    },[]);

    const confirmPasswordChangeHandler = useCallback(event => {
        setConfirmPassword(event.target.value);
    },[]);

    const selectedBandleaderOnChangeHandler = useCallback(event => {
        setSelectedBandleader(event.target.value);
    },[]);

    const clientRegisterSubmitHandler = useCallback(event => {
        event.preventDefault();
        if(password !== confirmPassword){
            setNewErrorMessage("Passwords don't match");
        } else if(selectedBandleader === "") {
            setNewErrorMessage("SELECT A BANDLEADER");
        } else {
            dispatch(registerAction(username, password, "client", selectedBandleader));
        }
    },[password, confirmPassword, dispatch, username, selectedBandleader]);

    if(isAuthenticated){
        return <Redirect to="/clientHome"/>;
    }

    return(
        <div className={styles.clientRegisterContainer}>
            <div className={styles.textContainer}>
                <Text headerText={true}>Client Register</Text>
                <Text>
                    Already have an account? Login <Link className={styles.registerLink} to="/clientLogin">Here</Link>
                </Text>
                <Text>{errorMessage ? errorMessage : newErrorMessage}</Text>
            </div>
            <form className={styles.registerForm} onSubmit={clientRegisterSubmitHandler}>
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
                <Input 
                    name="confirmPassword"
                    title="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChangeHandler={confirmPasswordChangeHandler}
                    placeholder="Enter your password again here"
                />
                <Dropdown
                    selectedItem={selectedBandleader}
                    name="selectedBandleader"
                    title="Select Your Bandleader"
                    selectedItemOnChangeHandler={selectedBandleaderOnChangeHandler}
                    items={bandleaders}
                />
                <Button title="Register" type="submit"/>
            </form>
        </div>
    )
};

export default ClientRegisterPage;