import React from 'react'
import Modale from './Modale'
import styles from "/assets/styles/Modale.module.css?module";
import MyButton from './MyButton';
import xMark from '/public/images/icons/x-mark.png';
import { useState } from 'react';

export default  function ({props}) {

       const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }



  return (
    <div>
        <Modale
            username = {props.username}
            email = {props.email}
            role = {props.role}
            userImg= {props.userImg}
        >
            <div className={`${styles.modaleHeader}`}>
                <img style={{width: "30px", cursor: "pointer", margin: "10px"}} src={xMark} alt="cross_icone" />
            </div>
            <div className={`${styles.modaleImgBox}`}>
                <img src={props.userImg} alt={props.username} className={`${styles.modaleImg}`}/>
            </div>
            <hr />
            <div className={`${styles.modaleRow}`}>
                Pseudo : {props.username}
                {console.log(props.username)}
            </div>
            <hr />
            <div className={`${styles.modaleRow}`}>
                Email : {props.email}
            </div> 
            <hr />
            <div className={`${styles.modaleRow}`}>
                Role : {props.role}
            </div>
            <hr />
            <div className={`${styles.modaleRow}`}>
                <MyButton myStyle="marginButton" to="">Edit Profile</MyButton>
                <MyButton myStyle="marginButton" to="">My Artworks</MyButton>
            </div>
            <div className={`${styles.modaleRowButtons}`}>
                <MyButton myStyle="whiteButton" to="">Ask for Artist Role</MyButton>
                <MyButton myStyle="whiteButton" to="">Artist Dashboard</MyButton>
            </div>

        </Modale>
    </div>
  )
}

