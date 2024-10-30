import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, User, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { logout } from '../../store/slices/authSlice';
import type { RootState } from '../../store/store';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
      <div className="flex justify-between items-center">
        <motion.h1 
          className="text-3xl font-bold text-white text-center flex-1"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.9, 1, 0.9]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          1900套计算机专业毕设项目代码资料大合集
        </motion.h1>
        
        {user && (
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
            >
              <Globe size={18} />
              <span>{i18n.language.toUpperCase()}</span>
            </button>

            <div className="flex items-center gap-2 text-white">
              <User size={20} />
              <span>{user.name}</span>
            </div>
            
            <button
              onClick={() => dispatch(logout())}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-red-500/20 transition-colors duration-200"
            >
              <LogOut size={18} />
              <span>{t('auth.logout')}</span>
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;