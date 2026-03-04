import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ onSelectContent }) => {
    return (
        <nav className="bg-gray-800 text-white h-screen">
            <div className="p-4">
                <ul>
                    <li className="my-2">
                        <Link
                            to="/dashboard/history"
                            onClick={() => onSelectContent('/dashboard/history')}
                            className="block py-2 px-4 hover:bg-gray-700"
                        >
                            Order History
                        </Link>
                    </li>
                    <li className="my-2">
                        <Link
                            to="/dashboard/revenue"
                            onClick={() => onSelectContent('/dashboard/revenue')}
                            className="block py-2 px-4 hover:bg-gray-700"
                        >
                            Revenue
                        </Link>
                    </li>
                    <li className="my-2">
                        <Link
                            to="/dashboard/booklistadmin"
                            onClick={() => onSelectContent('/dashboard/booklistadmin')}
                            className="block py-2 px-4 hover:bg-gray-700"
                        >
                            Book List
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Sidebar;
