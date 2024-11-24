import React, { useCallback, useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../Enrollment/Department/department.css";
import axios from "axios";
import ConirmationModal from "../Modal/conirmationModal";
import addAnimation from "../../assets/Lottie/addAnim.json";
import updateAnimation from "../../assets/Lottie/updateAnim.json";
import deleteAnimation from "../../assets/Lottie/deleteAnim.json";
import successAnimation from "../../assets/Lottie/successAnim.json";
import warningAnimation from "../../assets/Lottie/warningAnim.json";
import { SERVER_URL } from "../../config";
import ShiftManagementTable from "./ShiftManagementTable";

const ShiftsTable = () => {


  return (
    <>
    <ShiftManagementTable/>
    </>
  );
};

export default ShiftsTable;
