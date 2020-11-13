import React, { Component } from 'react'
import BackDrop from '../../components/Backdrop/Backdrop';
import Modal from '../../components/Modal/Modal';
import authContext from '../../context/auth-context';
import './Auth.css';

class Auth extends Component {
    state = {
        isLogin: true,
        errorText: '',
        isError:false,
    };

    static contextType = authContext;
    constructor(props){
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin};
        })
    }
    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if(email.trim().length === 0 || password.trim().length === 0){
            return;
        }

        let requestBody = {
            query: `
                query Login($email: String!, $password: String!){
                    login(email: $email, password: $password){
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                email: email,
                password: password,
            }
        };
        if(!this.state.isLogin){
            requestBody = {
                query: `
                    mutation CreateUser($email: String!, $password: String!){
                        createUser(userInput: {email: $email, password: $password}){
                            _id
                            email
                        }
                    }
                `,
                variables: {
                    email: email,
                    password: password,
                }
            }
        }

        fetch('https://eventschedular.herokuapp.com/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then( res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('failed');
            }
            return res.json();
        })
        .then(resData => {

            if(this.state.isLogin){
                if(resData.data.login.token){
                    this.context.login(
                        resData.data.login.token, 
                        resData.data.login.userId, 
                        resData.data.login.tokenExpiration
                    );
                }
            }
            else{
                if(resData.errors){
                    this.setState(prevState => {return {...prevState,errorText:resData.errors[0].message}});
                    console.log(this.state.errorText)

                }
                else{
                    this.setState(prevState => {return {...prevState,errorText:'Successfully signed Up, Now try to login'}});
                    console.log(this.state.errorText,)
                }
            }
        })
        .catch(err => {
            this.setState(prevState => {return {...prevState,errorText:err.toString()}});
            console.log(this.state.errorText)
        })
    }

    closeModal = () => {
        this.setState(prevState => {
            return {...prevState, errorText:''}
        })
    }
    render() {
        return (
            <>
            {this.state.errorText.trim() && <BackDrop/>}
            {this.state.errorText.trim() && <Modal
                canCancel
                title="Message from AI Calendar"
                onCancel={this.closeModal}
            >
                {this.state.errorText}
            </Modal>}
            <form className='auth-form' onSubmit={this.submitHandler}>
                <div className='form-control'>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" ref={this.emailEl}/>
                </div>
                <div className='form-control'>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl}/>
                </div>
                <div className='form-actions'>
                    <button type='submit'>Submit</button>
                    <button type='button' onClick={this.switchModeHandler}>
                        Switch to {this.state.isLogin ? 'Signup':'Login'}
                    </button>
                </div>
            </form>
            </>
        )
    }
}


export default Auth
