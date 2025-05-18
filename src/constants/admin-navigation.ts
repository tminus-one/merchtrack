import { 
  MdShoppingCart, 
  MdPayments, 
  MdPeople, 
  MdInventory, 
  MdEmail, 
  MdBarChart
} from 'react-icons/md';
import { FaAddressBook } from "react-icons/fa6";
import { RiSurveyFill } from "react-icons/ri";
import type { IconType } from 'react-icons';
import { IoTicket } from 'react-icons/io5';
  
export type AdminNavigation = {
  name: string
  href: string
  icon: IconType
}
  
export const AdminLinks: AdminNavigation[] = [
  {
    name: "Orders",
    href: "/admin/orders",
    icon: MdShoppingCart,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: MdPayments,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: MdPeople,
  },
  {
    name: "Inventory",
    href: "/admin/inventory",
    icon: MdInventory,
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: MdEmail,
  },
  {
    name: "Insights",
    href: "/admin/insights",
    icon: MdBarChart,
  },
  {
    name: "Tickets",
    href: "/admin/tickets",
    icon: IoTicket
  },
  {
    name: "Surveys",
    href: "/admin/survey",
    icon: RiSurveyFill,
  },
  {
    name: "Logs",
    href: "/admin/logs",
    icon: FaAddressBook,
  }
];
