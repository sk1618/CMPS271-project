

import '../styles/OurServices.css';
import assistance from "../assets/assistance.png";
import custom from "../assets/custom.png";
import future from "../assets/future.png";
import secure from "../assets/secure.png";
import smartExpense from "../assets/smartExpense.jnp.jpg";
import budget from "../assets/budget.png";



function OurServices() {
  return (
    <div className="wrapper">
     <div className="card">
      <img className="card-image" src={secure} alt="not available" />
      <h2 className="card-title">Secure Platform</h2>
      <p className="card-text">Your data is encrypted and protected with bank-level security.</p>
    </div>

    <div className="card">
      <img className="card-image" src={assistance} alt="not available" />
      <h2 className="card-title">AI-powered Chatbot Assistance</h2>
      <p className="card-text">Get real-time help with managing your expenses, purchases, and budgeting from our intelligent chatbot.</p>
    </div>

    <div className="card">
      <img className="card-image" src={smartExpense} alt="not available" />
      <h2 className="card-title">Smart Expense Tracking</h2>
      <p className="card-text">Easily record and categorize all your business expenses in real-time.</p>
    </div>

     <div className="card">
      <img className="card-image" src={future} alt="not available" />
      <h2 className="card-title">Future Purchase Planning</h2>
      <p className="card-text">Organize your upcoming purchases with our interactive To-Buy list.</p>
    </div>

     <div className="card">
      <img className="card-image" src={budget} alt="not available" />
      <h2 className="card-title">Budget Insights & Analytics</h2>
      <p className="card-text">Visualize your spending habits and optimize your financial decisions.</p>
    </div>

     <div className="card">
      <img className="card-image" src={custom} alt="not available" />
      <h2 className="card-title">Custom Expense Categories</h2>
      <p className="card-text">Tailor categories to fit your business model and workflow.</p>
    </div>
    </div>
   
  );
}

export default OurServices;


