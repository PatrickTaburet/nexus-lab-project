import React from "react";
import styles from "/assets/styles/Button.module.css?module";



export default function MyButton({myStyle, to, children}) {
  return (
    <a 
      href={to}
      role="button"
    >
      <button className={`${styles.customButton} ${styles[myStyle]}`} >
        <span>
          {children}
        </span>
      </button>
    </a>
  )
}
