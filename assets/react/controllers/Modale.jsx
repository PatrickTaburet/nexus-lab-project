import React from "react";
import { useState } from 'react';
import styles from "/assets/styles/Modale.module.css?module";
import MyButton from './MyButton';

export default function ({props}) {
  return (
    <div className={`${styles.modalContainer}`}>
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
            <MyButton myStyle="marginButton" to="">Edit</MyButton>
        </div>
    </div>
  )
}
