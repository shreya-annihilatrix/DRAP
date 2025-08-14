import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import AdminHome from "./components/AdminHome";
import VolunteerHome from "./components/VolunteerHome";
import PublicHome from "./components/PublicHome";

import ProfilePage from "./components/ProfilePage";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";

import VolunteerProfilePage from "./components/VolunteerProfilePage";
import VolunteerEditProfile from "./components/EditProfileVolunteer";
import VolunteerChangePassword from "./components/ChangePasswordVolunteer";

import PublicProfilePage from "./components/PublicProfilePage";
import PublicEditProfile from "./components/EditProfilePublic";
import ChangePasswordPublic from "./components/ChangePasswordPublic";

import AdminSkills from "./components/AdminSkills";
import AdminApprovalPage from "./components/AdminApprovalPage";
import VolunteerAccepted from "./components/VolunteerAccepted";
import VolunteerRejected from "./components/VolunteerRejected";
import AdminReportIncident from "./components/AdminReportIncident";
import ReportIncident from "./components/ReportIncident";
import MyIncidentReports from "./components/MyIncidentReports";
import VerifyPublicReports from "./components/VerifyPublicReports";
import OngoingIncidents from "./components/OngoingIncidents";
import CompletedIncidents from "./components/CompletedIncidents";
import AdminIncidentPage from "./components/IncidentPageAdmin";
import AddShelter from "./components/AddShelter";
import ViewShelterAdmin from "./components/ViewShelterAdmin";
import ViewAssignedShelters from "./components/ViewAssignedShelters";
import AcceptedShelters from "./components/AcceptedSheltersVolunteer";
import AddInmates from "./components/AddInmates";
import { UserProvider } from "./context/UserContext";
import TaskManagement from './components/TaskManagement';
import ResourceTypeForm from "./components/ResourceTypeForm";
import TaskTypeForm from "./components/TaskTypeForm";
import AdminTaskView from './components/AdminTaskView';
import VolunteerTaskView from "./components/VolunteerTaskView";
import AcceptedTasksView from "./components/AcceptedTaskView";
import MarkProgressForm from "./components/MarkProgressForm";
import VolunteerCompletedTasks from './components/VolunteerCompletedTasks';
import CampaignPage from './components/AddCampaign';
import AdminCompletedTasksView from './components/AdminCompletedTaskView';
import ViewCampaigns from "./components/ViewCampaignPublic";
import MakeDonation from "./components/MakeDonation";
import MyDonations from "./components/MyDonationsPublic";
import AdminCampaignDonationsView from "./components/AdminDonationsView";
import AdminResourceAllocation from "./components/AdminResourceAllocation";
import ViewAllocatedResources from "./components/ViewAllocatedResources";
import ViewAllocatedResourcesVolunteer from "./components/ViewAllocatedResourcesVolunteer";
import AddContributedResource from "./components/AddContributedResource";
import ViewUserContributions from "./components/PublicResourceContributions";
import VerifyContributions from "./components/VerifyContributionVolunteer";
import AdminContributions from "./components/ViewContributionsAdmin";
import AddResourceUsage from "./components/AddResourceUsage";
import ViewResourceUsageShelterOwner from "./components/ViewResourceUsage";
import AdminViewResourceUsage from "./components/ViewResourceUsageAdmin";
import DonationAllocation from "./components/DonationAllocationAdmin";
import DonationUsageReport from "./components/DonationUsageReport";
import IndexPage from "./components/IndexPage";
import VolunteerFeedbackView from "./components/ViewFeedbackVolunteer";
import ReportComplaint from "./components/ReportComplaint";
import ViewComplaints from "./components/ViewComplaintStatus";
import AdminComplaintManagement from "./components/AdminComplaintManagement";
import IncidentReportsPage from "./components/IncidentReportsPage";
import TaskProgressReport from "./components/TaskProgressReport";
import SubmitComplaintPublic from "./components/SubmitComplaintPublic";




import AdminVolunteerPage from "./components/VolunteerManagement";
import AdminShelterPage from "./components/AdminShelterManagement";
import AdminTaskPage from "./components/AdminTaskManagement";
import AdminResourcePage from "./components/AdminResourceManagement";
import AdminDonationPage from "./components/AdminDonationManagement";
import AdminAccountPage from "./components/AdminAccountSettings";
import VolunteerShelterManagement from "./components/ShelterManagementVolunteer";
import VolunteerTaskManagement from "./components/VolunteerTaskManagement";
import VolunteerResourceUsage from "./components/VolunteerResourceManagement";
import VolunteerCompFeed from "./components/ComplaintFeedbackVolunteer";
import VolunteerAccountSettings from "./components/VolunteerAccountSettings";
import IncidentReport from "./components/IncidentReportPage";
import DonationPage from "./components/DonationPage";
import ContributionPage from "./components/ContributionPage";
import ComplaintPublic from "./components/ComplaintPublic";
import PublicAccount from "./components/PublicAccount";

import ViewComplaintpublic from "./components/ViewComplaintPublic";

