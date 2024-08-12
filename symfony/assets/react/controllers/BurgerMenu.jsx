import React, { forwardRef } from 'react';
import styles from "/assets/styles/BurgerMenu.module.css?module";


const BurgerMenu = forwardRef(({ isOpen }, ref) => {

  // const burgerRef = React.createRef();

  return (
    <div ref={ref} className={`${styles.menuBurger} ${isOpen ? `${styles.visible} ${styles.menuOpen}` : styles.hidden}`}>
      
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
                <a href='/gallery' className={`${styles.hexContent}`}>
                    <span className={`${styles.hexContentInner}`}>
                        <span className={`${styles.icon}`}>
                          <svg className={`${styles.svgGallery}`} viewBox="0 0 104.9 96.17" xmlns="http://www.w3.org/2000/svg"><title/><g data-name="Layer 2" id="Layer_2"><g data-name="Layer 1" id="Layer_1-2"><path d="M27.32,76.5A16.37,16.37,0,0,1,11.83,65.34l-.15-.5a16,16,0,0,1-.76-4.74V30.3L.32,65.7a9.93,9.93,0,0,0,7,12l67.59,18.1a10,10,0,0,0,2.52.32A9.75,9.75,0,0,0,86.83,89L90.77,76.5Z"/><path d="M39.34,30.6a8.74,8.74,0,1,0-8.74-8.74A8.75,8.75,0,0,0,39.34,30.6Z"/><path d="M94,0H28.41A10.94,10.94,0,0,0,17.48,10.93V59A10.94,10.94,0,0,0,28.41,69.94H94A10.94,10.94,0,0,0,104.9,59V10.93A10.94,10.94,0,0,0,94,0ZM28.41,8.74H94a2.19,2.19,0,0,1,2.19,2.19V42L82.35,25.85a7.83,7.83,0,0,0-5.86-2.69,7.64,7.64,0,0,0-5.84,2.76L54.42,45.4l-5.29-5.28a7.67,7.67,0,0,0-10.84,0L26.22,52.19V10.93A2.19,2.19,0,0,1,28.41,8.74Z"/></g></g></svg>
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
                <a href='/create' className={`${styles.hexContent}`}>
                    <span className={`${styles.hexContentInner}`}>
                        <span className={`${styles.icon}`}>
                          <svg className={`${styles.svgCreate}`} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M204.3 5.017C104.9 24.42 24.8 104.4 5.171 203.5c-36.1 187 131.7 326.4 258.8 306.7c41.19-6.406 61.41-54.61 42.5-91.7c-23.09-45.41 9.897-98.4 60.9-98.4h79.7c35.81 0 64.8-29.59 64.9-65.31C511.5 97.13 368.1-26.89 204.3 5.017zM96 320c-17.69 0-32-14.31-32-32c0-17.69 14.31-32.03 31.1-32.03s32 14.31 32 31.1C127.1 305.7 113.7 320 96 320zM128 192c-17.69 0-32-14.31-32-32s14.31-32 32-32s32 14.31 32 32S145.7 192 128 192zM256 128c-17.69 0-32-14.31-32-32S238.3 64.04 256 64.04s32 14.31 32 32S273.7 128 256 128zM384 192c-17.69 0-32-14.31-32-32s14.31-32 32-32s32 14.31 32 32S401.7 192 384 192z"/></svg>
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
                <a href='/community' className={`${styles.hexContent}`}>
                    <span className={`${styles.hexContentInner}`}>
                        <span className={`${styles.icon}`}>
                          <svg className={`${styles.svgCommunity}`} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g id="Teamwork"><path d="M22.2837,13.3631l2.9538,2.1461a1.9827,1.9827,0,0,1,.72,2.2168L24.83,21.1986a1.9827,1.9827,0,0,0,3.051,2.2166l2.9541-2.1461a1.9823,1.9823,0,0,1,2.3306,0l2.9541,2.1461a1.9827,1.9827,0,0,0,3.051-2.2166L38.042,17.726a1.9828,1.9828,0,0,1,.72-2.2168l2.9539-2.1461a1.9827,1.9827,0,0,0-1.1655-3.5867H36.9a1.9831,1.9831,0,0,1-1.8857-1.37L33.8857,4.9338a1.9826,1.9826,0,0,0-3.7712,0L28.9861,8.4064A1.9829,1.9829,0,0,1,27.1,9.7764H23.4492A1.9827,1.9827,0,0,0,22.2837,13.3631Z"/><path d="M37.4387,44.1386a1.1737,1.1737,0,0,1-.71-1.0786,1.1966,1.1966,0,0,1,.3718-.8779c.0725-.0691.1419-.1372.1939-.192a7.3474,7.3474,0,0,0,.9675-1.2707,7.3009,7.3009,0,0,0-7.637-10.9231,7.134,7.134,0,0,0-5.758,5.5937A7.3,7.3,0,0,0,26.88,42.1668a1.2386,1.2386,0,0,1,.3862.8793v.0061a1.1751,1.1751,0,0,1-.71,1.09,12.0152,12.0152,0,0,0-6.46,6.4014,15.2866,15.2866,0,0,0-1.274,6.2953v1.56A2.547,2.547,0,0,0,21.37,60.9459h21.261a2.5468,2.5468,0,0,0,2.5466-2.5468V56.8234a15.2521,15.2521,0,0,0-1.2761-6.292A12.0124,12.0124,0,0,0,37.4387,44.1386Z"/><path d="M60.8821,47.0135A12.0119,12.0119,0,0,0,54.42,40.6208a1.1745,1.1745,0,0,1-.71-1.0786,1.1973,1.1973,0,0,1,.3719-.878c.0725-.0692.1421-.1372.1938-.1921a7.3327,7.3327,0,0,0,.9676-1.27,7.3007,7.3007,0,0,0-7.6368-10.9232,7.1333,7.1333,0,0,0-5.758,5.5937,7.3,7.3,0,0,0,2.0129,6.7768,1.2373,1.2373,0,0,1,.3862.8792v.0063a1.1745,1.1745,0,0,1-.71,1.09,11.8293,11.8293,0,0,0-3.1953,1.9487,14.7374,14.7374,0,0,1,6.0188,6.8459,17.8408,17.8408,0,0,1,1.5161,7.405v.6043H59.6116a2.5468,2.5468,0,0,0,2.5468-2.5466V53.3056A15.25,15.25,0,0,0,60.8821,47.0135Z"/><path d="M23.66,42.5729a11.8205,11.8205,0,0,0-3.2026-1.9521,1.1744,1.1744,0,0,1-.71-1.0786,1.1968,1.1968,0,0,1,.3721-.878c.0722-.0692.1418-.1372.1938-.1921a7.341,7.341,0,0,0,.9673-1.27,7.3006,7.3006,0,0,0-7.6367-10.9232,7.1338,7.1338,0,0,0-5.7581,5.5937,7.3007,7.3007,0,0,0,2.013,6.7768,1.2369,1.2369,0,0,1,.3862.8792v.0063a1.1747,1.1747,0,0,1-.71,1.09,12.0156,12.0156,0,0,0-6.46,6.4013,15.2875,15.2875,0,0,0-1.2742,6.2953l0,1.5607a2.5465,2.5465,0,0,0,2.5466,2.5466H16.1228v-.5893a17.8839,17.8839,0,0,1,1.5127-7.4058A14.74,14.74,0,0,1,23.66,42.5729Z"/></g></svg>                        </span>
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
                <a href='/' className={`${styles.hexContent}`}>
                    <span className={`${styles.hexContentInner}`}>
                        <span className={`${styles.icon}`}>
                          <svg className={`${styles.svgHome}`} viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"/></svg>                        </span>
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
                <a href='/contact' className={`${styles.hexContent}`}>
                    <span className={`${styles.hexContentInner}`}>
                        <span className={`${styles.icon}`}>
                          <svg className={`${styles.svgContact}`} viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><title/><path d="M48,0a48,48,0,0,0,0,96,6,6,0,0,0,0-12A36,36,0,1,1,84,48V66a6,6,0,0,1-12,0V48A24,24,0,1,0,48,72a23.7365,23.7365,0,0,0,12.2549-3.4783A17.9586,17.9586,0,0,0,96,66V48A48.0474,48.0474,0,0,0,48,0Zm0,60A12,12,0,1,1,60,48,12.0081,12.0081,0,0,1,48,60Z"/></svg>
                        </span>
                        <span className={`${styles.title}`}>Contact</span>
                    </span>
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#1e2530"></path></svg>
                </a>
            </div>
          </div>
  )
});

export default BurgerMenu;
