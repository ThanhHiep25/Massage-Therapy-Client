
import { BotMessageSquare } from 'lucide-react';
import MenuDrawer from '../../components/menu/MenuDrawer';
import Bar from '../../components/taskbar/Bar';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col h-screen">
      {/* Taskbar */}
      <div className="flex-shrink-0">
        <Bar />
      </div>
      {/* Main content area */}
      <div className="flex overflow-hidden">
        {/* Menu Drawer */}       
          <MenuDrawer />
      </div>

      <div className="absolute bottom-20 sm:right-10 right-5 bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white animate-bounce cursor-pointer"
      onClick={() => navigate('/chatbot')}
      >
        <BotMessageSquare/>
      </div>
    </div>
  );
};

export default Home;