//import FeedbackModal from "./components/FeedbackAdmin";
function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/volunteer-home" element={<VolunteerHome />} />
        <Route path="/public-home" element={<PublicHome />} />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/public/profile" element={<PublicProfilePage />} />
        <Route path="/public/edit-profile" element={<PublicEditProfile />} />
        <Route path="/public/change-password" element={<ChangePasswordPublic />} />

        <Route path="/volunteer/profile" element={<VolunteerProfilePage />} />
        <Route path="/volunteer/edit-profile" element={<VolunteerEditProfile />} />
        <Route path="/volunteer/change-password" element={<VolunteerChangePassword />} />


        <Route path="/admin-skills" element={<AdminSkills />} />
        <Route path="/admin-approval" element={<AdminApprovalPage />} />
        <Route path="/volunteer-accepted" element={<VolunteerAccepted />} />
        <Route path="/volunteer-rejected" element={<VolunteerRejected />} />
        <Route path="/admin-incident-page" element={<AdminIncidentPage />} />
        <Route path="/admin-incident-page/admin-report-incident" element={<AdminReportIncident />} />
        <Route path="/report-incident" element={<ReportIncident />} />
        <Route path="/my-incidents" element={<MyIncidentReports />} />
        <Route path="/admin-incident-page/verify-public" element={<VerifyPublicReports />} />
        <Route path="/admin-incident-page/ongoing-incident" element={<OngoingIncidents />} />
        <Route path="/admin-incident-page/completed-incident" element={<CompletedIncidents />} />
        <Route path="/admin/add-shelter" element={<AddShelter />}/>
        <Route path="/admin/view-shelter-admin" element={<ViewShelterAdmin />}/>
        <Route path="/assigned-shelters" element={<ViewAssignedShelters />} />
        <Route path="/accepted-shelters" element={<AcceptedShelters />} />
        <Route path="/add-inmates/:shelterId" element={<AddInmates />} />
        <Route path="/admin/task-management" element={<TaskManagement />} />
        <Route path="/admin/resource-type" element={<ResourceTypeForm />} />
        <Route path="/admin/task-type" element={<TaskTypeForm />} />
        <Route path="/admin/tasks" element={<AdminTaskView />} />
        <Route path="/volunteer/tasks" element={<VolunteerTaskView />} />
        <Route path="/volunteer/accepted-task" element={<AcceptedTasksView />} />
        <Route path="/volunteer/progress-form" element={<MarkProgressForm />} />
        <Route path="/volunteer/completed-tasks" element={<VolunteerCompletedTasks />} />
        <Route path="/admin/completed-tasks" element={<AdminCompletedTasksView />} />
        <Route path="/admin/campaign-page" element={<CampaignPage />} />
        <Route path="/public/view-campaign" element={<ViewCampaigns />} />
        <Route path="/public/make-donation/:campaignId" element={<MakeDonation />} />
        <Route path="/public/my-donation" element={<MyDonations />} />
        <Route path="/admin/donation-view" element={<AdminCampaignDonationsView />} />
        <Route path="/admin/resource-allocation" element={<AdminResourceAllocation />} />
        <Route path="/admin/view-allocated" element={<ViewAllocatedResources />} />
        <Route path="/volunteer/view-allocated" element={<ViewAllocatedResourcesVolunteer />} />
        <Route path="/public/contribute-res" element={<AddContributedResource />} />
        <Route path="/public/view-contribute" element={<ViewUserContributions />} />
        <Route path="/volunteer/verify-contribute" element={<VerifyContributions />} />
        <Route path="/Admin/view-contribute" element={<AdminContributions />} />
        <Route path="/volunteer/res-usage" element={<AddResourceUsage />} />
        <Route path="/volunteer/res-usage-details" element={<ViewResourceUsageShelterOwner />} />
        <Route path="/admin/res-usage-details" element={<AdminViewResourceUsage />} />
        <Route path="/admin/donation-alloc" element={<DonationAllocation />} />
        <Route path="/admin/donation-report" element={<DonationUsageReport />} />
        {/* <Route path="/admin/donation-report" element={<FeedbackModal />} /> */}
        <Route path="/volunteer/feedback-view" element={<VolunteerFeedbackView />} />
        <Route path="/user/complaint" element={<ReportComplaint />} />
        <Route path="/user/view-complaint" element={<ViewComplaints />} />
        <Route path="/admin/view-complaint" element={<AdminComplaintManagement />} />
        <Route path="/admin/incident-reports" element={<IncidentReportsPage />} />
        <Route path="/admin/progress-reports" element={<TaskProgressReport />} />





        <Route path="/admin/volunteer-page" element={<AdminVolunteerPage />} />
        <Route path="/admin/shelter-page" element={<AdminShelterPage />} />
        <Route path="/admin/task-page" element={<AdminTaskPage />} />
        <Route path="/admin/resource-page" element={<AdminResourcePage />} />
        <Route path="/admin/donation-page" element={<AdminDonationPage />} />
        <Route path="/admin/account" element={<AdminAccountPage />} />
        <Route path="/volunteer/sm" element={<VolunteerShelterManagement />} />
        <Route path="/volunteer/tm" element={<VolunteerTaskManagement />} />
        <Route path="/volunteer/rum" element={<VolunteerResourceUsage />} />
        <Route path="/volunteer/cf" element={<VolunteerCompFeed />} />
        <Route path="/volunteer/as" element={<VolunteerAccountSettings />} />
        <Route path="/public/increp" element={<IncidentReport />} />
        <Route path="/public/don" element={<DonationPage />} />
        <Route path="/public/cont" element={<ContributionPage />} />
        <Route path="/public/compl" element={<ComplaintPublic />} />
        <Route path="/public/acnt" element={<PublicAccount />} />
        <Route path="/public/acnt" element={<PublicAccount />} />

        <Route path="/public/complaint" element={<SubmitComplaintPublic />} />
        <Route path="/public/view-complaint" element={<ViewComplaintpublic />} />


        






        
        

        

        

        


        

        


        

      
        

        













        











      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
