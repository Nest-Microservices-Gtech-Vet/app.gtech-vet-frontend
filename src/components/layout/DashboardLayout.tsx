import { useState } from "react";
import Sidebar from "./Sidebar";
import UserList from "../users/UserList";

const DashboardLayout = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="div">
            <UserList/>
        </div>
    );
};

export default DashboardLayout;
