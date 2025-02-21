// import { useEffect, useState } from "react";
// import { apiFetch } from "../../services/api";

// const UserList = () => {
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             const data = await apiFetch("/users");
//             setUsers(data);
//             console.log(`LOS DATOS ${data}`)
//         };
//         fetchUsers();
//     }, []);

//     return (
//         <ul>
//             {users.map((user) => (
//                 <li key={user.usu}>{user.usua_nombre}</li>
//             ))}
//         </ul>
//     );
// };

// export default UserList;
