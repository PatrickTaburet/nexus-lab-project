import React from 'react';
import { useState, useEffect } from 'react';
import styles from "/assets/styles/Navbar.module.css?module";
import MyButton from './MyButton';
import Modale from './Modale'
import modStyles from "/assets/styles/Modale.module.css?module";



export default function Navbar ({props}) {

  // Menu burger functions
  const [menuOpen, setMenuOpen] = useState(false);
  //add the active class
  const handleBurgerClick  = () => {
    setMenuOpen(!menuOpen);
      document.querySelector(`.${styles.menuBurger}`).classList.toggle(styles.hidden);
      document.querySelector(`.${styles.menuBurger}`).classList.add(styles.visible);
      document.querySelector(`.${styles.menuBurger}`).classList.add(styles.menuOpen);

    document.body.classList.toggle(styles.noScroll); //empecher scroll
   
  };
 

  // Modale functions 

    const [ModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!ModalOpen);
    }
    
    const handleButtonClick = () => {
      setModalOpen(!ModalOpen);
    }

  // Display navbar & modale buttons depend on the login status and role
    
    let loginButtons = null
    if (props.user && (props.role.includes("ROLE_ADMIN"))){
      loginButtons = 
        (<div className={`${styles.rightSide}`}>
          <MyButton to="/logout">Log out</MyButton>
          <MyButton handleClick={()=> toggleModal()} >Profile</MyButton>
          <MyButton  to="/admin/dashboard">Admin</MyButton>
        </div>)
    } else if (props.user){
      loginButtons = 
      (<div className={`${styles.rightSide}`}>
        <MyButton to="/logout">Log out</MyButton>
        <MyButton handleClick={()=> toggleModal()} >Profile</MyButton>
      </div>) 
    } 
    
    const modaleButtons = (props.user && props.role.includes("ROLE_ARTIST"))? 
      (<div className={`${modStyles.modaleRowButtons}`}>
        <MyButton myStyle="whiteButton" to="/artist/dashboard">Artist Dashboard</MyButton>
      </div> ) :
      (<div className={`${modStyles.modaleRowButtons}`}>
        <MyButton myStyle="whiteButton" to="/profile/roleRequest">Ask for Artist Role</MyButton>
      </div> ) 

    const profileResponsive = props.user ? 
      (<div  className={`${styles.rightSideImg}`}>
        <img onClick={()=> toggleModal()}  src={props.userImg} alt={props.username} className={`${styles.profileImg}`}/>
      </div>) :
      (<div className={`${styles.rightSideButtons}`}>
        <MyButton to="/login">Log in</MyButton>
        <MyButton to="/register">Sign up</MyButton>
      </div>);

    // Navbar
    
    return (
      <div className="App">
        <header className="App-header">
          <nav className={`${styles.navbar}`}>
            <div className={`${styles.leftSide}`}>
              {/* logo */}
              <a href='/' className={`${styles.logo}`}>LOGO</a>
              <ul className={`${styles.navMenu}`}>
                <li >
                  <a data-item= "Gallery" href='/gallery' className={`${styles.navLink}`}>Gallery</a>
                </li>
                <li >
                  <a data-item= "Create"  href='/create' className={`${styles.navLink}`}>Create</a>
                </li>
                <li >
                  <a data-item= "Community" href='#home' className={`${styles.navLink}`}>Community</a>
                </li>
              </ul>
            </div>
            {/* Navbar buttons, different depending on the roles & user adress, link  to profile modale  */}
              {loginButtons}
            <div className={`${styles.burger} ${menuOpen ? styles.active : ''}`}  onClick={handleBurgerClick}>
              <span className={`${styles.bar}`}></span>
              <span className={`${styles.bar}`}></span>
              <span className={`${styles.bar}`}></span>
            </div>
            {profileResponsive}
          </nav>

      {/*----------- Menu Burger --------*/}

          <div className={`${styles.menuBurger} ${styles.hidden}`}>
            <div className={`${styles.hexagonItem}`}>
                <div className={`${styles.hexItem}`}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={`${styles.hexItem}`}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <a  className={`${styles.hexContent}`}>
                    <span className={`${styles.hexContentInner}`}>
                        <span className={`${styles.icon}`}>
                            <i className={`${styles.fa} ${styles.faUniversalAccess}`}></i>
                        </span>
                        <span className={`${styles.title}`}>Gallery</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#1e2530"></path></svg>
                </a>
            </div>
            <div className={`${styles.hexagonItem}`}>
                <div className={`${styles.hexItem}`}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={`${styles.hexItem}`}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <a  className={`${styles.hexContent}`}>
                    <span className={`${styles.hexContentInner}`}>
                        <span className={`${styles.icon}`}>
                            <i className={`${styles.fa} ${styles.faBullseye}`}></i>
                        </span>
                        <span className={`${styles.title}`}>Create</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#1e2530"></path></svg>
                </a>
            </div>
            <div className={`${styles.hexagonItem}`}>
                <div className={`${styles.hexItem}`}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={`${styles.hexItem}`}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <a className={`${styles.hexContent}`}>
                    <span className={`${styles.hexContentInner}`}>
                        <span className={`${styles.icon}`}>
                            <i className={`${styles.fa} ${styles.faBraille}`}></i>
                        </span>
                        <span className={`${styles.title}`}>Community</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#1e2530"></path></svg>
                </a>    
            </div>
            <div className={`${styles.hexagonItem}`}>
                <div className={`${styles.hexItem}`}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={`${styles.hexItem}`}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <a  className={`${styles.hexContent}`}>
                    <span className={`${styles.hexContentInner}`}>
                        <span className={`${styles.icon}`}>
                            <i className={`${styles.fa} ${styles.faIdBadge}`}></i>
                        </span>
                        <span className={`${styles.title}`}>Home</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#1e2530"></path></svg>
                </a>
            </div>            
            <div className={`${styles.hexagonItem}`}>
                <div className={`${styles.hexItem}`}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={`${styles.hexItem}`}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <a  className={`${styles.hexContent}`}>
                    <span className={`${styles.hexContentInner}`}>
                        <span className={`${styles.icon}`}>
                            <i className={`${styles.fa } ${styles.faMapSigns}`}></i>
                        </span>
                        <span className={`${styles.title}`}>Contact</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#1e2530"></path></svg>
                </a>
            </div>
          </div>
        </header>

        {/* Profile Modale */}

        {ModalOpen && <Modale  //Display the modale  if ModaleOpen = true
          username = {props.username}
          email = {props.email}
          role = {props.role}
          userImg= {props.userImg}
          onClose = {handleButtonClick}
        >
            <div className={`${modStyles.modaleImgBox}`}>
                <img src={props.userImg} alt={props.username} className={`${modStyles.modaleImg}`}/>
            </div>
            <hr />
            <div className={`${modStyles.modaleRow}`}>
                Pseudo : {props.username}
            </div>
            <hr />
            <div className={`${modStyles.modaleRow}`}>
                Email : {props.email}
            </div> 
            <hr />
            <div className={`${modStyles.modaleRow}`}>
                Role : {props.role[0] ? "USER" : ""}{props.role[1] ? " / ARTIST" : ""}{props.role[2] ? " / ADMIN" : ""}
            </div>
            <hr />
            <div className={`${modStyles.modaleRow}`}>
                <MyButton myStyle="marginButton" to="profile/edit" id={props.userId}>Edit Profile</MyButton>
                <MyButton myStyle="marginButton" to="profile/myArtworks" id={props.userId}>My Artworks</MyButton>
            </div>
              {modaleButtons}
            <hr />
            <div className={`${modStyles.modaleBottom}`}> 
              <a className={`${modStyles.logout}`} href="/logout">Log out</a>
            </div>
           
        </Modale>}
      </div>
    );
  }

  