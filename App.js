import React, { useState } from "react";
import "./App.css";

function App() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [startDate, setStartDate] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [emiValue, setEmiValue] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);

  const calculateEMI = () => {
    if (!amount || !rate || !years || !startDate) {
      alert("Please fill all fields");
      return;
    }

    const P = parseFloat(amount);
    const R = parseFloat(rate) / 12 / 100;
    const N = parseInt(years) * 12;

    const emi =
      (P * R * Math.pow(1 + R, N)) /
      (Math.pow(1 + R, N) - 1);

    const totalPay = emi * N;
    const totalInt = totalPay - P;

    setEmiValue(emi.toFixed(2));
    setTotalPayment(totalPay.toFixed(2));
    setTotalInterest(totalInt.toFixed(2));

    let tempDate = new Date(startDate);
    let data = [];

    for (let i = 1; i <= N; i++) {
      tempDate.setMonth(tempDate.getMonth() + 1);

      data.push({
        month: i,
        date: new Date(tempDate).toLocaleDateString(),
        emi: emi.toFixed(2),
      });
    }

    setSchedule(data);
  };

  // Yearly totals
  const yearlyTotals = {};
  schedule.forEach((item, index) => {
    const year = Math.ceil((index + 1) / 12);
    if (!yearlyTotals[year]) yearlyTotals[year] = 0;
    yearlyTotals[year] += parseFloat(item.emi);
  });

  return (
    <div className="container">
      <h2>Loan EMI Calculator</h2>

      <input
        type="number"
        placeholder="Loan Amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="number"
        placeholder="Interest Rate (%)"
        onChange={(e) => setRate(e.target.value)}
      />

      <input
        type="number"
        placeholder="Loan Years"
        onChange={(e) => setYears(e.target.value)}
      />

      <input
        type="date"
        onChange={(e) => setStartDate(e.target.value)}
      />

      <button onClick={calculateEMI}>Calculate EMI</button>

      {emiValue && (
        <div className="result-box">
          <h3>Monthly EMI: ₹{emiValue}</h3>
          <h3>Total Amount Payable: ₹{totalPayment}</h3>
          <h3>Total Interest: ₹{totalInterest}</h3>

          <h3>Yearly Spending</h3>
          {Object.keys(yearlyTotals).map((year) => (
            <div key={year} className="year-box">
              Year {year}: ₹{yearlyTotals[year].toFixed(2)}
            </div>
          ))}

          <h3>Monthly EMI Schedule</h3>
          {schedule.map((item) => (
            <p key={item.month}>
              Month {item.month} - {item.date} - ₹{item.emi}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;