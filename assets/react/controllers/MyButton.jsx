import React from "react";
import styles from "/assets/styles/Button.module.css?module";

export default function MyButton({to, children}) {
  return (
    <a 
      href={to}
      role="button"
    >
      <button className={styles.customButton}>
        <span>
          {children}
        </span>
      </button>
    </a>
  )
}
