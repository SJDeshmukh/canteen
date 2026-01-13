import React, { useRef } from 'react';
import { useAmbientMotion } from '../../hooks/useAmbientMotion';
import { useParallax } from '../../hooks/useParallax';
import { Spoon, Fork, Ladle, Pan } from './UtensilIcons';
import styles from './FloatingUtensils.module.scss';

interface FloatingItemProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  size?: number;
  top: string;
  left: string;
  depth?: number;
  rotation?: number;
  color?: string;
  blur?: number;
}

const FloatingItem: React.FC<FloatingItemProps> = ({ 
  Icon, size = 40, top, left, depth = 1, rotation = 0, color = 'var(--color-steel)', blur = 0 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const delay = 0.2 * depth;
  
  useAmbientMotion(ref, {
    yRange: 15 * depth,
    duration: 3 + depth,
    delay
  });

  useParallax(ref, {
    sensitivity: 30 * depth
  });

  return (
    <div 
      ref={ref}
      className={styles.floatingItem}
      style={{
        top,
        left,
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
        color: color,
        filter: `blur(${blur}px)`,
        zIndex: Math.floor(depth * 10)
      }}
    >
      <Icon width="100%" height="100%" />
    </div>
  );
};

export const FloatingUtensils: React.FC = () => {
  return (
    <div className={styles.container}>
      <FloatingItem Icon={Spoon} top="10%" left="5%" size={120} depth={0.5} rotation={45} blur={4} color="rgba(59, 170, 59, 0.08)" />
      <FloatingItem Icon={Ladle} top="60%" left="85%" size={150} depth={0.6} rotation={-15} blur={3} color="rgba(245, 134, 52, 0.08)" />
      
      <FloatingItem Icon={Fork} top="25%" left="80%" size={80} depth={1} rotation={-30} color="rgba(229, 57, 53, 0.12)" />
      <FloatingItem Icon={Pan} top="75%" left="15%" size={90} depth={1.2} rotation={10} color="rgba(142, 36, 170, 0.10)" />
      
      <FloatingItem Icon={Spoon} top="40%" left="90%" size={50} depth={1.5} rotation={120} color="rgba(253, 216, 53, 0.16)" />
      <FloatingItem Icon={Fork} top="85%" left="50%" size={60} depth={1.4} rotation={-90} color="rgba(59, 170, 59, 0.12)" />
    </div>
  );
};
