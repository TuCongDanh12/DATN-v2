import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css"

function Header({titlez, process}) {
    const [checked, setChecked] = useState(false);

    const handleChecked = () => {
        setChecked(!checked);
    }

    const navLinkClass = ({ isActive }) => {
        return isActive ? "nav-link activated" : "nav-link";
    };

    return (
        <div className="topnav" id="topnav">
            <input type="checkbox" hidden name="" id="nav__input" checked={checked} readOnly />
            <h1 className="px-[3rem] max-[768px]:px-[5.5rem] text-[28px] text-[#464F60]">{titlez}</h1>

            <nav className="main-nav">
                {process.map((i,index)=><NavLink key={index} to={i.url} className={navLinkClass}>
                    {i.content}
                </NavLink>
                )}
            </nav>

            <label htmlFor="nav__input" className="nav__overlay" onClick={handleChecked}></label>
        </div >
    );
}

export default Header;
