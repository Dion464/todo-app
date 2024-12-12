import React from 'react';
import styles from "../styles/category.module.css";
import { FaBriefcase, FaHome, FaShoppingCart, FaRegHandshake, FaPlane, FaMoneyBillWave, FaTv } from 'react-icons/fa';

const CategoryModal = ({ onClose, onSelectCategory }) => {
  const categories = [
    { name: 'Work', icon: <FaBriefcase /> },
    { name: 'Personal', icon: <FaHome /> },
    { name: 'Urgent', icon: '⚡' },
    { name: 'Shopping', icon: <FaShoppingCart /> },
    { name: 'Health', icon: '💪' },
    { name: 'Study', icon: '📚' },
    { name: 'Travel', icon: <FaPlane /> },
    { name: 'Family', icon: '👨‍👩‍👧‍👦' },
    { name: 'Finance', icon: <FaMoneyBillWave /> },
    { name: 'Entertainment', icon: <FaTv /> },
  ];


  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Select a Category</h3>
        <div className={styles.categoryGrid}>
          {categories.map((category, index) => (
            <div
              key={index}
              className={styles.categoryCard}
              onClick={() => onSelectCategory(category.name)}
            >
              <div className={styles.icon}>
                {typeof category.icon === 'string' ? (
                  <span>{category.icon}</span>
                ) : (
                  category.icon
                )}
              </div>
              <span className={styles.categoryLabel}>{category.name}</span>
            </div>
          ))}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CategoryModal;
