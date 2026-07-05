import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BudgetForm: React.FC = () => {
  const [budget, setBudget] = useState({}
  const animateInput = useFocusVisible();

  return (
    <motion.form className='max-w-md mx-auto p-4'
      animate={{ scale: animateInput.isFocused ? 1.05 : 1 }}
    >
      <label className='mb-2'>
        Budget Amount
        <motion.input
          type='number'
          value={budget.amount}
          onChange={e => setBudget({ ...budget, amount: +e.target.value })}
          className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </label>
      <button className='mt-2 bg-blue-500 text-white px-4 py-2 hover:bg-blue-600'>
        Submit Budget
      </button>
    </motion.form>
  );
};

export default BudgetForm;