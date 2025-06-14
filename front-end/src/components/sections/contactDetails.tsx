import React from 'react';
import clsx from 'clsx';

const ContactDetails: React.FC = () => {
    return (
        <section className={clsx('py-12 bg-gray-100')}>
            <div className={clsx('container mx-auto px-4')}>
                <h2 className={clsx('text-2xl font-bold text-center mb-8')}>Contact Us</h2>
                <div className={clsx('text-center')}>
                    <p className={clsx('text-lg')}>
                        Email:{' '}
                        <a
                            href="mailto:support@blooddonation.com"
                            className={clsx('text-red-600 hover:underline')}
                        >
                            support@blooddonation.com
                        </a>
                    </p>
                    <p className={clsx('text-lg')}>
                        Phone:{' '}
                        <a href="tel:+84123456789" className={clsx('text-red-600 hover:underline')}>
                            +84 123 456 789
                        </a>
                    </p>
                    <p className={clsx('text-lg')}>Address: 123 Blood Donation Center, Hanoi, Vietnam</p>
                </div>
            </div>
        </section>
    );
};

export default ContactDetails;