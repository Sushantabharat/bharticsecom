import React from 'react'
import {
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineYoutube,
  AiOutlineLinkedin,
  AiOutlineGoogle,
} from 'react-icons/ai'
import aboutus from './Aboutus'

const Footer = () => {
  return (
    <>
      <footer className="footer grid-rows-2 p-10 bg-slate-950 text-neutral-content">
        <nav>
          <h6 className="footer-title text-gray-300">
            Bhartics Ecom Services Pvt Ltd
          </h6>
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <p className="py-2">
              India's first auto e-commerce platform. Now you can buy new car
              with the best price and exprience
            </p>
            <div>
              <span className="mt-2 my-2 space-x-2 text-xl text-blue-200">
                Want to speak with us
              </span>
              <p>
                <a href="tel:+913348495661">033-4849-5661</a>
              </p>
            </div>
          </div>
        </nav>
        <nav>
          <h6 className="footer-title">Know About Bhartics</h6>
          <a href="/about-us" className="link link-hover">
            About us
          </a>
          <a href="/contact" className="link link-hover">
            Contact
          </a>
          <a href="/reviews" className="link link-hover">
            What People Talk About Us
          </a>
          <a href="/community" className="link link-hover">
            Bhartics Community
          </a>
        </nav>
        <nav>
          <h6 className="footer-title">Become Our Partner</h6>
          <a href="/become-out-partner" className="link link-hover">
            New Car Dealer
          </a>
          <a href="/become-out-partner" className="link link-hover">
            Used Car Dealer
          </a>
          <a href="/become-out-partner" className="link link-hover ">
            OEM
          </a>
          <a href="/register-service" className="link link-hover ">
            Register Your Service
          </a>
        </nav>
        <nav>
          <h6 className="footer-title">Make Money With Us</h6>
          <a href="/sellers" className="link link-hover">
            Sell on Bhartics
          </a>
          <a href="/ads" className="link link-hover">
            Advertise Your Product
          </a>
          <a href="/affiliate" className="link link-hover">
            Become an Affiliate
          </a>

          <a href="/refer" className="link link-hover">
            Refer & Earn
          </a>
        </nav>
        <nav>
          <h6 className="footer-title">Let Us Help You</h6>
          <a href="/profile" className="link link-hover">
            Your Account
          </a>
          <a href="/bhartics-work" className="link link-hover">
            How Bhartics Work
          </a>
          <a href="/policy" className="link link-hover">
            100% Purchase Protection
          </a>
          <a href="/help" className="link link-hover">
            Help
          </a>
        </nav>
        <nav>
          <h6 className="footer-title">useful link</h6>
          <a href="/career" className="link link-hover">
            Career
          </a>
          <a href="/investor" className="link link-hover">
            Investor
          </a>
          <a href="/founder" className="link link-hover">
            Founder
          </a>
          <a href="/team" className="link link-hover">
            Team
          </a>
        </nav>
      </footer>
      <div className="bg-slate-50 ">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-black text-sm text-center sm:text-left">
            <span className="px-4">© 2020 — 24 carshartics.com</span>Bhartics
            Ecom Services Pvt Ltd
            <a
              href="/"
              rel="noopener noreferrer"
              className="text-blue-950 ml-1"
              target="_blank"
            >
              @bhartics
            </a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
            <a
              href="https://www.facebook.com/Bhartics/"
              className="text-xl text-blue-700 bg-gray-200 "
            >
              <AiOutlineFacebook />
            </a>
            <a
              href="https://www.google.com/search?channel=fs&client=ubuntu&q=bhartics&hs=C64&tbs=lf:1,lf_ui:2&tbm=lcl&rflfq=1&num=10&rldimm=7745775596332734597&lqi=CghiaGFydGljc0jG7Ketu7KAgAhaDhAAGAAiCGJoYXJ0aWNzkgEKY2FyX2RlYWxlcg&ved=2ahUKEwj32pTnnqj9AhWW6jgGHcy7Ch8QvS56BAgKEAE&sa=X&rlst=f#rlfi=hd:;si:7745775596332734597,l,CghiaGFydGljc0jG7Ketu7KAgAhaDhAAGAAiCGJoYXJ0aWNzkgEKY2FyX2RlYWxlcg;mv:[[22.572628277319026,88.35679470828673],[22.572268322680973,88.35640489171327]];tbs:lrf:!1m4!1u3!2m2!3m1!1e1!1m4!1u2!2m2!2m1!1e1!2m1!1e2!2m1!1e3!3sIAE,lf:1,lf_ui:2/"
              className="ml-3 text-xl text-blue-700 bg-gray-200 "
            >
              <AiOutlineGoogle />
            </a>
            <a
              href="https://www.instagram.com/carsbhartics"
              className="ml-3 text-fuchsia-500 bg-gray-200 text-xl"
            >
              <AiOutlineInstagram />
            </a>
            <a
              href="https://www.youtube.com/@carsbhartics"
              className="ml-3 text-red-500 bg-gray-200 text-xl"
            >
              <AiOutlineYoutube />
            </a>
            <a
              href="https://www.linkedin.com/company/bhartics"
              className="ml-3 text-blue-900 bg-gray-200  text-xl"
            >
              <AiOutlineLinkedin />
            </a>
          </span>
        </div>
      </div>
    </>
  )
}

export default Footer
