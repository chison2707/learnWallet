const InfoCard = ({ title, value, icon }) => (
  <div className="flex items-center space-x-4">
    <div className="bg-blue-100 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default InfoCard;