import React, { Children } from "react";


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
        <svg 
          className={`${styles.crossSvg}`}
          onClick={()=>{props.onClose()}}
          viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><title/><g data-name="1" id="_1">
          <path d="M257,461.46c-114,0-206.73-92.74-206.73-206.73S143,48,257,48s206.73,92.74,206.73,206.73S371,461.46,257,461.46ZM257,78C159.55,78,80.27,157.28,80.27,254.73S159.55,431.46,257,431.46s176.73-79.28,176.73-176.73S354.45,78,257,78Z" strokeWidth="2"/>
          <path d="M342.92,358a15,15,0,0,1-10.61-4.39L160.47,181.76a15,15,0,1,1,21.21-21.21L353.53,332.4A15,15,0,0,1,342.92,358Z" strokeWidth="5"/>
          <path d="M171.07,358a15,15,0,0,1-10.6-25.6L332.31,160.55a15,15,0,0,1,21.22,21.21L181.68,353.61A15,15,0,0,1,171.07,358Z" strokeWidth="5"/></g>
        </svg>
      </div>
          {props.children}
      </div>
    </div>
  )
}
