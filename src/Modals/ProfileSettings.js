import React from 'react';
import { Spinner, ProgressBar, Row, Col, Modal, Button, FormGroup, FormControl } from 'react-bootstrap';
import { firebase, storage } from '../Firebase/firebase';

import '../Styling/ProfileSettings.scss';

import TagsInput from '../Components/TagsInput';


class ProfileSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            displayname: "",
            email: this.props.email,
            selectedPhoto: null,
            selectedPhotoURL: null,
            imageUploadProgress: 0,
            isUploadInProgress: false,
        }

        this.validateUserDetailsForm = this.validateUserDetailsForm.bind(this);
        this.validateNewProfilePic = this.validateNewProfilePic.bind(this);

        this.setDisplayname = this.setDisplayname.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSelectedPhoto = this.setSelectedPhoto.bind(this);

        this.handleFileUploadClick = this.handleFileUploadClick.bind(this);

        this.submitUserDetailsForm = this.submitUserDetailsForm.bind(this);
        this.submitNewProfilePic = this.submitNewProfilePic.bind(this);

        this.user = firebase.auth().currentUser;
    }

    validateUserDetailsForm = () => {

        return this.state.displayname !== this.user.displayName && this.state.displayname;
    }

    validateNewProfilePic = () => {
        var fileType = this.state.selectedPhoto ? this.state.selectedPhoto.type : "";
        var fileSize = this.state.selectedPhoto ? this.state.selectedPhoto.size : "";
        if (fileType === "image/jpeg" || fileType === "image/png" || fileType === "image/gif") {
        } else {
            //console.log("error: not an image");
        }

        if (fileSize <= 2097152) {
        } else {
            //console.log("error: image too big: ", fileSize);
        }

        return this.state.selectedPhoto && (fileType === "image/jpeg" || fileType === "image/png" || fileType === "image/gif") && fileSize <= 2097152;
    }

    setDisplayname = (e) => {
        this.setState({
            displayname: e.target.value
        })
    }

    setEmail = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    setSelectedPhoto = (e) => {

        var thisComponent = this;
        const eventSelectedPhoto = e.target.files[0];

        if (e.target.files && e.target.files[0]) {

            var reader = new FileReader();

            reader.onload = function (r) {
                thisComponent.setState({
                    selectedPhoto: eventSelectedPhoto,
                    selectedPhotoURL: r.target.result
                })
            }

            reader.readAsDataURL(e.target.files[0]);
        }


    }


    handleFileUploadClick = (e) => {
        this.refs.fileUploader.click();
    }

    submitUserDetailsForm = () => {

        var thisComponent = this;

        if (this.state.displayname !== this.user.displayName) {
            this.user.updateProfile({
                displayName: this.state.displayname
            }).then(function () {
                // Update successful.
                thisComponent.props.settaskspagedisplayname(thisComponent.state.displayname);
                thisComponent.setState({
                    displayname: ""
                });

                // console.log("updated name")
            }).catch(function (error) {
                // An error happened.
                console.log(error)

            });
        }

        // if (this.state.email !== this.props.email) {
        //     this.user.updateEmail(this.state.email).then(function () {
        //         // Update successful.
        //         console.log("updated email")
        //     }).catch(function (error) {
        //         // An error happened.
        //         console.log(error);
        //         var credential;
        //         thisComponent.user.reauthenticateWithCredential(credential).then(function () {
        //             // User re-authenticated.
        //         }).catch(function (error) {
        //             // An error happened.
        //             console.log(error);
        //         });
        //     });
        // }
    }

    submitNewProfilePic = () => {

        var thisComponent = this;

        if (this.state.selectedPhoto) {

            var uploadTask = storage.ref(this.user.uid + '/profilePic').put(this.state.selectedPhoto);

            this.setState({
                isUploadInProgress: true
            });

            //updload image to storage
            uploadTask.on('state_changed', function (snapshot) {

                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                thisComponent.setState({
                    imageUploadProgress: progress,
                    selectedPhoto: null
                });

            }, function (error) {
                // Handle unsuccessful uploads
            }, function () {

                // Handle successful uploads on complete
                thisComponent.setState({
                    imageUploadProgress: 0
                });
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    thisComponent.props.settaskspagephotourl(downloadURL);
                    //update user current user photo
                    thisComponent.user.updateProfile({
                        photoURL: downloadURL
                    }).then(function () {
                        // Update successful.
                        // console.log("updated image")
                        thisComponent.setState({
                            isUploadInProgress: false
                        });
            
                    }).catch(function (error) {
                        // An error happened.
                        console.log(error)

                    });
                });
            });

        }

    }


    render() {

        var fileType = this.state.selectedPhoto ? this.state.selectedPhoto.type : "";
        var fileSize = this.state.selectedPhoto ? this.state.selectedPhoto.size : "";
        return (
            <Modal
                {...this.props}
                dialogClassName="ProfileSettings-modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Body className="ProfileSettings-body">
                    <div className="ProfileSettings-header">
                        <p className="ProfileSettings-title">Profile Settings</p>
                        <img className="ProfileSettings-xButton" alt="modal x button" src="/Assets/Images/xIcon.png" onClick={this.props.onHide} />
                    </div>
                    <p className="ProfileSettings-profilepic-title">Profile Picture</p>
                    <Row>
                        <Col md={5}>
                            <div onClick={this.handleFileUploadClick} className="ProfileSettings-profilepic-container">
                                <img className="ProfileSettings-profilepic" alt="profile pic" src={this.state.selectedPhotoURL ? this.state.selectedPhotoURL : this.props.currentprofilepic} />
                                <div className="ProfileSettings-profilepic-overlay">
                                </div>
                                <img className="ProfileSettings-profilepic-overlay-icon" alt="upload img icon" src="/Assets/Images/imageIcon.png" />
                                <input className="ProfileSettings-profilepic-fileupload" type="file" ref="fileUploader" onChange={this.setSelectedPhoto} />
                            </div>

                            {
                                this.state.imageUploadProgress ? <ProgressBar className="ProfileSettings-profilepic-fileupload-Bar" now={this.state.imageUploadProgress.toFixed(0)} label={`${this.state.imageUploadProgress.toFixed(0)}%`} /> : ""
                            }

                            <Button onClick={this.submitNewProfilePic} disabled={!this.validateNewProfilePic()} className="ProfileSettings-upload-profilepic-btn">
                                {
                                    this.state.isUploadInProgress ? <Spinner className="ProfileSettings-upload-profilepic-btn-spinner" animation="border" size="sm" /> : "Upload"
                                }
                            </Button>

                        </Col>
                        <Col md={7}>
                            {
                                this.state.selectedPhoto ? (fileType === "image/jpeg" || fileType === "image/png" || fileType === "image/gif" ? "" : <p className="ProfileSettings-profilepic-error">Can only upload a PNG or JPG file</p>) : ""
                            }
                            {
                                this.state.selectedPhoto ? (fileSize <= 2097152 ? "" : <p className="ProfileSettings-profilepic-error">Can only upload up to 2MB</p>) : ""
                            }
                        </Col>
                    </Row>

                    <hr className="ProfileSettings-seperator" />
                    <p className="ProfileSettings-displayname-title">Display Name</p>
                    <FormGroup controlId="displayName">
                        <FormControl onChange={this.setDisplayname} defaultValue={this.user.displayName} className="ProfileSettings-displayname-textfield" type="text" placeholder="Title" />
                    </FormGroup>
                    <p className="ProfileSettings-email-title">Email Address</p>
                    <FormGroup controlId="emailAddress">
                        <FormControl onChange={this.setEmail} disabled={true} defaultValue={this.props.email} className="ProfileSettings-email-textfield" type="text" placeholder="Title" />
                    </FormGroup>

                    <Button onClick={this.submitUserDetailsForm} disabled={!this.validateUserDetailsForm()} className="ProfileSettings-savechanges-btn">Update Details</Button>

                    <hr className="ProfileSettings-seperator" />

                    <TagsInput tags={this.props.tags} />

                </Modal.Body>

            </Modal>
        );
    }

}

export default ProfileSettings;