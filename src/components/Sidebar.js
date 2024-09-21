import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BsArrowLeftShort } from 'react-icons/bs';
import home from '../assets/home.png';
import logout from '../assets/log-out.png';
import order from '../assets/take-order.png';
import client from '../assets/user.png';

const Sidebar = ({ setIsAuth }) => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    // menu items with paths
    const Menus = [
        { title: 'Home', src: home, path: '/' },
        { title: 'Client', src: client, path: '/hello' },
        { title: 'Take Orders', src: order, path: '/takeorder' },
        { title: 'Logout', src: logout },
    ];

    return (
        <div
            className={`fixed top-0 left-0 h-screen bg-purple-950 p-5 pt-8 z-50 transition-transform duration-300 ${open ? 'translate-x-0 w-15' : '-translate-x-full w-0'}`}
        >
            <BsArrowLeftShort
                className={`absolute cursor-pointer rounded-full ${!open ? "-right-10" : "-right-2"} md:top-9 top-4 w-7 h-7 border-2 border-purple-900 bg-white ${!open && 'rotate-180'}`}
                onClick={() => setOpen(!open)}
            />
            {/* Menu lists showing sidebar */}
            <ul className='pt-10'>
                {Menus.map((menu, index) => (
                    <li key={index} className="relative group">
                        <Link
                            to={menu.path}
                            className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md ${location.pathname === menu.path ? 'bg-light-white text-black' : ''}`}
                        >
                            <img src={menu.src} className='w-10 h-10' alt={menu.title} />
                        </Link>
                        <div className={`absolute left-full top-1/2 transform -translate-y-1/2 bg-gray-700 text-white text-xs rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                            {menu.title}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
