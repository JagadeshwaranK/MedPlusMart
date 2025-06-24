import React from 'react';
import '../styles/footer.css'; 

const Footer = () => {
  return (
    <footer className="footer  pt-5">
      <div className="container">
        <div className="row ">
          {/* Column 1 */}
          <div className="col-md-3">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Health Article</a></li>
              <li><a href="#">Diseases & Health Conditions</a></li>
              <li><a href="#">All Medicines</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="col-md-3">
            <h5>Need Help</h5>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="col-md-3">
            <h5>Legal</h5>
            <ul>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Editorial Policy</a></li>
              <li><a href="#">Returns & Cancellations</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="col-md-3">
            <h5>Subscribe</h5>
            <p>Claim your complimentary health and fitness tips subscription and stay updated on our newest promotions.</p>
            <input type="email" placeholder="Enter your email ID" className="subscribe-input" />
            <button className="btn btn-primary">Subscribe</button>
            {/* <h5>Registered Office Address</h5>
            <p>
              Intellihealth Solutions Private Limited<br />
              Office Unit no. 1, 2, 5, & 7, 6th floor Urmi Corporate Park Solaris,<br />
              Saki Vihar Rd, Opp. L&T Flyover, New Mhada Colony,<br />
              Budhia Jadhav Wadi, Mumbai, Maharashtra 400072.<br />
              CIN: U85320MH2019PTC320566<br />
              Telephone: 09240250346
            </p>
            <h5>Grievance Officer</h5>
            <p>
              Name: Chandrasekhar Swaminathan<br />
              Email: <a href="mailto:grievance-officer@truemeds.in">grievance-officer@truemeds.in</a>
            </p> */}
          </div>
        </div>

        <div className="row">
          <div className="col ">
            <h5>Download MediMart</h5>
            <p>Manage your health with ease. Download MediMart today!</p>
            <p>Get easy access to medicine refills, health information, and more. With our app, you'll never have to wait in line again. Download now and start taking control of your health.</p>
            <button className="btn p-2 btn-secondary">Download Now</button>
          </div>
        </div>

        <div className="row">
          <div className="col ">
            <p>Our customer representative team is available 7 days a week from 8:30 am - 9:30 pm.</p>
            <p>Email: <a href="mailto:support@medimart.in">support@medimart.in</a> | Phone: 09042062072</p>
          </div>
        </div>

        <div className="row">
          <div className="col ">
            <p>v3.6.8</p>
            <p>© 2025 - MediMart | All rights reserved</p>
          </div>
        </div>

        <div className="row">
          <div className="col ">
            <h5>Our Payment Partners</h5>
            <div className="payment-partners">
              <img src="paymentPartner1.png" alt="Payment Partner 1" />
              <img src="paymentPartner2.png" alt="Payment Partner 2" />
              <img src="paymentPartner3.png" alt="Payment Partner 3" />
              <img src="paymentPartner4.png" alt="Payment Partner 4" />
              <img src="paymentPartner5.png" alt="Payment Partner 5" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;