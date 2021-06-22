import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import { createUser } from '../Actions/auth';

import '../Styling/SignUpPage.scss';

function SignUpPage(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0 && name.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    createUser(email,password,name);
    //props.history.push("/");

  }

  return (
    <div className="SignUpPage">
      <Container fluid={true}>
        <Row>
          <Col md={6}>
            <div className="text-center">
              <img className="SignUpPage-Logo" alt="logo" src="/Assets/Images/animatedlogotagline.gif" />
            </div>
          </Col>
          <Col md={6}>
            <Container>
              <Row>
                <Col md={4}></Col>
                <Col md={6}>
                  <p className="SignUpPage-title">Sign Up Sail</p>
                  <form onSubmit={handleSubmit}>
                    <FormGroup controlId="name">
                      <FormLabel className="SignUpPage-textfield-label">Your Name</FormLabel>
                      <FormControl
                        className="SignUpPage-textfield SignUpPage-textfield-name"
                        autoFocus
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup controlId="email">
                      <FormLabel className="SignUpPage-textfield-label">Your Email</FormLabel>
                      <FormControl
                        className="SignUpPage-textfield SignUpPage-textfield-email"
                        autoFocus
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup controlId="password">
                      <FormLabel className="SignUpPage-textfield-label">Password</FormLabel>
                      <FormControl
                        className="SignUpPage-textfield SignUpPage-textfield-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                      />
                    </FormGroup>
                    <Button className="SignUpPage-SignUpBtn" block disabled={!validateForm()} type="submit">
                      SIGN UP
                    </Button>
                    <hr className="SignUpPage-hr" />
                    <div className="text-center">
                      <Link className="SignUpPage-loginlink" to="/">Already have an account? Sign In</Link>
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

export default SignUpPage;