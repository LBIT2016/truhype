import React from 'react';
import PropTypes from "prop-types";
import ReactGA from "react-ga";
import { Switch } from "react-router-dom";

import './semantic/dist/semantic.min.css';

import GuestRoute from "./routes/GuestRoute";
import UserRoute from "./routes/UserRoute";
import AdminGuestRoute from "./routes/AdminGuestRoute";
import AdminUserRoute from "./routes/AdminUserRoute";

import MenuPage from "./components/pages/MenuPage";
import LoginPage from "./components/pages/LoginPage";
import EntranceUploadPage from "./components/pages/EntranceUploadPage";
import WelcomePage from "./components/pages/WelcomePage";
import EntranceLocalPage from "./components/pages/EntranceLocalPage";
import EntranceGlobalPage from "./components/pages/EntranceGlobalPage";
import EntranceUserPostsPage from "./components/pages/EntranceUserPostsPage";
import EntranceSearchPage from "./components/pages/EntranceSearchPage";
import EntrancePostFull from "./components/elements/EntrancePostFull";
import EntrancePostImageFull from "./components/elements/EntrancePostImageFull";
import EntrancePostVideoFull from "./components/elements/EntrancePostVideoFull";
import PageAfterWelcomePage from "./components/pages/PageAfterWelcomePage";
import Page404 from "./components/pages/Page404";

// Admin paths
import AdLoginPage from "./components/admin/pages/AdLoginPage";
import AdDashboardPage from "./components/admin/pages/AdDashboardPage";
import AdUploadPage from "./components/admin/pages/AdUploadPage";
import AdPostsPage from "./components/admin/pages/AdPostsPage";
import AdReportedPostsPage from "./components/admin/pages/AdReportedPostsPage";
import AdSearchPage from "./components/admin/pages/AdSearchPage";
import AdCategoryPage from "./components/admin/pages/AdCategoryPage";
import AdSurveyResultsPage from "./components/admin/pages/AdSurveyResultsPage";
import AdFeedbacksPage from "./components/admin/pages/AdFeedbacksPage";
import AdChangePasswordPage from "./components/admin/pages/AdChangePasswordPage";

function initializeReactGA() {              // eslint-disable-line
    ReactGA.initialize('UA-134718309-1');
    ReactGA.pageview('/homepage');
}

class App extends React.Component {
    render() {
        const { location } = this.props;
        
        return (
            <Switch>
                <GuestRoute location={location} path="/welcome" exact component={WelcomePage} />
                <GuestRoute location={location} path="/login" exact component={LoginPage} />
                <GuestRoute location={location} path="/welcome2" exact component={PageAfterWelcomePage} />
                <UserRoute location={location} path="/upload" exact component={EntranceUploadPage} />
                <UserRoute location={location} path="/" exact component={EntranceLocalPage} />
                <UserRoute location={location} path="/global" exact component={EntranceGlobalPage} />
                <UserRoute location={location} path="/menu" exact component={MenuPage} />
                <UserRoute location={location} path="/posts" exact component={EntranceUserPostsPage} />
                <UserRoute location={location} path="/search" exact component={EntranceSearchPage} />
                <UserRoute location={location} path="/textpost/:id" component={EntrancePostFull} />
                <UserRoute location={location} path="/imagepost/:id" component={EntrancePostImageFull} />
                <UserRoute location={location} path="/videopost/:id" component={EntrancePostVideoFull} />

                {/* Admin routes */}
                <AdminGuestRoute location={location} path="/admin_login_page" component={AdLoginPage} />
                <AdminUserRoute location={location} path="/admin_dashboard" component={AdDashboardPage} />
                <AdminUserRoute location={location} path="/admin_upload_page" component={AdUploadPage} />
                <AdminUserRoute location={location} path="/admin_adposts_page" component={AdPostsPage} />
                <AdminUserRoute location={location} path="/admin_reported_posts_page" component={AdReportedPostsPage} />
                <AdminUserRoute location={location} path="/admin_search_page" component={AdSearchPage} />
                <AdminUserRoute location={location} path="/admin_category_page" component={AdCategoryPage} />
                <AdminUserRoute location={location} path="/admin_survey_results" component={AdSurveyResultsPage} />
                <AdminUserRoute location={location} path="/admin_feedbacks" component={AdFeedbacksPage} />
                <AdminUserRoute location={location} path="/admin_change_password" component={AdChangePasswordPage} />
                
                <UserRoute location={location} component={Page404} />
            </Switch>
        );
    }
}

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
}

export default App;