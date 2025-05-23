import styles from "./Nav.module.css";
import {FiLogOut} from "react-icons/fi";
import { Outlet , useNavigate} from "react-router-dom";
import {MdLightMode, MdDarkMode} from "react-icons/md"

import { sessionDetailsSelector, dataActions, handleLogout } from "../../redux/reducers/dataReducer";
import {useDispatch, useSelector} from "react-redux";

export default function Nav(){
    const {theme} = useSelector(sessionDetailsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLogout = async () => {
        dispatch(handleLogout());
        navigate('/chatApp/');
    };

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
                <FiLogOut size={20} onClick={onLogout}></FiLogOut>
            </div>
            <Outlet/>
        </div>
    )
}