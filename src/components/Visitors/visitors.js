import React, {useState} from "react";
import VisitorTable from "./VisitorTable";
import AddVisitor from "../AddVisitors/addvisitors";
const Visitors = () => {
    const [activeTab, setActiveTab] = useState('Visitors');
    const [data, setData] = useState([
        {
            "id": 1,
            "visitorName": "John Doe",
            "crftNo": "A123456",
            "createTime": "2024-09-01T09:30:00",
            "exitTime": "2024-09-01T10:30:00",
            "email": "john.doe@example.com",
            "phoneNo": "1234567890",
            "visitingDepartment": "IT",
            "host": "Jane Smith",
            "visitingReason": "System Maintenance",
            "carryingGoods": "Laptop",
            "image": "image1.jpg"
        },
        {
            "id": 2,
            "visitorName": "Emily Clark",
            "crftNo": "B234567",
            "createTime": "2024-09-01T10:00:00",
            "exitTime": "2024-09-01T11:15:00",
            "email": "emily.clark@example.com",
            "phoneNo": "0987654321",
            "visitingDepartment": "HR",
            "host": "Tom Brown",
            "visitingReason": "Interview",
            "carryingGoods": "Documents",
            "image": "image2.jpg"
        },
        {
            "id": 3,
            "visitorName": "Michael Green",
            "crftNo": "C345678",
            "createTime": "2024-09-02T08:45:00",
            "exitTime": "2024-09-02T09:45:00",
            "email": "michael.green@example.com",
            "phoneNo": "5678901234",
            "visitingDepartment": "Finance",
            "host": "Emma Davis",
            "visitingReason": "Meeting",
            "carryingGoods": "None",
            "image": "image3.jpg"
        },
        {
            "id": 4,
            "visitorName": "Sarah Johnson",
            "crftNo": "D456789",
            "createTime": "2024-09-02T09:20:00",
            "exitTime": "2024-09-02T10:15:00",
            "email": "sarah.johnson@example.com",
            "phoneNo": "3456789012",
            "visitingDepartment": "Marketing",
            "host": "Robert Wilson",
            "visitingReason": "Presentation",
            "carryingGoods": "USB Drive",
            "image": "image4.jpg"
        },
        {
            "id": 5,
            "visitorName": "David Lee",
            "crftNo": "E567890",
            "createTime": "2024-09-02T11:00:00",
            "exitTime": "2024-09-02T12:00:00",
            "email": "david.lee@example.com",
            "phoneNo": "2345678901",
            "visitingDepartment": "IT",
            "host": "Megan Taylor",
            "visitingReason": "Software Installation",
            "carryingGoods": "External Hard Drive",
            "image": "image5.jpg"
        },
        {
            "id": 6,
            "visitorName": "Karen White",
            "crftNo": "F678901",
            "createTime": "2024-09-03T10:45:00",
            "exitTime": "2024-09-03T11:45:00",
            "email": "karen.white@example.com",
            "phoneNo": "6789012345",
            "visitingDepartment": "R&D",
            "host": "James King",
            "visitingReason": "Research Discussion",
            "carryingGoods": "Documents",
            "image": "image6.jpg"
        },
        {
            "id": 7,
            "visitorName": "Chris Brown",
            "crftNo": "G789012",
            "createTime": "2024-09-03T09:30:00",
            "exitTime": "2024-09-03T10:30:00",
            "email": "chris.brown@example.com",
            "phoneNo": "9876543210",
            "visitingDepartment": "Sales",
            "host": "Sophia Moore",
            "visitingReason": "Client Meeting",
            "carryingGoods": "Presentation Material",
            "image": "image7.jpg"
        },
        {
            "id": 8,
            "visitorName": "Patricia Miller",
            "crftNo": "H890123",
            "createTime": "2024-09-03T11:15:00",
            "exitTime": "2024-09-03T12:15:00",
            "email": "patricia.miller@example.com",
            "phoneNo": "7654321098",
            "visitingDepartment": "Admin",
            "host": "Paul Anderson",
            "visitingReason": "Contract Signing",
            "carryingGoods": "None",
            "image": "image8.jpg"
        },
        {
            "id": 9,
            "visitorName": "George Thomas",
            "crftNo": "I901234",
            "createTime": "2024-09-04T09:15:00",
            "exitTime": "2024-09-04T10:15:00",
            "email": "george.thomas@example.com",
            "phoneNo": "4567890123",
            "visitingDepartment": "IT",
            "host": "Linda Robinson",
            "visitingReason": "System Upgrade",
            "carryingGoods": "Laptop",
            "image": "image9.jpg"
        },
        {
            "id": 10,
            "visitorName": "Sophia Hall",
            "crftNo": "J012345",
            "createTime": "2024-09-04T08:30:00",
            "exitTime": "2024-09-04T09:30:00",
            "email": "sophia.hall@example.com",
            "phoneNo": "6543210987",
            "visitingDepartment": "Finance",
            "host": "Richard Clark",
            "visitingReason": "Audit",
            "carryingGoods": "Documents",
            "image": "image10.jpg"
        },
        {
            "id": 11,
            "visitorName": "Thomas Scott",
            "crftNo": "K123456",
            "createTime": "2024-09-05T09:45:00",
            "exitTime": "2024-09-05T10:45:00",
            "email": "thomas.scott@example.com",
            "phoneNo": "7658901234",
            "visitingDepartment": "HR",
            "host": "Natalie Carter",
            "visitingReason": "New Hire Orientation",
            "carryingGoods": "ID Badge",
            "image": "image11.jpg"
        },
        {
            "id": 12,
            "visitorName": "Olivia Adams",
            "crftNo": "L234567",
            "createTime": "2024-09-05T10:00:00",
            "exitTime": "2024-09-05T11:00:00",
            "email": "olivia.adams@example.com",
            "phoneNo": "2345678901",
            "visitingDepartment": "IT",
            "host": "Harry Allen",
            "visitingReason": "Security Patch",
            "carryingGoods": "USB Drive",
            "image": "image12.jpg"
        },
        {
            "id": 13,
            "visitorName": "Daniel Turner",
            "crftNo": "M345678",
            "createTime": "2024-09-05T11:30:00",
            "exitTime": "2024-09-05T12:30:00",
            "email": "daniel.turner@example.com",
            "phoneNo": "3456789012",
            "visitingDepartment": "Admin",
            "host": "Barbara Collins",
            "visitingReason": "Supplies Delivery",
            "carryingGoods": "Stationery",
            "image": "image13.jpg"
        },
        {
            "id": 14,
            "visitorName": "Ella Hernandez",
            "crftNo": "N456789",
            "createTime": "2024-09-06T09:45:00",
            "exitTime": "2024-09-06T10:45:00",
            "email": "ella.hernandez@example.com",
            "phoneNo": "5678901234",
            "visitingDepartment": "Sales",
            "host": "Emily Hughes",
            "visitingReason": "Sales Presentation",
            "carryingGoods": "Presentation Material",
            "image": "image14.jpg"
        },
        {
            "id": 15,
            "visitorName": "Joshua Phillips",
            "crftNo": "O567890",
            "createTime": "2024-09-06T10:30:00",
            "exitTime": "2024-09-06T11:30:00",
            "email": "joshua.phillips@example.com",
            "phoneNo": "7890123456",
            "visitingDepartment": "IT",
            "host": "Mia Wright",
            "visitingReason": "Network Configuration",
            "carryingGoods": "Laptop",
            "image": "image15.jpg"
        },
        {
            "id": 16,
            "visitorName": "Grace Evans",
            "crftNo": "P678901",
            "createTime": "2024-09-06T11:00:00",
            "exitTime": "2024-09-06T12:00:00",
            "email": "grace.evans@example.com",
            "phoneNo": "8901234567",
            "visitingDepartment": "HR",
            "host": "Steven Martin",
            "visitingReason": "Employee Wellness Program",
            "carryingGoods": "Brochures",
            "image": "image16.jpg"
        }
    ])
    return (
        <div>
        {activeTab === 'Visitors' ? (
            <VisitorTable data={data} setData={setData} setActiveTab={setActiveTab} />
        ) : (
            <AddVisitor setData={setData} setActiveTab={setActiveTab} data={data} />
        )}
    </div>
    );
};

export default Visitors;
