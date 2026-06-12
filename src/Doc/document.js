/*backend
•	models / schemas → database tables 
•	routes → API URLs 
•	controllers → logic 
•	server.js / app.js → backend start point
frontend
•	components → UI parts 
•	pages → main screens 
•	Auth.js → login / user role / token 
•	App.js → routes / pages connection
CRUD
Create → POST
View / List → GET
Update → PUT
Delete → DELETE

useState → store values
Yup → validation









submit flow(Create New)
User fills form
 ↓
Clicks Submit button
 ↓
React onSubmit function runs
 ↓
Frontend sends data using fetch / axios
 ↓
Express API route receives data
 ↓
Backend validates / checks data
 ↓
Mongoose model saves data
 ↓
MongoDB stores data
 ↓
Backend sends success / error response
 ↓
Frontend shows message or redirects

User fills form, Clicks Submit button
    < form onSubmit = { submitUser } >
<input
type="text"
placeholder="Enter name"
onChange={(e) => setName(e.target.value)}
/>

<input
type="email"
placeholder="Enter email"
onChange={(e) => setEmail(e.target.value)}
/>

<button type="submit">Submit</button>
</form >
    React onSubmit function runs
registerUser is the function that executes when the form is submitted.async allows waiting for backend operations, e represents the submit event, and preventDefault() prevents the browser's default behavior of refreshing the page.

const registerUser = async (e) => {
    e.preventDefault();
}

Frontend sends data using fetch
await fetch("http://localhost:5001/users/register", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name: name,
        email: email,
        password: password,
    }),
});

Express API route receives data => Routes
router.post("/register", async (req, res) => {
    console.log(req.body);
});

Backend validates / checks data => Routes
if (!req.body.name || !req.body.email || !req.body.password) {
    return res.json({ error: "All fields are required" });
}

Mongoose model saves data => Schema
const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
});
MongoDB stores data

Backend sends success / error response
res.json({
    message: "User registered successfully",
    data: user,
});

Frontend shows message or redirects
const data = await res.json();
if (data.error) {
    alert(data.error);
} else {
    alert("User registered successfully");
}

Update

Frontend update function
const updateUser = async (e) => {
    e.preventDefault();

    const updatedData = {
        id: userId,
        name: name,
        email: email,
        tel: tel,
    };

    const res = await fetch("http://localhost:5001/users/register", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    });

    const data = await res.json();

    if (data.error) {
        alert(data.error);
    } else {
        alert("User updated successfully");
    }
};

Backend route => Routes
router.put("/register", async function (req, res) {
    // Finds the user in MongoDB and updates the details
    const updatedUser = await User.findByIdAndUpdate(
        { _id: req.body.id },
        {
            name: req.body.name,
            email: req.body.email,
            tel: req.body.tel,
        },
        { new: true }
    );

    res.json(updatedUser);
});

Show number of members in Public, Private, Academic, Association
Take users from db
↓
Separate by sector
↓
Count each group
↓
Send result to frontend

Backend route — UserRoutes.js
router.get("/stats", async function (req, res) {
    const publicCount = await User.find({ sector: "Public" });
    const privateCount = await User.find({ sector: "Private" });
    const academicCount = await User.find({ sector: "Academic" });
    const associationCount = await User.find({ sector: "Association" });

    res.json({
        Public: publicCount.length,
        Private: privateCount.length,
        Academic: academicCount.length,
        Association: associationCount.length,
    });
});

Frontend
import React, { useEffect, useState } from "react";

function Dashboard() {
    // stats → stores numbers , setStats → updates numbers, At first, all values are 0
    const [stats, setStats] = useState({
        Public: 0,
        Private: 0,
        Academic: 0,
        Association: 0,
    });

    // When dashboard opens, call loadStats(). [] means run only one time when page loads
    useEffect(() => {
        loadStats();
    }, []);

    // loads member counts from backend
    const loadStats = async () => {
        const res = await fetch("http://localhost:5001/users/stats");
        // converts backend response into JavaScript object
        const data = await res.json();
        // saves backend result into stats
        setStats(data);
    };

    return (
        <div>
            <h2>Member Count by Sector</h2>

            <div>Public Members: {stats.Public}</div>
            <div>Private Members: {stats.Private}</div>
            <div>Academic Members: {stats.Academic}</div>
            <div>Association Members: {stats.Association}</div>
        </div>
    );
}

export default Dashboard;

Count members of each sector of selected meeting

Backend => EventRoutes.js
router.get("/:id", async (req, res) => {
    const meeting = await Event.findById(req.params.id);
    res.json(meeting);
});

Frontend =>
    EventDetails.js

function MeetingDetails() {
    // Stores the meeting selected/opened by the user
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    // This function runs when user clicks a meeting
    const openMeeting = async (id) => {
        // Call backend API using selected meeting ID
        const res = await fetch(`http://localhost:5001/events/${id}`);

        // Convert backend response to JSON
        const data = await res.json();

        // Save selected meeting details into state
        setSelectedMeeting(data);
    };

    // Get members from selected meeting
    // If no meeting is selected yet, use empty array []
    const members = selectedMeeting?.members || [];

    // Count members by sector
    const publicCount = members.filter((m) => m.sector === "Public").length;
    const privateCount = members.filter((m) => m.sector === "Private").length;
    const academicCount = members.filter((m) => m.sector === "Academic").length;
    const associationCount = members.filter(
        (m) => m.sector === "Association"
    ).length;

    return (
        <div>
            <h2>Meeting Details</h2>

            Example button to open selected meeting
            <button onClick={() => openMeeting("69ea2654b9ddfb0899f353ee")}>
                Open Meeting
            </button>

            Show meeting name if selected 
            {selectedMeeting && <h3>{selectedMeeting.name}</h3>}

            Show sector counts 
            <div>Public Members: {publicCount}</div>
            <div>Private Members: {privateCount}</div>
            <div>Academic Members: {academicCount}</div>
            <div>Association Members: {associationCount}</div>
        </div>
    );
}

export default MeetingDetails;



Console show when Button Clicked
import React from "react";
import Auth from "../authentication/Auth";

function TestButton() {
    const handleTestClick = () => {
        console.log(`${Auth.getUserName()} clicked`);
    };

    return (
        <div>
            <button onClick={handleTestClick}>
                Test
            </button>
        </div>
    );
}

export default TestButton;

Insert a table and load meeting details
import React, { useEffect, useState } from "react";

function MeetingTable() {
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/events/all/`);
            const data = await res.json();

            setMeetings(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Meeting Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Venue</th>
                    <th>Development Area</th>
                </tr>
            </thead>

            <tbody>
                {meetings.map((meeting, index) => (
                    <tr key={meeting._id}>
                        <td>{index + 1}</td>
                        <td>{meeting.name}</td>
                        <td>{meeting.date}</td>
                        <td>{meeting.time}</td>
                        <td>{meeting.venue}</td>
                        <td>{meeting.sector}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default MeetingTable;





Even without sending data from frontend, prove the DB field exists
availableUsers: {
    type: [
        {
            userId: String,
            userName: String,
        }
    ],
  default: []
}

If you do not pass data from button to backend, admin cannot see real clicked users.But for viva / pass purpose, you can show the admin list using data already added manually in DB.
In MongoDB Compass, manually add this field inside one meeting document:
availableUsers: [
    {
        userId: "123",
        userName: "Kamal Perera"
    },
    {
        userId: "456",
        userName: "Nimal Silva"
    }
]

Then in Admin meeting details screen:
{
    Auth.getUserRole() === "Admin" && (
        <div>
            <h5>Available Members</h5>

            {props.event.availableUsers?.length > 0 ? (
                props.event.availableUsers.map((user) => (
                    <p key={user.userId}>{user.userName}</p>
                ))
            ) : (
                <p>No available members yet</p>
            )}
        </div>
    )
} 
*/