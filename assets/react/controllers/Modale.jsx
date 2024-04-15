import React, { Children } from "react";
import xMark from '/public/images/icons/x-mark.png';

import styles from "/assets/styles/Modale.module.css?module";

export default function (props) {

  return (

    <div className={`${styles.modalContainer}`} onClick={(e) =>
      {if (e.target.className === `${styles.modalContainer}` ){
        props.onClose()}
      }}
    >
      <div className={`${styles.modalBox}`}>
      <div className={`${styles.modaleHeader}`}>
          <img 
            style={{width: "30px", cursor: "pointer", margin: "10px"}} 
            src={xMark} alt="cross_icone" 
            onClick={()=>{props.onClose()}}
          />
      </div>
          {props.children}
      </div>
    </div>
  )
}
