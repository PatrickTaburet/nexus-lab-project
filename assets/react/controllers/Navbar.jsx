import React from 'react';
import { useState } from 'react';
import styles from "/assets/styles/Navbar.module.css?module";
import MyButton from './MyButton';

export default function (props) {

    // adding the states 
    const [isActive, setIsActive] = useState(false);
    //add the active class
    const toggleActiveClass = () => {
      setIsActive(!isActive);
    };
    //clean up function to remove the active class
    const removeActive = () => {
      setIsActive(false)
    }
   
    const loginButtons = props.user ? (<div className={`${styles.rightSide}`}>
      <MyButton to="logout">Log out</MyButton>
      <MyButton to="">Profile</MyButton>
    </div>) : 
    ( <div className={`${styles.rightSide}`}>
      <MyButton to="login">Login</MyButton>
      <MyButton to="register">Sign in</MyButton>
    </div>);

    return (
      <div className="App">
        <header className="App-header">
          <nav className={`${styles.navbar}`}>
            <div className={`${styles.leftSide}`}>
              {/* logo */}
              <a href='home' className={`${styles.logo}`}>LOGO</a>
              <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
                <li onClick={removeActive}>
                  <a href='#home' className={`${styles.navLink}`}>Gallery</a>
                </li>
                <li onClick={removeActive}>
                  <a href='#home' className={`${styles.navLink}`}>Create</a>
                </li>
                <li onClick={removeActive}>
                  <a href='#home' className={`${styles.navLink}`}>Community</a>
                </li>
              </ul>
            </div>
            {/* Navbar buttons, different depending on the roles & user adress, link  to profile modale  */}
              {loginButtons}
            <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`}  onClick={toggleActiveClass}>
              <span className={`${styles.bar}`}></span>
              <span className={`${styles.bar}`}></span>
              <span className={`${styles.bar}`}></span>
            </div>
          </nav>
        </header>
      </div>
    );
  }

  