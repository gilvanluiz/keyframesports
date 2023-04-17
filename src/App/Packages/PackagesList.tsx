import * as React from 'react';
import { useState } from 'react';
import { SuccessSendingEmailModal } from './SuccessSendingEmailModal';
import { PlansButtons } from './PlansButtons';

interface IProps {
    loading: boolean;
    handleCheckout: () => void;
}

const packagesData = [
    {
        packageTitle: 'Single User',
        usersQuantity: 1,
        packageSubtitle: 'Best Choice for Individuals',
        pricePerUser: 0,
        checkoutPrice: 149.99,
        features: [
            '10GB storage',
            'No watermark on export',
            'Secure video storage',
            'Access online from any machine',
        ],
    },
    {
        packageTitle: '3 User Package',
        usersQuantity: 3,
        packageSubtitle: 'Best Choice for Smaller Size Teams',
        pricePerUser: 120,
        checkoutPrice: 360,
        features: [
            'As single user',
            '10GB storage per user',
            'Additional licences at $120',
        ],
    },
    {
        packageTitle: '6 User Package',
        usersQuantity: 6,
        packageSubtitle: 'Best Choice for Medium Size Teams',
        pricePerUser: 110,
        checkoutPrice: 660,
        features: [
            'As single user',
            '10GB storage per user',
            'Additional licences at $110',
        ],
    },
    {
        packageTitle: '9 User Package',
        usersQuantity: 9,
        packageSubtitle: 'Best Choice for Larger Size Teams',
        pricePerUser: 100,
        checkoutPrice: 900,
        features: [
            'As single user',
            '10GB storage per user',
            'Additional licences at $100',
        ],
    },
];

export const PackagesList = ({ loading, handleCheckout }: IProps) => {
    const [isModalOpened, setModalState] = useState(false);

    function handleChange() {
        setModalState((prev) => !prev);
    }

    return (
        <>
            {packagesData.map((packageData, index) => (
                <PlansButtons
                    key={index}
                    loading={loading}
                    handleCheckout={handleCheckout}
                    packageData={packageData}
                    openSuccessModal={handleChange}
                />
            ))}
            <SuccessSendingEmailModal
                open={isModalOpened}
                onClose={handleChange}
            />
        </>
    );
};
