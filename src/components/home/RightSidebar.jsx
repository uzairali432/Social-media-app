import { Bell, Gift, MoreHorizontal, Plus } from "lucide-react";
import userImage from '../../assets/user.png'

const RightSidebar = () => {
    return (
    <div className="w-72 h-[calc(100vh-64px)] bg-white p-3 shadow-md overflow-y-auto sticky top-14">
      <SectionTitle title="Sponsored" />

      <div className="mt-5">
        <SectionTitle title="Your Pages" />
        <div className="flex items-center gap-2 mt-2">
          <img className="w-9 h-9 bg-gray-200 rounded-full" src={userImage}></img>
          <span className="font-medium text-gray-800">Gus's goods</span>
        </div>
        <SidebarLink icon={<Bell size={16} />} text="4 Notifications" />
        <SidebarLink icon={<Plus size={16} />} text="Create Promotion" />
      </div>

      <div className="mt-6">
        <SectionTitle title="Birthdays" />
        <div className="flex items-center gap-3 mt-2">
          <Gift className="text-pink-500" />
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-blue-700">
              Sara Edwards
            </span>{" "}
            and{" "}
            <span className="font-semibold text-blue-700">
              Melina Delkic
            </span>{" "}
            have birthdays today.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center">
          <SectionTitle title="Contacts" />
          <div className="flex items-center gap-2 text-gray-500">
            <Plus size={16} />
            <MoreHorizontal size={16} />
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {[
            "Tori Carnett",
            "Siarra Tishelle Bennett",
            "Jessica Sellers",
            "Becky Pallack",
            "Cindy Normandeau",
          ].map((name, idx) => (
            <ContactItem key={idx} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ title }) => (
  <h3 className="text-gray-500 text-sm font-semibold">{title}</h3>
);

const SidebarLink = ({ icon, text }) => (
  <div className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer text-sm">
    {icon}
    <span>{text}</span>
  </div>
);

const ContactItem = ({ name }) => (
  <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
    <div className="relative">
      <img
        src={`https://i.pravatar.cc/150?u=${name}`}
        alt={name}
        className="w-8 h-8 rounded-full"
      />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
    </div>
    <span className="text-gray-800 text-sm">{name}</span>
  </div>
);
export default RightSidebar