import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

const backendUrl = "https://plannerpal-ex34i.ondigitalocean.app/capstone-project-backend";

export function Courses({showPopup, setShowPopup, saveCourse, editingCourse, deleteCourse}){

    const [course_name, setCourseName] = useState("");
    const [course_code, setCourseCode] = useState("");
    const [instructor_name, setInstructorName] = useState("");
    const [course_semester, setCourseSemester] = useState("");
    const [color_code, setColorCode] = useState("#a7d0fb"); // default color


    useEffect(() => {
        if (editingCourse){
            setCourseName(editingCourse.course_name);
            setCourseCode(editingCourse.course_code);
            setInstructorName(editingCourse.instructor_name);
            setCourseSemester(editingCourse.course_semester);
            setColorCode(editingCourse.color_code || "#a7d0fb");
        }else{
            setCourseName("");
            setCourseCode("");
            setInstructorName("");
            setCourseSemester("");
            setColorCode("#a7d0fb");
        }
    }, [editingCourse])
    
    async function handleSave(){
        if (
            !course_name.trim() ||
            !course_code.trim() ||
            !instructor_name.trim() ||
            !course_semester.trim()
        ) {
            alert("All fields are required");
            return;
        } 

        const courseData = {
            id: editingCourse ? editingCourse.id : undefined,
            course_name, 
            course_code, 
            instructor_name, 
            course_semester,
            color_code
        };
        
        // colorcode testing
        console.log("COURSE POPUP SENDS:", courseData);

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
                    <input placeholder="Course Name" value={course_name} style={{borderWidth: "1px", borderColor: "#abababff", textAlign: "center", padding: "2px", fontSize: "15px", borderRadius: "4px", width: "auto", margin: "2px"}} onChange={(e) => setCourseName(e.target.value)}/>
                    <br />
                    <input placeholder="Course Code" value={course_code} style={{borderWidth: "1px", borderColor: "#abababff", textAlign: "center", padding: "2px", fontSize: "15px", borderRadius: "4px", width: "auto", margin: "2px"}} onChange={(e) => setCourseCode(e.target.value)}/>
                    <br />
                    <input placeholder="Instructor's Name" value={instructor_name} style={{borderWidth: "1px", borderColor: "#abababff", textAlign: "center", padding: "2px", fontSize: "15px", borderRadius: "4px", width: "auto", margin: "2px"}} onChange={(e) => setInstructorName(e.target.value)}/>
                    <br />
                    <input placeholder="Semester" value={course_semester} style={{borderWidth: "1px", borderColor: "#abababff", textAlign: "center", padding: "2px", fontSize: "15px", borderRadius: "4px", width: "auto", margin: "2px"}} onChange={(e) => setCourseSemester(e.target.value)}/>
                    <br />
                    <input type="color" value={color_code} style={{borderWidth:"1px", borderColor:"#abababff", padding:"2px", width:"50px", height:"30px", margin:"2px"}} onChange={e => setColorCode(e.target.value)}/>
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
