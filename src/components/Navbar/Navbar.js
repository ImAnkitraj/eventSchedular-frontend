import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import AuthContext from '../../context/auth-context'

function Navbar() {
    return (

    <AuthContext.Consumer>
        {
            (context)=> {
                return (
                    <header className='main-navigation'>
                        <div className='main-navigation__logo'>
                            <h1>AI Calendar</h1>
                        </div>
                        <nav className ='main-navigation__items'>
                            <ul>
                                {context.token && <li onClick={()=>context.logout()}><NavLink to="/auth">Logout</NavLink></li>}
                            </ul>
                        </nav>
                    </header>
                )
            }
        }
    </AuthContext.Consumer>
    )
}

export default Navbar;
