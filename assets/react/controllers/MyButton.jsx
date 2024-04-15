import React from "react";
import styles from "/assets/styles/Button.module.css?module";



export default function MyButton({myStyle, to, children, handleClick}) {
  return (
    <a 
      href={to}
    >
      <button className={`${styles.customButton} ${styles[myStyle]}`} onClick={handleClick}>
        <span>
          {children}
        </span>
      </button>
    </a>
  )
}
