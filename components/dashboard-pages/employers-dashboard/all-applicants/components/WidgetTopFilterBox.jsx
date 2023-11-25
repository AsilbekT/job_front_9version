const WidgetTopFilterBox = ({ dateFilter, setDateFilter }) => {
  return (
    <div className="chosen-outer">
      <select
        onChange={(e) => setDateFilter(e.target.value)}
        value={dateFilter}
        className="chosen-single form-select chosen-container"
      >
        <option value="">Select</option>
        <option value="12">Last 12 Months</option>
        <option value="16">Last 16 Months</option>
        <option value="24">Last 24 Months</option>
        <option value="60">Last 5 year</option>
      </select>
      {/* <!--Tabs Box--> */}

      {/* <select className="chosen-single form-select chosen-container">
        <option>All Status</option>
        <option>Last 12 Months</option>
        <option>Last 16 Months</option>
        <option>Last 24 Months</option>
        <option>Last 5 year</option>
      </select> */}
      {/* <!--Tabs Box--> */}
    </div>
  );
};

export default WidgetTopFilterBox;
