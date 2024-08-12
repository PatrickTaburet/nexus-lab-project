import React from "react";
import styles from "/assets/styles/Button.module.css?module";


export default function MyButton({props}) {
  return (
    <a 
    href={props.id?`/${props.to}/${props.id}`:props.to}
    >
      <button className={`${styles.customButton} ${styles[props.myStyle]}`} >
        <span>
          {props.children}
        </span>
      </button>
    </a>
  )
}
