import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

export function Courses({showPopup, setShowPopup}){

    const [course_name, setCourseName] = useState("");
    const [course_code, setCourseCode] = useState("");
    const [instructor_name, setInstructorName] = useState("");
    const [course_semester, setCourseSemester] = useState("");

    const [courseId, setCourseId] = useState(1);
    const [courses, setCourses] = useState([]);
    //const [showPopup, setShowPopup] = useState(false);

    const addCourse = () => {
        const newCourse = {
            course_name, 
            course_code, 
            instructor_name, 
            course_semester
        };

        setCourses([...courses, newCourse]);
        setCourseId(courseId + 1);
        setShowPopup(false);

        setCourseName("");
        setCourseCode("");
        setInstructorName("");
        setCourseSemester("");
    };
    if (!showPopup) return null;

    return(
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(51, 41, 41, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div className="card" style={{padding:"3rem"}}>
            {showPopup && (
                <div>
                    <h3 style={{ textAlign:"center" }}>Add Course</h3>
                    <input placeholder="Course Name" value={course_name} onChange={(e) => setCourseName(e.target.value)}/>
                    <br />
                    <input placeholder="Course Code" value={course_code} onChange={(e) => setCourseCode(e.target.value)}/>
                    <br />
                    <input placeholder="Instructor's Name" value={instructor_name} onChange={(e) => setInstructorName(e.target.value)}/>
                    <br />
                    <input placeholder="Semester" value={course_semester} onChange={(e) => setCourseSemester(e.target.value)}/>
                    <br />
                    <button className="button" style={{margin: ".5rem"}} onClick={addCourse}>Save</button>
                    <button className="button" style={{margin: ".5rem"}} onClick={() => setShowPopup(false)}>Cancel</button>
                </div>
            )}
        </div>
    </div>
    );

};

export default Courses;
