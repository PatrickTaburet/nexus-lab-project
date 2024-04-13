import React, { Children } from "react";
import { useState } from 'react';

import styles from "/assets/styles/Modale.module.css?module";

export default function (props) {

    function close() {
        console.log("close");
    }

  return (
    <div className={`${styles.modalContainer}`}>
        <div className={`${styles.modalBox}`}>
            {props.children}
        </div>
    </div>
  )
}
