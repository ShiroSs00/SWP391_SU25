import type {BloodType} from '../types';

export const bloodCompatibilityMatrix = {
    // Donor -> Recipients (who can receive)
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+']
};

export const componentCompatibility = {
    red_cells: {
        // Red cells follow standard ABO/Rh compatibility
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+']
    },
    plasma: {
        // Plasma compatibility is reverse of red cells
        'O-': ['O-'],
        'O+': ['O-', 'O+'],
        'A-': ['A-', 'O-'],
        'A+': ['A-', 'A+', 'O-', 'O+'],
        'B-': ['B-', 'O-'],
        'B+': ['B-', 'B+', 'O-', 'O+'],
        'AB-': ['AB-', 'A-', 'B-', 'O-'],
        'AB+': ['AB-', 'AB+', 'A-', 'A+', 'B-', 'B+', 'O-', 'O+']
    },
    platelets: {
        // Platelets are less restrictive, mainly ABO compatible
        'O-': ['O-', 'O+'],
        'O+': ['O-', 'O+'],
        'A-': ['A-', 'A+'],
        'A+': ['A-', 'A+'],
        'B-': ['B-', 'B+'],
        'B+': ['B-', 'B+'],
        'AB-': ['AB-', 'AB+', 'A-', 'A+', 'B-', 'B+', 'O-', 'O+'],
        'AB+': ['AB-', 'AB+', 'A-', 'A+', 'B-', 'B+', 'O-', 'O+']
    }
};

export function getBloodTypeString(bloodType: BloodType): string {
    return `${bloodType.abo}${bloodType.rh}`;
}

export function parseBloodTypeString(bloodTypeStr: string): BloodType {
    const abo = bloodTypeStr.slice(0, -1) as BloodType['abo'];
    const rh = bloodTypeStr.slice(-1) as BloodType['rh'];
    return { abo, rh };
}

export function canDonateWholeBood(donor: BloodType, recipient: BloodType): boolean {
    const donorStr = getBloodTypeString(donor);
    const recipientStr = getBloodTypeString(recipient);
    return bloodCompatibilityMatrix[donorStr as keyof typeof bloodCompatibilityMatrix]?.includes(recipientStr) || false;
}

export function canDonateComponent(
    donor: BloodType,
    recipient: BloodType,
    component: 'red_cells' | 'plasma' | 'platelets'
): boolean {
    const donorStr = getBloodTypeString(donor);
    const recipientStr = getBloodTypeString(recipient);
    return componentCompatibility[component][donorStr as keyof typeof componentCompatibility[typeof component]]?.includes(recipientStr) || false;
}

export function findCompatibleDonors(
    recipientBloodType: BloodType,
    component: 'whole_blood' | 'red_cells' | 'plasma' | 'platelets' = 'whole_blood'
): string[] {
    const recipientStr = getBloodTypeString(recipientBloodType);

    if (component === 'whole_blood') {
        return Object.entries(bloodCompatibilityMatrix)
            .filter(([_, recipients]) => recipients.includes(recipientStr))
            .map(([donor, _]) => donor);
    }

    return Object.entries(componentCompatibility[component])
        .filter(([_, recipients]) => recipients.includes(recipientStr))
        .map(([donor, _]) => donor);
}

export function calculateNextEligibleDate(lastDonationDate: string, donationType: 'whole_blood' | 'plasma' | 'platelets'): string {
    const lastDonation = new Date(lastDonationDate);
    const intervals = {
        whole_blood: 56, // 8 weeks
        plasma: 28, // 4 weeks
        platelets: 7 // 1 week
    };

    const nextDate = new Date(lastDonation);
    nextDate.setDate(nextDate.getDate() + intervals[donationType]);

    return nextDate.toISOString();
}

export function isDonorEligible(lastDonationDate: string | null, donationType: 'whole_blood' | 'plasma' | 'platelets'): boolean {
    if (!lastDonationDate) return true;

    const nextEligibleDate = calculateNextEligibleDate(lastDonationDate, donationType);
    return new Date() >= new Date(nextEligibleDate);
}