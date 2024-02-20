import React, { Component } from 'react';
import { Grid, Header, Form, Button, Message, Input, Segment, Select } from 'semantic-ui-react';
import './App.css';

import './/css/PostLoginScreen.css'; // Create this CSS file for styling if needed
import { Link } from 'react-router-dom';
import Navigation from './components/Menu';
import Footer from './components/Footer';

function Profile() {
  const { nickname, email, given_name, middle_name, family_name, birthdate, gender, phone_number, address, website } = {}
  let loading = true;
  return (
    <div className="layout">
      <header  className="headerAppName">
        <h1>Budgify</h1>
      </header>

      <div className="main-content">
        <div>
          <Navigation />
        </div>
        <div className="App">
          <div className="post-login-screen">
            <div className="gray-box">
              <Segment color="blue">
                <Grid padded>
                  <Grid.Column>
                    <Header as="h1" >Account Information</Header>
                    <p>Please update your details.</p>

                    <Form>

                      <Form.Group>
                        <Form.Input name='nickname' value={nickname} label='Display Name' placeholder='Display name' width={6} error={false} />
                        <Form.Input label='Username' value={email} width={10} />
                      </Form.Group>

                      <Form.Group>
                        <Form.Input name='given_name' value={given_name} label='First name' placeholder='First Name' width={6} error={false} />
                        <Form.Input name='middle_name' value={middle_name} label='Middle Name' placeholder='Middle Name' width={4} error={false} />
                        <Form.Input name='family_name' value={family_name} label='Last Name' placeholder='Last Name' width={6} error={false} />
                      </Form.Group>

                      <Form.Group>
                        <Form.Input name='birthdate' value={birthdate} label='Birthday' placeholder='02/02/2002' width={4} />
                        <Form.Select name='gender' value={gender} label='Gender' placeholder='Gender' width={6} />
                      </Form.Group>

                      <Form.Group>
                        <Form.Input name='phone_number' value={phone_number} label='Mobile number' placeholder='+61 0400 000 000' width={6} />
                        <Form.Input name='website' value={website} label='Website' placeholder='www.mywebsite.com' width={10} />
                      </Form.Group>

                      <Form.Group>
                        <Form.Input name='address' value={address} label='Address' placeholder='2/77 New Street, Newport 3015 Melbourne, Victoria, Australia ' width={16} />
                      </Form.Group>

                      {/* <Message
                  success
                  header='Account Details Updated'
                  content="Your details have been updated."
                />
                
                <Message
                  error
                  header='Somthing Went Wrong'
                  content='One of the fields has error. Please look over the forms to see where the error is. '
                />
                 */}
                      <Button type='submit'>Submit</Button>
                    </Form>

                  </Grid.Column>
                </Grid>
              </Segment>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  );
}

export default Profile;