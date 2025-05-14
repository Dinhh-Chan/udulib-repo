import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import DepartmentsPage from "./pages/DepartmentsPage"
import DepartmentPage from "./pages/DepartmentPage"
import CoursePage from "./pages/CoursePage"
import UploadPage from "./pages/UploadPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AdminPage from "./pages/AdminPage"
import SearchPage from "./pages/SearchPage"
import ForumPage from "./pages/ForumPage"
import ForumPostPage from "./pages/ForumPostPage"
import NewForumPostPage from "./pages/NewForumPostPage"
import ForumCategoriesPage from "./pages/ForumCategoriesPage"
import PopularForumPostsPage from "./pages/PopularForumPostsPage"
import ReplyToPostPage from "./pages/ReplyToPostPage"
import EditForumPostPage from "./pages/EditForumPostPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import DocumentPage from "./pages/DocumentPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="departments">
          <Route index element={<DepartmentsPage />} />
          <Route path=":slug" element={<DepartmentPage />} />
          <Route path=":slug/courses/:courseSlug" element={<CoursePage />} />
        </Route>
        <Route path="upload" element={<UploadPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="forum">
          <Route index element={<ForumPage />} />
          <Route path=":id" element={<ForumPostPage />} />
          <Route path="new" element={<NewForumPostPage />} />
          <Route path="categories" element={<ForumCategoriesPage />} />
          <Route path="popular" element={<PopularForumPostsPage />} />
          <Route path=":id/reply" element={<ReplyToPostPage />} />
          <Route path=":id/edit" element={<EditForumPostPage />} />
        </Route>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="documents/:id" element={<DocumentPage />} />
      </Route>
    </Routes>
  )
}

export default App
