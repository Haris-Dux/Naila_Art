import { MdOutlineDelete } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";


const ICONS = {
    delete: {
        value:MdOutlineDelete,
        color:"text-red-500"
    },
    tick:{
        value:FaCheckCircle,
        color:"text-green-500"
    },
    cross: {
        value:FaTimesCircle,
        color:"text-red-500"
    }
};

const Icon = ({ name, size = 20 }) => {
  const item = ICONS[name];
  if (!item) {
    return null;
  }

  const { value: IconComponent, color } = item;
  return <IconComponent  size={size} className={color} />;
};

export default Icon;
