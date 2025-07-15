import { Route, Routes } from "react-router";

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
import Profile from "./components/profile/Profile";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <>
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
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;