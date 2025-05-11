import styles from "./Nav.module.css";
import {FiLogOut} from "react-icons/fi";
import { Outlet } from "react-router-dom";
import {MdLightMode, MdDarkMode} from "react-icons/md"

import { sessionDetailsSelector, dataActions } from "../../redux/reducers/dataReducer";
import {useDispatch, useSelector} from "react-redux";

export default function Nav(){
    const {theme} = useSelector(sessionDetailsSelector);
    const dispatch = useDispatch();

    return (
        <div>
            <div className={theme === "dark" ? `${styles.navbar} ${  styles.dark_theme}` : `${styles.navbar}`}>
                <div className={styles.details}>
                    <h3 className={styles.title}>CHAT APP</h3>
                    <div onClick = {() => dispatch(dataActions.toggleTheme())}>
                        {
                            theme === "dark" ? <MdLightMode size={20}/> :
                            <MdDarkMode size={20} />
                        }
                    </div>
                </div>
                <input className={styles.searchbox}></input>
                <FiLogOut size={20}></FiLogOut>
            </div>
            <Outlet/>
        </div>
    )
}