import React, { useState } from "react";
import { Button, FormGroup, FormCheck, FormControl, FormLabel, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import {startGoogleLogin, startLogin} from '../Actions/auth';

import '../Styling/LoginPage.scss';

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    startLogin(email, password);
    //props.history.push("/");

  }

  return (
    <div className="LoginPage">
      <Container fluid={true}>
        <Row>
          <Col md={6}>
            <div className="text-center">
              <img className="LoginPage-Logo" alt="logo" src="/Assets/Images/animatedlogotagline.gif" />
            </div>
          </Col>
          <Col md={6}>
            <Container>
              <Row>
                <Col md={4}></Col>
                <Col md={6}>
                  <p className="LoginPage-title">Sign In Sail</p>
                  <form onSubmit={handleSubmit}>
                    <FormGroup controlId="email">
                      <FormLabel className="LoginPage-textfield-label">Email</FormLabel>
                      <FormControl
                        className="LoginPage-textfield"
                        autoFocus
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup controlId="password">
                      <FormLabel className="LoginPage-textfield-label">Password</FormLabel>
                      <FormControl
                        className="LoginPage-textfield"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                      />
                    </FormGroup>
                    <Row>
                      <Col>
                        <FormGroup>
                          <FormCheck className="LoginPage-RemembermeCheckbox" type="checkbox" label="Remember me" />
                        </FormGroup>
                      </Col>
                      <Col className="text-right">
                        <Link className="LoginPage-RecoverPasswordLink" to="/RecoverPassword">Recover Password</Link>
                      </Col>
                    </Row>
                    <Button className="LoginPage-SignInBtn" block disabled={!validateForm()} type="submit">
                      SIGN IN
                    </Button>
                    <p className="LoginPage-ORseperator" >OR</p>
                    <Button onClick={startGoogleLogin} className="LoginPage-LoginwithgoogleBtn" block>
                      <img className="LoginPage-LoginwithgoogleBtnIcon" alt="google icon" src="/Assets/Images/google icon.png" />
                      Log in with Google
                    </Button>

                    <hr className="LoginPage-hr" />
                    <div className="text-center">
                      <Link className="LoginPage-signuplink" to="/SignUp">Sign up for an account</Link>
                    </div>
                  </form>
                </Col>
                <Col md={2}></Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>

    </div>
  );
}

export default LoginPage;