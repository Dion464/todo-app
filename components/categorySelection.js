// todo-app/components/categorySelection.js
import React from 'react';
import styles from "../styles/category.module.css"
import { FaBriefcase, FaHome, FaShoppingCart } from 'react-icons/fa';

const CategoryModal = ({ onClose, onSelectCategory }) => {
  const categories = [
    { name: 'Work', icon: <FaBriefcase /> },
    { name: 'Personal', icon: <FaHome /> },
    { name: 'Shopping', icon: <FaShoppingCart /> },
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
              <div className={styles.icon}>{category.icon}</div>
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
