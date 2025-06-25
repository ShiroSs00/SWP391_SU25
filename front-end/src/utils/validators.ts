
export const calAge = (birthDate: Date | string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

export const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidBloodType = (bloodType: string): boolean => {
    const validTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    return validTypes.includes(bloodType);
};

export const isValidPassword = (password: string): boolean => {
    // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
};

export const validateAge = (birthDate: string): { isValid: boolean; message?: string } => {
    const age = calAge(birthDate);

    if (age < 18) {
        return { isValid: false, message: "Phải từ 18 tuổi trở lên để hiến máu" };
    }

    if (age > 65) {
        return { isValid: false, message: "Tuổi hiến máu tối đa là 65" };
    }

    return { isValid: true };
};

export const validateWeight = (
    weight: number,
    gender: 'male' | 'female',
    donationType: 'whole' | 'component' = 'whole'
): { isValid: boolean; message?: string } => {

    if (donationType === 'component') {
        if (weight < 50) {
            return {
                isValid: false,
                message: "Cân nặng tối thiểu để hiến thành phần máu là 50kg"
            };
        }
    } else {
        // Hiến máu toàn phần
        const minWeight = gender === 'female' ? 42 : 45;

        if (weight < minWeight) {
            return {
                isValid: false,
                message: `Cân nặng tối thiểu để hiến máu toàn phần là ${minWeight}kg đối với ${gender === 'female' ? 'nữ' : 'nam'}`
            };
        }
    }

    return { isValid: true };
};