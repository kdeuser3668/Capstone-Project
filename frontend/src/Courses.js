import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

const backendUrl = "http://localhost:5050"; // hits local backend, will be changed in deployment

export function Courses({showPopup, setShowPopup, saveCourse, editingCourse, deleteCourse}){

    const [course_name, setCourseName] = useState("");
    const [course_code, setCourseCode] = useState("");
    const [instructor_name, setInstructorName] = useState("");
    const [course_semester, setCourseSemester] = useState("");

    useEffect(() => {
        if (editingCourse){
            setCourseName(editingCourse.course_name);
            setCourseCode(editingCourse.course_code);
            setInstructorName(editingCourse.instructor_name);
            setCourseSemester(editingCourse.course_semester);
        }else{
            setCourseName("");
            setCourseCode("");
            setInstructorName("");
            setCourseSemester("");
        }
    }, [editingCourse])
    
    async function handleSave(){
        const courseData = {
            id: editingCourse ? editingCourse.id : undefined,
            course_name, 
            course_code, 
            instructor_name, 
            course_semester
        };
        
        await saveCourse(courseData);
    }

    //setCourseName("");
    //setCourseCode("");
    //setInstructorName("");
    //setCourseSemester("");

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
                    <h3 style={{ textAlign:"center" }}>{ editingCourse ? "Edit Course" : "Add Course"}</h3>
                    <input placeholder="Course Name" value={course_name} onChange={(e) => setCourseName(e.target.value)}/>
                    <br />
                    <input placeholder="Course Code" value={course_code} onChange={(e) => setCourseCode(e.target.value)}/>
                    <br />
                    <input placeholder="Instructor's Name" value={instructor_name} onChange={(e) => setInstructorName(e.target.value)}/>
                    <br />
                    <input placeholder="Semester" value={course_semester} onChange={(e) => setCourseSemester(e.target.value)}/>
                    <br />
                    <button className="button" style={{margin: ".5rem"}} onClick={handleSave}>Save</button>

                    <button className="button" style={{margin: ".5rem"}} onClick={() => setShowPopup(false)}>Cancel</button>

                    {editingCourse && ( <button className="button" style={{ marginTop: "1rem", padding: ".5rem" }} onClick={() => deleteCourse(editingCourse.id)}>Delete</button>)}
                
                </div>
            )}
        </div>
    </div>
    );

};

export default Courses;
