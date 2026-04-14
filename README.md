# SMART PARCEL MANAGEMENT SYSTEM

## Project Overview
A professional, responsive web application for managing student parcel deliveries. The system features role-based access with separate interfaces for students and watchman/staff.

---

## 📁 File Structure
```
project/
├── frontend/
│   ├── index.html          (Student Search Page)
│   ├── dashboard.html      (Watchman Dashboard)
│   ├── list.html           (Watchman View All)
│   ├── handover.html       (Watchman Handover)
│   └── styles.css          
├── backend/                
│   ├── server.js           (Node.js API Engine)
│   ├── schema.sql          (MySQL Database Blueprint)
│   ├── package.json        (Dependencies)
│   └── .env                (Hidden DB Credentials)
└── README.md               (This File)

```## 🎯 Features

### STUDENT INTERFACE (index.html)
- **Search Page Only**: Limited access to search functionality
- Search by: Name, SAP ID, or Phone Number
- View parcel details in card format:
  - Parcel Number
  - Student Name & SAP ID
  - Phone Number
  - Status (Arrived/Delivered)
  - Source (Amazon/Flipkart/Myntra)
  - Arrival Date
- Simple, clean interface focused on search

### WATCHMAN INTERFACE (dashboard.html, list.html, handover.html)

#### Dashboard (dashboard.html)
- Add new parcels to the system
- Form fields:
  - Student Name
  - Phone Number
  - Source (Dropdown: Amazon, Flipkart, Myntra)
  - Delivery Person Name
- **Real-time statistics**:
  - Total Parcels Count (updates automatically)
  - Delivered Count (updates automatically)
  - Pending Count (updates automatically)
- Success confirmation message

#### Parcel List (list.html)
- View all parcels in a clean table format
- Table columns:
  - Parcel ID
  - Student Name
  - Phone Number
  - Source
  - Status (Color-coded badges)
  - Action Button
- Mark parcels as "Delivered" with one click
- **Real-time updates** without page reload
- **Persistent storage** - changes saved across sessions

#### Parcel Handover (handover.html) ⭐ **IMPORTANT**
- Search parcel by Parcel Number
- Displays parcel details:
  - Parcel Number
  - Student Name
  - Phone Number
  - Current Status
- "Confirm Handover" button
- Status automatically updates to "Delivered" after confirmation
- Success message with animation
- Button disables for already-delivered parcels
- **Persistent storage** - changes saved across sessions

---

## 💾 Data Persistence
- **MySQL Database**: All parcel data, student information, and delivery statuses are securely stored in a relational database.
- **RESTful API**: A custom Node.js/Express backend handles all data requests securely.
- **Real-time Sync**: The frontend fetches live data from the database, meaning if one watchman updates a parcel on their computer, it immediately updates for everyone else.
- **Sequential IDs**: Parcel numbers are generated dynamically by the backend.
---

## 🎨 Design Features

### Color Scheme
- **Primary Red**: #d32f2f (Header, Buttons, Accents)
- **Dark Red**: #c62828 (Navigation Bar)
- **White**: #ffffff (Background)
- **Light Gray**: #f5f5f5 (Page Background)

### UI Components
- ✓ Round-cornered input fields (8px border-radius)
- ✓ Card-based layout with shadows
- ✓ Hover effects on buttons (color change + lift effect)
- ✓ Color-coded status badges:
  - Green: Delivered
  - Yellow: Arrived
  - Red: Pending
- ✓ Responsive design (Mobile, Tablet, Desktop)
- ✓ Proper spacing and alignment
- ✓ Modern sans-serif font (Arial)

---

## 📱 Responsive Design
- **Desktop**: Full layout with optimal spacing
- **Tablet**: Adjusted columns and button sizing
- **Mobile**: Single-column layout, full-width inputs
- Hamburger-style navigation on smaller screens

---

## 🚀 How to Use

### For Students:
1. Open `index.html` in a web browser
2. Enter your Name, SAP ID, or Phone Number
3. Click "Search Parcel" or press Enter
4. View your parcel details

### For Watchman:
1. **Add Parcel**: Open `dashboard.html`, fill the form, click "Add Parcel"
2. **View All**: Open `list.html` to see the table of all parcels
3. **Handover**: Open `handover.html` to search and handover parcels
4. Navigate using the top navigation bar

---

## 💻 Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox & Grid
- **JavaScript (ES6)**: Interactive features (minimal, no external libraries)
- **Node.js & Express**: High-performance server environment and routing framework
- **MySQL**: Relational database for robust data management
- ** REST API**: Custom-built endpoints (GET, POST, PUT) for client-server communication
### JavaScript Features:
- Search functionality with filtering
- Dynamic table population
- Form submission handling
- Status updates without page reload
- Enter key support for search
- Success message animations

---
## 🚀 Installation & Setup

**1. Database Setup:**
- Open MySQL Workbench or XAMPP.
- Run the provided `schema.sql` file to automatically build the `parcel_management` database and tables.

**2. Backend Setup:**
- Open the terminal in the project folder.
- Run `npm install` to download dependencies (Express, MySQL2, CORS, Dotenv).
- Create a `.env` file and add your local database credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
- Run `node server.js` to start the backend API on port 3000.

**3. Frontend Setup:**
- Once the server is running, simply open any `.html` file in your browser to start using the system!
---


## 🔒 Security & Access Control
- **Role-Based UI**: Different interfaces for students and watchman
- **Student**: Access restricted to search only
- **Watchman**: Full system access (add, view, handover)
- No sensitive data exposed
- Client-side validation for forms

---

## ✨ Key Highlights
- ✅ Professional college-submission ready
- ✅ NO raw HTML visible on screen
- ✅ Proper file structure maintained
- ✅ Clean, organized code
- ✅ Fully responsive design
- ✅ Smooth animations and transitions
- ✅ User-friendly interface
- ✅ Real-time data updates
- ✅ Success/error messages
- ✅ Keyboard support (Enter key)

---

## 📋 Sample Test Data
The system comes with pre-populated sample data:
- 10 sample parcels
- Various sources (Amazon, Flipkart, Myntra)
- Mixed delivery statuses
- Real-looking names and phone numbers

---
## 🎓 College Submission Notes
This project is designed to be:
- Professional and presentable
- Easy to understand and navigate
- Suitable for a mini project submission
- Demonstrating HTML, CSS, and JavaScript best practices
- Responsive and mobile-friendly
- Well-structured and maintainable

---

## 📞 Contact Support
For any questions about this system, refer to the clean, readable code with inline comments.

---

**Created**: March 2026
**Version**: 1.0
**Status**: Ready for College Submission ✓
