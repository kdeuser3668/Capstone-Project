import React from "react";
import { NavLink } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="main-content" style={{ backgroundColor: "#fff" }} >
        <h1 className="h1">PlannerPal Privacy Policy</h1>
        <p>Effective Date: November 19, 2025</p>
        <p>PlannerPal is committed to protecting the privacy of its users. This Privacy Policy outlines the types of information we collect, how we use and store that information, and the steps we take to safeguard user data.</p>
        <h3 className="h3">Eligibility</h3>
        <p>To comply with the Children's Online Privacy Protection Act (COPPA), users must confirm that they are at least 13 years of age before creating an account or using PlannerPal. Users under the age of 13 are not permitted to use the application.</p>
        <h3 className="h3">Information We Collect</h3>
        <p>PlannerPal collects limited personal information necessary to provide and improve the service. This may include name, email address, school affiliation, grade level, planner entries, and user preferences. We do not collect sensitive personal data such as financial information or government-issued identifiers.</p>
        <h3 className="h3">Use of Information</h3>
        <p>Collected data is used to personalize the user experience, support application functionality, and improve performance. PlannerPal does not sell user data to third parties. Data may be shared with trusted service providers only as necessary to operate the application and only under strict confidentiality agreements.</p>
        <h3 className="h3">Data Storage and Security</h3>
        <p>User data is stored securely using industry-standard encryption and access controls. Access to personal information is limited to authorized personnel who require it for support or maintenance purposes. We take reasonable measures to protect data from unauthorized access, disclosure, or destruction.</p>
        <h3 className="h3">Security Breach Notification</h3>
        <p>In the event of a data breach that compromises user information, PlannerPal will notify affected users as soon as reasonably possible. We will provide details of the breach, steps being taken to mitigate harm, and guidance on how users can protect themselves.</p>
        <h3 className="h3">User Consent</h3>
        <p>By creating an account and using PlannerPal, users confirm that they are at least 13 years old and agree to the terms outlined in this Privacy Policy. Continued use of the application constitutes acceptance of any updates to this policy.</p>
        <hr />
        <NavLink to="/">Return to Home</NavLink>
    </div>
    );
};

export default PrivacyPolicy;