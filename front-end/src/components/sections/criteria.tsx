import React from 'react';
import clsx from 'clsx';

interface Criterion {
  title: string;
  description: string;
}

const Criteria: React.FC = () => {
  const criteria: Criterion[] = [
    { title: 'Age', description: 'Must be between 18 and 65 years old.' },
    { title: 'Weight', description: 'Must weigh at least 50 kg.' },
    { title: 'Health', description: 'Must be in good health with no recent illnesses.' },
  ];

  return (
    <section className={clsx('py-12')}>
      <div className={clsx('container mx-auto px-4')}>
        <h2 className={clsx('text-2xl font-bold text-center mb-8')}>Donation Criteria</h2>
        <div className={clsx('grid grid-cols-1 md:grid-cols-3 gap-4')}>
          {criteria.map((criterion) => (
            <div
              key={criterion.title}
              className={clsx('p-4 bg-white rounded-lg shadow-md')}
            >
              <h3 className={clsx('text-lg font-semibold')}>{criterion.title}</h3>
              <p className={clsx('text-gray-600')}>{criterion.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Criteria;