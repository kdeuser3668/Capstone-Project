import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

export function Courses(){
    const [course_name, setCourseName] = useState("")
    const [course_code, setCourseCode] = useState("")
    const [instructor_name, setInstructorName] = useState("")
    const [course_semester, setCourseSemester] = useState("")
    const [courseId, setCourseId] = useState()

    const newCourse = {course_name, course_code, instructor_name, course_semester}



    return(
        <h3>{username || "User"}'s Courses</h3>
        
    );
};

export default Courses;
