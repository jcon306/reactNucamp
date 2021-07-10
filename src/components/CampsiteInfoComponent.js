import React, { Component } from 'react';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Button, Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem,  Modal, ModalHeader, 
    ModalBody, Label, Form, FormGroup} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';



const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

class CommentForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false
          };
          this.toggleModal = this.toggleModal.bind(this);
          this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.addComment(this.props.campsiteID, values.rating, values.author, values.text);
        console.log("Current state is: " + JSON.stringify(values));
        alert("Current state is: " + JSON.stringify(values));
        
    }

    render()  {
        return (
            <React.Fragment>
                <Button className ="fa fa-pencil fa-lg" onClick={this.toggleModal} outline>Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                     <ModalHeader toggle={this.toggleModal}>Add a Comment</ModalHeader>
                        <ModalBody>
                            <LocalForm onSubmit={values=>this.handleSubmit(values)}>
                                <div className="form-group">
                                    <Label htmlFor="rating">Rating</Label>
                                    <Control.select className="form-control" id="rating" name="rating" model=".rating"> 
                                        <option value ="1">1</option>
                                        <option value ="2">2</option>
                                        <option value ="3">3</option>
                                        <option value ="4">4</option>
                                        <option value ="5">5</option>
                                    </Control.select>
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="author">Author</Label>
                                    <Control.text 
                                        className="form-control"
                                        id="author" 
                                        name="author" 
                                        model=".author"
                                        validators={{
                                            required,
                                            minLength: minLength(2),
                                            maxLength: maxLength(15)
                                        }}
                                    /> 
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        component="div"
                                        messages={{
                                            required: "Required",
                                            minLength: "Must be at least 2 characters",
                                            maxLength: "Must be 15 characters or less",
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="text">text</Label>
                                    <Control.textarea
                                        rows="6"
                                        className="form-control"
                                        id="text" 
                                        name="text" 
                                        model=".text"
                                    />
                                </div>     
                                <Button type="submit" value="submit" color="primary">Submit</Button>
                            </LocalForm>
                        </ModalBody>
                </Modal>
            </React.Fragment>     
        );
    }
}

function RenderCampsite({campsite}) {
     return (
        <div className="col-md-5 m-1">
             <Card>
                <CardImg top src={ baseUrl + campsite.image} alt={campsite.name} />
                 <CardBody>
                    `<CardText>{campsite.description}</CardText>
                 </CardBody>
            </Card>
        </div>
    );
}

function RenderComments({comments, addComment, campsiteID}) {
        if (comments) {
            return (
                <div className="col-md-5 m-1">
                    <h4>Comments</h4>
                    {comments.map(comment => {
                        return (
                            <div key={comment.id}>
                                <p>{comment.text}<br />
                                -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                            </div>
                        );
                    })}
                    <CommentForm campsiteID={campsiteID} addComment={addComment} />
                </div>
                
            );
        }
        return <div />;
    }

function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className= 'container'>
                <div className= 'row'>
                    <Loading />
                </div>
            </div>
        );
    }

    if(props.errMess) {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }

    if (props.campsite) {
         return (
             <div className = "container">
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments 
                        comments={props.comments}
                        addComment={props.addComment}
                        campsiteID={props.campsite.id}
                         />
                </div>
             </div>
         );
    }
  return <div />;
}

export default CampsiteInfo;