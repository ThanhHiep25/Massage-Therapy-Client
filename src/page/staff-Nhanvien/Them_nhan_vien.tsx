import { TextField } from "@mui/material";
import { useState } from "react";


const ThemMoiNV: React.FC = () => {

    const [name , setName]= useState("");
    const [email, setEmail]= useState("");
    return(
        <div className="flex flex-col items-center">
            <div className="">
                <h2 className="text-2xl text-gray-800">Thêm mới nhân viên</h2>
                {/* Form */}
                <form action="" method="POST">
                    <TextField label="Tên" name="name" value={name} fullWidth margin="normal" variant="outlined" />
                    <TextField label="Email" name="email" value={email} fullWidth margin="normal" variant="outlined" /> 
                    <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">Thêm nhân viên</button>
                </form>
                {/*... */}
            </div>
        </div>
    )
}


export default ThemMoiNV;