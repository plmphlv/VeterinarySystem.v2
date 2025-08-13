import { Route, Routes } from "react-router";

import UserProvider from "./providers/UserProvider";
import AuthGuard from "./components/guards/AuthGuard";
import GuestGuard from "./components/guards/GuestGuard";

import Header from "./components/header/Header";
import Home from "./components/home/Home";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import Services from "./components/services/Services";
import GeneralCheckup from "./components/services/general-check-up/General-Check-up";
import Vaccinations from "./components/services/vaccinations/Vaccinations";
import Surgery from "./components/services/surgery/Surgery";
import DentalCare from "./components/services/dental-care/Dental-Care";
import EmegencyServices from "./components/services/emergency-services/Emergency-Services";
import PetNutritionCounseling from "./components/services/pet-nutrition-counseling/Pet-Nutrition-Counseling";
import MyPets from "./components/my-pets/My-Pets";
import MyPetsItemInfo from "./components/my-pets-item-info/My-Pets-Item-Info";
import MyPetsAdd from "./components/my-pets-add/My-Pets-Add";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/profile/edit-profile/Edit-Profile";
import ChangePassword from "./components/profile/change-password/Change-Password";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Logout from "./components/logout/Logout";
import Error from "./components/error/Error";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <UserProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/services" element={<Services />}></Route>
        <Route path="/services/general-check-up" element={<GeneralCheckup />}></Route>
        <Route path="/services/vaccinations" element={<Vaccinations />}></Route>
        <Route path="/services/surgery" element={<Surgery />}></Route>
        <Route path="/services/dental-care" element={<DentalCare />}></Route>
        <Route path="/services/emergency-services" element={<EmegencyServices />}></Route>
        <Route path="/services/pet-nutrition-counseling" element={<PetNutritionCounseling />}></Route>
        <Route path="*" element={<Error />}></Route>
        <Route element={<AuthGuard />}>
          <Route path="/my-pets" element={<MyPets />}></Route>
          <Route path="/my-pets/:id/info" element={<MyPetsItemInfo />}></Route>
          <Route path="/my-pets/add" element={<MyPetsAdd />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/profile/edit" element={<EditProfile />}></Route>
          <Route path="/profile/change-password" element={<ChangePassword />}></Route>
          <Route path="/logout" element={<Logout />}></Route>
        </Route>

        <Route element={<GuestGuard />}>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Route>
      </Routes>
      <Footer />
    </UserProvider>
  );
}

export default App;