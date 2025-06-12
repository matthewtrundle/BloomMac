'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FlowerProps {
  className?: string;
  isHovered?: boolean;
}

// Rose - for Women's Therapy (classic, elegant, self-care)
export const RoseIcon: React.FC<FlowerProps> = ({ className = "", isHovered = false }) => (
  <motion.svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    className={className}
    animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <motion.g
      animate={isHovered ? { y: -2 } : { y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Rose petals */}
      <motion.path
        d="M30 15 C25 10, 15 10, 15 20 C15 30, 25 35, 30 35 C35 35, 45 30, 45 20 C45 10, 35 10, 30 15"
        fill="#E8B4B8"
        animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
        style={{ transformOrigin: "30px 25px" }}
      />
      <motion.path
        d="M30 20 C27 17, 22 17, 22 22 C22 27, 27 30, 30 30 C33 30, 38 27, 38 22 C38 17, 33 17, 30 20"
        fill="#D4A5A5"
        animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
        style={{ transformOrigin: "30px 25px" }}
      />
      {/* Stem */}
      <path
        d="M30 35 L30 50"
        stroke="#7A8B7F"
        strokeWidth="2"
        fill="none"
      />
      {/* Leaves */}
      <path
        d="M30 40 C27 38, 24 38, 24 41 C24 44, 27 44, 30 42"
        fill="#7A8B7F"
      />
      <path
        d="M30 45 C33 43, 36 43, 36 46 C36 49, 33 49, 30 47"
        fill="#7A8B7F"
      />
    </motion.g>
  </motion.svg>
);

// Sunflower - for Therapy for Moms (bright, nurturing, growth)
export const SunflowerIcon: React.FC<FlowerProps> = ({ className = "", isHovered = false }) => (
  <motion.svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    className={className}
    animate={isHovered ? { scale: 1.1, rotate: -5 } : { scale: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <motion.g
      animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
      transition={{ duration: 20, repeat: isHovered ? Infinity : 0, ease: "linear" }}
      style={{ transformOrigin: "30px 25px" }}
    >
      {/* Petals */}
      {[...Array(12)].map((_, i) => (
        <motion.ellipse
          key={i}
          cx="30"
          cy="15"
          rx="4"
          ry="8"
          fill="#FFD700"
          transform={`rotate(${i * 30} 30 25)`}
          animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
          style={{ transformOrigin: "30px 25px" }}
        />
      ))}
      {/* Center */}
      <circle cx="30" cy="25" r="8" fill="#8B4513" />
      <circle cx="30" cy="25" r="6" fill="#A0522D" />
    </motion.g>
    {/* Stem */}
    <path
      d="M30 33 L30 50"
      stroke="#228B22"
      strokeWidth="3"
      fill="none"
    />
    {/* Leaves */}
    <motion.path
      d="M30 40 C25 37, 20 37, 20 42 C20 47, 25 47, 30 44"
      fill="#228B22"
      animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
      style={{ transformOrigin: "25px 42px" }}
    />
    <motion.path
      d="M30 45 C35 42, 40 42, 40 47 C40 52, 35 52, 30 49"
      fill="#228B22"
      animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
      style={{ transformOrigin: "35px 47px" }}
    />
  </motion.svg>
);

// Lotus - for Anxiety & Stress Management (peace, mindfulness, calm)
export const LotusIcon: React.FC<FlowerProps> = ({ className = "", isHovered = false }) => (
  <motion.svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    className={className}
    animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <motion.g>
      {/* Center petal */}
      <motion.path
        d="M30 20 C30 15, 25 10, 20 15 C15 20, 20 30, 30 30 C40 30, 45 20, 40 15 C35 10, 30 15, 30 20"
        fill="#DDA0DD"
        animate={isHovered ? { y: -3 } : { y: 0 }}
      />
      {/* Side petals */}
      <motion.path
        d="M20 25 C15 20, 10 20, 10 25 C10 30, 15 35, 25 30"
        fill="#E6E6FA"
        animate={isHovered ? { x: -2, rotate: -10 } : { x: 0, rotate: 0 }}
        style={{ transformOrigin: "17px 27px" }}
      />
      <motion.path
        d="M40 25 C45 20, 50 20, 50 25 C50 30, 45 35, 35 30"
        fill="#E6E6FA"
        animate={isHovered ? { x: 2, rotate: 10 } : { x: 0, rotate: 0 }}
        style={{ transformOrigin: "43px 27px" }}
      />
      {/* Bottom petals */}
      <motion.path
        d="M30 30 C25 30, 20 35, 25 40 C30 35, 30 30, 30 30"
        fill="#D8BFD8"
        animate={isHovered ? { y: 2 } : { y: 0 }}
      />
      <motion.path
        d="M30 30 C35 30, 40 35, 35 40 C30 35, 30 30, 30 30"
        fill="#D8BFD8"
        animate={isHovered ? { y: 2 } : { y: 0 }}
      />
    </motion.g>
    {/* Water ripples */}
    <motion.ellipse
      cx="30"
      cy="45"
      rx="15"
      ry="3"
      fill="none"
      stroke="#87CEEB"
      strokeWidth="1"
      opacity="0.5"
      animate={isHovered ? { scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.svg>
);

// Daisy - for Parent Support (fresh, cheerful, family)
export const DaisyIcon: React.FC<FlowerProps> = ({ className = "", isHovered = false }) => (
  <motion.svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    className={className}
    animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* Petals */}
    {[...Array(8)].map((_, i) => (
      <motion.ellipse
        key={i}
        cx="30"
        cy="18"
        rx="5"
        ry="10"
        fill="white"
        stroke="#FFB6C1"
        strokeWidth="1"
        transform={`rotate(${i * 45} 30 28)`}
        animate={isHovered ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}
        style={{ transformOrigin: "30px 28px" }}
      />
    ))}
    {/* Center */}
    <motion.circle
      cx="30"
      cy="28"
      r="8"
      fill="#FFD700"
      animate={isHovered ? { scale: 1.3 } : { scale: 1 }}
    />
    {/* Stem */}
    <path
      d="M30 36 L30 50"
      stroke="#90EE90"
      strokeWidth="2"
      fill="none"
    />
    {/* Leaves */}
    <path
      d="M30 42 C27 40, 24 40, 24 43 C24 46, 27 46, 30 44"
      fill="#90EE90"
    />
  </motion.svg>
);

// Cherry Blossom - for Postpartum Depression (delicate, renewal, hope)
export const CherryBlossomIcon: React.FC<FlowerProps> = ({ className = "", isHovered = false }) => (
  <motion.svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    className={className}
    animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* Branch */}
    <path
      d="M10 40 Q20 35, 30 30 T50 20"
      stroke="#8B4513"
      strokeWidth="2"
      fill="none"
    />
    {/* Blossoms */}
    <motion.g
      animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
      style={{ transformOrigin: "20px 35px" }}
    >
      {[...Array(5)].map((_, i) => (
        <motion.circle
          key={i}
          cx={20 + i * 2}
          cy={35 - i}
          r="4"
          fill="#FFB6C1"
          animate={isHovered ? { y: [-1, 1, -1] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </motion.g>
    <motion.g
      animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
      style={{ transformOrigin: "35px 28px" }}
    >
      {[...Array(5)].map((_, i) => (
        <motion.circle
          key={i}
          cx={35 + i * 2}
          cy={28 - i}
          r="4"
          fill="#FFC0CB"
          animate={isHovered ? { y: [-1, 1, -1] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 + 0.5 }}
        />
      ))}
    </motion.g>
    {/* Falling petals animation */}
    {isHovered && (
      <motion.circle
        cx="25"
        cy="30"
        r="3"
        fill="#FFB6C1"
        initial={{ y: 0, x: 0, opacity: 1 }}
        animate={{ y: 20, x: 10, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    )}
  </motion.svg>
);

// Lavender - for Postpartum Anxiety (calming, soothing, healing)
export const LavenderIcon: React.FC<FlowerProps> = ({ className = "", isHovered = false }) => (
  <motion.svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    className={className}
    animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* Stems */}
    {[...Array(3)].map((_, i) => (
      <path
        key={i}
        d={`M${25 + i * 5} 50 L${25 + i * 5} 20`}
        stroke="#7A8B7F"
        strokeWidth="1.5"
        fill="none"
      />
    ))}
    {/* Lavender flowers */}
    {[...Array(3)].map((_, stemIndex) => (
      <motion.g key={stemIndex}>
        {[...Array(8)].map((_, i) => (
          <motion.ellipse
            key={i}
            cx={25 + stemIndex * 5}
            cy={20 + i * 3}
            rx="3"
            ry="2"
            fill="#9370DB"
            animate={isHovered ? { 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            } : {}}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: (stemIndex * 0.2) + (i * 0.1)
            }}
          />
        ))}
      </motion.g>
    ))}
    {/* Leaves */}
    <path
      d="M25 40 C22 38, 19 38, 19 41 C19 44, 22 44, 25 42"
      fill="#7A8B7F"
    />
    <path
      d="M35 45 C38 43, 41 43, 41 46 C41 49, 38 49, 35 47"
      fill="#7A8B7F"
    />
  </motion.svg>
);

// Map service IDs to their flower components
export const serviceFlowers = {
  'therapy-for-women': RoseIcon,
  'therapy-for-moms': SunflowerIcon,
  'anxiety-stress-management': LotusIcon,
  'parent-support': DaisyIcon,
  'postpartum-depression-support': CherryBlossomIcon,
  'postpartum-anxiety-support': LavenderIcon,
};